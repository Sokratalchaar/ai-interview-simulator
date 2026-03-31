const { json } = require("node:stream/consumers");
const prisma = require("../lib/prisma");
const { error } = require("console");
const { create } = require("domain");
const { connect } = require("http2");
const openai = require("../lib/openai");


exports.startInterview = async (req, res) => {
  try {
    const{ role, level, tech, language } =req.body;
    const langMap = {
      en: "English",
      fr: "French",
      ar: "Arabic"
    };
    const selectedLang = langMap[language] || "English";
    const completion = await openai.chat.completions.create({
      model:"gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI interviewer.

Generate technical interview questions.

IMPORTANT:
- The questions MUST be in ${selectedLang}
- Even if the input (role, tech) is in English, translate and respond in ${selectedLang}
- Keep technical terms (Node.js, API, SQL) in English

Return clear questions.

Role: ${role}
Tech Stack: ${tech}
Level: ${level}
`
        },
        {
          role: "user",
          content: `Generate 1 interview questions for a ${level} ${role} specializating in ${tech}. Return only the questions.`
        }
      ]
    });
    const questionText = completion.choices[0].message.content.trim();
    const session = await prisma.interviewSession.create({
      data: {
        status: "STARTED",
        userId: req.userId,
        questions : {
          create : {
            content: questionText
          }
        }
      },
      include: {
        questions: true
      }
    });
    res.json({
      question: session.questions[0],
      sessionId: session.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create session" });
  }};

  exports.generateNextQuestion = async (req, res) => {
    try {
      const { sessionId, previousQuestion, answer, role, level, tech, language,score,questionCount} = req.body;
  
      const langMap = {
        en: "English",
        fr: "French",
        ar: "Arabic"
      };
  
      const selectedLang = langMap[language] || "English";
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
 You are an AI technical interviewer.

You MUST adapt the next question based on the candidate's answer quality.

Rules:
- If answer is weak → ask easier or clarifying question
- If answer is good → ask deeper follow-up
- If answer is excellent → increase difficulty

Language: ${selectedLang}

Keep technical terms in English.

Be natural like a real interviewer.
      `
    },
    {
      role: "user",
      content: `
Previous Question:
${previousQuestion}

Candidate Answer:
${answer}

candidate Score: ${score}/10

Generate ONE next question.
Return ONLY the question.
Current number of questions: ${questionCount}

IMPORTANT:
- NEVER end the interview before 5 questions
- Only return END if questionCount >= 5
      `
    }
        ]
      });
  
      const question = completion.choices[0].message.content.trim();
      if (question === "END") {
        return res.json({ done: true });
      }
      
      
  
      // خزّن السؤال بالداتابيس
      const newQuestion = await prisma.question.create({
        data: {
          content: question,
          sessionId: Number(sessionId)
        }
      });
  
      res.json(newQuestion);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate next question" });
    }
  };

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
      const average = scores.length
      ? Math.round((total / scores.length) * 10) / 10
      : null;
     
      return{
        id:interview.id,
        createdAt:interview.createdAt,
        score:average,
        completed:scores.length > 0
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
    const { language,timeTaken } = req.body;

    const langMap = {
      en: "English",
      fr: "French",
      ar: "Arabic"
    };
    const selectedLang = langMap[language] || "English";
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
          content: `You are an interview evaluator.
Respond ONLY in ${selectedLang}.
Give a score from 1 to 10.
Then give short feedback.
IMPORTANT:
- Keep technical terms in English (like Node.js, SQL, API, JSON)
- Wrap any English word with this format: <ltr>WORD</ltr>

Format EXACTLY like this:
Score: X
Feedback: ...`
        },
        {
          role: "user",
          content: `Question: ${answer.question.content}
Answer: ${answer.content}
Answer Time: ${timeTaken} seconds

If the answer is too fast (${timeTaken}< 5 sec) and very good,
mention suspicion in feedback.
`
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


exports.getDashboardStats = async (req, res) => {
  try {
    const interviews = await prisma.interviewSession.findMany({
      where: { userId: req.userId },
      include: {
        questions: {
          include: {
            answer: true
          }
        }
      }
    });

    let totalInterviews = interviews.length;
    let completed = 0;

    let interviewScores = []; 

    interviews.forEach(interview => {
      const scores = interview.questions
        .map(q => q.answer?.score)
        .filter(s => s !== null && s !== undefined);

      if (scores.length > 0) {
        completed++;

        const avg =
          scores.reduce((a, b) => a + b, 0) / scores.length;

        interviewScores.push(avg); 
      }
    });

    const averageScore =
      interviewScores.length > 0
        ? (interviewScores.reduce((a, b) => a + b, 0) /
            interviewScores.length).toFixed(1)
        : 0;

    const bestScore =
      interviewScores.length > 0
        ? Math.max(...interviewScores).toFixed(1)
        : 0;

    res.json({
      totalInterviews,
      completed,
      averageScore,
      bestScore
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};


exports.getAIInsights = async (req, res) => {
  try {
    const { range } = req.query;
 
    const interviews = await prisma.interviewSession.findMany({
      where: { userId: req.userId },
      include: {
        questions: {
          include: {
            answer: true
          }
        }
      },
      orderBy: {
        createdAt: "asc" // مهم للـ trend
      }
    });
   

const now = new Date();

const filteredInterviews = interviews.filter(interview => {
  const date = new Date(interview.createdAt);
  const diffDays = (now - date) / (1000 * 60 * 60 * 24);

  if (range === "week") return diffDays <= 7;
  if (range === "month") return diffDays <= 30;

  return true;
});

    // 1️⃣ نحسب average لكل interview
    const detailedData = filteredInterviews.map(interview => {
      return interview.questions.map(q => {
        if (!q.answer || q.answer.score == null) return null;
    
        return `
    Question: ${q.content}
    Score: ${q.answer.score}
    Feedback: ${q.answer.feedback || "No feedback"}
    `;
      }).filter(Boolean).join("\n");
    }).join("\n\n");

    if (!detailedData || detailedData.trim() === "") {
      return res.json({
        trend: "No data yet",
        strength: "-",
        weakness: "-",
        advice: "Complete interviews to get insights"
      });
    }

    // 3️⃣ نطلب تحليل من AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI technical career coach.

IMPORTANT:
- Respond ONLY in English
- Keep technical terms in English (Node.js, SQL, API)

Analyze interview performance based on:
- Questions
- Scores
- Feedback

Detect:
- Strength areas
- Weak areas
- Overall trend

Return JSON ONLY in this format:
{
  "trend": "...",
  "strength": "...",
  "weakness": "...",
  "advice": "..."
}
`

        },
        {
          role: "user",
          content: `
          Here is the interview data for the last ${range}:
          
          ${detailedData}
          
          Analyze performance.
          `
        }
      ]
    });

    let aiText = completion.choices[0].message.content;

// 🔥 إزالة ```json و ```
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch {
      console.log("AI RAW:", aiText);
    
      parsed = {
        trend: "Error parsing AI response",
        strength: "-",
        weakness: "-",
        advice: "-"
      };
    }
 
    res.json(parsed);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
};

exports.translateInsights = async (req, res) => {
  try {
    const { insights, language } = req.body;

    const langMap = {
      ar: "Arabic",
      fr: "French"
    };

    const selectedLang = langMap[language] || "English";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a translator.

Translate the following JSON values to ${selectedLang}.

IMPORTANT:
- Keep JSON format EXACTLY the same
- Translate ONLY the values, NOT the keys
- Keep technical terms in English (Node.js, SQL, API)

Return JSON only.
`
        },
        {
          role: "user",
          content: JSON.stringify(insights)
        }
      ]
    });

    const aiText = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = insights; // fallback
    }

    res.json(parsed);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
};