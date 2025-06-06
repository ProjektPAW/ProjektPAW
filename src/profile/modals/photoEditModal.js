import photoStyles from "../../styles/photoGalery.module.css";
import styles from "../../styles/profile.module.css";
import closeImg from "../../public/imgs/close.png";

const PhotoEditModal = ({
  selectedEdit,
  setSelectedEdit,
  handleEditChange,
  handleSetCatalogs,
  catalogs,
  catalogsLoaded,
  checkedCatalogsList,
  handleEditSubmit,
}) => {
  if (!selectedEdit) return null;

  return (
    <div
      className={photoStyles.modal_overlay}
      onClick={() => setSelectedEdit(null)}
    >
      <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
        <span
          className={photoStyles.close_modal}
          onClick={() => setSelectedEdit(null)}
        >
          <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
        </span>
        <img src={`/api/${selectedEdit.path}`} alt={selectedEdit.title} />
        <form className={styles.photo_form}>
          <label>Tytuł:</label>
          <input
            type="text"
            name="title"
            onChange={handleEditChange}
            required
            defaultValue={selectedEdit.title}
          />
          <label>Opis:</label>
          <textarea
            name="description"
            onChange={handleEditChange}
            defaultValue={selectedEdit.description}
          />
          <label>
            <input
              type="checkbox"
              name="is_private"
              onChange={handleEditChange}
              defaultChecked={selectedEdit.is_private}
            />{" "}
            Prywatne
          </label>
          <label>Dodaj do katalogu</label>
          <div className={styles.select_catalog}>
            {catalogsLoaded &&
              catalogs.map(
                (catalog) =>
                  catalog.id_catalog >= 0 && (
                    <div key={catalog.id_catalog}>
                      <input
                        type="checkbox"
                        name={catalog.id_catalog}
                        onChange={handleSetCatalogs}
                        defaultChecked={checkedCatalogsList.includes(
                          catalog.id_catalog
                        )}
                      />
                      <label>{catalog.name}</label>
                    </div>
                  )
              )}
          </div>
          <button type="button" onClick={handleEditSubmit}>
            Zapisz zmiany
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhotoEditModal;
