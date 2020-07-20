import React from "react";

//Import method
import millisToMinutesAndSeconds from "./MilliToMinute";

//Import CountryFlag Generator
import ReactCountryFlag from "react-country-flag";

//Material-ui Components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

const Header = ({ setDrawerOpen, checkedSongs, userID, flag }) => {
  //initialize styles
  const useStyles = makeStyles((theme) => ({
    toolbar: {
      minHeight: 70,
      alignItems: "flex-start",
      paddingTop: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
      alignSelf: "flex-start",
    },
    totalDuration: {
      justifyContent: "center",
      fontSize: "1.7rem",
      [theme.breakpoints.down("xs")]: {
        fontSize: "1.5rem",
      },
    },
    appBar: {
      backgroundColor: "#1DB954",
    },
  }));

  const classes = useStyles();

  return (
    <AppBar position="sticky" style={{ backgroundColor: "#1DB954" }}>
      <Toolbar className={classes.toolbar}>
        {/* {Hamburger Button} */}
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="open drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Typography className={classes.title} variant="h5">
          {/* {Display Username and Flag} */}
          Spotify - {userID}{" "}
          {flag && <ReactCountryFlag countryCode={flag} svg />}
        </Typography>
        <Typography className={classes.totalDuration} variant="h4">
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
