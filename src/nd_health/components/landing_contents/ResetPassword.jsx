import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Grid } from "@mui/joy";
import { Button, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/joy/CircularProgress";
import NotificationDialog from "../resources/Notification";
import Layout from "nd_health/components/Layout";
import { validatePassword } from "nd_health/components/resources/utils";
import API_BASE_PATH from "../../../apiConfig";

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [passwordmatch, setPasswordmatch] = React.useState(true);
  const [passwordError, setPasswordError] = useState("");

  const [open, setOpen] = useState(true);

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [submitbutton, setSubmitbutton] = useState(true);
  const [successSignup, setSuccessSignup] = useState(false);
  const navigate = useNavigate();
  const [updatedInfo, setUpdatedInfo] = useState({
    password: "",
    password1: "",
  });

  useEffect(() => {
    handelpassword();
  }, [updatedInfo.password, updatedInfo.password1]);
  const handelpassword = () => {
    if (
      validatePassword(updatedInfo.password, updatedInfo.password1) &&
      updatedInfo.password === updatedInfo.password1
    ) {
      setPasswordmatch(true);
      setPasswordError("Password did matchd");
    } else if (updatedInfo.password === "" || updatedInfo.password1 === "") {
      setPasswordmatch(true);
      setPasswordError("Password did matchd");
    } else {
      setPasswordError("Password did not match");
      setPasswordmatch(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_PATH}/reset-password-confirm/${uidb64}/${token}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: updatedInfo.password,
        }),
      });

      setUpdatedInfo({
        password: "",
        password1: "",
      });

      handleSuccess("Password has been reset");
    } catch (error) {
      // console.error('Error resetting password', error);
      handleFailure("Something Went Wrong!, please try again");
    }
  };
  const handleInputChange = (field, value) => {
    // Apply any necessary formatting methods
    let formattedValue = value;

    setUpdatedInfo((prevInfo) => ({
      ...prevInfo,
      [field]: formattedValue,
    }));
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
  };

  return (
    <Layout>
      <Grid container spacing={2} sx={{ paddingTop: 8 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Password"
            name="newndpassword"
            value={updatedInfo.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            fullWidth
            type="password"
            helperText={!passwordmatch ? passwordError : ""}
            error={!passwordmatch}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Repeat Password"
            name="repeat Password"
            value={updatedInfo.password1}
            onChange={(e) => handleInputChange("password1", e.target.value)}
            fullWidth
            type="password"
            helperText={!passwordmatch ? passwordError : ""}
            error={!passwordmatch}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button onClick={handleClose} color="primary" variant={"contained"}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button onClick={handleSubmit} color="primary" variant={"contained"}>
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
      {!submitbutton && (
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
    </Layout>
  );
};

export { PasswordResetConfirm };
