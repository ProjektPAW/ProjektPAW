import styles from './home.module.css';
import photoStyles from './photoGalery.module.css';
import './swiper.css';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import {sendError, sendSuccess, sendWarning} from './toast'
import closeImg from "./public/imgs/close.png";
import deleteImg from "./public/imgs/bin.png";

function Home({ refr }) {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  useEffect(() => {
    axios
      .get("/api/getphotos")
      .then(response => {
        setPhotos(response.data);
      })
      .catch(error => {
        console.error("Błąd podczas pobierania zdjęć:", error);
      });
  }, []);

  const deletePhoto = async (id) => {
    const confirmDelete = window.confirm("Na pewno chcesz usunąć to zdjęcie?");
    if (!confirmDelete) return;
    
    try {
        axios
            .delete("/api/deletephoto", {
                data: { id_photo: id },
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                },
            }) 
            .then((response) => {
                if (response.status == 200) {
                    sendError(response.data || "deleting failed.");
                    return;
                }
                sendSuccess("Photo deleted successfully!");
                refr();
            })
            .catch((error) => {
                console.error("Błąd:", error);
                sendError("Photo deleting failed.");
            });
    } catch (error) {
        sendError("Server error: " + error.message);
    }

};

  return (
    <div className={styles.page_container}>
      <main className={styles.content}>

        {/* Carousel Section */}
        {photos.length > 0 && (
        <div>
          {photos.length < 3 ? (
            <></>
          ) : (<h2>Wyróżnione Zdjęcia</h2>)&&(
            <Swiper
              modules={[Navigation, EffectCoverflow]}
              navigation
              loop={photos.length > 3}
              centeredSlides={true}
              slidesPerView={2}
              initialSlide={Math.floor(photos.length / 2)}
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
              }}
              className={styles.carousel}
            >
              {photos.map((photo, index) => (
                <SwiperSlide
                  key={`${photo.id_photo}-${index}`}
                  style={{ width: '320px' }}
                  className="carousel-slide"
                >
                  <img src={`/api/${photo.path}`} alt={photo.title} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}


        {/* Grid Section */}
        <h2>Publiczne Zdjęcia</h2>
        <div className={photoStyles.photo_grid}>
          {photos.slice(0, photos.length).map((photo) => (
            <div key={photo.id_photo} className={photoStyles.photo_card} >
              <img
                  src={`/api/${photo.path}`}
                  alt={photo.title}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`${photoStyles.clickable} ${photoStyles.photo}`}

              />
            <div className={styles.title_container}>
              <div className={styles.padlock_container}>
                <h4>{photo.title.length > 30 ? photo.title.slice(0, 30) + '...' : photo.title}</h4>
              </div>
              {localStorage.getItem("role")==1 && (
              <div>
                <button className ={styles.delete_btn} onClick={() => deletePhoto(photo.id_photo)}>
                    <img src={deleteImg}
                        alt = "Delete"
                        className={styles.icon_delete}
                    />
                </button>
              </div>)}
            </div>

            <p>{photo.description.length > 30 ? photo.description.slice(0, 30) + '...' : photo.description}</p>


            </div>
          ))}
        </div>
          {selectedPhoto && (
          <div className={photoStyles.modal_overlay} onClick={() => setSelectedPhoto(null)}>
              <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
              <div className={photoStyles.close_modal} onClick={() => setSelectedPhoto(null)}>
                  <img src={closeImg} alt="Close" className={photoStyles.icon_close}/>
              </div>
              <img src={`/api/${selectedPhoto.path}`} alt={selectedPhoto.title} />
              <h4>Tytuł: {selectedPhoto.title}</h4>
              <p>Autor: {selectedPhoto.username}</p>
              <p>{selectedPhoto.description.length===0?"Brak opisu":"Opis: "+selectedPhoto.description}</p>
              <p>Data dodania: 
                {new Date(selectedPhoto.added).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour:"numeric",
                  minute:"numeric"
                })}
              </p>
              </div>
          </div>
          )}
      </main>
    </div>
  );
}

export default Home;
