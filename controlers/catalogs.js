const catalogsdao = require("../model/catalogsDAO");
const auth = require("./auth");

async function getUserCatalogs(req,res) {
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        let result = await catalogsdao.getUserCatalogs(id_user);
        return res.status(201).json(result.rows);
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

async function addCatalog(req,res) {
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {name} = req.body;
        if(!name)
            return res.status(200).json({ message: "All fields are required" });
        if(name.length<=0)
            return res.status(200).json({ message: "Name cannot be empty" });
        let resultAdd = await catalogsdao.addCatalog(name,id_user);
        return res.status(201).send("Catalog added successfuly");
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

async function editCatalog(req,res) {
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {id_catalog,name} = req.body;
        if(!id_catalog || !name)
            return res.status(200).json({ message: "All fields are required" });
        if(id_catalog<0)
            return res.status(200).json({ message: "Catalog ID must be positive integer" });
        if(name.length<=0)
            return res.status(200).json({ message: "Name cannot be empty" });
        let checkExist = await catalogsdao.getUserCatalogById(id_catalog,id_user);
        if(checkExist.rowCount<=0)
            return res.status(200).send("Catalog not found");
        let resultEdit = await catalogsdao.editCatalog(name,id_catalog,id_user);
        return res.status(201).send("Catalog edited successfuly");
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

async function deleteCatalog(req,res) {
    try{
        const token=req.headers.authorization;
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {id_catalog} = req.body;
        if(!id_catalog)
            return res.status(200).json({ message: "All fields are required" });
        if(id_catalog<0)
            return res.status(200).json({ message: "Catalog ID must be positive integer" });
        let checkExist = await catalogsdao.getUserCatalogById(id_catalog,id_user);
        if(checkExist.rowCount<=0)
            return res.status(200).send("Catalog not found");
        let resultEdit = await catalogsdao.deleteCatalog(id_catalog,id_user);
        return res.status(201).send("Catalog deleted successfuly");
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}

module.exports={
    getUserCatalogs,
    addCatalog,
    editCatalog,
    deleteCatalog,
}
