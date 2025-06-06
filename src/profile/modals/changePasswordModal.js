import photoStyles from "../../styles/photoGalery.module.css";
import styles from "../../styles/profile.module.css";
import passwordInputStyles from "../../styles/register.module.css"
import closeImg from "../../public/imgs/close.png";

const ChangePasswordModal = ({
  showChangePasswordModal,
  setShowChangePasswordModal,
  handleSubmitChangePassword,
  handleChangePassword,
  type,
  icon,
    handleToggle
}) => {
  if (!showChangePasswordModal) return null; // Nie renderuj modala jeśli flaga jest false

  return (
    <div className={photoStyles.modal_overlay} onClick={() => setShowChangePasswordModal(false)}>
       {/* Kliknięcie poza modal zamyka go */}
      <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
        {/* Zapobiega zamknięciu modala przy kliknięciu w jego treść */}
        <span className={photoStyles.close_modal} onClick={() => setShowChangePasswordModal(false)}>
          <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
        </span>
        <h3>Zmiana Hasła</h3>
        <div className={styles.change_password_form}>
          <form onSubmit={handleSubmitChangePassword} className={styles.photo_form}>
            {["oldPassword", "newPassword", "confirmedNewPassword"].map((field) => (
              <div key={field}>
                <label>
                  {field === "oldPassword"
                    ? "Podaj obecne hasło:"
                    : field === "newPassword"
                    ? "Podaj nowe hasło:"
                    : "Potwierdź nowe hasło:"}
                </label>
                <div className={styles.password_container}>
                  <input
                    name={field}
                    type={type} // pokazuje lub ukrywa hasło w zależności od stanu
                    placeholder={
                      field === "oldPassword"
                        ? "Podaj obecne hasło..."
                        : field === "newPassword"
                        ? "Podaj nowe hasło..."
                        : "Potwierdź nowe hasło..."
                    }
                    onChange={handleChangePassword}
                    required
                  />
                  {/* Ikona do pokazywania/ukrywania hasła */}
                  <span className={passwordInputStyles.password_icon} onClick={handleToggle}>
                    {icon}
                  </span>
                </div>
              </div>
            ))}
            <button type="submit" className={styles.change_password_btn}>
              Zapisz zmiany
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
