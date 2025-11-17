import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { blue, blueGrey, deepPurple, green, lightBlue, lime, teal } from "@mui/material/colors";
import Layout from "../../Layout";
import HelmetComponent from "../../SEO/HelmetComponent";
import API_BASE_PATH from "apiConfig";
import { FaWpforms } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { ImLab, ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";

// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";
import Container from "@mui/material/Container";
import MKBox from "../../../../components/MKBox";
import colors from "assets/theme/base/colors";
// Material Kit 2 PRO React Examples
import SimpleInfoCard from "examples/Cards/InfoCards/SimpleInfoCard";
import DefaultBlogCard from "examples/Cards/BlogCards/DefaultBlogCard";
import Divider from "@mui/material/Divider";
import cyan from "@mui/material/colors/cyan";

const ClinicLanding = () => {
  const headerRef = useRef(null);
  const typedJSRef = useRef(null);
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [locationsData, setLocations] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationColor, setLocationColor] = useState(null);
  const [notice, setNotice] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [submitbutton] = useState(true);
  const navigate = useNavigate();
  const [clinic_locations_multiple] = useState("We provide services at the following location(s):");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // Function to invert a hex color
  function invertColor(hex) {
    hex = hex.replace(/^#/, "");
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
        const data = await response.json();
        setClinicInfo(data.clinic);
        setLocations(data.locations);
        if (data.notices) {
          const notices = [];
          for (let i = 0; i < data.notices.length; i++) {
            if (data.notices[i]) {
              notices.push(data.notices[i]);
              setNotice(notices.join(" | "));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };

    if (!clinicInfoFetched) {
      fetchClinicInfo();
      setClinicInfoFetched(true);
    }
  }, [clinicSlug, clinicInfoFetched]);

  const handleLocationClick = (location) => {
    const locationId = location.id;
    setSelectedLocation(selectedLocation === locationId ? null : locationId);
    setLocationColor(location.color);
  };

  const handleClose = () => {
    setSelectedLocation(null);
  };

  const cardData = [
    {
      name: "Appointment",
      description: "Schedule, check, Cancel",
      icon: <MdOutlineDateRange />,
      onClick: () => navigate(`/clinic/${clinicSlug}/appointment`),
      backgroundcolor: green[400],
      title_font_color: "white",
      description_color: "rgba(255,255,255,0.9)",
    },
    {
      name: "Update Profile",
      description: "Update your information, like address or version code",
      icon: <CgProfile />,
      onClick: () => navigate(`/clinic/${clinicSlug}/UpdateProfileOauth`),
      backgroundcolor: blue[400],
      title_font_color: "white",
      description_color: "rgba(255,255,255,0.9)",
    },
    {
      name: "Fill Form",
      description: "Find forms assigned to you.",
      icon: <FaWpforms />,
      onClick: () => navigate(`/EformOauth/${clinicSlug}/`),
      backgroundcolor: deepPurple[400],
      title_font_color: "white",
      description_color: "rgba(255,255,255,0.9)",
    },
    {
      name: "Patient Registration",
      description: "If you are new patient to our clinic, register first.",
      icon: <ImProfile />,
      onClick: () => navigate(`/patient/${clinicSlug}/requestpatientprofile`),
      backgroundcolor: teal[400],
      title_font_color: "white",
      description_color: "rgba(255,255,255,0.9)",
    },
    {
      name: "Lab Result",
      description: "Lab results are available only to patients of our clinic.",
      icon: <ImLab />,
      onClick: () => navigate(`/clinic/${clinicSlug}/lab`),
      backgroundcolor: blueGrey[400],
      title_font_color: "white",
      description_color: "rgba(255,255,255,0.9)",
    },
  ];

  const gotoPolicy = () => {
    navigate(`/clinic/${clinicSlug}/policy`);
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <HelmetComponent />
        {clinicInfo ? (
          <>
            {/* Hero Section with improved mobile responsiveness */}
            <MKBox
              ref={headerRef}
              minHeight={isMobile ? "40vh" : "35vh"}
              width="100%"
              sx={{
                backgroundImage: ({
                                    functions: { linearGradient, rgba },
                                    palette: { gradients },
                                  }) => `${linearGradient(rgba(gradients.dark.main, 0.4), rgba(gradients.dark.state, 0.9))}, url(${clinicInfo.clinicPhoto})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "grid",
                placeItems: "center",
                borderRadius: isMobile ? "0.5rem" : "1rem",
                mx: 0,
              }}
            >
              <Container maxWidth="lg">
                <Grid
                  container
                  item
                  xs={12}
                  lg={10}
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  sx={{ mx: "auto", textAlign: "center", px: isMobile ? 2 : 0 }}
                >
                  <MKTypography
                    variant={isMobile ? "h3" : "h1"}
                    color="white"
                    sx={{
                      fontSize: isMobile ? "1.8rem" : isTablet ? "2.5rem" : "3rem",
                      fontWeight: "bold",
                      lineHeight: 1.2,
                      mb: 2,
                    }}
                  >
                    Welcome to {clinicInfo.name}
                  </MKTypography>
                  <MKTypography
                    variant="body1"
                    color="white"
                    opacity={0.9}
                    sx={{
                      fontSize: isMobile ? "1rem" : "1.2rem",
                      maxWidth: "600px",
                      lineHeight: 1.6,
                    }}
                  >
                    {clinicInfo.slogan}
                  </MKTypography>
                </Grid>
              </Container>
            </MKBox>

            {/* Main Content Card with improved spacing */}
            <Card sx={{
              p: isMobile ? 1.5 : 3,
              mx: isMobile ? 1 : 3,
              mt: isMobile ? -6 : -8,
              mb: 4,
              backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.95),
              backdropFilter: "saturate(200%) blur(30px)",
              boxShadow: ({ boxShadows: { xxl } }) => xxl,
              borderRadius: isMobile ? "1rem" : "1.5rem",
            }}>
              {/* Notice Section with better mobile styling */}
              {notice && (
                <Box sx={{
                  mb: 3,
                  p: isMobile ? 1.5 : 2,
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 0, 0, 0.3)",
                }}>
                  <MKTypography
                    variant={isMobile ? "body2" : "body1"}
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Clinic Notice:</strong> {notice}
                  </MKTypography>
                </Box>
              )}

              {/* Service Cards with improved mobile layout and centering */}
              <Box sx={{ mb: 4 }}>
                <Grid
                  container
                  spacing={isMobile ? 2 : 3}
                  justifyContent="center"
                  alignItems="stretch"
                >
                  {cardData.map((card, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={3}
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        maxWidth: isMobile ? "400px" : "none",
                        mx: isMobile ? "auto" : 0,
                      }}
                    >
                      <Card
                        variant="outlined"
                        onClick={card.onClick}
                        sx={{
                          width: "100%",
                          maxWidth: isMobile ? "350px" : "none",
                          height: "100%",
                          minHeight: isMobile ? "160px" : "180px",
                          backgroundColor: card.backgroundcolor,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          borderRadius: "1rem",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            "& .icon-button": {
                              transform: "scale(1.2)",
                            },
                          },
                          "&:active": {
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <CardContent sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          p: isMobile ? 2 : 3,
                          textAlign: "center",
                        }}>
                          <Box>
                            <Typography
                              variant={isMobile ? "h6" : "h5"}
                              sx={{
                                fontWeight: "bold",
                                color: card.title_font_color,
                                mb: 1,
                                fontSize: isMobile ? "1.1rem" : "1.3rem",
                              }}
                            >
                              {card.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: card.description_color,
                                fontSize: isMobile ? "0.85rem" : "1rem",
                                lineHeight: 1.4,
                                fontWeight: 600,
                                mb: 2,
                              }}
                            >
                              {card.description}
                            </Typography>
                          </Box>
                          <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}>
                            <IconButton
                              className="icon-button"
                              sx={{
                                fontSize: isMobile ? "2rem" : "2.5rem",
                                color: "white",
                                transition: "transform 0.3s ease",
                                p: 1,
                              }}
                              aria-label={card.name}
                            >
                              {React.cloneElement(card.icon, { style: { color: "white" } })}
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons with improved mobile layout */}
              <Box sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                alignItems: isMobile ? "stretch" : "center",
                justifyContent: "space-between",
              }}>
                <Button
                  variant="contained"
                  href="https://www.youtube.com/watch?v=N00wcFxDuRw"
                  target="_blank"
                  color="info"
                  size={isMobile ? "large" : "medium"}
                  sx={{
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    fontWeight: 500,
                    color: "white",
                    py: isMobile ? 1.5 : 1,
                    borderRadius: "0.5rem",
                    textTransform: "none",
                  }}
                >
                  📹 Learn how to book an appointment
                </Button>
                <Button
                  variant="outlined"
                  onClick={gotoPolicy}
                  size={isMobile ? "large" : "medium"}
                  sx={{
                    borderRadius: "0.5rem",
                    fontWeight: 500,
                    py: isMobile ? 1.5 : 1,
                    textTransform: "none",
                  }}
                >
                  📋 Clinic Policy
                </Button>
              </Box>
            </Card>

            {/* Locations Section with improved mobile design */}
            <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3, mb: 4 }}>
              <MKTypography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                {clinic_locations_multiple}
              </MKTypography>
              <Grid container spacing={isMobile ? 2 : 3}>
                {locationsData &&
                  locationsData.map(
                    (location) =>
                      location.doctorsLocation.length > 0 && (
                        <Grid item key={location.id} xs={12} sm={6} lg={4}>
                          <Card
                            sx={{
                              backgroundColor: location.color,
                              borderRadius: "1rem",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                              },
                            }}
                          >
                            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                              <Typography
                                variant={isMobile ? "h6" : "h5"}
                                sx={{
                                  fontWeight: "bold",
                                  mb: 1,
                                  color: "white",
                                }}
                              >
                                📍 {location.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255,255,255,0.9)",
                                  lineHeight: 1.5,
                                  fontWeight: 500,
                                }}
                              >
                                {location.address}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255,255,255,0.9)",
                                  mt: 0.5,
                                  fontWeight: 500,
                                }}
                              >
                                {location.city}, {location.province}, {location.postal}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ),
                  )}
              </Grid>
            </Container>
          </>
        ) : (
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            flexDirection: "column",
            gap: 2,
          }}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Loading clinic information...
            </Typography>
          </Box>
        )}

        {!submitbutton && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <CircularProgress size={80} />
          </Box>
        )}
      </div>
    </Layout>
  );
};

export default ClinicLanding;

