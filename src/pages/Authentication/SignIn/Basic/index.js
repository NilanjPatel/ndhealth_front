import React, { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate, useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

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
// import Notification from "../../../../nd_health/components/resources/Notification";
import NotificationDialog from "../../../../nd_health/components/resources/Notification";

function SignInBasic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState(""); // localStorage.getItem('username') === 'true'
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [clinicSlug, setClinicSlug] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

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

  }, [clinicSlug]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_PATH}/token-auth/`, {
        username,
        password,
      });
      const accessToken = response.data.token;
      // Store the token in local storage or state for future requests
      localStorage.setItem("accessToken", accessToken);
      setClinicSlug(response.data.clinicSlug);
      // Redirect or update UI as needed
      localStorage.setItem("loggedIn", "true");
      if (rememberMe) {
        // Save credentials to localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
      } else {
        // Clear credentials from localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }

      handleSuccess("You have logged in Successfully!");
      // window.location.reload();
    } catch (error) {
      handleFailure("Login Failed, Please try again with correct Username and Password");
      console.error("Login failed:", error);

    }
  };
  const gotoHome = () => {

    if (clinicSlug) {
      navigate(`/clinic/${clinicSlug}/home/`);
    } else {
      console.error("clinicSlug is undefined");
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
        <Card>
          <MKBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"

          >
            <MKTypography variant="h2" fontWeight="medium" color="white" mt={1}>
              Sign in
            </MKTypography>
            {/*<Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>*/}
            {/*  <Grid item xs={2}>*/}
            {/*    <MKTypography component={MuiLink} href="#" variant="body1" color="white">*/}
            {/*      <FacebookIcon color="inherit" />*/}
            {/*    </MKTypography>*/}
            {/*  </Grid>*/}
            {/*  <Grid item xs={2}>*/}
            {/*    <MKTypography component={MuiLink} href="#" variant="body1" color="white">*/}
            {/*      <GitHubIcon color="inherit" />*/}
            {/*    </MKTypography>*/}
            {/*  </Grid>*/}
            {/*  <Grid item xs={2}>*/}
            {/*    <MKTypography component={MuiLink} href="#" variant="body1" color="white">*/}
            {/*      <GoogleIcon color="inherit" />*/}
            {/*    </MKTypography>*/}
            {/*  </Grid>*/}
            {/*</Grid>*/}
          </MKBox>
          <MKBox pt={4} pb={3} px={3}>
            <MKBox component="form" role="form">
              <MKBox mb={2}>
                <MKInput
                  type="username"
                  label="Username"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </MKBox>
              <MKBox mb={2}>
                <MKInput
                  type={showPassword ? "text" : "password"} // Toggle input type
                  label="Password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                  InputProps={{
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
                />
              </MKBox>
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
              <MKBox mt={4} mb={1}>
                <MKButton
                  variant="gradient" color="info" fullWidth
                  onClick={handleLogin}
                >
                  sign in
                </MKButton>
              </MKBox>
              <MKBox mt={3} mb={1} textAlign="center">
                <MKTypography variant="button" color="text">
                  Don&apos;t have an account?{" "}
                  <MKTypography
                    component={Link}
                    to="/join"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign up
                  </MKTypography>
                </MKTypography>
              </MKBox>
            </MKBox>
          </MKBox>
        </Card>
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
