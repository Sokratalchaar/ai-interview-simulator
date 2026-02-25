const startInterview = (req,res)=>{
    const { name }= req.body;
    if(!name){
        return res.status(400).json({ error: "Name is required"});
    }
    res.json({
        message: `Welcome ${name} , your interview has started! 🚀`,
        question: "Tell me about yourself."
    });
};


const answerQuestion = (req,res)=>{
    const { answer } = req.body;

    if(!answer){
        return res.status(400).json({ error: "Answer is required"});
    }

    res.json({
       message: "Answer received ✅",
    nextQuestion: "Why do you want this job?"
    });
};

module.exports={startInterview,answerQuestion};