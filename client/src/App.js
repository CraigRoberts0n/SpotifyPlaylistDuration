import React, { useState, useEffect } from "react";

//For API calls
import axios from "axios";

//Import Components
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import AppActions from "./Components/AppActions";
import SongCards from "./Components/SongCards";
import hash from "./Components/helper/hash";

//Material-ui Components
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";

//Endpoint to authorize user
const authEndpoint = "https://accounts.spotify.com/authorize";

//client ID, redirect URI and desired scopes
const clientId = "f5200adfddfd40869e0cc7da942bb413";
const Address = window.location.href.split("/")
const redirectUri = `${Address[0]}//${Address[2]}/callback`;
const scopes = [
  "user-library-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
];

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

  //Sets the access token to state
  useEffect(() => {
    let _token = hash.access_token;
    if (_token) {
      setToken(_token);
    }
  }, []);

  //Retrieves the users Profile data and library
  useEffect(() => {
    if (token) {
      // window.location.hash = '';
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

      {/* {Display Button to Authorize Spotify} */}
      {!token && (
        <Button
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
          )}&response_type=token&show_dialog=true`}
          variant="contained"
          color="primary"
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            height: 50,
          }}
        >
          Click to Login To Spotify
        </Button>
      )}
    </div>
  );
}

export default App;
