import React from "react";

//Material-ui Components
import { Typography, Button } from "@mui/material";

//Endpoint to authorize user
const authEndpoint = "https://accounts.spotify.com/authorize";

//client ID, redirect URI and desired scopes
const clientId = "f5200adfddfd40869e0cc7da942bb413";
const redirectUri = window.location.href + 'callback';
const scopes = [
  "user-library-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private",
  "user-read-email",
];

const Landing = () => {
  return (
    <div
      style={{ backgroundImage: `url(./landingImage.jpg)`, height: "92vh" }}
      className="landing"
    >
      <div
        style={{
          backgroundColor: "rgba(50,50,50, 0.5)",
          backgroundClip: "content-box",
        }}
        className="landingTransparent"
      >
        <div className="landingInfo">
          <Typography
            variant="h1"
            gutterBottom
            style={{
              fontSize: "2.75rem",
              fontWeight: "normal",
              color: "white",
            }}
          >
            Spotify Playlist Duration Tool
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            style={{ fontSize: "1.5rem", color: "white", paddingBottom: "1vh" }}
          >
            Create a Spotify playlist with the overall duration you require.
          </Typography>
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            style={{ fontSize: "1.0rem", color: "white", paddingBottom: "2vh" }}
          >
            - View User Library <br />
            - Search Songs <br />
            - Select Songs <br />
            - Save Songs to Spotify Playlist <br />
          </Typography>
          <Typography
            variant="h4"
            component="h4"
            gutterBottom
            style={{ fontSize: "1.25rem", color: "white" }}
          >
            Login To Spotify to Continue
          </Typography>
          <Button
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
            variant="contained"
            color="primary"
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              height: 50,
              backgroundColor: "rgb(29, 185, 84)",
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
