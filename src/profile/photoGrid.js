import photoStyles from "../styles/photoGalery.module.css";
import styles from "../styles/profile.module.css";
import privateImg from "../public/imgs/private.png";
import editImg from "../public/imgs/edit.png";
import deleteImg from "../public/imgs/bin.png";

const truncate = (str, len) => (str.length > len ? str.slice(0, len) + "..." : str);

const PhotoGrid = ({
  sortedPhotos,
  searchText,
  setSelectedPhoto,
  prepareEditForm,
  deletePhoto,
}) => {
  if (!Array.isArray(sortedPhotos) || sortedPhotos.length === 0) {
    return (
      <div className={styles.catalog_empty}>
        {searchText !== "" ? (
          <p>Brak zdjęć spełniających kryteria wyszukiwania.</p>
        ) : (
          <p>Katalog pusty</p>
        )}
      </div>
    );
  }

  return (
    <div className={photoStyles.photo_grid}>
      {sortedPhotos.map((photo) => (
        <div key={photo.id_photo} className={photoStyles.photo_card}>
          <img
            src={`/api/${photo.path}`}
            alt={photo.title}
            onClick={() => setSelectedPhoto(photo)}
            className={`${photoStyles.clickable} ${photoStyles.photo}`}
          />
          <div className={styles.title_container}>
            <div className={styles.padlock_container}>
              {photo.is_private && (
                <img
                  src={privateImg}
                  alt="Private"
                  className={styles.icon}
                />
              )}
              <h4>{truncate(photo.title, 20)}</h4>
            </div>
            <div>
              <button className={styles.edit_btn}>
                <img
                  src={editImg}
                  alt="Edit"
                  className={styles.icon_edit}
                  onClick={() => prepareEditForm(photo)}
                />
              </button>
              <button
                className={styles.delete_btn}
                onClick={() => deletePhoto(photo.id_photo)}
              >
                <img
                  src={deleteImg}
                  alt="Delete"
                  className={styles.icon_delete}
                />
              </button>
            </div>
          </div>
          <p>{truncate(photo.description, 25)}</p>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
