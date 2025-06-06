import photoStyles from "../../styles/photoGalery.module.css";
import styles from '../../styles/profile.module.css'; 
import closeImg from "../../public/imgs/close.png";

const AddCatalogModal = ({
  showCatalogModal,
  setShowCatalogModal,
  newCatalog,
  handleCatalogChange,
  CreateCatalogue,
}) => {
  if (!showCatalogModal) return null; // Renderuj tylko jeśli modal ma być widoczny

  return (
    <div className={photoStyles.modal_overlay} onClick={() => setShowCatalogModal(false)}>
      {/*Kliknięcie poza modal zamyka go*/}
      <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
        {/*Zapobiega zamknięciu modala po kliknięciu w jego treść*/}
        <span className={photoStyles.close_modal} onClick={() => setShowCatalogModal(false)}>
          {/*Przycisk zamknięcia modala*/}
          <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
        </span>
        <h3>Dodaj katalog</h3>
        <form className={styles.photo_form}>
          <label>Nazwa katalogu:</label>
          <input
            type="text"
            name="name"
            value={newCatalog.name}
            onChange={handleCatalogChange}
            required
          />
          <button type="button" onClick={CreateCatalogue}>
            Utwórz katalog
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCatalogModal;
