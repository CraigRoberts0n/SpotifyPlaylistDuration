import React, { useState } from 'react';

//Material-ui Components
import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from "@mui/material";
import { Box, Button, Grid2, LinearProgress, Typography } from "@mui/material";

const TrackInfo = ({
	token, 
	progress, 
	totalTracks,
	setSongCardsDisabled,
	loadAllLibrary
}) => {
	const [loadAllConfirmationModal, setLoadAllConfirmationModal] = useState({open: false, evt: null});

	//Retrieves all tracks
	const loadAllLibraryConfirmation = (e) => handleClickOpen(e);

	//Modal open or close handlers
	const handleClickOpen = (evt) => {
		if(totalTracks < 250) loadAllLibraryAction();
		setLoadAllConfirmationModal({open: true, evt});
	}
	const handleClose = () => setLoadAllConfirmationModal(prev => ({...prev, open: false}));

	//
  const loadAllLibraryAction = () => {
    loadAllConfirmationModal.evt.target.style.display = "none";
    handleClose();
    setSongCardsDisabled(true);
    loadAllLibrary();
  }
	if(!token) return <></>;
	return (
			<>
				<Grid2 container style={{ padding: 10, gap: "1rem", alignItems: "center", height: "60px" }}>
					<Grid2>
							<Typography variant="body2">Showing {progress.num} of {totalTracks} tracks</Typography>
					</Grid2>
					<Grid2>
							{<Button
									color="primary"
									onClick={loadAllLibraryConfirmation}
									style={{height: "40px", marginLeft: 2}}
									size="small"
									variant="text"
							>
									Load all Library
							</Button>}
					</Grid2>
					<Dialog open={loadAllConfirmationModal.open} onClose={handleClose}>
						<DialogTitle id="alert-dialog-title">
								{"Are you sure you want to load all library?"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{totalTracks} tracks will be loaded.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Close</Button>
							<Button onClick={loadAllLibraryAction} autoFocus>
								Continue
							</Button>
						</DialogActions>
					</Dialog>
				</Grid2>
				<Grid2 container> 
					<Box sx={{ width: '100%', padding: "0 0 1rem 0" }}>
							<LinearProgress variant="determinate" value={progress.percent}/>
					</Box>
				</Grid2>
		</>
	)
}

export default TrackInfo