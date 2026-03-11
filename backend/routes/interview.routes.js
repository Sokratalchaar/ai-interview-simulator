const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { startInterview, getUserInterviews,getInterviewDetails,updateSessionStatus,deleteInterview,getSessionQuestions,answerQuestion,evaluateAnswer,getInterviewScore } = require("../controllers/interview.controller");

router.post("/start",auth, startInterview);

router.post("/question/:id/evaluate",auth, evaluateAnswer);
router.post("/question/:questionId/answer",auth, answerQuestion);
router.get("/my", auth, getUserInterviews);
router.get("/:id/score", auth, getInterviewScore);
router.get("/:id/questions",auth,getSessionQuestions)
router.get("/:id", auth, getInterviewDetails);
router.put("/:id",auth,updateSessionStatus);
router.delete("/:id",auth,deleteInterview);


module.exports=router;