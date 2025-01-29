import React from "react";

//Import Component
import SongCard from "./SongCard";

//Material-ui Components
import { Button, Grid2 } from "@mui/material";

const SongCards = ({
  userLibrary,
  artistNationality,
  checkedSongs,
  setCheckedSongs,
  token,
  loadMoreLibrary,
  searchResults,
  nationalityFilter,
  disableLoadMore,
}) => {  
  return (
    <div style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
      <Grid2 container spacing={0} justify="center" style={{gap: "1rem", justifyContent: "center", padding: "0 1rem"}}>
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
            userLibrary.map((song) => {
              const inclusionList = Array.isArray(nationalityFilter) ? nationalityFilter : [nationalityFilter];
              //Filter out basic on nationality filter
              if(inclusionList.length > 0 
                && !inclusionList.includes(artistNationality[song.track.artists[0].name])) 
                return <React.Fragment key={`${song.track.id}-${song.added_at}`}></React.Fragment>;
              return (
                <SongCard
                  key={`${song.track.id}-${song.added_at}`}
                  song={song.track.name}
                  artist={song.track.artists[0].name}
                  nationality={artistNationality[song.track.artists[0].name]}
                  albumCover={song.track.album.images[1].url}
                  duration={song.track.duration_ms}
                  identifier={song.track.id}
                  checkedSongs={checkedSongs}
                  setCheckedSongs={setCheckedSongs}
                  uri={song.track.uri}
                />
            )})}
      </Grid2>
      {/* {Button to Load More Songs} */}
      {(!searchResults.length > 0 && token && !disableLoadMore) ? (
          <Button
            variant="contained"
            color="primary"
            onClick={loadMoreLibrary}
            style={{width: "20%"}}
          >
            Load More
          </Button>
      ) : <></>}
    </div>
  );
};

export default SongCards;
