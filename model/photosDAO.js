const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
// Zwraca 5 najnowszych publicznych zdjęć do karuzeli
async function getCarouselPhotos() {
    return await pool.query(
        "select p.id_photo, p.title, p.path, p.added, p.description, u.username \
        from photos p inner join users u on p.id_user=u.id_user \
        where p.is_private=false order by p.added desc\
        limit 5"
    );
}
// Zwraca publiczne zdjęcia posortowane i przefiltrowane
async function filterGetAllPublicPhotos(sort,search,limit,offset) {
    return await pool.query(
        `select p.id_photo, p.title, p.path, p.added, p.description, u.username
        from photos p inner join users u on p.id_user=u.id_user
        where p.is_private=false and p.title like $1
        order by `+sort+` limit $2 offset $3`
    ,[search,limit,offset]);
}
// Zwraca zdjęcia użytkownika posortowane i przefiltrowane
async function filterGetUserPhotos(id_user,sort,search,limit,offset) {
    return await pool.query(
        `SELECT p.id_photo, p.title, p.path, p.added, p.description, p.is_private, u.username
         FROM photos p INNER JOIN users u ON p.id_user = u.id_user
         WHERE p.id_user = $1 and p.title like $2
         order by `+sort+` limit $3 offset $4`,
        [id_user,search,limit,offset]
    );
}
// Dodaje nowe zdjęcie do bazy danych i zwraca jego ID
async function addPhoto(title,path,is_private,added,description,id_user) {
    return await pool.query(
        "insert into photos(title,path,is_private,added,description,id_user) values($1,$2,$3,$4,$5,$6) RETURNING id_photo",
        [title,path,is_private,added,description,id_user]
    );
}
// Pobiera dane zdjęcia, jeśli należy do danego użytkownika
async function getPhotoById(id_photo, id_user) {
    return await pool.query(
        "SELECT * FROM photos WHERE id_photo = $1 and id_user = $2",
        [id_photo,id_user]
    );
}
// Administrator może pobrać zdjęcie niezależnie od właściciela
async function adminGetPhotoById(id_photo) {
    return await pool.query(
        "SELECT * FROM photos WHERE id_photo = $1",
        [id_photo]
    );
}
// Edytuje dane zdjęcia
async function editPhoto(title,is_private,description,id_photo,path) {
    let result = await pool.query(
        "update photos set title=$1, is_private=$2, description=$3, path=$4  \
        where id_photo=$5",
        [title,is_private,description,path,id_photo]
    );
}
// Usuwa zdjęcie jeśli należy do użytkownika
async function deletePhoto(id_photo,id_user) {
    let result = await pool.query(
        "delete from photos where id_photo=$1 and id_user=$2",
        [id_photo,id_user]
    );
}
// Administrator może usunąć dowolne zdjęcie bez sprawdzania właściciela
async function adminDeletePhoto(id_photo) {
    let result = await pool.query(
        "delete from photos where id_photo=$1",
        [id_photo]
    );
}

module.exports={
    getCarouselPhotos,
    filterGetAllPublicPhotos,
    filterGetUserPhotos,
    addPhoto,
    getPhotoById,
    editPhoto,
    deletePhoto,
    adminGetPhotoById,
    adminDeletePhoto
}



