import styles from "../styles/profile.module.css";

const ProfileCard = ({
  userData,
  setShowModal,
  setCatalogList,
  setShowChangePasswordModal,
  handleDeleteUser,
}) => {
  return (
    <div className={styles.profile_card}>
      <h2>Profil</h2>
      <p>Użytkownik: {userData.username}</p>
      <p>Email: {userData.email}</p>
      <div className={styles.button_group}>
        <button
          className={styles.open_modal_btn}
          onClick={() => {
            setCatalogList({});
            setShowModal(true);
          }}
        >
          Dodaj zdjęcie
        </button>
        <button
          className={styles.open_modal_btn}
          onClick={() => setShowChangePasswordModal(true)}
        >
          Zmień hasło
        </button>
        <button className={styles.delete_account_btn} onClick={handleDeleteUser}>
          Usuń konto
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
