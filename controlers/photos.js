const photodao = require("../model/photosDAO");
const catalogsdao = require("../model/catalogsDAO");
const catalogPhotoDAO = require("../model/catalogPhotoDAO");
const userdao = require("../model/userDAO");
const auth = require("./auth");
const fs = require("fs");
const numPerPage=20;

async function getCarouselPhotos(res) {
    try{
        let result = await photodao.getCarouselPhotos();
        return res.status(200).json(result.rows);
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

async function filterGetAllPublicPhotos(req, res) {
    try{
        const possibleSort=["added_desc","added_asc","title_desc","title_asc"];
        const {sort, search, page} = req.query;
        if(!page)
            return res.status(200).json({ message: "Page is required" });
        const pageNumber = parseInt(page, 10);
        if(!Number.isInteger(pageNumber) || pageNumber<0)
            return res.status(200).json({ message: "Page must be non negative integer" });
        if(possibleSort.includes(sort)==false)
            return res.status(200).json({ message: "Invalid sort" });
        let offset=pageNumber*numPerPage;
        let newSort = sort||"added desc";
        newSort=newSort.replace("_"," ").toString();
        let newSearch=search||"";
        newSearch="%"+search+"%";
        let result = await photodao.filterGetAllPublicPhotos(newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos not found");
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(201).json({message:"Photo get failed"});
    }
}

async function addPhoto(req,res) {
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        if (!req.files || !req.files.photo){
            console.log("No file data");
            return res.status(200).send("No file data");
        }
        const {title,is_private,description} = req.body;
        const catalogs_to_add = JSON.parse(req.body.catalogs_to_add);

        if(!title || !catalogs_to_add)
            return res.status(200).json({ message: "All fields are required" });
        if (is_private!="true"&&is_private!="false")
            return res.status(200).json({ message: "Invalid private checkbox value" });
        if (typeof description !== "string" || typeof title !== "string")
            return res.status(200).json({ message: "Description and title must be a string." });

        let file=req.files.photo;
        if(!file)
            return res.status(200).json({ message: "Photo file is required" });
        if(file.mimetype.match(/^image\/[\w]+$/)==null)
        console.log(file);
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
    }catch(err){
        console.error(err);
        return res.status(500).send("Photo adding failed");
    }
}

async function filterGetUserPhotos(req, res){
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const possibleSort=["added_desc","added_asc","title_desc","title_asc"];
        const {sort, search, page} = req.query;
        if(!sort || !page)
            return res.status(200).json({ message: "All fields are required" });
        const pageNumber = parseInt(page, 10);
        if(!Number.isInteger(pageNumber) || pageNumber<0)
            return res.status(200).json({ message: "Page must be non negative integer" });
        if(possibleSort.includes(sort)==false)
            return res.status(200).json({ message: "Invalid sort" });
        let offset=pageNumber*numPerPage;
        let newSort = sort||"added desc";
        newSort=newSort.replace("_"," ").toString();
        let newSearch=search||"";
        newSearch="%"+search+"%";
        let result = await photodao.filterGetUserPhotos(id_user,newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos not found");
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(201).json({message:"Photo get failed"});
    }
}

async function editPhoto(req, res){
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        
        const {title,is_private,description,id_photo, catalogs_to_add} = req.body;
        if(!title || !id_photo || ! catalogs_to_add)
            return res.status(200).json({ message: "All fields are required" });
        if(typeof id_photo !== "number" || id_photo<0)
            return res.status(200).json({ message: "Photo ID must be positive integer" });
        if (typeof is_private !== "boolean" && is_private !== 0 && is_private !== 1)
            return res.status(200).json({ message: "Invalid private checkbox value" });
        if (typeof description !== "string" || typeof title !== "string")
            return res.status(200).json({ message: "Description and title must be a string." });
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
    }catch(err){
        console.log(e);
        return res.status(201).json({message:"Photo edition failed"});
    }
}

async function deletePhoto(req, res){
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {id_photo} = req.body;
        if(!id_photo)
            return res.status(200).json({ message: "All fields are required" });
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
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

module.exports={
    getCarouselPhotos,
    filterGetAllPublicPhotos,
    filterGetUserPhotos,
    addPhoto,
    editPhoto,
    deletePhoto
}