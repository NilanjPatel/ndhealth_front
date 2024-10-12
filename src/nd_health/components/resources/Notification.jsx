// NotificationDialog.js

import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { green, red } from "@mui/material/colors";

// eslint-disable-next-line react/prop-types
function NotificationDialog({ open, onClose, content, isError }) {
  // const [modalContent, setModalContent] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (isError) {
      setColor(red[400]);
    } else {
      setColor(green[400]);
    }
  });

  const handleCloseModal = () => {
    onClose(false);
  };

  // const openDialog = (content, isError) => {
  //   setModalContent(content);
  //   onClose(true);
  // };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      className={isError ? "error" : "success"}
      PaperProps={{ style: { boxShadow: `28px 13px 143px 19px ${color}` } }}
    >
      <DialogTitle sx={{ color: "black", fontWeight: "bold" }}>Notification</DialogTitle>
      <DialogContent sx={{ color: "#000000" }}>{content}</DialogContent>
      <DialogActions>
        <Button sx={{ fontSize: "1rem", fontWeight: "bold" }} onClick={handleCloseModal} variant="contained" color="info">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NotificationDialog;
