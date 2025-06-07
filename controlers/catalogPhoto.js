const catalogphotosdao = require("../model/catalogPhotoDAO");
const photosdao = require("../model/photosDAO");
const auth = require("./auth");
const numPerPage=20;
// zwrócenie zdjęć z katalogu zgodnie z podanymi filtrami: sortowaniem, wyszukiwaniem, paginacją
async function filterGetPhotosInCatalog(req,res) {
    try{
        const token=req.headers.authorization;
        // Uwierzytelnianie użytkownika
        let id_user = await auth.autenthicate(token);
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        // Lista dozwolonych opcji sortowania
        const possibleSort=["added_desc","added_asc","title_desc","title_asc"];
        // Pobranie parametrów z zapytania
        const {id_catalog, sort, search, page} = req.query;
        // Walidacja pól
        if(!page || !id_catalog)
            return res.status(200).json({ message: "All fields are required" });
        const pageNumber = parseInt(page, 10);
        if(!Number.isInteger(pageNumber) || pageNumber<0)
            return res.status(200).json({ message: "Page must be non negative integer" });
        if(possibleSort.includes(sort)==false)
            return res.status(200).json({ message: "Invalid sort" });
        if(id_catalog<0)
            return res.status(200).json({ message: "Catalog ID must be positive integer" });
        // Wyliczenie offsetu do paginacji
        let offset=pageNumber*numPerPage;
        // określenie sortowania
        let newSort = sort||"added desc";
        newSort=newSort.replace("_"," ").toString();
        //szukanie po nazwie
        let newSearch=search||"";
        newSearch="%"+search+"%";
        //pobranie danych z bazy
        let result = await catalogphotosdao.filterGetPhotosInCatalog(id_catalog,id_user,newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos in catalog not found");
        //zwrócenie danych
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(200).json({message:"Photo get failed"});
    }
}
// zwrócenie katalogów, do których przypisane jest dane zdjęcie użytkownika
async function getPhotoCatalogs(req,res) {
    try{
        // Autoryzacja użytkownika na podstawie tokena JWT
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");

        const {id_photo} = req.query;
        //walidacja id zdjęcia
        if(!id_photo)
            return res.status(200).json({ message: "All fields are required" });
         if(!Number.isInteger(parseInt(id_photo, 10))||id_photo<0)
            return res.status(200).json({ message: "Photo ID must be positive integer" });
        //sprawdzenie czy zdjęcie o podanym id istnieje w bazie
        let result = await photosdao.getPhotoById(id_photo,id_user);
        if(result.rowCount<=0)
            return res.status(200).send("Photo not found");
        //pobranie i zwrócenie katalogów przypisanych do zdjęcia
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
