import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import API_BASE_PATH from "../../apiConfig";
import NotificationDialog from "../resources/Notification";
import { blue } from "@mui/material/colors";
import CircularProgress from "@mui/joy/CircularProgress";
import { json, useNavigate } from "react-router-dom";
import axios from "axios";
import { checkUsername } from "./utils";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  spacing: 8, // Default spacing unit
});

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
  form: {
    width: "100%", // Full width for smaller screens
    [theme.breakpoints.up("sm")]: {
      width: "80%", // Adjust width for medium screens
    },
    [theme.breakpoints.up("md")]: {
      width: "70%", // Adjust width for large screens
    },
    margin: "auto", // Center the form horizontally
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
  usernameAvailable: {
    "& .MuiInputBase-root": {
      borderColor: "green",
      color: "green",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "green",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
  },
  usernameUnavailable: {
    "& .MuiInputBase-root": {
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: theme.palette.error.main,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme.palette.error.main,
    },
  },
}));

const Login = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [submitbutton, setSubmitbutton] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // localStorage.getItem('username') === 'true'
  const [isUsernameAvailable, SetIsUsernameAvailable] = useState(true);
  const [userNameNotice, setUserNameNotice] = useState("");

  const gotoHome = (clinicSlug) => {
    navigate(`/clinic/${clinicSlug}/home/`);
  };

  const handleLogin = async () => {
    setSubmitbutton(true);
    let clinicSlug;
    try {
      const response = await axios.post(`${API_BASE_PATH}/token-auth/`, {
        username,
        password,
      });
      const accessToken = response.data.token;
      // Store the token in local storage or state for future requests
      localStorage.setItem("accessToken", accessToken);
      clinicSlug = response.data.clinicSlug;
      // Redirect or update UI as needed
      handleSuccess("Login successful!");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      gotoHome(clinicSlug);
      // window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      handleFailure("Login unsuccessful!");
    } finally {
      setSubmitbutton(false);
    }
  };

  const handleSuccess = (message) => {
    setModalContent(message);
    setIsError(false);
    setOpenModal(true);
  };
  const handleFailure = (message) => {
    setModalContent(message);
    setIsError(true);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate(`/`);
    window.location.reload();
  };

  useEffect(() => {
    if (username.length > 4) {
      handleUsernameChange();
      setUserNameNotice("");
    } else if (username === "") {
      setUserNameNotice("should be greater than 4 characters");
      SetIsUsernameAvailable(false);
    } else {
      SetIsUsernameAvailable(true);
    }
  }, [username]);

  const handleUsernameChange = async () => {
    try {
      const response = await checkUsername(username);
      const data = response.data;

      if (data.status === "success") {
        if (data.available === false) {
          SetIsUsernameAvailable(true);
          setUserNameNotice("Available");
        } else if (data.available === true) {
          SetIsUsernameAvailable(false);
          setUserNameNotice("Username not found");
        }
      } else if (data.status === "failed") {
        handleFailure(data.message);
      }
    } catch (error) {
      handleFailure(error);
      // console.error('Error creating staff:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent className="custom-scrollbar">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                variant="outlined"
                margin="normal"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!isUsernameAvailable}
                helperText={isUsernameAvailable ? userNameNotice : ""}
                className={
                  isUsernameAvailable ? classes.usernameAvailable : classes.usernameUnavailable
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogin}
            color="primary"
            variant={"contained"}
            // disabled={
            // }
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
      {submitbutton && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 900000,
          }}
        >
          <CircularProgress size="lg" variant="solid" value={70} color="primary" />
        </div>
      )}
    </>
  );
};

// export default SignupForm;

export { Login };
