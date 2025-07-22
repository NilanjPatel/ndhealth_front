// Layout.js

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Link,
  Paper,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Modal,
  TextField,
  Box,
  Grid,
  Card,
  DialogTitle,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Import AccountCircleIcon
// import ndHealthLogo from "nd_health/assets/images/nd-health-logo.png";
import powered_by_logo from "nd_health/assets/images/powered_by_nd_health_n.png";
import ndHealthLogo from "nd_health/assets/images/ND(1).png";

// import "../App.css";
import API_BASE_PATH from "apiConfig";

import HelmetComponent from "./SEO/HelmetComponent";
// login
import axios from "axios";
import PropTypes from "prop-types";
import CardHeader from "@mui/material/CardHeader";

const lightTheme = createTheme({
  palette: {
    mode: "light", // Ensure the theme is in light mode
    primary: {
      main: "#1976d2", // Creamy color for primary elements
    },
    background: {
      default: "#ffffff", // White background
    },
  },
});

const Layout1 = ({ clinicInfo, tabtitle, children, title }) => {
  const [password, setPassword] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [username, setUsername] = useState(""); // localStorage.getItem('username') === 'true'
  // const [userInfo, setUserInfo] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;
  const [home, setHome] = useState("");
  const [clinicWebsite, setClinicWebsite] = useState("");
  const { clinicSlug } = useParams();
  // const [clinicInfo, setClinicInfo] = useState();
  // const [locationsData, setLocations] = useState();
  // const pathSegments = location.pathname.split("/");
  // const clinicSlugcurrent = clinicSlug || pathSegments[pathSegments.indexOf("clinic") + 1];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    // Handle login logic or navigate to login page
    // You can use React Router's history.push('/login') to navigate to the login page
    setLoginModalOpen(true);
    navigate(`/login/`);
  };

  const resetPassword = () => {
    navigate(`/clinic/${clinicSlug}/ResetPassword`);

  }
  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
    setLoginMessage("");
    // Clear username and password if needed
    setUsername("");
    setPassword("");
  };

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

  const handleResetPassword = () => {
    setLoginModalOpen(false);
    navigate(`/clinic/${clinicSlug}/resetPassword`);
  };
  const handleLogout = () => {
    // Implement logout logic here
    setLoggedIn(false);
    localStorage.clear();
    gotoHome();
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_PATH}/user-info/`, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      });

      if (response.status === 200) {
        // setUserInfo(response.data);
        try {
          setUsername(response.data.username);
          setLoggedIn(true);
        } catch (error) {
          setUsername("");
          setLoggedIn(false);
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("accessToken");
        }
      }
    } catch (error) {
      console.error("Error fetching user information:", error.message);
      setUsername("");
      setLoggedIn(false);
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("accessToken");
    }
  };

  const gotoHome = () => {
    navigate(`/clinic/${clinicSlug}/home/`);
  };

  const gotoPolicy = () => {
    navigate(`/clinic/${clinicSlug}/policy`);
  };

  useEffect(() => {
    const fetchClinicInfo = async () => {
      setHome(`https://nd-health.ca`);
      try {
        // const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);

        // const data = await response.json();
        // setClinicInfo(clinicInfo);
        // setLocations(clinicInfo.locations);

        if (clinicInfo) {
          setClinicWebsite(clinicInfo.website);
        }
        //  if terminal in currretPage , set home as current page
        if (currentPage.includes("terminal")) {
          // setHome(`https://nd-health.ca`);
          setHome("https://nd-health.ca" + currentPage);
          setClinicWebsite(home + currentPage);
        }
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };

    // fetchClinicInfo();

    if (accessToken !== null) {
      fetchUserInfo();
    } else {
      if (currentPage === `/clinic/${clinicSlug}/home`) {
        navigate(`/clinic/${clinicSlug}/`);
      }
    }
    fetchClinicInfo();
    // set_clinicdetails();
  }, [accessToken, clinicInfo]);

  return (
    <>
      {(() => {
        if (clinicInfo) {
          return (
            <>
              <HelmetComponent tabtitle={tabtitle}/>

              <CssBaseline />
              <ThemeProvider theme={lightTheme}>
                <AppBar position="fixed">
                  <Toolbar>
                    {/* <img src={ndHealthLogo} alt="ND Health Logo" style={{ height: '40px' }} /> */}

                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      <Link href={home} variant='title' color="inherit" underline="none" style={{ paddingLeft: '0.81rem', fontFamily: 'sans-serif' }} > ND Health</Link>
                    </Typography> */}

                    {clinicInfo.logo && (
                      <img
                        alt={`Book family and walk in appointment at ${clinicInfo.name} near ${clinicInfo.user__city}, ${clinicInfo.user__province}`}
                        src={clinicInfo.logo}
                        height="50"
                        style={{
                          marginRight: "10px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Adjust the shadow to create a lifting effect
                          backgroundColor:'white',
                          transform: "translateY(-2px)", // Slightly lift the logo
                          transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition
                          borderRadius: "50%", // Ensure the shadow follows the shape of the logo
                        }}
                      />
                    )}

                    <Link
                      href={clinicWebsite}
                      color="inherit"
                      underline="none"
                      style={{ flexGrow: 1 }}
                    >
                      {title ? (
                        <CardHeader
                          title={title}
                          sx={{
                            backgroundColor: "#1976d2",
                            color: "white !important",
                            "& .MuiCardHeader-title": {
                              color: "white !important",
                            },
                            display: "flex",
                            alignItems: "center",
                            padding: "16px 24px",
                          }}
                        />
                      ) : (
                        <span>{clinicInfo.name}</span>
                      )}

                    </Link>
                    {/* Use an IconButton for the login dropdown */}
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                      <AccountCircleIcon />
                    </IconButton>

                    {/* Login Dropdown */}
                    <Menu
                      id="login-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {(() => {
                        if (loggedIn) {
                          return [
                            <MenuItem key="welcome"
                                      onClick={gotoHome}>{`${username}`}</MenuItem>,
                            <MenuItem key="settings" onClick={gotoHome}>
                              Settings
                            </MenuItem>,
                            <MenuItem key="logout" onClick={handleLogout}>
                              Logout
                            </MenuItem>,
                            // Add more menu items for authenticated users if needed
                          ];
                        } else {
                          return (
                            <>

                              <MenuItem key="login" onClick={handleLoginClick}>
                                Clinic Login (staff)
                              </MenuItem>
                              <MenuItem key="reset" onClick={resetPassword}>
                                Reset password (staff)
                              </MenuItem>
                            </>
                            // Add more menu items for other authentication options if needed
                          );
                        }
                      })()}
                    </Menu>
                  </Toolbar>
                </AppBar>
              </ThemeProvider>

              {/* Login Modal */}
              <Modal
                open={loginModalOpen}
                onClose={handleLoginModalClose}
                aria-labelledby="login-modal"
                aria-describedby="login-modal-description"
              >
                <Paper
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    p: 3,
                    width: 300,
                  }}
                >
                  <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingTop={-1}>
                    <Grid item xs={12} sm={12} md={12}>
                      <DialogTitle>
                        <Card sx={{ background: "primary", boxShadow: "none" }}>
                          <Box>
                            <Typography variant="h5" component="h2">
                              Login
                            </Typography>
                          </Box>
                        </Card>
                      </DialogTitle>
                    </Grid>
                    {/*<Grid item xs={12} sm={12} md={12}>*/}
                    <TextField
                      label="Username"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {/*</Grid>*/}
                    {/*<Grid item xs={12} sm={12} md={12}>*/}
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
                    {/*</Grid>*/}
                    <Grid item xs={12} sm={6} md={6}>
                      <Button variant="contained" color="primary" onClick={handleLogin}>
                        Login
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Button variant={"outlined"} color="primary" onClick={handleResetPassword}>
                        Reset
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={12}>
                      <Box mt={2}>
                        <Typography
                          variant="body2"
                          color={loginMessage.includes("failed") ? "error" : "success"}
                        >
                          {loginMessage}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>

              <div className="w-full mt-8 pb-40 pt-16 px-2">
                   <Paper elevation={1} sx={{ p: 2 ,mt:7}}>
                  {children}
                   </Paper>
              </div>

            </>
          );
        } else {
          return (
            <>
              <CssBaseline />
              <ThemeProvider theme={lightTheme}>
                <AppBar position="fixed">
                  <Toolbar>
                    <img href={home} src={ndHealthLogo} alt="ND Health Logo" style={{ height: "90px" }} />
                  </Toolbar>
                </AppBar>
              </ThemeProvider>
              <Container
                component="main"
                maxWidth="md"
                sx={{ mt: 2, paddingBottom: "5rem", paddingTop: "2.2rem" }}
              >
                <Paper elevation={0} sx={{ p: 2 }}>
                  {children}
                </Paper>
              </Container>
            </>
          );
        }
      })()}
    </>
  );
};

// Define PropTypes for the component
Layout1.propTypes = {
  clinicInfo: PropTypes.object.isRequired, // Adjust the shape as needed
  children: PropTypes.node.isRequired,
};

export default Layout1;
