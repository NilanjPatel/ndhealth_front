import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, redirect } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ListAltOutlined from "@mui/icons-material/ListAltOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelmetComponent from "../SEO/HelmetComponent";
import API_BASE_PATH from "../../../apiConfig";

import LoginMenu from "../resources/LoginMenu";
import Footer from "../landing_contents/footer";
import ApprovePatients from "./ApprovePatients";
import Dashboard from "./Dashboard";
import Settings1 from "./Settings";
import EFormList from "./EFormList";
import EmailStatus from "./EmailStatus";
import CreateNewStaff from "./CreateNewStaff";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      }),
    },
  })
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: "1rem", width: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function ClinicHome() {
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const [clinicInfo, setClinicInfo] = useState(null);
  const clinicInfo1 = location.state && location.state.clinicInfo;
  const [clinicName, setClinicName] = useState(null);
  const [clinicSlug, setClinicSlug] = useState(null);
  const [clinicUsername, setClinicUsername] = useState(null);
  const [clinicId, setClinicId] = useState(null);
  const navigate = useNavigate();
  const [newDemographic, setNewDemographic] = useState(0);
  const [value, setValue] = React.useState(0);
  const [dplyDashbord, setDplyDashbord] = useState(false);
  const [dplyPatientAprv, setDplyPatientAprv] = useState(false);
  const [dplyEmailStatus, setDplyEmailStatus] = useState(false);
  const [dplyEforms, setDplyEforms] = useState(false);
  const [dplySettings, setDplySettings] = useState(false);
  const [dplyNewStaff, setDplyNewStaff] = useState(false);

  const [indexDash, setIndexDash] = useState(99);
  const [indexEmail, setIndexEmail] = useState(99);
  const [indexPtientAprv, setIndexPtientAprv] = useState(99);
  const [indexEform, setIndexEform] = useState(99);
  const [indexSettings, setIndexsettings] = useState(99);
  const [indexNewStaff, setIndexNewStaff] = useState(99);
  const [direct_login, setDirect_login] = useState(false);
  useEffect(() => {
    const getClinicInfo = async (accessToken) => {
      try {
        const response = await fetch(`${API_BASE_PATH}/user-info/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${accessToken}`,
          },
        });
        const data = await response.json();
        if (data.detail === "Invalid token.") {
          navigate("/");
        }
        if (data.user_type === "clinic") {
          setClinicName(data.clinic.name);
          setClinicSlug(data.clinic.slug);
          setClinicUsername(data.username);
          setClinicId(data.clinic.id);
          displayForAdmin();
        } else if (data.user_type === "doctor") {
          setClinicName(data.doctor.name);
          setClinicSlug(data.doctor.slug);
          setClinicUsername(data.username);
          setClinicId(data.doctor.id);
          displayForDoctor();
        } else if (data.user_type === "staff") {
          setClinicName(data.staff.name);
          setClinicSlug(data.staff.slug);
          setClinicUsername(data.username);
          setClinicId(data.staff.id);
          displayForStaff();
        }

        // setClinicInfo(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    if (!localStorage.getItem("accessToken")) {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("token");
      const username = urlParams.get("username");
      const loggedIn = urlParams.get("loggedIn");
      if (accessToken && username && loggedIn) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", username);
        localStorage.setItem("loggedIn", loggedIn);
        // Proceed with authenticated actions
        getClinicInfo(accessToken);
        window.location.reload();
      } else {
        navigate("/"); // Redirect to login if no token
      }
    }
  }, [direct_login]);

  useEffect(() => {
    // get user clinic info using access token
    const accessToken = localStorage.getItem("accessToken");
    const getClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/user-info/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${accessToken}`,
          },
        });
        const data = await response.json();
        if (data.detail === "Invalid token.") {
          setDirect_login(true);
        }
        if (data.user_type === "clinic") {
          setClinicName(data.clinic.name);
          setClinicSlug(data.clinic.slug);
          setClinicUsername(data.username);
          setClinicId(data.clinic.id);
          displayForAdmin();
        } else if (data.user_type === "doctor") {
          setClinicName(data.doctor.name);
          setClinicSlug(data.doctor.slug);
          setClinicUsername(data.username);
          setClinicId(data.doctor.id);
          displayForDoctor();
        } else if (data.user_type === "staff") {
          setClinicName(data.staff.name);
          setClinicSlug(data.staff.slug);
          setClinicUsername(data.username);
          setClinicId(data.staff.id);
          displayForStaff();
        }

        // setClinicInfo(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    const isNewDemographic = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/demographic-count/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            clinic_slug: clinicSlug,
          }),
        });
        const data = await response.json();
        setNewDemographic(data.demographic_count);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getClinicInfo();
    // isNewDemographic();
  });

  const displayForAdmin = () => {
    setDplyDashbord(true);
    setDplyPatientAprv(true);
    setDplyEmailStatus(true);
    setDplyEforms(true);
    setDplySettings(true);
    setDplyNewStaff(true);

    setIndexDash(0);
    setIndexPtientAprv(1);
    setIndexEmail(2);
    setIndexEform(3);
    setIndexsettings(4);
    setIndexNewStaff(5);
  };

  const displayForStaff = () => {
    setDplyDashbord(true);
    setDplyPatientAprv(true);
    setDplyEmailStatus(true);
    setDplyEforms(true);
    setDplySettings(false);
    setDplyNewStaff(false);
    setIndexDash(0);
    setIndexPtientAprv(1);
    setIndexEmail(2);
    setIndexEform(3);
  };

  const displayForDoctor = () => {
    setDplyDashbord(true);
    setDplyPatientAprv(false);
    setDplyEmailStatus(true);
    setDplyEforms(false);
    setDplySettings(false);
    setDplyNewStaff(false);
    setIndexDash(0);
    setIndexEmail(1);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Dashboard
              {/* {clinicInfo.website} */}
            </Typography>
            <IconButton color="inherit">
              {/* Replace the IconButton for login/logout with LoginMenu */}
              <LoginMenu username={clinicUsername} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" sx={{ marginLeft: "-0.5rem" }}>
            <Tabs
              orientation="vertical"
              // variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              {dplyDashbord && (
                <Tab
                  label={open ? "Dashboard" : ""}
                  icon={open ? <DashboardIcon /> : <DashboardOutlinedIcon />}
                  {...a11yProps(indexDash)}
                />
              )}
              {dplyPatientAprv && (
                <Tab
                  label={
                    <Badge
                      badgeContent={newDemographic}
                      color="error"
                      sx={{ paddingRight: "8px" }} // Adjust spacing as needed
                    >
                      {open ? "Patients" : ""}
                    </Badge>
                  }
                  // label={open ? 'Patients' : ''}
                  icon={open ? <PeopleIcon /> : <PeopleOutlinedIcon />}
                  {...a11yProps(indexPtientAprv)}
                />
              )}

              {dplyEmailStatus && (
                <Tab
                  label={open ? "emailStatus" : ""}
                  icon={open ? <MailIcon /> : <MailOutlineIcon />}
                  {...a11yProps(indexEmail)}
                />
              )}
              {dplyEforms && (
                <Tab
                  label={open ? "eForms" : ""}
                  icon={open ? <ListAltIcon /> : <ListAltOutlined />}
                  {...a11yProps(indexEform)}
                />
              )}
              {dplySettings && (
                <Tab
                  label={open ? "Settings" : ""}
                  icon={open ? <SettingsIcon /> : <SettingsOutlinedIcon />}
                  {...a11yProps(indexSettings)}
                />
              )}

              {dplyNewStaff && (
                <Tab
                  label={open ? "NewStaff" : ""}
                  icon={open ? <MailIcon /> : <MailOutlineIcon />}
                  {...a11yProps(indexNewStaff)}
                />
              )}
            </Tabs>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
            <Grid container spacing={3}>
              {dplyDashbord && (
                <TabPanel value={value} index={indexDash}>
                  <Dashboard clinicSlug={clinicSlug} />
                </TabPanel>
              )}
              {dplyPatientAprv && (
                <TabPanel value={value} index={indexPtientAprv}>
                  <ApprovePatients clinicSlug={clinicSlug} />
                </TabPanel>
              )}
              {dplyEmailStatus && (
                <TabPanel value={value} index={indexEmail}>
                  <EmailStatus clinicSlug={clinicSlug} />
                </TabPanel>
              )}
              {dplyEforms && (
                <TabPanel value={value} index={indexEform}>
                  <EFormList />
                </TabPanel>
              )}
              {dplySettings && (
                <TabPanel value={value} index={indexSettings}>
                  <Settings1 clinicSlug={clinicSlug} clinicId={clinicId} />
                </TabPanel>
              )}

              <TabPanel value={value} index={indexNewStaff}>
                <TabPanel value={value} index={indexNewStaff}>
                  <CreateNewStaff clinicSlug={clinicSlug} clinicId={clinicId} />
                </TabPanel>
              </TabPanel>
              <TabPanel value={value} index={6}>
                Item Six
              </TabPanel>
              <TabPanel value={value} index={7}>
                Item Seven
              </TabPanel>
            </Grid>
          </Container>
        </Box>
      </Box>
      <Footer />
      <HelmetComponent />
    </ThemeProvider>
  );
}
