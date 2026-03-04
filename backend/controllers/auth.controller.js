const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const { error } = require("console");
const jwt = require("jsonwebtoken");

exports.register = async(req,res)=>{
    const {email,password}=req.body;
    try{
        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data:{
                email,
                password: hashedPassword
            }
        });
        res.json({message:"user created successfully"});
    } catch (error) {
        res.status(400).json({ error: "Email already exists" });
      }
};

exports.login = async(req,res)=>{
    const { email,password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if(!user){
        return res.status(400).json({error:"Invalid credentials"});
    }

    const isValid=await bcrypt.compare(password,user.password);

    if(!isValid){
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        {userId:user.id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );
    res.json({token});
};