import styles from './home.module.css';
import photoStyles from './photoGalery.module.css';
import './swiper.css';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from "axios";
import React, { useRef,useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import {sendError, sendSuccess, sendWarning} from './toast'
import closeImg from "./public/imgs/close.png";
import deleteImg from "./public/imgs/bin.png";

function Home({ refr }) {
  const [photos, setPhotos] = useState([]);
  const [sortedPhotos, setSortedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [sortOrder, setSortOrder]=useState("added_desc");
  const [page, setPage]=useState(0);
  const [searchText, setSearchText]=useState("");
  const [loading, setLoading] = useState(false);
  const [fetchNoMore,setFetchNoMore] = useState(false);

  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
      return () => {
          if (debounceTimeoutRef.current) {
              clearTimeout(debounceTimeoutRef.current);
          }
      };
  }, []);
  useEffect(()=>{
    try {
      axios
        .get("/api/getcarouselphotos")
        .then((response) => {
          setPhotos(response.data);
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania zdjęć:", error);
        });
    } catch (error) {
      sendError("Błąd serwera: " + error.message);
    }
  },[]);

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
                    sendError(response.data || "Usuwanie nie powiodło się.");
                    return;
                }
                sendSuccess("Zdjęcie usunięte pomyślnie!");
                refr();
            })
            .catch((error) => {
                console.error("Błąd:", error);
                sendError("Usuwanie nie powiodło się.");
            });
    } catch (error) {
        sendError("Błąd serwera: " + error.message);
    }
  };

  const handleSort = (e) => {
    setPage(0);
    setSortOrder(e.target.value);
  };

    const handleSearch = (e) => {
        const value = e.target.value;

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            setPage(0);
            setSearchText(value);
        }, 500);
    };

  const fetchPhotos = () => {
    try {
      axios
        .get("/api/paged/getphotos", {
          params: {page:page,sort:sortOrder,search:searchText},
          headers: {
          },
        })
        .then((response) => {
          if(response.status===201){
            setSortedPhotos(prev => {
              const existingIds = new Set(prev.map(p => p.id_photo));
              const newUniquePhotos = response.data.filter(p => !existingIds.has(p.id_photo));
              return [...prev, ...newUniquePhotos];
            });
          }
          else if (response.status===200){
              setFetchNoMore(true);
          }
          else{
            console.warn("Blad przy pobieraniu zdjec: ", response.data.message)
          }
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania zdjęć:", error);
        });
        setPage(page+1);
        setLoading(false);
    } catch (error) {
      sendError("Błąd serwera: " + error.message);
    }
  };

  useEffect(() => {
    setSortedPhotos([]);
    setPage(0);
    setFetchNoMore(false);
    fetchPhotos(sortOrder, searchText);
  }, [sortOrder,searchText]);

  const handleScroll = () => {
    if(fetchNoMore)
      return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if(docHeight-scrollTop<200 && loading==false){
      setLoading(true);
      fetchPhotos();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page, fetchNoMore]); 

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
      <div className={styles.sort_container}>
        <h2>Publiczne Zdjęcia</h2>
        <div className={styles.sort_search_container}>
          <select onChange={handleSort} className={styles.sort_dropdown}>
            <option value="added_desc">Data dodania: od najnowszych</option>
            <option value="added_asc">Data dodania: od najstarszych</option>
            <option value="title_asc">Nazwa: A - Z</option>
            <option value="title_desc">Nazwa: Z - A</option>
          </select>
          <input placeholder='Szukaj...' onChange={handleSearch} onEmptied={handleSearch} className={styles.search_input}></input>
        </div>
      </div>
      {/* Grid Section */}
      <div className={photoStyles.photo_grid}>
        {Array.isArray(sortedPhotos) && sortedPhotos.length > 0 ?(
        sortedPhotos.map((photo) => (
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
        ))):
            <span className={styles.no_results}>
              <p>Brak zdjęć spełniających kryteria wyszukiwania.</p>
            </span>
        }
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
