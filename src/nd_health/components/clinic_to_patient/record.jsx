import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  Typography,
  CardHeader,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import "./../css/Marquee.css";
import { formatDob, formatHin } from "../resources/utils";
import HelmetComponent from "./../SEO/HelmetComponent";
import { red } from "@mui/material/colors";
import MKButton from "../../../components/MKButton";
import Breadcrumbs from "../../../examples/Breadcrumbs";
import Icon from "@mui/material/Icon";
import API_BASE_PATH from "../../../apiConfig";

const RecordOauth = () => {
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [buttonpressed, setButtonPressed] = useState(true);
  const [hin, setHin] = useState("");
  const [dob, setDob] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [doctorsMsgDisplay, setDoctorsMsg] = useState("none");
  const [authformdisplay, setAuthformdisplay] = useState("block");
  const [secureFileData, setSecureFileData] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null); // Track expanded message
  const dobRef = useRef(null);

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
        const data = await response.json();
        setClinicInfo(data.clinic);
      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };

    if (!clinicInfoFetched) {
      fetchClinicInfo();
      setClinicInfoFetched(true);
    }
  }, [clinicSlug, hin, clinicInfoFetched]);

  const handleHinChange = (e) => {
    const formattedHin = formatHin(e.target.value);
    setHin(formattedHin);

    if (formatHin(hin).length === 12 && dobRef.current) {
      dobRef.current.focus();
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRequest = async () => {
    try {
      if (hin === "" || dob === "") {
        setModalContent("Please enter your health-card number and date of birth.");
        setOpenModal(true);
        setButtonPressed(true);
        return;
      }
      setButtonPressed(false);

      const url = `${API_BASE_PATH}/patient-access-file/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ healthcard: hin, birthday: dob, clinic_id: clinicInfo.id }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setDoctorsMsg("block");
        const sortedData = data.data.sort((a, b) => b.id - a.id);
        setSecureFileData(sortedData);
        setAuthformdisplay("none");
      } else if (data.status === "failed") {
        setModalContent(data.message);
        setOpenModal(true);
        setButtonPressed(true);
      }
    } catch (error) {
      console.error("Error making request:", error, hin);
      setButtonPressed(true);
    }
  };

  const handledownload = (e, url1) => {
    e.preventDefault();
    const userChoice = window.confirm(
      "Do you want to open this file in a new tab? Click \"Cancel\" to download.",
    );
    if (userChoice) {
      window.open(url1, "_blank", "noopener,noreferrer");
    } else {
      const link = document.createElement("a");
      link.href = url1;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const toggleMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div style={{ display: authformdisplay }}>
        <HelmetComponent />

        {clinicInfo ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Secure access for your message and report from {clinicInfo.name}
            </Typography>

            <Card sx={{ padding: "1.5rem", boxShadow: 3 }}>
              <Grid item xs={12} md={12}>
                <Breadcrumbs
                  routes={[
                    { label: "Home", route: `/clinic/${clinicSlug}/`, icon: <Icon>home</Icon> },
                    { label: "Access Doctor's message", icon: <Icon>message</Icon> },
                  ]}
                />
              </Grid>
              <CardHeader
                title="Verify Your Identity"
                titleTypographyProps={{ style: { fontSize: "1rem", fontWeight: "bold" } }}
              />

              <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingTop={-1}>
                <Grid item xs={12}>
                  <TextField
                    label="Health Card Number - 10 digits only"
                    value={formatHin(hin)}
                    onChange={handleHinChange}
                    inputMode="numeric"
                    placeholder="1234-567-890"
                    fullWidth
                    type="tel"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Date of Birth - YYYY-MM-DD"
                    value={formatDob(dob)}
                    onChange={(e) => setDob(e.target.value)}
                    inputMode="numeric"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    type="tel"
                    inputRef={dobRef}
                  />
                </Grid>

                <Grid item xs={6}>
                  <MKButton
                    color="info"
                    variant="contained"
                    disabled={!buttonpressed}
                    onClick={handleRequest}
                    fullWidth
                  >
                    Submit
                  </MKButton>
                </Grid>
              </Grid>
            </Card>

          </>
        ) : (
          <p>Loading...</p>
        )}

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>{modalContent}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
      {secureFileData.length > 0 && (
        <Card sx={{ padding: "1.5rem", boxShadow: 3, marginBottom: "20px" }}>
          <Grid container spacing={2} paddingX={2}>
            <Grid item xs={12} md={12}>
              <Breadcrumbs
                routes={[
                  { label: "Home", route: `/clinic/${clinicSlug}/`, icon: <Icon>home</Icon> },
                  { label: "Doctor's message", icon: <Icon>message</Icon> },
                ]}
              />
            </Grid>
          </Grid>
        </Card>
      )}
      {secureFileData.length > 0 && (
        <div style={{ display: doctorsMsgDisplay }}>
          <HelmetComponent />
          {secureFileData.map((message, index) => {
            const date = new Date(message.created_at);
            const formattedDate = date.toISOString().split("T")[0]; // Extracts the date part

            return (
              <Card key={index} sx={{ padding: "1.5rem", boxShadow: 3, marginBottom: "20px" }}>
                <Grid container spacing={2} paddingX={2}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      onClick={() => toggleMessage(message.id)}
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                      {formattedDate} - {message.deleted ? "Expired" : "Active"}
                    </Typography>
                    {expandedMessageId === message.id && (
                      <>
                        <Typography variant="body1" paragraph>
                          {message.deleted ? (
                            <span style={{ color: red[900] }}>{message.message}</span>
                          ) : (
                            <>
                              <Typography variant="h4" gutterBottom>
                                Message from {message.sender} for You
                              </Typography>
                              <Typography variant="body1" paragraph>
                                {message.body}
                              </Typography>
                            </>
                          )}
                        </Typography>

                        {message.urls && message.urls.length > 0 && (
                          <Grid item xs={12}>
                            {message.urls.map((url1, index) => (
                              <div key={index} style={{ marginTop: "10px" }}>
                                <a
                                  href={url1}
                                  download
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: "none", color: "#3f51b5", fontWeight: "bold" }}
                                  target="_blank"
                                >
                                  {message.urls.length > 1 ? `Download File ${index + 1}` : `Download File`}
                                </a>
                              </div>
                            ))}
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Typography color="textSecondary">
                            If you want to book follow-up Appointment with doctor please click here{" "}
                            <Link to={`/clinic/${clinicSlug}/`} style={{ color: "black" }}>
                              Book Appointment.
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" paragraph color="error">
                            {message.title}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Card>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default RecordOauth;