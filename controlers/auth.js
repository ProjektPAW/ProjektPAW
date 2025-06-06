require("dotenv").config();
const bcrypt = require("bcrypt");
const userdao = require("../model/userDAO");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


async function register(req,res){
    try {
        const { username, email, password } = req.body;
        const nameReqex=/^[a-zA-Z0-9\-\_\.]+$/;
        const emailReqex=/^[a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9\-\_\.]+$/;
        if (!username || !email || !password )
            return res.status(200).json({ message: "All fields are required" });
        if (username.match(nameReqex)==null)
            return res.status(200).json({ message: "Invalid username" });
        if (email.match(emailReqex)==null)
            return res.status(200).json({ message: "Invalid email" });
        
        if((await userdao.selectUserByUnameEmail(username,email)).rowCount>0)
            return res.status(200).json({message:"Username or email taken"});

        const emailToken = crypto.randomBytes(32).toString("hex");

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userdao.createUser(username,email,hashedPassword, emailToken);

        const verificationLink = `${process.env.SERVER_ADDRESS}verify-email?token=${emailToken}`;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.VERIFICATION_EMAIL,
              pass: process.env.VERIFICATION_EMAIL_PASSWORD
            }
          });
    
          var mailOptions = {
            from: process.env.VERIFICATION_EMAIL,
            to: email,
            subject: "Verify your email address",
            html: `
              <h3>Hello ${username},</h3>
              <p>Please confirm your email by clicking the link below:</p>
              <a href="${verificationLink}">${verificationLink}</a>
            `
          };
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error)
              console.log(error);
          });

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};
async function deleteuser(req,res){
    try {
        const token=req.headers.authorization;
        let id_user = await autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        await userdao.deleteUser(id_user);
        return res.status(201).send("User deleted successfully");
    } catch (err) {
        console.error("User deletion error:", err);
        return res.status(500).send("Failed to delete user");
    }
}
async function changepassword(req,res){
    try {
        const token=req.headers.authorization;
        let id_user = await autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {currentPassword,newPassword} = req.body;
        if(!currentPassword || !newPassword)
            return res.status(200).json({ message: "All fields are required" });
        if(currentPassword.length<=0 || newPassword.length<=0)
            return res.status(200).json({ message: "Passwords cannot be empty" });
        const user = (await userdao.selectUserById(id_user)).rows[0];
        const equal = await bcrypt.compare(currentPassword,user.password);
        if(equal==false)
            return res.status(200).send("Incorrect current password");
        const hashedNew = await bcrypt.hash(newPassword, 10);
        await userdao.updateUserPassword(id_user, hashedNew);
        return res.status(201).send("Password updated successfully");
    }catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
}

async function verifyEmail(req,res){
    try{
        const { emailToken } = req.body;
        if(!emailToken)
            return res.status(200).json({ message: "All fields are required" });
        const result = await userdao.verifyEmail(emailToken);
        if(result.rowCount>0)
            return res.status(201).send("email verification successful.");
        else
            return res.status(200).send("email verification failed.");
    }catch (err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

async function login(req,res) {
    try{
        const { username, password } = req.body;
        if (!username || !password )
            return res.status(200).json({ message: "All fields are required" });
        const result = await userdao.selectUserByUsername(username);
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
            res.status(200).json({message:"Login successful.",token:token,username:user.username,email:user.email,role:user.id_role,emailverified:user.emailverified});
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
        let token_arr = token.split(" ");
        token=token_arr[token_arr.length - 1];
        const content = jwt.verify(token,process.env.JWT_SECRET);
        const result = await userdao.selectUserById(content.id);
        if(result.rows[0].id_user==content.id && (content.exp*1000)>=Date.now())
            return content.id;
        return -1;
    }
    catch(err){
        if(!err=="JsonWebTokenError: jwt must be provided")
            console.log("JWT AUTH ERROR: "+err);
        return -2;
    }
}

async function refreshToken(req,res) {
    try{
        const token = req.headers.authorization;
        let id_user = await autenthicate(token);
        if(id_user < 0)
            return res.status(200).json({message:"Invalid token",token:"-1"});
        const newToken = jwt.sign(
                    {id:id_user},
                    process.env.JWT_SECRET,
                    {
                        algorithm:"HS256",
                        allowInsecureKeySizes:true,
                        expiresIn:3600
                    });
        return res.status(201).json({message:"Token refreshed",token:newToken});
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

async function getUser(req,res) {    
    try{
        const token=req.headers.authorization;
        let id_user = await autenthicate(token);
        if(id_user<0) return res.status(200).send("Invalid token");
        const result = await userdao.selectUserById(id_user);
        return res.json({ username: result.rows[0].username, email: result.rows[0].email });
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

module.exports={
    register,
    login,
    autenthicate,
    refreshToken,
    getUser,
    verifyEmail,
    deleteuser,
    changepassword
}