const express = require("express");
const router = express.Router();

const { startInterview , answerQuestion } = require("../controllers/interview.controller");
router.post("/start", startInterview);
router.post("/answer",answerQuestion);
module.exports=router;