const photodao = require("../model/photosDAO");
const catalogsdao = require("../model/catalogsDAO");
const catalogPhotoDAO = require("../model/catalogPhotoDAO");
const userdao = require("../model/userDAO");
const auth = require("./auth");
const fs = require("fs");
const numPerPage=20;
// zwrócenie zdjęć do karuzeli
async function getCarouselPhotos(res) {
    try{
        //pobranie oraz zwrócenie 5 najnowszych zdjęć do karuzeli
        let result = await photodao.getCarouselPhotos();
        return res.status(200).json(result.rows);
    }catch(err){
        console.error(err);
        return res.status(500).send("Server error");
    }
}
// pobranie publicznych zdjęć z filtrowaniem, sortowaniem i paginacją
async function filterGetAllPublicPhotos(req, res) {
    try{
        // Dozwolone wartości sortowania
        const possibleSort=["added_desc","added_asc","title_desc","title_asc"];
        const {sort, search, page} = req.query;
        //walidacja danych
        if(!page)
            return res.status(200).json({ message: "Page is required" });
        const pageNumber = parseInt(page, 10);
        if(!Number.isInteger(pageNumber) || pageNumber<0)
            return res.status(200).json({ message: "Page must be non negative integer" });
        if(possibleSort.includes(sort)==false)
            return res.status(200).json({ message: "Invalid sort" });
        // Wyliczenie offsetu do paginacji
        let offset=pageNumber*numPerPage;
        // określenie sortowania
        let newSort = sort||"added desc";
        newSort=newSort.replace("_"," ").toString();
        //szukanie po nazwie
        let newSearch=search||"";
        newSearch="%"+search+"%";
        //pobranie danych z bazy
        let result = await photodao.filterGetAllPublicPhotos(newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos not found");
        //zwrócenie danych
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(201).json({message:"Photo get failed"});
    }
}
//dodanie zdjęcia
async function addPhoto(req,res) {
    try{
        // Uwierzytelnianie użytkownika
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        // Sprawdzenie, czy w żądaniu przesłano plik ze zdjęciem
        if (!req.files || !req.files.photo){
            return res.status(200).send("No file data");
        }
        // Pobranie danych z ciała żądania
        const {title,is_private,description} = req.body;
        // Parsowanie tablicy katalogów, do których ma zostać dodane zdjęcie
        const catalogs_to_add = JSON.parse(req.body.catalogs_to_add);
        // Walidacja wymaganych pól
        if(!title || !catalogs_to_add)
            return res.status(200).json({ message: "All fields are required" });
        if (is_private!="true"&&is_private!="false")
            return res.status(200).json({ message: "Invalid private checkbox value" });
        if (typeof description !== "string" || typeof title !== "string")
            return res.status(200).json({ message: "Description and title must be a string." });
        // Pobranie pliku zdjęcia
        let file=req.files.photo;
        if(!file)
            return res.status(200).json({ message: "Photo file is required" });
        // Przygotowanie ścieżki do zapisu pliku
        let path = "files/";
        // Jeśli katalog files nie istnieje, tworzymy go
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        // Dodanie do ścieżki znacznika czasu i nazwy pliku dla unikalności
        path+=Date.now()+"__"+file.name;
        // Przeniesienie pliku na dysk do wyznaczonego katalogu
        file.mv(path);
        // Dodanie zdjęcia do bazy danych i pobranie ID utworzonego zdjęcia
        let result = await photodao.addPhoto(title,path,is_private,new Date(),description,id_user);
        let id_photo=result.rows[0].id_photo;
        // Pobranie listy ID katalogów użytkownika
        let userCatalogs=await catalogsdao.getUserCatalogsId(id_user);
        // utworzenie tablicy ID katalogów użytkownika z pobranej listy 
        let catalogsArray=[];
        for(var i in userCatalogs.rows)
            catalogsArray.push(userCatalogs.rows[i].id_catalog);
        // Iteracja po katalogach do dodania zdjęcia
        for(i in catalogs_to_add){
            i=parseInt(i);
            // Sprawdzenie, czy katalog jest oznaczony do dodania i czy należy do użytkownika
            if(catalogs_to_add[i]==true && catalogsArray.includes(i)){
                // Dodanie zdjęcia do danego katalogu w bazie danych
                catalogPhotoDAO.addPhotoToCatalog(i,id_photo);
            }
        }
        return res.status(201).send("Photo added succesfully");
    }catch(err){
        console.error(err);
        return res.status(500).send("Photo adding failed");
    }
}
// pobranie zdjęć użytkownika z filtrowaniem, sortowaniem i paginacją
async function filterGetUserPhotos(req, res){
    try{
        // Uwierzytelnianie użytkownika
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        // Lista dozwolonych opcji sortowania
        const possibleSort=["added_desc","added_asc","title_desc","title_asc"];
         // Pobranie parametrów z zapytania
        const {sort, search, page} = req.query;
        // Walidacja pól
        if(!sort || !page)
            return res.status(200).json({ message: "All fields are required" });
        const pageNumber = parseInt(page, 10);
        if(!Number.isInteger(pageNumber) || pageNumber<0)
            return res.status(200).json({ message: "Page must be non negative integer" });
        if(possibleSort.includes(sort)==false)
            return res.status(200).json({ message: "Invalid sort" });
        // Wyliczenie offsetu do paginacji
        let offset=pageNumber*numPerPage;
        // określenie sortowania
        let newSort = sort||"added desc";
        newSort=newSort.replace("_"," ").toString();
        //szukanie po nazwie
        let newSearch=search||"";
        newSearch="%"+search+"%";
        //pobranie danych z bazy
        let result = await photodao.filterGetUserPhotos(id_user,newSort,newSearch,numPerPage,offset);
        if(result.rowCount<=0)
            return res.status(200).send("Photos not found");
        //zwrócenie danych
        return res.status(201).json(result.rows);
    }catch(e){
        console.log(e);
        return res.status(201).json({message:"Photo get failed"});
    }
}
//edycja zdjęcia
async function editPhoto(req, res){
    try{
         // Uwierzytelnianie użytkownika
        const token=req.headers.authorization;
        //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        
        const {title,is_private,description,id_photo, catalogs_to_add} = req.body;
        //walidacja danych wejściowych
        if(!title || !id_photo || ! catalogs_to_add)
            return res.status(200).json({ message: "All fields are required" });
        if(typeof id_photo !== "number" || id_photo<0)
            return res.status(200).json({ message: "Photo ID must be positive integer" });
        if (typeof is_private !== "boolean" && is_private !== 0 && is_private !== 1)
            return res.status(200).json({ message: "Invalid private checkbox value" });
        if (typeof description !== "string" || typeof title !== "string")
            return res.status(200).json({ message: "Description and title must be a string." });
        //pobranie danych zdjęcia po ID
        let result = await photodao.getPhotoById(id_photo,id_user);
        if(result.rowCount<=0)
            return res.status(200).send("Photo not found");
        // utworzenie nowej ścieżki do pliku ze zmienioną nazwą (dodanie timestampu)
        let newPath = result.rows[0].path.split("__");
        newPath.shift();
        newPath="files/"+Date.now()+"__"+newPath.join("");
         // Zmiana nazwy rzeczywistego pliku
        if(fs.rename(result.rows[0].path, newPath, function (err) {
            if (err) {console.log("Photo edit error: "+err);return 1;}
            else return 0;
        }))    return res.status(500).send("File rename error: "+error);
        else{
             // Edycja wpisu w bazie danych (aktualizacja danych zdjęcia)
            let resultEdit = await photodao.editPhoto(title,is_private,description,id_photo,newPath);
            // Usunięcie zdjęcia ze wszystkich katalogów
            catalogPhotoDAO.deletePhotoFromAllCatalogs(id_photo);
             // Pobranie ID katalogów użytkownika
            let userCatalogs=await catalogsdao.getUserCatalogsId(id_user);
            // utworzenie tablicy ID katalogów użytkownika z pobranej listy
            let catalogsArray=[];
            for(var i in userCatalogs.rows)
                catalogsArray.push(userCatalogs.rows[i].id_catalog);
            // Iteracja po katalogach do dodania zdjęcia
            for(i in catalogs_to_add){
                i=parseInt(i);
                // Sprawdzenie, czy katalog jest oznaczony do dodania i czy należy do użytkownika
                if(catalogs_to_add[i]==true && catalogsArray.includes(i)){
                    // Dodanie zdjęcia do danego katalogu w bazie danych
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
//usunięcie zdjęcia
async function deletePhoto(req, res){
    try{
         // Uwierzytelnianie użytkownika
        const token=req.headers.authorization;
         //weryfikacja tokenu (gdy token jest niepoprawny lub uzytkownik nie istnieje funkcja authenticate zwraca wartość -1)
        let id_user = await auth.autenthicate(token);
        if(id_user < 0)
            return res.status(200).send("Invalid token");
        const {id_photo} = req.body;
       // Sprawdzamy, czy id_photo jest podane
        if(!id_photo)
            return res.status(200).json({ message: "All fields are required" });
        // Pobieramy rolę użytkownika aby określicz czy użytkownik jest administratorem
        let user_role=(await userdao.selectUserRoleById(id_user)).rows[0].id_role;
        
        let result;
        //pobranie zdjęcia na podstawie ID, jeśli to nie administrator, sprawdzenie dodatkowo czy zdjęcie należy do użytkownika
        if(user_role==1)
            result = await photodao.adminGetPhotoById(id_photo);
        else 
            result = await photodao.getPhotoById(id_photo,id_user);
        //sprawdzenie czy zdjęcie zostało znalezione
        if(result.rowCount<=0)
            return res.status(200).send("Photo not found");
        //usunięcie rzeczywistego pliku
        if(fs.unlink(result.rows[0].path, function (err) {
            if (err) {console.log("Photo deletion error: "+err);return 1;}
            else return 0;
        }))     return res.status(500).send("File deletion failed.");
        else{
            //usunięcie rekordu z bazy jako użytkownik lub administrator
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