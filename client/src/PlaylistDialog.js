import React, { useState } from "react";

//For API calls
import axios from "axios";

//Material-ui Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Alert from "@material-ui/lab/Alert";

const PlaylistDialog = ({
  checkedSongs,
  token,
  userID,
  setAppErrorMessage,
}) => {
  const [open, setOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistPublic, setPlaylistPublic] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Handles the opening of Playlist modal
  const handleClickOpen = () => {
    if (checkedSongs.length === 0) {
      setAppErrorMessage({
        variant: "error",
        message: "Please Select Some Songs",
      });
    } else {
      setAppErrorMessage({ variant: "", message: "" });
      setOpen(true);
    }
  };

  //Handles the closing of Playlist modal
  const handleClose = () => {
    setOpen(false);
  };

  //Handles Toggle of Public Setting
  const handleChange = (event) => {
    setPlaylistPublic(event.target.checked);
  };

  //Handles the validation of the Modal form
  const confirmPlaylist = () => {
    if (!playlistName) {
      setErrorMessage("Please give the playlist a name!");
    } else {
      postPlaylistWithItems({
        name: playlistName,
        description: playlistDescription,
        public: playlistPublic,
      });
    }
  };

  //Create the Playlist and populate with selected songs - POST
  const postPlaylistWithItems = (playlistSettings) => {
    axios
      .post(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        playlistSettings,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        //On successful playlist creation - populate playlist
        console.log(response);
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${response.data.id}/tracks`,
            {
              uris: checkedSongs.map((song) => song.uri),
            },
            { headers: { Authorization: "Bearer " + token } }
          )
          .then((response) => {
            console.log(response);
            setOpen(false);
            //Display Successful Creation Message
            setAppErrorMessage({
              variant: "success",
              message: "Playlist creation Success!",
            });
          });
      })
      .catch((error) => {
        //Display an error message
        setAppErrorMessage({
          variant: "error",
          message: `Playlist creation Failed: ${error.response.data.error.message}`,
        });
      });
  };

  return (
    <div style={{ marginBottom: 6 }}>
      {/* {Button to Open modal} */}
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Save to Playlist
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {/* {Display Error Message} */}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        {/* {Heading Text} */}
        <DialogTitle id="form-dialog-title">
          Save Selected Items to a Playlist
        </DialogTitle>

        <DialogContent>
          {/* {Playlist Name Input} */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Playlist Name"
            type="text"
            fullWidth
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          {/* {Playlist Description Input} */}
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            onChange={(e) => setPlaylistDescription(e.target.value)}
          />
          {/* {Playlist Public Checkbox} */}
          <FormControlLabel
            control={
              <Checkbox
                checked={playlistPublic}
                onChange={handleChange}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="Public?"
            labelPlacement="start"
            style={{ marginLeft: "0px" }}
          />
        </DialogContent>
        {/* {Handles Cancel & SavePlaylist Buttons} */}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmPlaylist} color="primary">
            Save Playlist
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlaylistDialog;
