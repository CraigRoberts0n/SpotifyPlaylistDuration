import React from "react";

//For API calls
import axios from "axios";

//Import Component
import PlaylistDialog from "./PlaylistDialog";

//Material-ui Components
import { Grid2, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from "@mui/material";

//Countries JSON
import countries from "../countries.json"
import ReactCountryFlag from "react-country-flag";

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
  artistNationality,
  nationalityFilter,
  setNationalityFilter,
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
  //Handle NationalityChange
  const handleNationalityChange = (event) => {
    const { target: { value } } = event;
    setNationalityFilter(typeof value === 'string' ? value.split(',') : value);
  };
  //Unique list of used countries
  const distinctCountries = React.useMemo(() => 
    [...new Set(Object.values(artistNationality)
      .map(country => country.toUpperCase())
      .filter(country => country !== "-"))
    ]
  , [artistNationality]);
  const countriesByCode = React.useMemo(() => 
    countries.reduce((prev, curr) => ({...prev, [curr.code]: curr.name}), {})
  , []);
  
  if(!token) return <></>;
  return (
    <>
      <Grid2 container style={{ padding: 10, gap: "1rem", alignItems: "center" }}>
        <Grid2>
          {/* {Playlist Component} */}
          <PlaylistDialog
            token={token}
            checkedSongs={checkedSongs}
            userID={userID}
            setAppErrorMessage={setAppErrorMessage}
          />
        </Grid2>
        <Grid2>
          {/* {Button to show Sidebar} */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setDrawerOpen(true)}
            style={{height: "40px"}}
          >
            Show Selected
          </Button>
        </Grid2>
        <Grid2>
          <FormControl sx={{ minWidth: 300 }} size="small">
            <InputLabel id="demo-multiple-checkbox-label">Nationalities Filter</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              autoWidth={true}
              fullWidth={true}
              value={nationalityFilter}
              onChange={handleNationalityChange}
              input={<OutlinedInput label="Nationalities Filter" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {distinctCountries.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={nationalityFilter.includes(name)} />
                  <ListItemText primary={<>
                      <span style={{paddingRight: "4px"}}>{countriesByCode[name]}</span>
                      <ReactCountryFlag countryCode={name} svg />
                    </>}/>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        {searchResults.length > 0 && (
          //Button to show user library
          <>
            <Grid2>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setSearchResults([]);
                }}
                style={{ height: "40px", marginBottom: 6 }}
              >
                Back to Library
              </Button>
            </Grid2>
          </>
        )}
        <Grid2 style={{marginLeft: "auto"}}>
          <Grid2 container style={{justifyContent: "flex-end"}}>
            <Grid2 size={8}>
              {/* {Search Text Input} */}
              <TextField
                id="outlined-basic"
                label="Search..."
                size="small"
                variant="outlined"
                fullWidth={true}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid2>
            <Grid2 size={4}>
              {/* {Search Text Submit Button} */}
              <Button
                variant="outlined"
                color="primary"
                fullWidth={true}
                style={{ height: 40, marginLeft: 2, textWrap: 'nowrap' }}
                onClick={() => searchForSong(searchQuery)}
              >
                Search Song
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  );
};

export default AppActions;
