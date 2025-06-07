const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// Zwraca zdjęcia z danego katalogu użytkownika, przefiltrowane i posortowane
async function filterGetPhotosInCatalog(id_catalog,id_user,sort,search,limit,offset) {
    return await pool.query(
        `select p.* 
        from photos p inner join catalog_photo c_p on p.id_photo=c_p.id_photo
        where c_p.id_catalog=$1 and id_user=$2 and p.title like $3
        order by `+sort+` limit $4 offset $5`,
        [id_catalog,id_user,search,limit,offset]
    );
}
// Zwraca wszystkie katalogi dla danego zdjęcia
async function getPhotoCatalogs(id_photo) {
    return await pool.query(
        `select * from catalog_photo where id_photo=$1`,
        [id_photo]
    );
}
// Dodaje zdjęcie do katalogu (relacja wiele-do-wielu)
async function addPhotoToCatalog(id_catalog,id_photo) {
    return await pool.query(
        `insert into catalog_photo(id_photo,id_catalog) values($1,$2);`,
        [id_photo,id_catalog]
    );
}
// Usuwa wszystkie przypisania zdjęcia do katalogów
async function deletePhotoFromAllCatalogs(id_photo) {
    return await pool.query(
        `delete from catalog_photo where id_photo=$1`,
        [id_photo]
    );
}
// Sprawdza, czy dane zdjęcie już zostało przypisane do katalogu przez użytkownika
async function checkPhotoAlreadyAdded(id_catalog,id_photo,id_user) {
    return await pool.query(
        `select * 
        from photos p inner join catalog_photo c_p on p.id_photo=c_p.id_photo
        where c_p.id_catalog=$1 and p.id_photo=$2 and id_user=$3;`,
        [id_catalog,id_photo,id_user]
    );
}

module.exports={
    filterGetPhotosInCatalog,
    deletePhotoFromAllCatalogs,
    addPhotoToCatalog,
    getPhotoCatalogs,
    checkPhotoAlreadyAdded,
}
