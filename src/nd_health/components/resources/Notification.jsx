// NotificationDialog.js

import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { green, red } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";

// eslint-disable-next-line react/prop-types
function NotificationDialog({ open, onClose, content, isError, closeButtonLabel = "Close" }) {
  const [color, setColor] = useState("");
  const [titleColor, setTitleColor] = useState("");
  const [contentsColor, setContentsColor] = useState("");
  const [notificationColor] = useState("#ffffffff");
  const [closeButton, setCloseButton] = useState(closeButtonLabel);

  useEffect(() => {
    if (closeButtonLabel === "") {
      setCloseButton("Close");
    } else {
      setCloseButton(closeButtonLabel);
    }
  }, []);

  useEffect(() => {
    if (isError) {
      setColor(red[400]);
      setTitleColor(red[900]);
      setContentsColor(notificationColor);
    } else {
      setColor(green[400]);
      setTitleColor(green[900]);
      setContentsColor(notificationColor);
    }
  }, [isError, notificationColor]);

  const handleCloseModal = () => {
    onClose(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      className={isError ? "Error" : "success"}
      PaperProps={{ style: { boxShadow: `28px 13px 143px 19px ${color}` } }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: titleColor,
          padding: "8px 16px",
        }}
      >
        <Icon sx={{ color: notificationColor, marginRight: "8px" }}>
          {isError ? "error" : "notifications"}
        </Icon>
        <DialogTitle sx={{ color: notificationColor, fontWeight: "bold", flexGrow: 1 }}>
          Notification
        </DialogTitle>
      </Box>
      <DialogContent sx={{ color: "#000000", backgroundColor: contentsColor }}>
        {content}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: contentsColor }}>
        <Button
          sx={{ fontSize: "1rem", fontWeight: "bold" }}
          onClick={handleCloseModal}
          variant="contained"
          color="info"
        >
          {closeButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NotificationDialog;