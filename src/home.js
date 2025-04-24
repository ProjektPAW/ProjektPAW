import styles from './home.module.css';
import photoStyles from './photoGalery.module.css';
import './swiper.css';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import closeImg from "./public/imgs/close.png";

function Home() {
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
            <h4>{photo.title.length > 30 ? photo.title.slice(0, 30) + '...' : photo.title}</h4>
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
