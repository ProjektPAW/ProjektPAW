import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useUser from "./hooks/useUser";
import useUserAccount from "./hooks/useUserAccount";
import useCatalogs from "./hooks/useCatalogs";
import usePhotos from "./hooks/usePhotos";
import usePasswordChange from "./hooks/usePasswordChange";

import AddPhotoModal from "./modals/addPhotoModal";
import PhotoDetailsModal from "./modals/photoDetailsModal";
import PhotoEditModal from "./modals/photoEditModal";
import AddCatalogModal from "./modals/addCatalogModal";
import EditCatalogModal from "./modals/editCatalogModal";
import ChangePasswordModal from "./modals/changePasswordModal";
import PhotoGrid from "../photoGrid";
import ProfileCard from "./profileCard";
import SearchSortBar from "../searchSortBar";

import styles from "../styles/profile.module.css";

function Profile({ refr }) {
  // ————— USER & ACCOUNT —————
  const { userData } = useUser();
  const { deleteUser } = useUserAccount();

  // ————— CATALOGS HOOK —————
  const {
    catalogs,
    catalogList,
    checkedCatalogsList,
    catalogsLoaded,
    loadPhotoCatalogs,
    showCatalogModal,
    setShowCatalogModal,
    showEditCatalogModal,
    setShowEditCatalogModal,
    selectedCatalogId,
    setSelectedCatalogId,
    newCatalogName,
    setNewCatalogName,
    newCatalog,
    handleCatalogChange,
    handleSetCatalogs,
    createCatalog,
    editCatalog,
    deleteCatalog,
    setCatalogList,
  } = useCatalogs(refr);

  // ————— PHOTOS HOOK —————
  const {
    sortedPhotos,
    searchText,
    handleSort,
    handleSearch,
    prepareEditForm,
    addPhoto,
    editPhoto,
    deletePhoto,
    handleAddPhotoChange,
    handleEditPhotoChange,
  } = usePhotos(refr, selectedCatalogId);

  // ————— PASSWORD-CHANGE HOOK —————
  const {
    handleChangePassword,
    handleSubmitChangePassword,
  } = usePasswordChange(refr, () => setShowChangePasswordModal(false));

  // ————— LOCAL MODAL STATE —————
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // ————— PASSWORD-TOGGLE STATE —————
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(FaEyeSlash);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(FaEye);
      setType("text");
    } else {
      setIcon(FaEyeSlash);
      setType("password");
    }
  };

  const handlePrepareEdit = (photo) => {
    setSelectedEdit(photo);
    loadPhotoCatalogs(photo.id_photo);
    prepareEditForm(photo);
  };

  return (
    <div className={styles.page_container}>
      <main className={styles.content}>
        <ProfileCard
          userData={userData}
          setShowModal={setShowModal}
          setCatalogList={setCatalogList}
          setShowChangePasswordModal={setShowChangePasswordModal}
          handleDeleteUser={deleteUser}
        />

        <SearchSortBar
          catalogs={catalogs}
          handleSort={handleSort}
          handleSearch={handleSearch}
          getCatalogPhotos={(e) => setSelectedCatalogId(e.target.value)}
          setShowCatalogModal={setShowCatalogModal}
          setShowEditCatalogModal={setShowEditCatalogModal}
          selectedCatalogId={selectedCatalogId}
        />

        <PhotoGrid
          sortedPhotos={sortedPhotos}
          searchText={searchText}
          setSelectedPhoto={setSelectedPhoto}
          prepareEditForm={handlePrepareEdit}
          deletePhoto={deletePhoto}
        />

        {showModal && (
          <AddPhotoModal
            showModal={showModal}
            setShowModal={setShowModal}
            handleSubmit={(e) =>
              addPhoto(e, catalogList, () => setShowModal(false))
            }
            handleChange={handleAddPhotoChange}
            handleSetCatalogs={handleSetCatalogs}
            catalogs={catalogs}
          />
        )}

        {selectedPhoto && (
          <PhotoDetailsModal
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
          />
        )}

        {selectedEdit && (
          <PhotoEditModal
            selectedEdit={selectedEdit}
            setSelectedEdit={setSelectedEdit}
            handleEditChange={handleEditPhotoChange}
            handleSetCatalogs={handleSetCatalogs}
            catalogs={catalogs}
            catalogsLoaded={catalogsLoaded}
            checkedCatalogsList={checkedCatalogsList} 
            handleEditSubmit={(e) =>
              editPhoto(e, catalogList, () => setSelectedEdit(null))
            }
          />
        )}

        {showCatalogModal && (
          <AddCatalogModal
            showCatalogModal={showCatalogModal}
            setShowCatalogModal={setShowCatalogModal}
            newCatalog={newCatalog}
            handleCatalogChange={handleCatalogChange}
            CreateCatalogue={createCatalog}
          />
        )}

        {showEditCatalogModal && (
          <EditCatalogModal
            showEditCatalogModal={showEditCatalogModal}
            setShowEditCatalogModal={setShowEditCatalogModal}
            catalogs={catalogs}
            selectedCatalogId={selectedCatalogId}
            newCatalogName={newCatalogName}
            setNewCatalogName={setNewCatalogName}
            handleEditCatalogSubmit={editCatalog}
            handleDeleteCatalog={deleteCatalog}
          />
        )}

        {showChangePasswordModal && (
          <ChangePasswordModal
            showChangePasswordModal={showChangePasswordModal}
            setShowChangePasswordModal={setShowChangePasswordModal}
            handleSubmitChangePassword={handleSubmitChangePassword}
            handleChangePassword={handleChangePassword}
            type={type}
            icon={icon}
            handleToggle={handleToggle}
          />
        )}
      </main>
    </div>
  );
}

export default Profile;
