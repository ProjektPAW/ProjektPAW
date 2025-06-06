import React from "react";
import styles from "../styles/home.module.css";

const SortSearchBar = ({ handleSort, handleSearch }) => {
  return (
    <div className={styles.sort_container}>
      <h2>Publiczne Zdjęcia</h2>
      <div className={styles.sort_search_container}>
        {/* Rozwijane menu do sortowania zdjęć */}
        <select onChange={handleSort} className={styles.sort_dropdown}>
          <option value="added_desc">Data dodania: od najnowszych</option>
          <option value="added_asc">Data dodania: od najstarszych</option>
          <option value="title_asc">Nazwa: A - Z</option>
          <option value="title_desc">Nazwa: Z - A</option>
        </select>
        {/* Pole wyszukiwania zdjęć po tytule */}
        <input
          placeholder="Szukaj..."
          onChange={handleSearch}
          className={styles.search_input}
        />
      </div>
    </div>
  );
};

export default SortSearchBar;
