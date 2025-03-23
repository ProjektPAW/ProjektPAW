import './App.css';
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  // Fetch data
  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <div>
      <h1>Photo Gallery</h1>
      <div>
        {users.length == 0  ? (
          <p>Loading...</p>
        ) : (
          users.map((user) => (
          <div key={user.id_user}>
            <p>
              {user.username} {user.email}
              {user.emailverified ? "Verified" : "Not Verified"}
            </p>
          </div>
        )))}
      </div>
    </div>
  );
}
export default App;