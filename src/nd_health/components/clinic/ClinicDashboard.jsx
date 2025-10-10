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
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import PodcastsIcon from '@mui/icons-material/Podcasts';
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
import Broadcast from "./Broadcast";

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
      backgroundColor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`,
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

const StyledListItem = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    minWidth: 40,
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  minHeight: 'calc(100vh - 64px)', // Subtract toolbar height
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
}));

const ContentHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2, 3),
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}));

const ContentBody = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: 0,
  overflow: 'hidden', // Keep container from scrolling
  display: 'flex',
  flexDirection: 'column',
}));

// Professional theme
const professionalTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#42a5f5',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
  },
});

// Navigation items configuration
const getNavigationItems = (userType) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, component: 'Dashboard' },
  ];

  const adminItems = [
    ...baseItems,
    { id: 'patients', label: 'Patients', icon: PeopleIcon, component: 'ApprovePatients', hasBadge: true },
    { id: 'email', label: 'Email Status', icon: MailIcon, component: 'EmailStatus' },
    { id: 'Broadcast', label: 'Broadcast', icon: PodcastsIcon, component: 'Broadcast' },
    { id: 'eforms', label: 'E-Forms', icon: ListAltIcon, component: 'EFormList' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, component: 'Settings1' },
    { id: 'staff', label: 'New Staff', icon: PersonAddIcon, component: 'CreateNewStaff' },
  ];

  const staffItems = [
    ...baseItems,
    { id: 'patients', label: 'Patients', icon: PeopleIcon, component: 'ApprovePatients', hasBadge: true },
    { id: 'email', label: 'Email Status', icon: MailIcon, component: 'EmailStatus' },
    { id: 'Broadcast', label: 'Broadcast', icon: PodcastsIcon, component: 'Broadcast' },
    { id: 'eforms', label: 'E-Forms', icon: ListAltIcon, component: 'EFormList' },
  ];

  const doctorItems = [
    ...baseItems,
    { id: 'email', label: 'Email Status', icon: MailIcon, component: 'EmailStatus' },
  ];

  switch (userType) {
    case 'clinic': return adminItems;
    case 'staff': return staffItems;
    case 'doctor': return doctorItems;
    default: return baseItems;
  }
};

export default function ClinicHome() {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();

  // User and clinic state
  const [clinicInfo, setClinicInfo] = useState({
    name: '',
    slug: '',
    username: '',
    id: null,
    userType: '',
  });
  const [newDemographic, setNewDemographic] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        handleTokenFromURL();
        return;
      }

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
          handleTokenFromURL();
          return;
        }

        const userInfo = getUserInfo(data);
        setClinicInfo(userInfo);
        setLoading(false);

        // Fetch demographic count for admin/staff
        if (data.user_type !== 'doctor') {
          fetchDemographicCount(userInfo.slug);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleTokenFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");
    const username = urlParams.get("username");
    const loggedIn = urlParams.get("loggedIn");

    if (accessToken && username && loggedIn) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", username);
      localStorage.setItem("loggedIn", loggedIn);
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const getUserInfo = (data) => {
    const userTypeMap = {
      clinic: data.clinic,
      doctor: data.doctor,
      staff: data.staff,
    };

    const userEntity = userTypeMap[data.user_type];

    return {
      name: userEntity?.name || '',
      slug: userEntity?.slug || '',
      username: data.username || '',
      id: userEntity?.id || null,
      userType: data.user_type || '',
    };
  };

  const fetchDemographicCount = async (slug) => {
    try {
      const response = await fetch(`${API_BASE_PATH}/demographic-count/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ clinic_slug: slug }),
      });
      const data = await response.json();
      setNewDemographic(data.demographic_count || 0);
    } catch (error) {
      console.error("Error fetching demographic count:", error);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    const navigationItems = getNavigationItems(clinicInfo.userType);
    const activeItem = navigationItems.find(item => item.id === activeTab);

    if (!activeItem) return null;

    const props = {
      clinicSlug: clinicInfo.slug,
      clinicId: clinicInfo.id,
    };

    const contentMap = {
      'Dashboard': () => <Dashboard {...props} />,
      'ApprovePatients': () => <ApprovePatients {...props} />,
      'EmailStatus': () => <EmailStatus {...props} />,
      'EFormList': () => <EFormList {...props} />,
      'Settings1': () => <Settings1 {...props} />,
      'CreateNewStaff': () => <CreateNewStaff {...props} />,
      'Broadcast': () => <Broadcast {...props} />,
    };

    const ContentComponent = contentMap[activeItem.component];

    return {
      title: activeItem.label,
      description: getPageDescription(activeItem.id),
      component: ContentComponent ? <ContentComponent /> : <div>Content not found</div>
    };
  };

  const getPageDescription = (pageId) => {
    const descriptions = {
      dashboard: 'Overview of your clinic activities and statistics',
      patients: 'Manage patient approvals and demographic information',
      email: 'Monitor email delivery status and communication logs',
      eforms: 'Manage electronic forms and templates',
      settings: 'Configure clinic settings and preferences',
      staff: 'Add and manage staff members',
    };
    return descriptions[pageId] || '';
  };

  if (loading) {
    return (
      <ThemeProvider theme={professionalTheme}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const navigationItems = getNavigationItems(clinicInfo.userType);

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* App Bar */}
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: "24px" }}>
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

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Typography component="h1" variant="h6" color="inherit" noWrap>
                {clinicInfo.userType ==='doctor' &&(
                  'Dr. '
                )}
                {clinicInfo.name || 'Dashboard'}
              </Typography>
              {clinicInfo.userType && (
                <Chip
                  label={clinicInfo.userType.charAt(0).toUpperCase() + clinicInfo.userType.slice(1)}
                  size="small"
                  sx={{ ml: 2, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              )}
            </Box>

            <LoginMenu username={clinicInfo.username} />
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
              backgroundColor: (theme) => theme.palette.grey[50],
            }}
          >
            {open && (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pl: 2 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1, backgroundColor: 'primary.main' }}>
                  {clinicInfo.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle2" noWrap>
                  {clinicInfo.username}
                </Typography>
              </Box>
            )}
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>

          <Divider />

          <List component="nav" sx={{ pt: 1 }}>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <ListItem key={item.id} disablePadding>
                  <StyledListItem
                    active={isActive}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <ListItemIcon>
                      {item.hasBadge && newDemographic > 0 ? (
                        <Badge badgeContent={newDemographic} color="error">
                          <IconComponent />
                        </Badge>
                      ) : (
                        <IconComponent />
                      )}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.label} />}
                  </StyledListItem>
                </ListItem>
              );
            })}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[50],
            flexGrow: 1,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar />
          <ContentArea>
            {(() => {
              const content = renderContent();
              return (
                <>
                  {/* Content Header */}
                  {/*<ContentHeader>*/}
                  {/*  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>*/}
                  {/*    <Box>*/}
                  {/*      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>*/}
                  {/*        {content.title}*/}
                  {/*      </Typography>*/}
                  {/*      <Typography variant="body2" color="text.secondary">*/}
                  {/*        {content.description}*/}
                  {/*      </Typography>*/}
                  {/*    </Box>*/}
                  {/*    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>*/}
                  {/*      <Chip*/}
                  {/*        label={new Date().toLocaleDateString()}*/}
                  {/*        size="small"*/}
                  {/*        variant="outlined"*/}
                  {/*        sx={{ backgroundColor: 'background.paper' }}*/}
                  {/*      />*/}
                  {/*      {activeTab === 'patients' && newDemographic > 0 && (*/}
                  {/*        <Chip*/}
                  {/*          label={`${newDemographic} New`}*/}
                  {/*          size="small"*/}
                  {/*          color="error"*/}
                  {/*          sx={{ backgroundColor: 'error.main', color: 'white' }}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    </Box>*/}
                  {/*  </Box>*/}
                  {/*</ContentHeader>*/}

                  {/* Content Body */}
                  <ContentBody>
                    <Box
                      sx={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Scrollable content container */}
                      <Box
                        sx={{
                          flex: 1,
                          overflow: 'auto', // Enable scrolling here
                          width: '100%',
                          minHeight: 0, // Important for flex scrolling
                        }}
                      >
                        {/* Content wrapper with optional padding */}
                        <Box
                          sx={{
                            minHeight: '100%',
                            width: '100%',
                            // Add minimal padding for content that needs it
                            padding: { xs: 1, sm: 2 },
                          }}
                        >
                          {content.component}
                        </Box>
                      </Box>
                    </Box>
                  </ContentBody>
                </>
              );
            })()}
          </ContentArea>
        </Box>
      </Box>

      <HelmetComponent />
    </ThemeProvider>
  );
}