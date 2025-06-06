import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import '../styles/swiper.css';
import "swiper/css";
import "swiper/css/navigation";
import styles from "../styles/home.module.css";

export default function Carousel({ photos }) {
  if (!Array.isArray(photos) || photos.length < 3) return null;

  return (
    <div>
      <h2 className={styles.carousel_title}>Wyróżnione Zdjęcia</h2>
      <Swiper
        modules={[Navigation, EffectCoverflow]}
        navigation
        loop={photos.length > 4}
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
        {photos.map((photo, idx) => (
          <SwiperSlide
            key={`${photo.id_photo}-${idx}`}
            style={{ width: "320px" }}
            className="carousel-slide"
          >
            <img src={`/api/${photo.path}`} alt={photo.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
