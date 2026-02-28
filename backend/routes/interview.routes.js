const express = require("express");
const router = express.Router();

const { startInterview, getAllSessions,getSessionById,updateSessionStatus,deleteSession,getSessionQuestions,answerQuestion } = require("../controllers/interview.controller");

router.post("/start", startInterview);
router.get("/",getAllSessions);
router.post("/question/:questionId/answer", answerQuestion);
router.get("/:id/questions",getSessionQuestions)
router.get("/:id",getSessionById);
router.put("/:id",updateSessionStatus);
router.delete("/:id",deleteSession);


module.exports=router;