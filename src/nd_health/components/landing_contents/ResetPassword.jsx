import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, TextField, Typography, Card, CardContent, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationDialog from "../resources/Notification";
import Layout from "nd_health/components/Layout";
import { validatePassword } from "nd_health/components/resources/utils";
import API_BASE_PATH from "../../../apiConfig";

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [updatedInfo, setUpdatedInfo] = useState({ password: "", password1: "" });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    validatePasswords();
  }, [updatedInfo.password, updatedInfo.password1]);

  const validatePasswords = () => {
    if (!updatedInfo.password && !updatedInfo.password1) {
      setPasswordMatch(true);
      setPasswordError("");
      return;
    }

    if (
      validatePassword(updatedInfo.password, updatedInfo.password1) &&
      updatedInfo.password === updatedInfo.password1
    ) {
      setPasswordMatch(true);
      setPasswordError("Passwords match");
    } else {
      setPasswordMatch(false);
      setPasswordError("Passwords do not match");
    }
  };

  const handleInputChange = (field, value) => {
    setUpdatedInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch || !updatedInfo.password) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_PATH}/reset-password-confirm/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_password: updatedInfo.password }),
        }
      );

      setUpdatedInfo({ password: "", password1: "" });

      if (response.ok) {
        handleSuccess("Password has been reset successfully!");
      } else {
        handleFailure("Something went wrong. Please try again.");
      }
    } catch (error) {
      handleFailure("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
    navigate("/"); // redirect to home
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          padding: 2,
        }}
      >
        <Card sx={{ maxWidth: 500, width: "100%", p: 3, boxShadow: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={updatedInfo.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  helperText={!passwordMatch ? passwordError : ""}
                  error={!passwordMatch}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Repeat Password"
                  type="password"
                  fullWidth
                  value={updatedInfo.password1}
                  onChange={(e) => handleInputChange("password1", e.target.value)}
                  helperText={!passwordMatch ? passwordError : ""}
                  error={!passwordMatch}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={!passwordMatch || !updatedInfo.password || isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Change Password"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Box>

      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
    </Layout>
  );
};

export { PasswordResetConfirm };
