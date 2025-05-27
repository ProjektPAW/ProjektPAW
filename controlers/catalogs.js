const catalogsdao = require("../model/catalogsDAO");
const auth = require("./auth");

async function getUserCatalogs(token,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    let result = await catalogsdao.getUserCatalogs(id_user);
    return res.status(201).json(result.rows);
}

async function addCatalog(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {name} = req.body;
    let resultAdd = await catalogsdao.addCatalog(name,id_user);
    return res.status(201).send("Catalog added successfuly");
}

async function editCatalog(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {id_catalog,name} = req.body;
    let checkExist = await catalogsdao.getUserCatalogById(id_catalog,id_user);
    if(checkExist.rowCount<=0)
        return res.status(200).send("Catalog not found");
    let resultEdit = await catalogsdao.editCatalog(name,id_catalog,id_user);
    return res.status(201).send("Catalog edited successfuly");
}

async function deleteCatalog(token,req,res) {
    let id_user = await auth.autenthicate(token);
    if(id_user < 0)
        return res.status(200).send("Invalid token");
    const {id_catalog} = req.body;
    let checkExist = await catalogsdao.getUserCatalogById(id_catalog,id_user);
    if(checkExist.rowCount<=0)
        return res.status(200).send("Catalog not found");
    let resultEdit = await catalogsdao.deleteCatalog(id_catalog,id_user);
    return res.status(201).send("Catalog deleted successfuly");
}

module.exports={
    getUserCatalogs,
    addCatalog,
    editCatalog,
    deleteCatalog,
}
