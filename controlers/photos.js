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
async function editPhoto(token, req, res){
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {title,is_private,description,id_photo} = req.body;
    let result = await photodao.getPhotoById(id_photo,id_user);
    if(result.rowCount<=0)
        return res.status(200).send("Photo not found");
    console.log(req.body);
    let newPath = result.rows[0].path.split("__");
    newPath.shift();
    newPath="files/"+Date.now()+"__"+newPath.join("");
    console.log("PATH: "+newPath);
    fs.rename(result.rows[0].path, newPath, function (err) {
        if (err) return res.status(500).send("File rename error: "+error);
      })
    let resultAdd = await photodao.editPhoto(title,is_private,description,id_photo,newPath);
    return res.status(201).send("Update successful");
}

module.exports={
    getAllPublicPhotos,
    getUserPhotos,
    addPhoto,
    editPhoto
}