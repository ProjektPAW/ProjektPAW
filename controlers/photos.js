const photodao = require("../model/photosDAO");
const auth = require("./auth");
const fs = require("fs");

async function getAllPublicPhotos(res) {
    let result = await photodao.getAllPublicPhotos();
    return res.status(200).json(result.rows);
}

async function addPhoto(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0){
        console.log("Invalid token "+id_user);
        return res.status(200).send("Invalid token");
    }
    if (!req.files || !req.files.photo){
        console.log("No file data");
        return res.status(200).send("No file data");
    }
    const { title,is_private,description } = req.body;
    let file=req.files.photo;
    let path = "files\\"+Date.now()+"__"+file.name;
    file.mv(path);
    let result = await photodao.addPhoto(title,path,is_private,Date.now(),description,id_user);
    return res.status(201).send("Photo added succesfully");
}


module.exports={
    getAllPublicPhotos,
    addPhoto
}