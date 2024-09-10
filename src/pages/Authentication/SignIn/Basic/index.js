import { useEffect, useState } from "react";

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

// Authentication pages components
import BasicLayout from "pages/Authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axios from "axios";
import API_BASE_PATH from "../../../../apiConfig";

function SignInBasic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState(""); // localStorage.getItem('username') === 'true'
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const navigate = useNavigate();
  const { clinicSlug } = useParams();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  useEffect(() => {
    console.log(`Username:${username}`);
  }, [username]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_PATH}/token-auth/`, {
        username,
        password,
      });
      const accessToken = response.data.token;
      // Store the token in local storage or state for future requests
      localStorage.setItem("accessToken", accessToken);
      // Redirect or update UI as needed
      setLoginMessage("Login successful!");
      setLoginModalOpen(false);
      setAnchorEl(null);
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      gotoHome();
      // window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      setLoginMessage("Login unsuccessful!");
    }
  };
  const gotoHome = () => {
    navigate(`/clinic/${clinicSlug}/home/`);
  };

  return (
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
                type="password" label="Password" fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
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
  );
}

export default SignInBasic;
