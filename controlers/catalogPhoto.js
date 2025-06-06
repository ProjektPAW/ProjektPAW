const catalogphotosdao = require("../model/catalogPhotoDAO");
const photosdao = require("../model/photosDAO");
const auth = require("./auth");
const numPerPage=20;

async function filterGetPhotosInCatalog(req,res) {
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const possibleSort=["added_desc","added_asc","title_desc","title_asc"];
        const {id_catalog, sort, search, page} = req.query;
        if(!page || !id_catalog)
            return res.status(200).json({ message: "All fields are required" });
        const pageNumber = parseInt(page, 10);
        if(!Number.isInteger(pageNumber) || pageNumber<0)
            return res.status(200).json({ message: "Page must be non negative integer" });
        if(possibleSort.includes(sort)==false)
            return res.status(200).json({ message: "Invalid sort" });
        if(id_catalog<0)
            return res.status(200).json({ message: "Catalog ID must be positive integer" });
        let offset=pageNumber*numPerPage;
        let newSort = sort||"added desc";
        newSort=newSort.replace("_"," ").toString();
        let newSearch=search||"";
        newSearch="%"+search+"%";
        let result = await catalogphotosdao.filterGetPhotosInCatalog(id_catalog,id_user,newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos in catalog not found");
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(200).json({message:"Photo get failed"});
    }
}

async function getPhotoCatalogs(req,res) {
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");

        const {id_photo} = req.query;
        if(!id_photo)
            return res.status(200).json({ message: "All fields are required" });
         if(!Number.isInteger(parseInt(id_photo, 10))||id_photo<0)
            return res.status(200).json({ message: "Photo ID must be positive integer" });
        let result = await photosdao.getPhotoById(id_photo,id_user);
        if(result.rowCount<=0)
            return res.status(200).send("Photo not found");

        let results = await catalogphotosdao.getPhotoCatalogs(id_photo);
        if(results.rowCount<=0)
            return res.status(200).send("Photo not in any catalogue");
        return res.status(201).json(results.rows);
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}


module.exports={
    filterGetPhotosInCatalog,
    getPhotoCatalogs,
}
