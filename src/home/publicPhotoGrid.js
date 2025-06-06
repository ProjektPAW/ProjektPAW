import React from "react";
import photoStyles from "../styles/photoGalery.module.css";
import styles from "../styles/home.module.css";
import deleteImg from "../public/imgs/bin.png";

const truncate = (str, len) =>
  str.length > len ? str.slice(0, len) + "..." : str;

export default function PublicPhotoGrid({
  photos,
  searchText,
  onSelectPhoto,
  onDeletePhoto,
}) {
  if (!Array.isArray(photos) || photos.length === 0) {
    return (
      <span className={styles.no_results}>
        <p>Brak zdjęć spełniających kryteria wyszukiwania.</p>
      </span>
    );
  }

  return (
    <div className={photoStyles.photo_grid}>
      {photos.map((photo) => (
        <div key={photo.id_photo} className={photoStyles.photo_card}>
          <img
            src={`/api/${photo.path}`}
            alt={photo.title}
            onClick={() => onSelectPhoto(photo)}
            className={`${photoStyles.clickable} ${photoStyles.photo}`}
          />
          <div className={styles.title_container}>
            <div className={styles.padlock_container}>
              <h4>
                {truncate(photo.title, 30)}
              </h4>
            </div>
            {localStorage.getItem("role") === "1" && (
              <button
                className={styles.delete_btn}
                onClick={() => onDeletePhoto(photo.id_photo)}
              >
                <img
                  src={deleteImg}
                  alt="Usuń"
                  className={styles.icon_delete}
                />
              </button>
            )}
          </div>
          <p>{truncate(photo.description, 30)}</p>
        </div>
      ))}
    </div>
  );
}
