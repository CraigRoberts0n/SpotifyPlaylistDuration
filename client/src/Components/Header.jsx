import React from "react";

//Import method
import millisToMinutesAndSeconds from "./helper/MilliToMinute";

//Import CountryFlag Generator
import ReactCountryFlag from "react-country-flag";

//Material-ui Components
import { IconButton, Typography, Toolbar, AppBar } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material";

const Header = ({ setDrawerOpen, checkedSongs, userID, flag }) => {
  //initialize styles
  const totalDurationStyles = {
    justifyContent: "center",
    fontSize: "1.7rem",
    marginLeft: "auto"
  }

  return (
    <AppBar position="sticky" style={{ backgroundColor: "#1DB954" }}>
      <Toolbar>
        {/* {Hamburger Button} */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuOutlined />
        </IconButton>

        <Typography variant="h5">
          {/* {Display Username and Flag} */}
          {userID} {flag && <ReactCountryFlag countryCode={flag} svg />}
        </Typography>
        <Typography sx={totalDurationStyles} variant="h4">
          {/* {Display the Total Playlist Duartion} */}
          {checkedSongs.length > 0 &&
            "Duration: " +
              millisToMinutesAndSeconds(
                checkedSongs.reduce((acc, { duration }) => acc + duration, 0)
              )}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
