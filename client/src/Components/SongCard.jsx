import React, { useState, useEffect } from "react";

//Import method
import millisToMinutesAndSeconds from "./helper/MilliToMinute";

//Material-ui Components
import { Card, CardActionArea, Checkbox, CardMedia, Grid2, Typography, CardContent, CardHeader } from "@mui/material";
import ReactCountryFlag from "react-country-flag";

const SongCard = ({
  identifier,
  uri,
  song,
  artist,
  nationality,
  duration,
  albumCover,
  checkedSongs,
  setCheckedSongs,
}) => {
  const [checked, setChecked] = useState(false);
  const flag = nationality && nationality !== "-" ? nationality : null;

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
    <Grid2
      component={Card}
      size={'grow'}
      key={identifier}
      variant="outlined"
      style={{minWidth: "250px"}}
    >
      <CardActionArea onClick={() => handleChange(!checked)} style={{height: "100%"}}>
        <CardHeader style={{ padding: ".5rem"}} avatar={
          <Checkbox
            checked={checked}
            onChange={() => handleChange(!checked)}
            inputProps={{ "aria-label": "primary checkbox" }}
            style={{padding: 0}}
          />
        }>          
        </CardHeader>
        <CardMedia component="img" image={albumCover} loading="lazy"/>
        <CardContent style={{display: "flex", flexDirection: "column", height: "100px"}}>
          <Typography variant="h6" style={{display: 'inline-block', width: "calc(200px-16px)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{song}</Typography>
          <Typography variant="body2" component="p">
            {artist} {flag && <ReactCountryFlag countryCode={flag} svg />}
          </Typography>
          <Typography variant="body2" component="p" style={{marginTop: "auto"}}>
            Duration: {millisToMinutesAndSeconds(duration)}m
          </Typography>
        </CardContent>
      </CardActionArea>
    </Grid2>
  );
};

export default SongCard;
