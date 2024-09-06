import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { blue, deepPurple, green, teal } from "@mui/material/colors";
import Layout from "../../Layout";
import HelmetComponent from "../../SEO/HelmetComponent";
import API_BASE_PATH from "apiConfig";
import { FaWpforms } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { alpha } from "@mui/material/styles";

// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";

const ClinicLanding = () => {
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  // const [locationsData, setLocations] = useState(null);
  const [notice, setNotice] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [submitbutton] = useState(true);
  const navigate = useNavigate();

  // Function to invert a hex color
  function invertColor(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse the r, g, b values
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);

    // Invert each color component
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    // Convert back to hex and return
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
        const data = await response.json();
        setClinicInfo(data.clinic);
        // setLocations(data.locations);
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

  const cardData = [
    {
      name: "Appointment",
      description: "Schedule / Cancel",
      icon: <MdOutlineDateRange sx={{ height: 38, width: 38 }} />,
      onClick: () => navigate(`/clinic/${clinicSlug}/appointment`),
      backgroundcolor: green[400],
      title_font_color: "black",
      description_color: invertColor(alpha(green[400], 1)),
    },
    {
      name: "Fill Form",
      description: "Find forms assigned to you.",
      icon: <FaWpforms sx={{ height: 38, width: 38 }} />,
      onClick: () => navigate(`/EformOauth/${clinicSlug}/`),
      backgroundcolor: blue[400],
      title_font_color: "black",
      description_color: invertColor(alpha(blue[400], 1)),
    },
    {
      name: "Patient Registration",
      description: "If you are new patient to our clinic, register first.",
      icon: <ImProfile sx={{ height: 38, width: 38 }} />,
      onClick: () => navigate(`/patient/${clinicSlug}/requestpatientprofile`),
      backgroundcolor: deepPurple[400],
      title_font_color: "black",
      description_color: invertColor(alpha(deepPurple[400], 1)),
    },
    {
      name: "Update Profile",
      description: "Update you new/updated information, like address",
      icon: <CgProfile sx={{ height: 38, width: 38 }} />,
      onClick: () => navigate(`/clinic/${clinicSlug}/UpdateProfileOauth`),
      backgroundcolor: teal[400],
      title_font_color: "black",
      description_color: invertColor(alpha(teal[400], 1)),
    },
  ];

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <HelmetComponent />
        {clinicInfo ? (
          <>
            <h3>Welcome to {clinicInfo.name}</h3>
            <Card variant={"outlined"}>
              {notice && (
                <Grid item xs={12} md={12}>
                  <MKTypography
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "0.8rem",
                    }}
                  >
                    Clinic Notice: {notice}
                  </MKTypography>
                </Grid>
              )}
              <Grid container spacing={2} paddingLeft={2} paddingRight={2}>
                {cardData.map((card, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      variant="outlined"
                      onClick={card.onClick}
                      sx={{
                        height: "100%",
                        backgroundColor: card.backgroundcolor,
                        "&:hover .icon-button": {
                          transform: "scale(1.4)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            component="div"
                            variant="h5"
                            style={{
                              fontWeight: "bold",
                              color: card.title_font_color,
                            }}
                          >
                            {card.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                            style={{ color: card.description_color, fontWeight: "bold" }}
                          >
                            {card.description}
                          </Typography>
                        </CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pb: 1,
                          }}
                        >
                          <IconButton
                            className="icon-button"
                            style={{
                              fontSize: "3rem",
                              color: "white",
                              fontWeight: "bolder",
                              transition: "transform 0.3s",
                            }}
                            aria-label={card.name}
                            onClick={card.onClick}
                          >
                            {card.icon}
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <CardActionArea>
                <CardContent>
                  <Button
                    variant="contained"
                    href="https://www.youtube.com/watch?v=N00wcFxDuRw"
                    target="_blank"
                    style={{ fontSize: "1rem", fontWeight: "bold", color: "white" }}
                  >
                    Learn how to book an appointment, click here.
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
            <div style={{ top: "0", right: "0", padding: "8px" }}>
              <Link
                to={`/clinic/${clinicSlug}/policy`}
                style={{ color: "black", fontWeight: "bold" }}
              >
                Clinic Policy
              </Link>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {!submitbutton && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress size="lg" variant="solid" value={70} color="primary" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClinicLanding;
