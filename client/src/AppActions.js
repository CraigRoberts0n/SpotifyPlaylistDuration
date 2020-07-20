import React from "react";

//For API calls
import axios from "axios";

//Import Component
import PlaylistDialog from "./PlaylistDialog";

//Material-ui Components
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const AppActions = ({
  token,
  checkedSongs,
  userID,
  setAppErrorMessage,
  setDrawerOpen,
  searchResults,
  setSearchResults,
  searchQuery,
  setSearchQuery,
}) => {
  //Search for Input query - GET
  const searchForSong = (searchQuery) => {
    //Validation
    if (!searchQuery) {
      setAppErrorMessage({
        variant: "error",
        message: "Please supply search query",
      });
      return;
    }
    axios
      .get(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(
        ({
          data: {
            tracks: { items },
          },
        }) => {
          setSearchResults(items); //Set Search Results State
        }
      )
      .catch((error) => {
        console.log(error.response); //console log error
        //Display error message
        setAppErrorMessage({
          variant: "error",
          message: `${error.response.data.error.message}`,
        });
      });
  };
  return (
    <>
      {token && (
        <Grid container style={{ padding: 10 }}>
          <Grid item xs={6} md={2}>
            {/* {Playlist Component} */}
            <PlaylistDialog
              token={token}
              checkedSongs={checkedSongs}
              userID={userID}
              setAppErrorMessage={setAppErrorMessage}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            {/* {Button to show Sidebar} */}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setDrawerOpen(true)}
            >
              Show Selected
            </Button>
          </Grid>
          <Grid item xs={6} md={4}>
            {searchResults.length > 0 && (
              //Button to show user library
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setSearchResults([]);
                }}
                style={{ marginBottom: 6 }}
              >
                Back to Library
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container>
              <Grid item xs={7} md={5}>
                {/* {Search Text Input} */}
                <TextField
                  id="outlined-basic"
                  label="Search..."
                  size="small"
                  variant="outlined"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginTop: 2 }}
                />
              </Grid>
              <Grid item xs={5} md={7}>
                {/* {Search Text Submit Button} */}
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ height: 40, margin: 2 }}
                  onClick={() => searchForSong(searchQuery)}
                >
                  Search Song
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AppActions;
