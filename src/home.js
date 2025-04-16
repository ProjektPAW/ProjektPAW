import styles from './home.module.css';
import photoStyles from './photoGalery.module.css';
import './swiper.css';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';

function Home() {
  const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
            <h2>Wyróżnione Zdjęcia</h2>
            <Swiper
              modules={[Navigation, EffectCoverflow]}
              navigation
              loop={true}
              centeredSlides={true}
              slidesPerView={2}
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
              {photos.slice(0, 5).map((photo) => (
                <SwiperSlide
                  key={photo.id_photo}
                  style={{ width: '320px' }}
                  className="carousel-slide"
                >
                  <img src={`/api/${photo.path}`} alt={photo.title} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Grid Section */}
        <h2>Publiczne Zdjęcia</h2>
        <div className={photoStyles.photo_grid}>
          {photos.slice(0, photos.length).map((photo) => (
            <div key={photo.id_photo} className={photoStyles.photo_card} >
              <img src={`/api/${photo.path}`} alt={photo.title} />
              <h4>{photo.title}</h4>
              <p>{photo.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
