import React, { useState, useEffect } from "react";

//For API calls
import axios from "axios";

//Import Components
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import AppActions from "./Components/AppActions";
import Landing from "./Components/Landing";
import SongCards from "./Components/SongCards";
import hash from "./Components/helper/hash";

import "./App.css";

//Material-ui Components
import Alert from "@material-ui/lab/Alert";

function App() {
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");
  const [flag, setFlag] = useState("");
  const [userLibrary, setUserLibrary] = useState([]);
  const [checkedSongs, setCheckedSongs] = useState([]);
  const [loadMoreURL, setLoadMoreURL] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appErrorMessage, setAppErrorMessage] = useState({
    variant: "",
    message: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  //Sets the access token and Local Storage to state
  useEffect(() => {
    let _token = hash.access_token;
    if (_token) {
      setToken(_token);

      //Looks at Local Storage
      let localStore = JSON.parse(localStorage.getItem('checkedLocalStore'))
      if(localStore) {
        setCheckedSongs(localStore) //If Local Storage Available set State
      }
    }
  }, []);

  //Update Local Storage when checked songs changes
  useEffect(() => {
    localStorage.setItem('checkedLocalStore', JSON.stringify(checkedSongs))
  }, [checkedSongs])

  //Retrieves the users Profile data and library
  useEffect(() => {
    if (token) {
      getUserDetails();
      getLibrary();
    }
  }, [token]);

  //Retrieve user Profile Data - GET
  const getUserDetails = () => {
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + token },
      })
      .then(({ data }) => {
        setUserID(data.id); //Set the UserID state
        setFlag(data.country); //Set the Flag State
      })
      .catch((error) => {
        console.log(error.response); //console log error
        //Display an error message
        setAppErrorMessage({
          variant: "error",
          message: `${error.response.data.error.message}`,
        });
        setToken(""); //remove token to prompt sign-in, {access token expires}
      });
  };

  //Retrieve user library - GET
  const getLibrary = (URL = "https://api.spotify.com/v1/me/tracks") => {
    axios
      .get(URL, { headers: { Authorization: "Bearer " + token } })
      .then(({ data: { items, next } }) => {
        setLoadMoreURL(next); //Set URL to load more songs

        //Append new tracks onto Library state and set new state
        let concatLibrary = userLibrary.concat(items);
        setUserLibrary(concatLibrary);
      })
      .catch((error) => {
        console.log(error.response); //console log error
      });
  };

  //Retrieves new tracks
  const loadMoreLibrary = () => {
    getLibrary(loadMoreURL);
  };

  return (
    <div>
      {/* {Header Component - Displays Hamburger & Spotify Username}  */}
      <Header
        setDrawerOpen={setDrawerOpen}
        checkedSongs={checkedSongs}
        userID={userID}
        flag={flag}
      />

      {/* {Sidebar Component - Displays Selected Songs} */}
      <Sidebar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        checkedSongs={checkedSongs}
        setCheckedSongs={setCheckedSongs}
      />

      {/* {Actions Component - SaveToPlaylist, ShowSelected, SearchBar} */}
      <AppActions
        token={token}
        checkedSongs={checkedSongs}
        userID={userID}
        setAppErrorMessage={setAppErrorMessage}
        setDrawerOpen={setDrawerOpen}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* {Displays Error Message to Display} */}
      {appErrorMessage.message && (
        <Alert
          onClose={() => setAppErrorMessage({ variant: "", message: "" })}
          severity={appErrorMessage.variant}
        >
          {appErrorMessage.message}
        </Alert>
      )}

      {/* {SongCards Component - Displays all songs in independent Cards} */}
      <SongCards
        userLibrary={userLibrary}
        checkedSongs={checkedSongs}
        setCheckedSongs={setCheckedSongs}
        token={token}
        loadMoreLibrary={loadMoreLibrary}
        searchResults={searchResults}
      />

      {/* {Display Landing to Authorize Spotify} */}
      {!token && <Landing />}
    </div>
  );
}

export default App;
