import React, { useEffect, useState, useCallback } from "react";
import "./UserDashboard.css";
import debounce from "./debounce";
const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchData = (searchTerm) => {
    setLoading(true);
    const apiUrl = `https://api.nociw.co.in/getTopUserList?${
      searchTerm ? `name=${capitalizeFirstLetter(searchTerm)}` : ""
    }`;

    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUsers(data?.users);
        setLoading(false);
      })
      .catch((err) => {
        setError("An error occurred while fetching data.");
        console.error(err);
      });
  };
  const debounceFunction = useCallback(debounce(fetchData, 500), []);
  const handleSearchChange = (event) => {
    const {
      target: { value },
    } = event || {};
    setSearchTerm(value);
    debounceFunction(value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };
  function dateConverter(dateString) {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedDate;
  }
  function capitalizeFirstLetter(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Top Users</h1>
      <form onSubmit={debounceFunction}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onSubmit={handleSearchSubmit} type="submit">
          Search
        </button>
      </form>
      {error ? (
        <p>{error}</p>
      ) : users.length || loading ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Gender</th>
              <th>LikesCount</th>
              <th>Post At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              ({ id, rank, name, gender, likesCount, postAt } = {}) => (
                <tr key={id}>
                  <td>{rank}</td>
                  <td>{name}</td>
                  <td>{capitalizeFirstLetter(gender)}</td>
                  <td>{likesCount}</td>
                  <td>{dateConverter(postAt)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <h1
          style={{
            width: "100%",
            backgroundColor: "red",
          }}
        >
          No users found
        </h1>
      )}
    </div>
  );
};

export default UserDashboard;
