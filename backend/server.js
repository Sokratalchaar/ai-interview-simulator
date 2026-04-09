const express = require("express");
const cors = require("cors");
require("dotenv").config();
const interviewRoutes = require("./routes/interview.routes");
const authRoutes = require("./routes/auth.routes");

const app=express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API is running 🚀");
  });
app.use("/api/interview", interviewRoutes);
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});