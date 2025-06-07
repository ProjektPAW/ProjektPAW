const catalogsdao = require("../model/catalogsDAO");
const auth = require("./auth");
// Pobranie wszystkich katalogów przypisanych do użytkownika
async function getUserCatalogs(req,res) {
    try{
        // Autoryzacja użytkownika za pomocą tokena JWT
        const token=req.headers.authorization;
         //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        //zwrócenie katalogów użytkownika
        let result = await catalogsdao.getUserCatalogs(id_user);
        return res.status(201).json(result.rows);
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}
// Dodanie nowego katalogu dla użytkownika
async function addCatalog(req,res) {
    try{
        // Autoryzacja użytkownika za pomocą tokena JWT
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {name} = req.body;
        // Walidacja — sprawdzenie, czy nazwa jest podana i nie jest pusta
        if(!name)
            return res.status(200).json({ message: "All fields are required" });
        if(name.length<=0)
            return res.status(200).json({ message: "Name cannot be empty" });
        // Dodanie katalogu do bazy danych
        let resultAdd = await catalogsdao.addCatalog(name,id_user);
        return res.status(201).send("Catalog added successfuly");
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}
// edycja nazwy katalogu
async function editCatalog(req,res) {
    try{
        // Autoryzacja użytkownika za pomocą tokena JWT
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {id_catalog,name} = req.body;
         // Walidacja  pól
        if(!id_catalog || !name)
            return res.status(200).json({ message: "All fields are required" });
        if(id_catalog<0)
            return res.status(200).json({ message: "Catalog ID must be positive integer" });
        if(name.length<=0)
            return res.status(200).json({ message: "Name cannot be empty" });
         // Sprawdzenie, czy katalog o podanym id istnieje i należy do użytkownika
        let checkExist = await catalogsdao.getUserCatalogById(id_catalog,id_user);
        if(checkExist.rowCount<=0)
            return res.status(200).send("Catalog not found");
        //aktualizacja nazwy katalogu
        let resultEdit = await catalogsdao.editCatalog(name,id_catalog,id_user);
        return res.status(201).send("Catalog edited successfuly");
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}
// usunięcie katalogu użytkownika na podstawie ID
async function deleteCatalog(req,res) {
    try{
        // Autoryzacja użytkownika za pomocą tokena JWT
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {id_catalog} = req.body;
        //walidacja id katalogu
        if(!id_catalog)
            return res.status(200).json({ message: "All fields are required" });
        if(id_catalog<0)
            return res.status(200).json({ message: "Catalog ID must be positive integer" });
        //weryfikacja istnienia katalogu
        let checkExist = await catalogsdao.getUserCatalogById(id_catalog,id_user);
        if(checkExist.rowCount<=0)
            return res.status(200).send("Catalog not found");
        //usunięcie katalogu
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
