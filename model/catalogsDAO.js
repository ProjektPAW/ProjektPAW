const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// Pobiera wszystkie katalogi należące do danego użytkownika
async function getUserCatalogs(id_user) {
    return await pool.query(
        "select * from catalog where id_user=$1;",
        [id_user]
    );
}
// Pobiera tylko id katalogów użytkownika
async function getUserCatalogsId(id_user) {
    return await pool.query(
        "select id_catalog from catalog where id_user=$1;",
        [id_user]
    );
}
// Pobiera konkretny katalog użytkownika po ID katalogu i ID użytkownika
async function getUserCatalogById(id_catalog,id_user) {
    return await pool.query(
        "select * from catalog where id_catalog=$1 and id_user=$2;",
        [id_catalog,id_user]
    );
}
// Dodaje nowy katalog dla danego użytkownika
async function addCatalog(name,id_user) {
    return await pool.query(
        "insert into catalog(name,id_user) values($1,$2);",
        [name,id_user]
    );
}
// Edytuje nazwę katalogu, tylko jeśli należy do danego użytkownika
async function editCatalog(name,id_catalog,id_user) {
    return await pool.query(
        "update catalog set name=$1 where id_catalog=$2 and id_user=$3;",
        [name,id_catalog,id_user]
    );
}
// Usuwa katalog, jeśli należy do użytkownika (nie usuwa zdjęć — tylko relację)
async function deleteCatalog(id_catalog,id_user) {
    return await pool.query(
        "delete from catalog where id_catalog=$1 and id_user=$2",
        [id_catalog,id_user]
    );
}

module.exports={
    getUserCatalogs,
    getUserCatalogsId,
    getUserCatalogById,
    addCatalog,
    editCatalog,
    deleteCatalog,
}



