import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { redirectHomeM } from "./utils";
import { useParams } from "react-router-dom";
import NotificationDialog from "./Notification";
import API_BASE_PATH from "../../../apiConfig";

const theme = createTheme({
  spacing: 8, // Default spacing unit
});

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    maxWidth: 400,
    width: "100%",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    position: "relative",
    top: "-10%",
    margin: "0 auto",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: theme.spacing(2),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    marginBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const PasswordReset = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(true);
  // NotificationDialog
  const [openNotification, setOpenNotification] = useState(false);
  const [isError, setIsError] = useState(false);
  const [notificationContent, setNotificationContent] = useState("");

  const { clinicSlug } = useParams();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    redirectHomeM(clinicSlug);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle password reset logic here

    const responcebody = {
      email: email,
    };
    try {
      const response = await fetch(`${API_BASE_PATH}/password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responcebody),
      });

      if (response.ok) {
        // Handle successful response
        handleSuccess(
          `We have sent email on ${email} with password reset link. Please check your email and reset password`
        );
        handleClose();
      } else {
        // Handle error response

        handleFailure("Something went wrong, Please try again later");
        console.error("Failed to upload files", response);
      }
    } catch (error) {
      handleFailure("Something went wrong, Please try again later");
      console.error("Error uploading files:", error);
    }
  };

  const handleSuccess = (message) => {
    setNotificationContent(message);
    setIsError(false);
    setOpenNotification(true);
  };
  const handleFailure = (message) => {
    setNotificationContent(message);
    setIsError(true);
    setOpenNotification(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Card className={classes.card}>
              <Box className={classes.header}>
                <Typography variant="h5" component="h2" className={classes.title}>
                  Reset Password
                </Typography>
              </Box>
            </Card>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.button}
              >
                RESET
              </Button>

              <Typography variant="body2" className={classes.subtitle}>
                You will receive an e-mail in maximum 60 seconds
              </Typography>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <NotificationDialog
          open={openNotification}
          onClose={setOpenNotification}
          content={notificationContent}
          isError={isError}
        />
      </div>
    </ThemeProvider>
  );
};

export default PasswordReset;
