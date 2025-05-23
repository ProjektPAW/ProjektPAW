const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function getPhotosInCatalog(id_catalog,id_user) {
    return await pool.query(
        `select p.* 
        from photos p inner join catalog_photo c_p on p.id_photo=c_p.id_photo
        where c_p.id_catalog=$1 and id_user=$2;`,
        [id_catalog,id_user]
    );
}

async function filterGetPhotosInCatalog(id_catalog,id_user,sort,search,limit,offset) {
    return await pool.query(
        `select p.* 
        from photos p inner join catalog_photo c_p on p.id_photo=c_p.id_photo
        where c_p.id_catalog=$1 and id_user=$2 and p.title like $4
        order by $3
        limit $5 offset $6;`,
        [id_catalog,id_user,sort,search,limit,offset]
    );
}

async function getPhotoCatalogs(id_photo) {
    return await pool.query(
        `select * from catalog_photo where id_photo=$1`,
        [id_photo]
    );
}

async function addPhotoToCatalog(id_catalog,id_photo) {
    return await pool.query(
        `insert into catalog_photo(id_photo,id_catalog) values($1,$2);`,
        [id_photo,id_catalog]
    );
}

async function deletePhotoFromAllCatalogs(id_photo) {
    return await pool.query(
        `delete from catalog_photo where id_photo=$1`,
        [id_photo]
    );
}

async function checkPhotoAlreadyAdded(id_catalog,id_photo,id_user) {
    return await pool.query(
        `select * 
        from photos p inner join catalog_photo c_p on p.id_photo=c_p.id_photo
        where c_p.id_catalog=$1 and p.id_photo=$2 and id_user=$3;`,
        [id_catalog,id_photo,id_user]
    );
}

module.exports={
    getPhotosInCatalog,
    filterGetPhotosInCatalog,
    deletePhotoFromAllCatalogs,
    addPhotoToCatalog,
    getPhotoCatalogs,
    checkPhotoAlreadyAdded,
}
