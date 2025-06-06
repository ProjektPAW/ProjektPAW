import React from "react";
import photoStyles from "../styles/photoGalery.module.css";
import closeImg from "../public/imgs/close.png";

const PhotoDetailsModal = ({ selectedPhoto, setSelectedPhoto }) => {
  // Jeśli nie wybrano zdjęcia, modal się nie renderuje
  if (!selectedPhoto) return null;

  return (
    // Kliknięcie poza modalem zamyka go
    <div
      className={photoStyles.modal_overlay}
      onClick={() => setSelectedPhoto(null)}
    >
      {/* Kliknięcie wewnątrz modala nie propaguje kliknięcia do overlay */}
      <div
        className={photoStyles.modal_photo}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Przycisk zamykający modal */}
        <span
          className={photoStyles.close_modal}
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={closeImg}
            alt="Close"
            className={photoStyles.icon_close}
          />
        </span>
        {/* Wyświetlenie zdjęcia i jego szczegółów */}
        <img
          src={`/api/${selectedPhoto.path}`}
          alt={selectedPhoto.title}
        />
        <h4>Tytuł: {selectedPhoto.title}</h4>
        <p>Autor: {selectedPhoto.username}</p>
        <p>
          {selectedPhoto.description.length === 0
            ? "Brak opisu"
            : "Opis: " + selectedPhoto.description}
        </p>
        <p>
          Data dodania:{" "}
          {new Date(selectedPhoto.added).toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default PhotoDetailsModal;
