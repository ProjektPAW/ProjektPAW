import styles from '../../styles/profile.module.css';
import photoStyles from '../../styles/photoGalery.module.css';
import closeImg from "../../public/imgs/close.png";

const PhotoUploadModal = ({
  showModal,
  setShowModal,
  handleSubmit,
  handleChange,
  handleSetCatalogs,
  catalogs
}) => {
  if (!showModal) return null;

  return (
    <div className={styles.modal_overlay} onClick={() => setShowModal(false)}>
      <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
        <span className={photoStyles.close_modal} onClick={() => setShowModal(false)}>
          <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
        </span>
        <h3>Dodaj zdjęcie</h3>
        <form onSubmit={handleSubmit} className={styles.photo_form}>
          <label>Tytuł:</label>
          <input type="text" name="title" onChange={handleChange} required />
          <label>Opis:</label>
          <textarea name="description" onChange={handleChange} />
          <label>
            <input type="checkbox" name="is_private" onChange={handleChange} /> Prywatne
          </label>
          <label>Zdjęcie:</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
          <label>Dodaj do katalogu</label>
          <div className={styles.select_catalog}>
            {catalogs.map(
              (catalog) =>
                catalog.id_catalog >= 0 && (
                  <div key={catalog.id_catalog}>
                    <input
                      type="checkbox"
                      name={catalog.id_catalog}
                      onChange={handleSetCatalogs}
                    />
                    <label>{catalog.name}</label>
                  </div>
                )
            )}
          </div>
          <button type="submit">Dodaj</button>
        </form>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
