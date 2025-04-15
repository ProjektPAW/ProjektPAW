import './home.css';
import axios from "axios";
import React, { useEffect, useState } from "react";

function Home() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get("/api/getphotos")
      .then(response => {
        setPhotos(response.data);
      })
      .catch(error => {
        console.error("Błąd podczas pobierania zdjęć:", error);
      });
  }, []);

  return (
    <div className="page_container">
      <main className="content">
        <h2>Publiczne Zdjęcia</h2>
        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo.id_photo} className="photo-card">
              <img src={`/api/${photo.path}`} alt={photo.title} />
              <h4>{photo.title}</h4>
              <p className="author">Dodane przez: {photo.username}</p>
              <p>{photo.description}</p>
              <p className="date">{photo.added}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
export default Home;