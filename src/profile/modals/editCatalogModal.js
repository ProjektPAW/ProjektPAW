import photoStyles from "../../styles/photoGalery.module.css";
import styles from "../../styles/profile.module.css";
import closeImg from "../../public/imgs/close.png";

const EditCatalogModal = ({
  showEditCatalogModal,
  setShowEditCatalogModal,
  catalogs,
  selectedCatalogId,
  setNewCatalogName,
  newCatalogName,
  handleEditCatalogSubmit,
  handleDeleteCatalog,
}) => {
  if (!showEditCatalogModal) return null;

  // Get the current catalog name for the selected id
  const currentCatalog = catalogs.find((c) => c.id_catalog === selectedCatalogId);

  return (
    <div className={photoStyles.modal_overlay} onClick={() => setShowEditCatalogModal(false)}>
      <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
        <span className={photoStyles.close_modal} onClick={() => setShowEditCatalogModal(false)}>
          <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
        </span>

        <h3>Edytuj katalog</h3>

        <form onSubmit={handleEditCatalogSubmit} className={styles.photo_form}>
          <label>Nowa nazwa:</label>
          <input
            type="text"
            name={selectedCatalogId}
            value={newCatalogName}
            onChange={(e) => setNewCatalogName(e.target.value)}
            placeholder={currentCatalog ? currentCatalog.name : ""}
            required
          />

          <button type="submit">Zapisz zmiany</button>

          <button
            type="button"
            className={styles.delete_catalog_btn}
            onClick={handleDeleteCatalog}
          >
            Usuń katalog
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCatalogModal;
