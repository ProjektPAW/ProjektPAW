import React from "react";
import styles from "./styles/profile.module.css";

const SearchSortBar = ({
  catalogs,
  handleSort,
  handleSearch,
  getCatalogPhotos,
  setShowCatalogModal,
  setShowEditCatalogModal,
  selectedCatalogId,
}) => {
  return (
    <div className={styles.catalog_section_container}>
      <div className={styles.catalog_container}>
        <h2>Moje Zdjęcia</h2>
        <div className={styles.catalog_group}>
          <select onChange={handleSort} className={styles.sort_dropdown}>
            <option value="added_desc">Data dodania: od najnowszych</option>
            <option value="added_asc">Data dodania: od najstarszych</option>
            <option value="title_asc">Nazwa: A - Z</option>
            <option value="title_desc">Nazwa: Z - A</option>
          </select>

          <input
            placeholder="Szukaj..."
            onChange={handleSearch}
            className={styles.search_input}
          />

          <select onChange={getCatalogPhotos} className={styles.catalog_dropdown}>
            {catalogs.map((catalog) => (
              <option key={catalog.id_catalog} value={catalog.id_catalog}>
                {catalog.name}
              </option>
            ))}
          </select>

          <button
            className={styles.add_catalog_btn}
            onClick={() => setShowCatalogModal(true)}
          >
            Dodaj katalog
          </button>

          {selectedCatalogId >= 0 ? (
            <button
              className={styles.add_catalog_btn}
              onClick={() => setShowEditCatalogModal(true)}
            >
              Edytuj katalog
            </button>
          ) : (
            <span className={styles.invisible_button}></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSortBar;
