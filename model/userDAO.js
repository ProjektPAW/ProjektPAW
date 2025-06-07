const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
// Tworzy nowego użytkownika z nadanym tokenem weryfikacyjnym i zwraca podstawowe dane (ID, login, email)
async function createUser(username, email, hashedPassword,emailToken) {
    return await pool.query(
        "INSERT INTO users (username, email, password, id_role, email_token) VALUES ($1, $2, $3,0, $4) RETURNING id_user, username, email",
        [username, email, hashedPassword, emailToken]
    );
}
// Weryfikuje użytkownika na podstawie tokena e-mailowego (ustawia emailverified = true)
async function verifyEmail(emailToken){
  return await pool.query(
    "update users set emailverified=true where email_token=$1 RETURNING id_user",
    [emailToken]
  );
}
// Sprawdza czy istnieje użytkownik o danym loginie lub e-mailu
async function selectUserByUnameEmail(username,email) {
    return await pool.query(
        "select * from users where username like $1 or email like $2",
        [username,email]
    );
}
// Pobiera dane użytkownika na podstawie loginu
async function selectUserByUsername(username) {
  return await pool.query(
      "select * from users where username like $1",
      [username]
  );
}
// Zwraca ID roli użytkownika (0 - zwykły, 1 - admin) na podstawie jego ID
async function selectUserRoleById(id) {
  return await pool.query(
      "select id_role from users where id_user = $1",
      [id]
  );
}
// Zwraca pełne dane użytkownika po jego ID
async function selectUserById(id) {
  return await pool.query(
      "select * from users where id_user = $1",
      [id]
  );
}
// Usuwa użytkownika z bazy danych
async function deleteUser(id) {
  return await pool.query(
      "delete from users where id_user = $1",
      [id]
  );
}
// Aktualizuje hasło użytkownika na nowe
async function updateUserPassword(id_user, hashedNew) {
  return await pool.query(
      "UPDATE users SET password = $2 WHERE id_user = $1",
      [id_user,hashedNew]
  );
}

  module.exports={
    createUser,
    selectUserByUnameEmail,
    selectUserByUsername,
    selectUserById,
    selectUserRoleById,
    verifyEmail,
    deleteUser,
    updateUserPassword
  }