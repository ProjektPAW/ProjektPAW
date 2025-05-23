const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

async function createUser(username, email, hashedPassword) {
    return await pool.query(
        "INSERT INTO users (username, email, password, id_role) VALUES ($1, $2, $3,0) RETURNING id_user, username, email",
        [username, email, hashedPassword]
    );
}

async function selectUserByUnameEmail(username,email) {
    return await pool.query(
        "select * from users where username like $1 or email like $2",
        [username,email]
    );
}

async function selectUserByUsername(username) {
  return await pool.query(
      "select * from users where username like $1",
      [username]
  );
}
async function selectUserRoleById(id) {
  return await pool.query(
      "select id_role from users where id_user = $1",
      [id]
  );
}

async function selectUserById(id) {
  return await pool.query(
      "select * from users where id_user = $1",
      [id]
  );
}

  module.exports={
    pool,
    createUser,
    selectUserByUnameEmail,
    selectUserByUsername,
    selectUserById,
    selectUserRoleById
  }