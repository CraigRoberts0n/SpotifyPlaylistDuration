import React from "react";

//Material-ui Components
import IconButton from "@material-ui/core/IconButton";

import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";

import Link from "@material-ui/core/Link";

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

  return (
    <Drawer
      anchor={"left"}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <IconButton onClick={() => setDrawerOpen(false)}>
        <ChevronLeftIcon />
      </IconButton>
      <Divider />
      <List style={{ minWidth: "auto", marginLeft: 5 }} subheader={<li />}>
        {checkedSongs.length > 0 && (
          <ListSubheader>{"Click Song to Delete"}</ListSubheader>
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
                alt="Remy Sharp"
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
              <DeleteIcon style={{ pointerEvents: "none" }} />
            </IconButton>
          </ListItem>
        ))}
        {/* {Display Default Text} */}
        {checkedSongs.length === 0 && (
          <ListItem>
            <ListItemText primary="SELECT SOME SONGS" />
          </ListItem>
        )}
        <Divider />
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
