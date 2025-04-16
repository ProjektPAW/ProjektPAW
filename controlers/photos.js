const photodao = require("../model/photosDAO");
const auth = require("./auth");
const fs = require("fs");

async function getAllPublicPhotos(res) {
    let result = await photodao.getAllPublicPhotos();
    return res.status(200).json(result.rows);
}

async function addPhoto(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    if (!req.files || !req.files.photo){
        console.log("No file data");
        return res.status(200).send("No file data");
    }
    const { title,is_private,description } = req.body;
    let file=req.files.photo;
    let path = "files/";
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    path+=Date.now()+"__"+file.name;
    file.mv(path);
    let result = await photodao.addPhoto(title,path,is_private,new Date(),description,id_user);
    return res.status(201).send("Photo added succesfully");
}
async function getUserPhotos(token, res){
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    let result = await photodao.getUserPhotos(id_user);
    return res.status(201).json(result.rows);
}

async function getPhotoInfo(req,res) {
    let id_photo = req.body.id_photo;
    let result = await photodao.getPhotoInfo(id_photo);
    return res.status(200).json(result.rows);
}

module.exports={
    getAllPublicPhotos,
    getUserPhotos,
    addPhoto,
    getPhotoInfo
}