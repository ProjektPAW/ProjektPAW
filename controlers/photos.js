const photodao = require("../model/photosDAO");
const catalogsdao = require("../model/catalogsDAO");
const catalogPhotoDAO = require("../model/catalogPhotoDAO");
const userdao = require("../model/userDAO");
const auth = require("./auth");
const fs = require("fs");
const numPerPage=20;

async function getCarouselPhotos(res) {
    let result = await photodao.getCarouselPhotos();
    return res.status(200).json(result.rows);
}

async function filterGetAllPublicPhotos(req, res) {
    const {sort, search, page} = req.query;
    let offset=page*numPerPage;
    let newSort = sort||"added desc";
    newSort=newSort.replace("_"," ").toString();
    let newSearch=search||"";
    newSearch="%"+search+"%";
    try{
        let result = await photodao.filterGetAllPublicPhotos(newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos not found");
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(201).json({message:"Photo get failed"});
    }
}

async function addPhoto(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    if (!req.files || !req.files.photo){
        console.log("No file data");
        return res.status(200).send("No file data");
    }

    const {title,is_private,description} = req.body;
    const catalogs_to_add = JSON.parse(req.body.catalogs_to_add);

    let file=req.files.photo;
    let path = "files/";
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    path+=Date.now()+"__"+file.name;
    file.mv(path);
    let result = await photodao.addPhoto(title,path,is_private,new Date(),description,id_user);
    
    let id_photo=result.rows[0].id_photo;
    let userCatalogs=await catalogsdao.getUserCatalogsId(id_user);
    let catalogsArray=[];
    for(var i in userCatalogs.rows)
        catalogsArray.push(userCatalogs.rows[i].id_catalog);

    for(i in catalogs_to_add){
        i=parseInt(i);
       
        if(catalogs_to_add[i]==true && catalogsArray.includes(i)){
            catalogPhotoDAO.addPhotoToCatalog(i,id_photo);
        }
    }
    return res.status(201).send("Photo added succesfully");
}
async function getUserPhotos(token, res){
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    let result = await photodao.getUserPhotos(id_user);
    return res.status(201).json(result.rows);
}

async function filterGetUserPhotos(token,req, res){
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {sort, search, page} = req.query;
    let offset=page*numPerPage;
    let newSort = sort||"added desc";
    newSort=newSort.replace("_"," ").toString();
    let newSearch=search||"";
    newSearch="%"+search+"%";
    try{
        let result = await photodao.filterGetUserPhotos(id_user,newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos not found");
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(201).json({message:"Photo get failed"});
    }
}

async function editPhoto(token, req, res){
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    
    const {title,is_private,description,id_photo, catalogs_to_add} = req.body;
    let result = await photodao.getPhotoById(id_photo,id_user);
    if(result.rowCount<=0)
        return res.status(200).send("Photo not found");
    let newPath = result.rows[0].path.split("__");
    newPath.shift();
    newPath="files/"+Date.now()+"__"+newPath.join("");
    if(fs.rename(result.rows[0].path, newPath, function (err) {
        if (err) {console.log("Photo deletion error: "+err);return 1;}
        else return 0;
    }))
        return res.status(500).send("File rename error: "+error);
    else{
        let resultEdit = await photodao.editPhoto(title,is_private,description,id_photo,newPath);

        catalogPhotoDAO.deletePhotoFromAllCatalogs(id_photo);
        let userCatalogs=await catalogsdao.getUserCatalogsId(id_user);
        let catalogsArray=[];
        for(var i in userCatalogs.rows)
            catalogsArray.push(userCatalogs.rows[i].id_catalog);

        for(i in catalogs_to_add){
            i=parseInt(i);
            if(catalogs_to_add[i]==true && catalogsArray.includes(i)){
                catalogPhotoDAO.addPhotoToCatalog(i,id_photo);
            }
        }
        return res.status(201).send("Update successful");
    }
}

async function deletePhoto(token, req, res){
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {id_photo} = req.body;
    let user_role=(await userdao.selectUserRoleById(id_user)).rows[0].id_role;
    
    let result;
    if(user_role==1)
        result = await photodao.adminGetPhotoById(id_photo);
    else 
        result = await photodao.getPhotoById(id_photo,id_user);
    if(result.rowCount<=0)
        return res.status(200).send("Photo not found");
    if(fs.unlink(result.rows[0].path, function (err) {
        if (err) {console.log("Photo deletion error: "+err);return 1;}
        else return 0;
    }))
        return res.status(500).send("File deletion failed.");
    else{
        if(user_role==1)
            await photodao.adminDeletePhoto(id_photo);
        else
            await photodao.deletePhoto(id_photo,id_user);
        return res.status(201).send("Deletion successful");
    }
}

module.exports={
    getCarouselPhotos,
    filterGetAllPublicPhotos,
    getUserPhotos,
    filterGetUserPhotos,
    addPhoto,
    editPhoto,
    deletePhoto
}