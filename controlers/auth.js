require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../model/database");
const jwt = require("jsonwebtoken");


async function register(username,email,password,res){
    try {
        
        if (!username || !email || !password ) {
            return res.status(200).json({ message: "All fields are required" });
        }
        
        if((await db.selectUserByUnameEmail(username,email)).rowCount>0)
            return res.status(200).json({message:"Username or email taken"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.createUser(username,email,hashedPassword);
        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

async function login(username,password,res) {
    try{
        const result = await db.selectUserByUsername(username);
        if(result.rowCount==0){
            res.status(200).json({message:"Invalid username."});
            return;
        }
        const user = result.rows[0];
        const equal = await bcrypt.compare(password,user.password);
        if(equal==true){
            const token = jwt.sign(
                {id:user.id_user},
                process.env.JWT_SECRET,
                {
                    algorithm:"HS256",
                    allowInsecureKeySizes:true,
                    expiresIn:3600
                });
            res.status(200).json({message:"Login successful.",token:token,username:user.username,email:user.email});
            return;
        }
        else{
            res.status(200).json({message:"Invalid password"});
            return;
        }
    }
    catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
    
};

async function autenthicate(token) {
    try{
        const content = jwt.verify(token,process.env.JWT_SECRET);
        const result = await db.selectUserById(content.id);
        if(result.rows[0].id_user==content.id && content.exp<=Date.now())
            return true;
        return false;
    }
    catch(err){
        console.log("JWT AUTH ERROR: "+err);
    }
}

async function checkTokenExpired(token,res) {
    try{
        const content = jwt.verify(token,process.env.JWT_SECRET);
        const result = await db.selectUserById(content.id);
        if(result.rows[0].id_user!=content.id)
            res.status(400).json({valid:false,message:"Invalid token"});
        else if(content.exp<=Date.now())
            res.status(200).json({valid:true,expired:false,message:"Token valid."});
        else
            res.status(200).json({valid:true,expired:true,message:"Token expired."});
    }
    catch(err){
        console.log("JWT CHECK ERROR: " + err);
        res.status(200).json({valid:false,message:"Invalid token"});
    }
}

module.exports={
    register,
    login,
    autenthicate,
    checkTokenExpired,
}