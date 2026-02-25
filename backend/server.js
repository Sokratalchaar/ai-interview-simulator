const express = require("express");
const cors = require("cors");
const interviewRoutes = require("./routes/interview.routes");

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/interview", interviewRoutes);

const PORT=5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});