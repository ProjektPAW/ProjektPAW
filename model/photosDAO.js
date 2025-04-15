const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

async function getAllPublicPhotos() {
    return await pool.query(
        "select p.id_photo, p.title, p.path, p.added, p.description, u.username \
        from photos p inner join users u on p.id_user=u.id_user \
        where p.is_private=false order by p.added desc"
    );
}

async function addPhoto(title,path,is_private,added,description,id_user) {
    let result = await pool.query(
        "insert into photos(title,path,is_private,added,description,id_user) values($1,$2,$3,$4,$5,$6);",
        [title,path,is_private,added,description,id_user]
    );
}

module.exports={
    getAllPublicPhotos,
    addPhoto
}



