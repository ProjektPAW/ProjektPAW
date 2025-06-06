import photoStyles from "../../styles/photoGalery.module.css";
import closeImg from "../../public/imgs/close.png";

const PhotoDetailsModal = ({ selectedPhoto, setSelectedPhoto }) => {
  if (!selectedPhoto) return null;

  return (
    <div className={photoStyles.modal_overlay} onClick={() => setSelectedPhoto(null)}>
      <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
        <span className={photoStyles.close_modal} onClick={() => setSelectedPhoto(null)}>
          <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
        </span>
        <img src={`/api/${selectedPhoto.path}`} alt={selectedPhoto.title} />
        <h4>Tytuł: {selectedPhoto.title}</h4>
        <p>{selectedPhoto.description.length === 0 ? "Brak opisu" : "Opis: " + selectedPhoto.description}</p>
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