import React, { useState, useEffect } from "react";

//For API calls
import axios from "axios";

//Import Components
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import AppActions from "./Components/AppActions";
import Landing from "./Components/Landing";
import SongCards from "./Components/SongCards";
import TrackInfo from "./Components/TrackInfo";
import hash from "./Components/helper/hash";

import "./App.css";

//Material-ui Components
import { Alert, Backdrop, CircularProgress, createTheme, ThemeProvider } from "@mui/material";

function App() {
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");
  const [flag, setFlag] = useState("");
  const [userLibrary, setUserLibrary] = useState([]);
  const [totalTracks, setTotalTracks] = useState(null);
  const [artistNationality, setArtistNationality] = useState({});
  const [checkedSongs, setCheckedSongs] = useState([]);
  const [loadMoreURL, setLoadMoreURL] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appErrorMessage, setAppErrorMessage] = useState({
    variant: "",
    message: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nationalityFilter, setNationalityFilter] = useState([]);
  const [progress, setProgress] = useState({ num: 0, percent: 0 });
  const [songCardsDisabled, setSongCardsDisabled] = useState(false);

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
  const getLibraryURL = "https://api.spotify.com/v1/me/tracks?limit=50";
  const getLibrary = async(URL = getLibraryURL, { loadAll, prevItems } = { loadAll: false, prevItems: [] }) => {
    axios
      .get(URL, { headers: { Authorization: "Bearer " + token } })
      .then(({ data: { items, next, total } }) => {
        //Populate total tracks
        if(!totalTracks) setTotalTracks(total);

        //
        if(!loadAll) {
          //Set URL to load more songs
          setLoadMoreURL(next);

          //Append new tracks onto Library state and set new state
          const concatLibrary = userLibrary.concat(items);
          setUserLibrary(concatLibrary);

          //Set Progress
          setProgress(prev => ({...prev, num: concatLibrary.length, percent: (concatLibrary.length / total) * 100}));

          //
          return;
        }

        //Set Progress
        if(loadAll) setProgress(prev => ({...prev, 
          num: prevItems.length + items.length,  
          percent: ((prevItems.length + items.length) / total) * 100
        }));
        
        //Handle recursive load all
        if(loadAll && next) {
          getLibrary(next, { loadAll: true, prevItems: prevItems.concat(items)});
        } else if(loadAll && !next) {
          setUserLibrary(prevItems.concat(items));
          setSongCardsDisabled(false);
        };
      })
      .catch((error) => {
        setSongCardsDisabled(false);
        console.log(error.response); //console log error
      });
  };

  useEffect(() => {
    if(!userLibrary) return;
    const artists = userLibrary.map(song => song.track.artists[0].name);
    if(artists.length === 0) return;
      axios
      .post("https://crobertson.dev/playlistduration/artists/nationality", artists)
      .then(({ data }) => {
        setArtistNationality(prev => ({...prev, ...data}))
      })
      .catch((error) => {
        console.log(error.response); //console log error
      });    
  }, [userLibrary])
  

  //Retrieves new tracks
  const loadMoreLibrary = () => getLibrary(loadMoreURL);

  //
  const loadAllLibrary = () => getLibrary(getLibraryURL, { loadAll: true, prevItems: [] });

  const theme = createTheme();  
  return (
    <ThemeProvider theme={theme}>
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
        artistNationality={artistNationality}
        nationalityFilter={nationalityFilter}
        setNationalityFilter={setNationalityFilter}
      />

      {/* {SongsList Information} */}
      {searchResults.length < 1 && <TrackInfo
        token={token} 
        progress={progress}
        totalTracks={totalTracks}
        loadAllLibrary={loadAllLibrary}
        setSongCardsDisabled={setSongCardsDisabled}
      />}

      {/* {Displays Error Message to Display} */}
      {appErrorMessage.message && (
        <Alert
          onClose={() => setAppErrorMessage({ variant: "", message: "" })}
          severity={appErrorMessage.variant}
        >
          {appErrorMessage.message}
        </Alert>
      )}

      {/* {Disable App} */}
      <Backdrop sx={() => ({ color: '#fff', zIndex: 999 })} open={songCardsDisabled}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* {SongCards Component - Displays all songs in independent Cards} */}
      <SongCards
        userLibrary={userLibrary}
        artistNationality={artistNationality}
        checkedSongs={checkedSongs}
        setCheckedSongs={setCheckedSongs}
        token={token}
        loadMoreLibrary={loadMoreLibrary}
        searchResults={searchResults}
        nationalityFilter={nationalityFilter}
        disableLoadMore={!(!!loadMoreURL)}
      />

      {/* {Display Landing to Authorize Spotify} */}
      {!token && <Landing />}
    </ThemeProvider>
  );
}

export default App;
