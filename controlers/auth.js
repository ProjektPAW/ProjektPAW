require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../model/database");


async function register(username,email,password,res){
    try {
        
        if (!username || !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if((await db.selectUserByUnameEmail(username,email)).rowCount>0)
            return res.status(400).json({message:"Username or email taken"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.createUser(username,email,hashedPassword);
        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

module.exports={
    register,
}