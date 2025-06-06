import React,{ useState } from "react";
import usePublicPhotos from "./usePublicPhotos";
import Carousel from "./carousel";
import PublicPhotoGrid from "./publicPhotoGrid";
import styles from "../styles/home.module.css";
import SortSearchBar from "./sortSearchBar";
import PhotoDetailsModal from "./photoDetailsModal";


export default function Home({ refr }) {
  // Hook odpowiedzialny za pobieranie i obsługę publicznych zdjęć
  const {
    carouselPhotos,
    sortedPhotos,
    handleSort,
    handleSearch,
    deletePhoto,
    searchText,
  } = usePublicPhotos(refr);

  // SelectedPhoto przechowuje wybrane zdjęcie, aby otworzyć modal ze szczegółami
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className={styles.page_container}>
      <main className={styles.content}>
        <Carousel photos={carouselPhotos} />

        <SortSearchBar
          handleSort={handleSort}
          handleSearch={handleSearch}
        />
        <PublicPhotoGrid
          photos={sortedPhotos}
          searchText={searchText}
          onSelectPhoto={setSelectedPhoto}
          onDeletePhoto={deletePhoto}
        />
        {selectedPhoto && (
          <PhotoDetailsModal
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
          />
        )}
      </main>
    </div>
  );
}
