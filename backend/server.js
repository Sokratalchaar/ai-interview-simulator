const express = require("express");
const cors = require("cors");

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(Req,Res)=>{
    Res.json({ message: "AI Interview Backend Running 🚀" })

});

const PORT=5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});