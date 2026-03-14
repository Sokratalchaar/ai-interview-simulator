const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const { error } = require("console");
const jwt = require("jsonwebtoken");

exports.register = async(req,res)=>{
    const {email,password}=req.body;
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if(!email || !password){
        return res.status(400).json({
          error:"Email and password are required"
        });
      }
    
      if(password.length < 8){
        return res.status(400).json({
          error:"Password must be at least 8 characters"
        });
      }
    
    if(!gmailRegex.test(email)){
        return res.status(400).json({error:"Only Gmail addresses are allowed."})
    }
    if(!passwordRegex.test(password)){
        return res.status(400).json({
         error:"Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        });
       }
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

      if (error.code === "P2002") {
        return res.status(400).json({
          error: "Email already exists"
        });
      }
    
      console.log(error);
    
      res.status(500).json({
        error: "Server error"
      });
    
    }
};

exports.login = async(req,res)=>{
    const { email,password } = req.body;

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(!email || !password){
        return res.status(400).json({
          error:"Email and password are required"
        });
      }
      if(!gmailRegex.test(email)){
        return res.status(400).json({
          error:"Only Gmail addresses are allowed."
        });    
     }
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