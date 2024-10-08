import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Popup } from 'reactjs-popup';
import { SfNav } from "react-sf-building-blocks";

import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Modal,
  Box,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { blue, deepPurple, green, lime, teal } from "@mui/material/colors";
import Layout from "../../Layout";
import HelmetComponent from "../../SEO/HelmetComponent";
import API_BASE_PATH from "apiConfig";
import { FaWpforms } from "react-icons/fa6";
import { MdOutlineDateRange } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { alpha } from "@mui/material/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClipboard, faAddressCard, faUser } from "@fortawesome/free-solid-svg-icons";

// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";
import bgImage from "../../../assets/images/maple_clinic.jpg";
import book_appointment from "../../../assets/images/clinic_landing_page/appointment_book.png";
import Container from "@mui/material/Container";
import MKBox from "../../../../components/MKBox";
import colors from "assets/theme/base/colors";
import "./ClinicLanding.css";

const ClinicLanding = (props) => {
  const headerRef = useRef(null);
  const typedJSRef = useRef(null);
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  // const [locationsData, setLocations] = useState(null);
  const [notice, setNotice] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [submitbutton] = useState(true);
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false)
  const [PopUp, setPopUp] = useState(true);

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

  const gotoAppointment = () => {
    navigate(`/clinic/${clinicSlug}/appointment`);
  }
  const gotoProfile = () => {
    navigate(`/clinic/${clinicSlug}/UpdateProfileOauth`);
  }
  const gotoForm = () => {
    navigate(`/EformOauth/${clinicSlug}`);
  }
  const gotoRegister = () => {
    navigate(`/patient/${clinicSlug}/requestpatientprofile`);
  }

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        //add /clinic/${clinicSlug}/ back after Path/clinic  
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
      name: "Book Appointment",
      description: "Schedule or cancel appointments",
      icon: <FontAwesomeIcon icon={faCalendar} sx={{ height: 38, width: 38 }}></FontAwesomeIcon>,
      onClick: () => navigate(`/clinic/${clinicSlug}/appointment`),
      title_font_color: "black",
      description_color: "black",
    },
    {
      name: "Update Profile",
      description: "Update your patient profile information",
      icon: <FontAwesomeIcon icon={faUser} sx={{ height: 38, width: 38 }}></FontAwesomeIcon>,
      onClick: () => navigate(`/clinic/${clinicSlug}/UpdateProfileOauth`),
      title_font_color: "black",
      description_color: "black",
    },
    {
      name: "View Your Forms",
      description: "Find and view your designated forms",
      icon: <FontAwesomeIcon icon={faClipboard} sx={{ height: 38, width: 38 }}></FontAwesomeIcon>,
      onClick: () => navigate(`/EformOauth/${clinicSlug}/`),
      title_font_color: "black",
      description_color: "black",
    },
    {
      name: "Patient Registration",
      description: "If you are new patient to the clinic, register first",
      icon: <FontAwesomeIcon icon={faAddressCard} sx={{ height: 38, width: 38 }}></FontAwesomeIcon>,
      onClick: () => navigate(`/patient/${clinicSlug}/requestpatientprofile`),
      title_font_color: "black",
      description_color: "black",
    },
  ];

  const embedId = `N00wcFxDuRw`;

return (
  <Layout clinicInfo={clinicInfo}>
    {notice && PopUp && (
      <div className="main-popup">
        <Modal
          open={true}
          onClose={() => setPopUp(false)}
          aria-labelledby="clinic-notice-title"
          aria-describedby="clinic-notice-description"
        >
          <Box className="popup-container">
            {/* what user will see in the modal is defined below */}
            <h1>Clinic Notice</h1>
            <h4>{notice}</h4>
            <button onClick={() => setPopUp(false)}>I Understand</button>
          </Box>
        </Modal>
      </div>
    )}
    <HelmetComponent />
      {clinicInfo ? (
        <>
          {/*<h3>Welcome to {clinicInfo.name}</h3>*/}

          <MKBox
            ref={headerRef}
            minHeight="75vh"
            width="100%"
            sx={{
              backgroundImage: ({
                                  functions: { linearGradient, rgba },
                                  palette: { gradients },
                                }) => `${linearGradient(rgba(gradients.dark.main, 0.4), rgba(gradients.dark.state, 0.5))}, url(${bgImage})`,
              backgroundSize: "inherit",
              backgroundPosition: "center",
              display: "grid",
              placeItems: "center",
              borderRadius: "1rem",
            }}
          >
            <Container>
              <Grid
                container
                item
                xs={12}
                lg={8}
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{ mx: "auto", textAlign: "center" }}
              >
                <MKTypography
                  variant="h1"
                  color="white"
                  sx={({ breakpoints, typography: { size } }) => ({
                    [breakpoints.down("md")]: {
                      fontSize: size["3xl"],
                    },
                  })}
                >
                  <span ref={typedJSRef} /> Welcome to {clinicInfo.name}
                </MKTypography>
                <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
                  {clinicInfo.slogan}
                </MKTypography>
                {/*<MKButton color="default" sx={{ color: ({ palette: { dark } }) => dark.main }}>*/}
                {/*  create account*/}
                {/*</MKButton>*/}
              </Grid>
            </Container>
          </MKBox>
          <Card sx={{
              p: 2,
              mx: { xs: 2, lg: 3 },
              mt: -8,
              mb: 4,
              backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
              backdropFilter: "saturate(200%) blur(30px)",
              boxShadow: ({ boxShadows: { xxl } }) => xxl,
            }}>
            <Grid container spacing={1.3} paddingLeft={1.4} paddingRight={1.4}>
              {cardData.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    className="card-layout-container"
                    variant="outlined"
                    onClick={card.onClick}
                    sx={{
                      height: "100%",
                      boxShadow: "0px 10px 8px #999",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          component="div"
                          variant="h4"
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: "19pt",
                            marginBottom: "20px",
                            color: card.title_font_color,
                          }}
                        >
                          {card.name}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          component="div"
                          style={{ color: card.description_color, fontSize: "10pt", textAlign: "center" }}
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
                            fontSize: "34px",
                            color: "black",
                            fontWeight: "bolder",
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
            </Card>
            <div className="additional-information-container">
                  <Button
                    variant="contained"
                    target="_blank"
                    onClick={() => {if (visible === false) setVisible(true) 
                                    else setVisible(false) }}
                    style={{ fontSize: "1rem", fontWeight: "bold", color: "white" }}
                  >
                    Learn how to book an appointment, click here.
                  </Button>
            </div>

            {visible === true &&
              <div className="video-container">
                <iframe
                  width="660"
                  height="370"
                  style={{borderRadius: "20px"}}
                  src={`https://www.youtube.com/embed/${embedId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
              </div>
            }
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
  </Layout>
  );
};

export default ClinicLanding;