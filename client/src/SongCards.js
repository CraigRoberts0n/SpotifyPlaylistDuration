import React from "react";

//Import Component
import SongCard from "./SongCard";

//Material-ui Components
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const SongCards = ({
  userLibrary,
  checkedSongs,
  setCheckedSongs,
  token,
  loadMoreLibrary,
  searchResults,
}) => {
  return (
    <div>
      {
        <Grid container spacing={0} justify="center">
          {/* {Display Song Cards for Search} */}
          {searchResults.length > 0
            ? searchResults.map((song) => (
                <SongCard
                  song={song.name}
                  artist={song.artists[0].name}
                  albumCover={song.album.images[1].url}
                  duration={song.duration_ms}
                  identifier={song.id}
                  checkedSongs={checkedSongs}
                  setCheckedSongs={setCheckedSongs}
                  uri={song.uri}
                  key={song.id}
                />
              ))
            : //Display Song Cards for User Library
              userLibrary.map((song) => (
                <SongCard
                  song={song.track.name}
                  artist={song.track.artists[0].name}
                  albumCover={song.track.album.images[1].url}
                  duration={song.track.duration_ms}
                  identifier={song.track.id}
                  checkedSongs={checkedSongs}
                  setCheckedSongs={setCheckedSongs}
                  uri={song.track.uri}
                  key={song.track.id}
                />
              ))}

          {/* {Button to Load More Songs} */}
          {!searchResults.length > 0 && token && (
            <Button
              variant="contained"
              color="primary"
              onClick={loadMoreLibrary}
            >
              Load More
            </Button>
          )}
        </Grid>
      }
    </div>
  );
};

export default SongCards;
