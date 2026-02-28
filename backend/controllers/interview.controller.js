const { json } = require("node:stream/consumers");
const prisma = require("../lib/prisma");
const { error } = require("console");
const { create } = require("domain");
const { connect } = require("http2");

exports.startInterview = async (req, res) => {
  try {
    const session = await prisma.interviewSession.create({
      data: {
        status: "STARTED",
        questions : {
          create : [
            {content: "Tell me about yourself."},
            {content: "What are your strengths?"},
            {content: "Why should we hire you?"}
          ]
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

  exports.getAllSessions = async (req,res)=>{
    try{
    const sessions = await prisma.interviewSession.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(sessions);

  }catch (error){
    console.error(error);
    res.status(500).json({error : "Failed to fetch sessions"});
  }
  }

  exports.getSessionById = async(req,res)=>{
    try{
    const {id} = req.params;
    const session = await prisma.interviewSession.findUnique({
      where: {
        id:Number(id),
      },
    });
    if(!session){
      return res.status(404).json({error:"Session not found"});
    }
    res.status(200).json(session);
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Failed to fetch session"});
  }
  }

  exports.updateSessionStatus=async(req,res)=>{
    try{
    const { id } = req.params;
    const { status } = req.body;
    const updateSession = await prisma.interviewSession.update({
      where : {
        id:Number(id),
      },
      data: {
        status,
      },
    });
    res.status(200).json(updateSession);
  }catch(error){
    console.error(error);
    res.status(500).json({error:"Failed to update session"});
  }
}

exports.deleteSession = async(req,res)=>{
  try{
    const { id } = req.params;
    prisma.interviewSession.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({message: "Session deleted successfuly"});
  }catch{
    console.error(error);
    res.status(500).json({error:"Failed to delete session"});
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
    res.status(200).json(answer);
  } catch(error){
    console.error(error);
    res.status(500).json({error: "Failed to save answer."})
  }
}