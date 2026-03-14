const { json } = require("node:stream/consumers");
const prisma = require("../lib/prisma");
const { error } = require("console");
const { create } = require("domain");
const { connect } = require("http2");
const openai = require("../lib/openai");


exports.startInterview = async (req, res) => {
  try {
    const{ role, level, tech } =req.body;
    const completion = await openai.chat.completions.create({
      model:"gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a technical interviewer."
        },
        {
          role: "user",
          content: `Generate 3 interview questions for a ${level} ${role} specializating in ${tech}. Return only the questions.`
        }
      ]
    });
    const aiQuestions = completion.choices[0].message.content.split("\n").filter(q=>q.trim()!=="");
    const session = await prisma.interviewSession.create({
      data: {
        status: "STARTED",
        userId: req.userId,
        questions : {
          create : aiQuestions.map(q=>({
            content: q
          }))
        }
      },
      include: {
        questions: true
      }
    });
    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create session" });
  }};

  exports.getUserInterviews = async (req,res)=>{
    try{
    const interviews = await prisma.interviewSession.findMany({
      where: {
        userId: req.userId
      },
      orderBy: {
        createdAt: "desc",
      },
      include:{
        questions:{
         include:{
          answer:true
         }
        }
       }
    });
     
      const result = interviews.map(interview=>{
      const scores = interview.questions.map(q=>q.answer?.score).filter(score => score !== null && score !== undefined);
      const total=scores.reduce((sum,s)=>sum + s ,0);
      const average = scores.length? (total/scores.length).toFixed(1):null;
      return{
        id:interview.id,
        createdAt:interview.createdAt,
        score:average
      };
    });
    res.json(result);

  }catch (error){
    console.error(error);
    res.status(500).json({error : "Failed to fetch interviews"});
  }
  }

  exports.getInterviewDetails = async(req,res)=>{
    try{
    const {id} = req.params;
    const interview = await prisma.interviewSession.findUnique({
      where: {
        id:Number(id),
      },
      include:{
        questions:{
          include:{
            answer: true
          }
        }
      }
    });
    if(!interview){
      return res.status(404).json({error:"interview not found"});
    }
    if(interview.userId !==req.userId){
      return res.status(403).json({error:"Not allowed"});
     }
   
    res.status(200).json(interview);
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Failed to fetch interview details."});
  }
  }

  exports.updateSessionStatus=async(req,res)=>{
    try{
    const { id } = req.params;
    const { status } = req.body;
    const session = await prisma.interviewSession.update({
      where : {
        id:Number(id)
      }
    });
    if(!session){
      return res.status(404).json({error:"Session not found"});
     }
   
     if(session.userId !== req.userId){
      return res.status(403).json({error:"Not allowed"});
     }
     const updateSession = await prisma.interviewSession.update({
      where:{
       id:Number(id)
      },
      data:{
       status
      }
     });
    
    res.status(200).json(updateSession);
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Failed to update session"});
  }
}

exports.deleteInterview = async(req,res)=>{
  try{
    const { id } = req.params;
    const interview = await prisma.interviewSession.findUnique({
      where:{
        id:Number(id)
      }
    });
    if(!interview){
      return res.status(404).json({error:"interview not found"});
     }
     if(interview.userId!==req.userId){
      return res.status(403).json({error:"Not allowed"});
     }

     await prisma.answer.deleteMany({
      where:{
        question:{
          sessionId:Number(id)
        }
      }
     });

     await prisma.question.deleteMany({
      where:{
        sessionId:Number(id)
      }
     });


    await prisma.interviewSession.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({message: "interview deleted successfuly"});
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Failed to delete interview"});
  }
}

exports.getSessionQuestions = async(req,res)=>{
  try{
  const { id } = req.params;
  const session = await prisma.interviewSession.findUnique({
    where: {
      id : Number(id),
    },
    include:{
      questions : true
    }
  })
  if(!session){
    return res.status(404).json({error:"Session is not found"});
  }
  res.status(200).json(session.questions);
}catch(error){
  console.error(error);
  res.status(500).json({message:"Failed to fetch questions"})
}
}
exports.answerQuestion = async(req, res)=>{
  try{
    const {questionId}=req.params;
    const {content}=req.body;
    const question = await prisma.question.findUnique({
      where:{ id:Number(questionId) },
      include:{ session:true }
    });
    if(!question){
      return res.status(404).json({error:"Question not found"});
    }
    if(question.session.userId !== req.userId){
      return res.status(403).json({error:"Not allowed"});
    }
    const answer = await prisma.answer.create({
      data: {
        content,
        question: {
          connect: {
            id : Number(questionId)
          }
        }
      }
    });
    res.status(201).json(answer);
  } catch(error){
    console.error(error);
    res.status(500).json({error: "Failed to save answer."})
  }
}

exports.evaluateAnswer = async(req,res)=>{
  try{
    const { id: questionId } = req.params;
    const answer = await prisma.answer.findUnique({
      where:{
        questionId: Number(questionId),
      },
      include:{
        question:{
          include:{
            session:true
          }
        }
      }
    });
    if(!answer){
      return res.status(404).json({error:"Answer not found"});
    }
    if(answer.question.session.userId!==req.userId){
      return res.status(403).json({error:"Not allowed"});
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an interview evaluator. Give a score from 1 to 10 and short feedback."
        },
        {
          role: "user",
          content: `Evaluate this answer: ${answer.content}`
        }
      ],
    });
    const aiResponse = completion.choices[0].message.content;
    const scoreMatch = aiResponse.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0]) : 5;

    let feedback = aiResponse;

    if (aiResponse.includes("Feedback:")) {
    feedback = aiResponse.split("Feedback:")[1].trim();
       }

    const updatedAnswer = await prisma.answer.update({
      where: {
        id: answer.id
      },
      data: {
        score,
        feedback
      }
    });
    res.json(updatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Evaluation failed" });
  }
}

exports.getInterviewScore = async(req,res)=>{
  try{
    const { id } = req.params;
    const session = await prisma.interviewSession.findUnique({
      where: {
        id: Number(id)
      },
      include:{
        questions:{
          include:{
            answer: true
          }
        }
      }
    });
    if(!session){
      return res.status(404).json({error:"Session not found"});
     }
   
     if(session.userId !== req.userId){
      return res.status(403).json({error:"Not allowed"});
     }
     const scores = session.questions.map(q=>q.answer?.score).filter(score=>score!==null&&score!==undefined);
     
     if(scores.length === 0){
      return res.json({score:0});
     }
     const total = scores.reduce((sum,s)=> sum + s ,0);
     const average = (total / scores.length).toFixed(1);

     await prisma.interviewSession.update({
      where: { id: Number(id) },
      data: {
        status: "COMPLETED"
      }
    });

     res.json({
      interviewId: session.id,
      score: average
     });
   
    }catch(error){
     console.error(error);
     res.status(500).json({error:"Failed to calculate score"});
    }
}