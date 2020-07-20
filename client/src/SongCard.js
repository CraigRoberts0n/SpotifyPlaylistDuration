import React, { useState, useEffect } from "react";

//Import method
import millisToMinutesAndSeconds from "./MilliToMinute";

//Material-ui Components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";

import Checkbox from "@material-ui/core/Checkbox";

import CardActionArea from "@material-ui/core/CardActionArea";

const SongCard = ({
  identifier,
  uri,
  song,
  artist,
  duration,
  albumCover,
  checkedSongs,
  setCheckedSongs,
}) => {
  const [checked, setChecked] = useState(false);

  //Check if Card Song is in CheckedSongs array, if so Check Card, othewise Uncheck Card
  useEffect(() => {
    if (checkedSongs.some((song) => song.id === identifier)) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [checkedSongs, identifier]);

  //Handles the Concatenation & Deletion of songs into CheckedSongs array
  const handleChange = (checkStatus) => {
    setChecked(checkStatus);

    if (checkStatus) {
      let songObj = {
        id: identifier,
        songName: song,
        uri,
        artist,
        duration,
        albumCover,
      };
      let concatCheckedSongs = checkedSongs.concat(songObj); //Add new Song onto Array
      setCheckedSongs(concatCheckedSongs);
    } else {
      let checkedSongsCopy = [...checkedSongs]; //Copy Array
      let removeIndex = checkedSongsCopy
        .map((song) => song.id)
        .indexOf(identifier); //Get index of song to remove
      if (removeIndex >= 0) {
        checkedSongsCopy.splice(removeIndex, 1); //Remove Song from Array
      }
      setCheckedSongs(checkedSongsCopy);
    }
  };

  return (
    <Grid
      item
      component={Card}
      xs={5}
      md={2}
      key={identifier}
      variant="outlined"
      style={{ margin: "0 1%", marginBottom: "1%" }}
    >
      <CardActionArea onClick={() => handleChange(!checked)}>
        <Checkbox
          checked={checked}
          onChange={() => handleChange(!checked)}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
        <CardMedia component="img" image={albumCover} />
        <CardContent>
          <Typography variant="h6">{song}</Typography>
          <Typography variant="body2" component="p">
            {artist}
          </Typography>
          <Typography variant="body2" component="p">
            Duration: {millisToMinutesAndSeconds(duration)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Grid>
  );
};

export default SongCard;
