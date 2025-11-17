import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Authentication pages components
import BasicLayout from "pages/Authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/toronto_cn_tower_side.jpg";
import axios from "axios";
import API_BASE_PATH from "../../../../apiConfig";
import NotificationDialog from "../../../../nd_health/components/resources/Notification";

function SignInBasic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [clinicSlug, setClinicSlug] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // Navigation function
  const gotoHome = useCallback(() => {
    if (clinicSlug) {
      navigate(`/clinic/${clinicSlug}/home/`);
    } else {
      console.error("clinicSlug is undefined");
    }
  }, [clinicSlug, navigate]);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setUsername(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
  }, [username]);

  useEffect(() => {
    if (clinicSlug !== "") {
      gotoHome();
    }
  }, [clinicSlug, gotoHome]);

  // Form validation
  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_PATH}/token-auth/`, {
        username,
        password,
      });
      const accessToken = response.data.token;
      localStorage.setItem("accessToken", accessToken);
      setClinicSlug(response.data.clinicSlug);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user_type", response.data.user_type);

      handleSuccess("You have logged in Successfully!");
    } catch (error) {
      handleFailure("Login Failed, Please try again with correct Username and Password");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // NotificationDialog
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

  return (
    <>
      <BasicLayout image={bgImage}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              overflow: "visible",
            }}
          >
            {/* Header Section */}
            <MKBox
              sx={{
                position: "relative",
                background: "linear-gradient(135deg, #579EF9 0%, #024BAA 100%)",
                borderRadius: "20px 20px 0 0",
                p: 4,
                textAlign: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(87, 158, 249, 0.9) 0%, rgba(2, 75, 170, 0.9) 100%)",
                  borderRadius: "20px 20px 0 0",
                },
              }}
            >
              <MKBox sx={{ position: "relative", zIndex: 1 }}>
                {/* Logo Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <MKBox
                    sx={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "15px",
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <Icon sx={{ fontSize: "2.5rem", color: "white" }}>lock_person</Icon>
                  </MKBox>
                </motion.div>

                <MKTypography variant="h2" fontWeight="bold" color="white" mb={1}>
                  Welcome Back
                </MKTypography>
                <MKTypography variant="body1" color="white" opacity={0.9}>
                  Sign in to access your clinic dashboard
                </MKTypography>

                {/* Trust Indicators */}
                <MKBox
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 3,
                    flexWrap: "wrap",
                  }}
                >
                  <MKBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Icon sx={{ fontSize: "1rem", color: "white" }}>lock</Icon>
                    <MKTypography variant="caption" color="white" fontWeight="medium">
                      256-bit Encrypted
                    </MKTypography>
                  </MKBox>
                  <MKBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Icon sx={{ fontSize: "1rem", color: "white" }}>verified_user</Icon>
                    <MKTypography variant="caption" color="white" fontWeight="medium">
                      HIPAA Compliant
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </MKBox>
            </MKBox>

            {/* Form Section */}
            <MKBox pt={4} pb={3} px={4}>
              <MKBox component="form" role="form">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <MKBox mb={3}>
                    <MKInput
                      type="text"
                      label="Username"
                      fullWidth
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors({ ...errors, username: "" });
                      }}
                      error={!!errors.username}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>person</Icon>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(87, 158, 249, 0.15)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 4px 20px rgba(87, 158, 249, 0.25)",
                          },
                        },
                      }}
                    />
                    <AnimatePresence>
                      {errors.username && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <MKTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                            {errors.username}
                          </MKTypography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </MKBox>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <MKBox mb={2}>
                    <MKInput
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: "" });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLogin();
                        }
                      }}
                      error={!!errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>key</Icon>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(87, 158, 249, 0.15)",
                          },
                          "&.Mui-focused": {
                            boxShadow: "0 4px 20px rgba(87, 158, 249, 0.25)",
                          },
                        },
                      }}
                    />
                    <AnimatePresence>
                      {errors.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <MKTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                            {errors.password}
                          </MKTypography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </MKBox>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <MKBox display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <MKBox display="flex" alignItems="center" ml={-1}>
                      <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                      <MKTypography
                        variant="button"
                        fontWeight="regular"
                        color="text"
                        onClick={handleSetRememberMe}
                        sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                      >
                        &nbsp;&nbsp;Remember me
                      </MKTypography>
                    </MKBox>
                    <MKTypography
                      component={Link}
                      to="/resetpassword"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      sx={{
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Forgot Password?
                    </MKTypography>
                  </MKBox>
                </motion.div>

                {/* Sign In Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <MKBox mt={2} mb={1}>
                    <MKButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={handleLogin}
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #579EF9 0%, #024BAA 100%)",
                        boxShadow: "0 8px 20px rgba(87, 158, 249, 0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 28px rgba(87, 158, 249, 0.4)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                        "&:disabled": {
                          opacity: 0.7,
                        },
                      }}
                    >
                      {isLoading ? (
                        <MKBox display="flex" alignItems="center" gap={1}>
                          <CircularProgress size={20} color="inherit" />
                          <span>Signing In...</span>
                        </MKBox>
                      ) : (
                        "Sign In"
                      )}
                    </MKButton>
                  </MKBox>
                </motion.div>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Divider sx={{ my: 3 }}>
                    <MKTypography variant="button" color="text" fontWeight="regular">
                      or
                    </MKTypography>
                  </Divider>
                </motion.div>

                {/* Social Login Options (Placeholder) */}
                {/* Commented out but styled professionally for future use
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <MKBox display="flex" gap={2} mb={3}>
                    <MKButton
                      variant="outlined"
                      color="dark"
                      fullWidth
                      sx={{
                        borderRadius: "10px",
                        py: 1.2,
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <Icon sx={{ mr: 1 }}>google</Icon>
                      Google
                    </MKButton>
                  </MKBox>
                </motion.div>
                */}

                {/* Sign Up Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <MKBox textAlign="center">
                    <MKTypography variant="button" color="text">
                      Don&apos;t have an account?{" "}
                      <MKTypography
                        component={Link}
                        to="/join"
                        variant="button"
                        fontWeight="bold"
                        sx={{
                          background: "linear-gradient(135deg, #579EF9 0%, #024BAA 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Sign up
                      </MKTypography>
                    </MKTypography>
                  </MKBox>
                </motion.div>

                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <MKBox
                    sx={{
                      mt: 4,
                      p: 2,
                      borderRadius: "10px",
                      background: "rgba(87, 158, 249, 0.05)",
                      border: "1px solid rgba(87, 158, 249, 0.1)",
                    }}
                  >
                    <MKBox display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: "#579EF9", fontSize: "1.2rem" }}>info</Icon>
                      <MKTypography variant="caption" color="text">
                        Your data is protected with bank-level security and encrypted end-to-end
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </motion.div>
              </MKBox>
            </MKBox>
          </Card>
        </motion.div>
      </BasicLayout>
      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
    </>
  );
}

export default SignInBasic;
