import React from "react";

//Material-ui Components
import { 
  List, ListItem, ListSubheader, ListItemText, ListItemAvatar, 
  Avatar, Button, Link, Divider, Drawer, IconButton 
} from "@mui/material";
import { DeleteOutline, ChevronLeftOutlined } from "@mui/icons-material";

const Sidebar = ({
  drawerOpen,
  setDrawerOpen,
  checkedSongs,
  setCheckedSongs,
}) => {
  //Method to delete the Selected Song from CheckedSongs Array
  const deleteSelectedItem = (event) => {
    let checkedSongsCopy = [...checkedSongs]; //Copy Array
    let removeIndex = checkedSongsCopy
      .map((item) => item.id)
      .indexOf(event.target.getAttribute("name")); //Get index of song to remove
    if (removeIndex >= 0) {
      checkedSongsCopy.splice(removeIndex, 1); //remove song from array
    }
    setCheckedSongs(checkedSongsCopy); //Set CheckedSong State
  };

  const deleteAllItems = () => {
    let checkedSongsCopy = [...checkedSongs]; //Copy Array
    checkedSongsCopy.length = 0;
    setCheckedSongs(checkedSongsCopy);
  }

  return (
    <Drawer
      anchor={"left"}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <IconButton onClick={() => setDrawerOpen(false)}>
        <ChevronLeftOutlined />
      </IconButton>
      <Divider />
      <List style={{ minWidth: "auto", marginLeft: 5 }} subheader={<li />}>
        {checkedSongs.length > 0 && (
          <ListSubheader>{"Click song to delete"}</ListSubheader>
        )}
        {checkedSongs.map((song) => (
          // List Item Container
          <ListItem
            button
            key={song.id}
            name={song.id}
            onClick={(event) => deleteSelectedItem(event)}
          >
            {/* {Song Avatar} */}
            <ListItemAvatar style={{ pointerEvents: "none" }}>
              <Avatar
                alt={song.songName}
                src={song.albumCover}
                style={{ pointerEvents: "none" }}
              />
            </ListItemAvatar>
            {/* {Song Name and Artist} */}
            <ListItemText
              primary={song.songName}
              secondary={song.artist}
              style={{ pointerEvents: "none" }}
            />
            {/* {Delete Icon} */}
            <IconButton style={{ pointerEvents: "none" }}>
              <DeleteOutline style={{ pointerEvents: "none" }} />
            </IconButton>
          </ListItem>
        ))}
        {/* {Display Default Text} */}
        {checkedSongs.length === 0 && (
          <ListItem>
            <ListItemText primary="Select Songs to Begin" />
          </ListItem>
        )}
        <Divider />
        {checkedSongs.length !== 0 && (
          <>
          <ListItem>
            <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    deleteAllItems();
                  }}
                >
                  Remove all Songs
              </Button>
          </ListItem>
          <Divider />
          </>)}
        {/* {GitHub Profile Link} */}
        <ListItem>
          <Link href="https://github.com/CraigRoberts0n">
            <ListItemText primary="Github: https://github.com/CraigRoberts0n" />
          </Link>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
