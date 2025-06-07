require("dotenv").config();
const bcrypt = require("bcrypt");
const userdao = require("../model/userDAO");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Rejestracja użytkownika
async function register(req,res){
    try {
        const { username, email, password } = req.body;

        // Walidacja danych wejściowych
        const nameReqex=/^[a-zA-Z0-9\-\_\.]+$/;
        const emailReqex=/^[a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9\-\_\.]+$/;
        if (!username || !email || !password )
            return res.status(200).json({ message: "All fields are required" });
        if (username.match(nameReqex)==null)
            return res.status(200).json({ message: "Invalid username" });
        if (email.match(emailReqex)==null)
            return res.status(200).json({ message: "Invalid email" });
        
        // Sprawdzenie czy użytkownik lub email już istnieje
        if((await userdao.selectUserByUnameEmail(username,email)).rowCount>0)
            return res.status(200).json({message:"Username or email taken"});

        // Generowanie tokena weryfikacyjnego do maila
        const emailToken = crypto.randomBytes(32).toString("hex");
        // Haszowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tworzenie użytkownika w bazie danych
        const result = await userdao.createUser(username,email,hashedPassword, emailToken);
        //Generowanie linku do weryfikacji e-maila
        const verificationLink = `${process.env.SERVER_ADDRESS}verify-email?token=${emailToken}`;
        // Konfiguracja i wysyłanie e-maila
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
// Usuwanie użytkownika na podstawie tokena JWT
async function deleteuser(req,res){
    try {
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny funkcja authenticate zwraca wartość -1)
        let id_user = await autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        //usuwanięcie użytkownia
        await userdao.deleteUser(id_user);
        return res.status(201).send("User deleted successfully");
    } catch (err) {
        console.error("User deletion error:", err);
        return res.status(500).send("Failed to delete user");
    }
}
// Zmiana hasła
async function changepassword(req,res){
    try {
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny funkcja authenticate zwraca wartość -1)
        let id_user = await autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {currentPassword,newPassword} = req.body;
        //walidacja danych wejściowych
        if(!currentPassword || !newPassword)
            return res.status(200).json({ message: "All fields are required" });
        if(currentPassword.length<=0 || newPassword.length<=0)
            return res.status(200).json({ message: "Passwords cannot be empty" });
        //pobranie danych użytkownia(w tym hasła)
        const user = (await userdao.selectUserById(id_user)).rows[0];
        // Sprawdzenie zgodności starego hasła
        const equal = await bcrypt.compare(currentPassword,user.password);
        if(equal==false)
            return res.status(200).send("Incorrect current password");
        //szyfrowanie nowego hasła i zapisanie do bazy
        const hashedNew = await bcrypt.hash(newPassword, 10);
        await userdao.updateUserPassword(id_user, hashedNew);
        return res.status(201).send("Password updated successfully");
    }catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
}
// Weryfikacja adresu e-mail
async function verifyEmail(req,res){
    try{
        const { emailToken } = req.body;
        // Walidacja tokena
        if(!emailToken || typeof emailToken !== "string" || emailToken.trim() === "")
            return res.status(200).json({ message: "email token invalid" });
        //weryfikacja, gdy poprawna funkcja verifyemail zwraca rekord z id_usera
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
// Logowanie użytkownika
async function login(req,res) {
    try{
        const { username, password } = req.body;
        // Sprawdzenie, czy oba pola zostały przesłane
        if (!username || !password )
            return res.status(200).json({ message: "All fields are required" });
        // Dodatkowa walidacja loginu – czy to nie pusty string
        if (typeof username !== "string" || username.trim() === "")
            return res.status(200).json({ message: "invalid username" });
        const result = await userdao.selectUserByUsername(username);
        // Jeśli użytkownik nie istnieje, zwracamy błąd logowania
        if(result.rowCount==0){
            res.status(200).json({message:"Invalid username."});
            return;
        }
        // Pobranie danych użytkownika z rezultatu zapytania
        const user = result.rows[0];
        // Porównanie podanego hasła z zahashowanym hasłem w bazie
        const equal = await bcrypt.compare(password,user.password);
        if(equal==true){
            // Jeśli hasło się zgadza – generowany jest token JWT
            const token = jwt.sign(
                {id:user.id_user},
                process.env.JWT_SECRET,
                {
                    algorithm:"HS256",
                    allowInsecureKeySizes:true,
                    expiresIn:3600
                });
            //zwrócenia danych użytkownia oraz tokenu
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
// Funkcja uwierzytelniająca użytkownika na podstawie tokena JWT
async function autenthicate(token) {
    try{
        // Obsługa tokena w formacie "Bearer <token>"
        let token_arr = token.split(" ");
        token=token_arr[token_arr.length - 1];
        // Weryfikacja i dekodowanie tokena przy użyciu sekretu
        const content = jwt.verify(token,process.env.JWT_SECRET);
        // Pobranie użytkownika z bazy na podstawie ID z tokena
        const result = await userdao.selectUserById(content.id);
         // Sprawdzenie czy użytkownik istnieje i token nie wygasł
        if(result.rows[0].id_user==content.id && (content.exp*1000)>=Date.now())
        //zwrócenie id użytkownika jeśli token jest poprawny
            return content.id;
        //zwrócenie -1 w przeciwnym wypadku
        return -1;
    }
    catch(err){
        if(!err=="JsonWebTokenError: jwt must be provided")
            console.log("JWT AUTH ERROR: "+err);
        return -2;
    }
}
// Odświeżenie tokena JWT użytkownika
async function refreshToken(req,res) {
    try{
        const token = req.headers.authorization;
        // Uwierzytelnienie użytkownika na podstawie starego tokena
        let id_user = await autenthicate(token);
        //weryfikacja tokenu (gdy token jest niepoprawny funkcja authenticate zwraca wartość -1)
        if(id_user < 0)
            return res.status(200).json({message:"Invalid token",token:"-1"});
        //wygenerowanie nowego tokenu
        const newToken = jwt.sign(
                    {id:id_user},
                    process.env.JWT_SECRET,
                    {
                        algorithm:"HS256",
                        allowInsecureKeySizes:true,
                        expiresIn:3600
                    });
        //zwrócenie nowego tokenu
        return res.status(201).json({message:"Token refreshed",token:newToken});
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}
// zwrócenie podstawowych danych użytkownika na podstawie przesłanego tokena JWT
async function getUser(req,res) {    
    try{
        const token=req.headers.authorization;
        // Uwierzytelnianie użytkownika z tokena
        let id_user = await autenthicate(token);
        //weryfikacja tokenu (gdy token jest niepoprawny funkcja authenticate zwraca wartość -1)
        if(id_user<0) return res.status(200).send("Invalid token");
        // Pobranie danych użytkownika z bazy
        const result = await userdao.selectUserById(id_user);
        // Zwrócenie danych użytkownika
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