const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { startInterview, getAllSessions,getSessionById,updateSessionStatus,deleteSession,getSessionQuestions,answerQuestion,evaluateAnswer } = require("../controllers/interview.controller");

router.post("/start",auth, startInterview);
router.get("/",auth,getAllSessions);
router.post("/question/:id/evaluate",auth, evaluateAnswer);
router.post("/question/:questionId/answer",auth, answerQuestion);
router.get("/:id/questions",auth,getSessionQuestions)
router.get("/:id",auth,getSessionById);
router.put("/:id",auth,updateSessionStatus);
router.delete("/:id",auth,deleteSession);


module.exports=router;