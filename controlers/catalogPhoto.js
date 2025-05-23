const catalogphotosdao = require("../model/catalogPhotoDAO");
const catalogsdao = require("../model/catalogsDAO");
const photosdao = require("../model/photosDAO");
const auth = require("./auth");
const numPerPage=20;

async function getPhotosInCatalog(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {id_catalog} = req.query;
    let result = await catalogphotosdao.getPhotosInCatalog(id_catalog,id_user);
    if(result.rowCount<=0)
        return res.status(200).send("Photos in catalog not found");
    return res.status(201).json(result.rows);
}

async function filterGetPhotosInCatalog(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {id_catalog, sort, search, page} = req.query;
    let offset=page*numPerPage;
    let newSort = sort||"added desc";
    newSort=newSort.replace("_"," ").toString();
    let newSearch=search||"";
    newSearch="%"+search+"%";
    try{
        let result = await catalogphotosdao.filterGetPhotosInCatalog(id_catalog,id_user,newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos in catalog not found");
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(201).json({message:"Photo get failed"});
    }
}

async function addPhotoToCatalog(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {id_catalog,id_photo} = req.body;
    let checkExistCatalog = await catalogsdao.getUserCatalogById(id_catalog,id_user);
    if(checkExistCatalog.rowCount<=0)
        return res.status(200).send("Catalog not found");
    let checkExistPhoto = await photosdao.getPhotoById(id_photo,id_user);
    if(checkExistPhoto.rowCount<=0)
        return res.status(200).send("Photo not found");
    let checkAlreadyAdded = await catalogphotosdao.checkPhotoAlreadyAdded(id_catalog,id_photo,id_user);
    if(checkAlreadyAdded.rowCount>0)
        return res.status(200).send("Photo already added to this catalog");
    let resultAdd = await catalogphotosdao.addPhotoToCatalog(id_catalog,id_photo);
    return res.status(201).send("Photo added to catalog successfuly");
}

async function getPhotoCatalogs(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");

    const {id_photo} = req.query;
     let result = await photosdao.getPhotoById(id_photo,id_user);
    if(result.rowCount<=0)
        return res.status(200).send("Photo not found");

    let results = await catalogphotosdao.getPhotoCatalogs(id_photo);
    if(results.rowCount<=0)
        return res.status(200).send("Photo not in any catalogue");
    return res.status(201).json(results.rows);
}


module.exports={
    getPhotosInCatalog,
    filterGetPhotosInCatalog,
    getPhotoCatalogs,
    addPhotoToCatalog,

}
