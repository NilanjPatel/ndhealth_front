// src/components/clinicInfo.js
import API_BASE_PATH from "../../../apiConfig";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardActionArea,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { Grid, Card, CardContent, Typography, CardHeader } from "@mui/material";

import Layout from "../Layout";
import "./../css/Marquee.css";
import { formatDob, formatHin, getTimezone, redirectHomeM } from "../resources/utils";
import HelmetComponent from "./../SEO/HelmetComponent";
import { red } from "@mui/material/colors";
import MKButton from "../../../components/MKButton";
import Breadcrumbs from "../../../examples/Breadcrumbs";
import Icon from "@mui/material/Icon";

const RecordOauth = () => {
  // const location = useLocation();
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [buttonpressed, setButtonPressed] = useState(true);
  const navigate = useNavigate();

  // const pathSegments = location.pathname.split('/');
  // const clinicSlugcurrent = clinicSlug || pathSegments[pathSegments.indexOf('clinic') + 1]
  const [hin, setHin] = useState("");
  const [dob, setDob] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  // const [appointmentData, setAppointmentData] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);

  const [doctorsMsgDisplay, setDoctorsMsg] = useState("none");
  const [authformdisplay, setAuthformdisplay] = useState("block");

  const [secureFileData, setSecureFileData] = useState(null);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgbody, setMsgBody] = useState("");
  const [msgMessage, setMsgMessage] = useState("");
  const [msgfirstName, setFirstName] = useState("");
  const [msgExpiration_date, seteExpiration_date] = useState("");
  const [msgUrls, setUrls] = useState([]);

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

    // Check if the formatted HIN is 12 characters and move focus to the DOB field
    if (formatHin(hin).length === 12 && dobRef.current) {
      dobRef.current.focus();
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleRequest = async () => {
    try {
      // Make a request with clinicSlug, hin, and dob
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
      // Handle the response as needed

      const data = await response.json();
      if (data.status === "success") {
        // navigate(`/clinic-forms/${clinicSlug}`, {state: {demo: data.demo, clinicInfo: clinicInfo,}}); // TODO change the demo
        setDoctorsMsg("block");
        setSecureFileData(data);
        setMsgTitle("Please Note :" + " " + data.title);
        setMsgBody(data.body);
        seteExpiration_date(data.expiration_date);
        setFirstName(data.firstName);
        setUrls(data.urls);
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

  return (
    <Layout clinicInfo={clinicInfo}>
      <div style={{ display: authformdisplay }}>
        <HelmetComponent />

        {clinicInfo ? (
          <>
            {/* <h3>Book appointment at {clinicInfo.name}</h3> */}
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
                    inputRef={dobRef} // Assigning the ref to the Date of Birth field
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

            {/* <Grid container spacing={2} > */}

            <div style={{ top: "0", right: "0", padding: "8px" }}>
              <Link to={`/clinic/${clinicSlug}/policy`} style={{ color: "black" }}>
                Clinic Policy
              </Link>
            </div>

            {/* </Grid> */}
          </>
        ) : (
          <p>Loading...</p>
        )}

        {/* Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>{modalContent}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>

      {secureFileData ? (

        <div style={{ display: doctorsMsgDisplay }}>
          <HelmetComponent />
          {secureFileData.deleted ? (
            <Typography variant="body1" sx={{ fontWeight: "bold", color: red[900] }} paragraph>
              {secureFileData.message}
            </Typography>
          ) : (
            <Typography variant="h4" gutterBottom>
              Message from {secureFileData.sender} for You
            </Typography>
          )}
          <Card sx={{ padding: "1.5rem", boxShadow: 3 }}>
            <Grid container spacing={2} paddingX={2}>
              <Grid item xs={12} md={12}>
                <Breadcrumbs
                  routes={[
                    { label: "Home", route: `/clinic/${clinicSlug}/`, icon: <Icon>home</Icon> },
                    { label: "Doctor's message", icon: <Icon>message</Icon> },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                {secureFileData.deleted ? (
                  <></>
                ) : (
                  <Typography variant="body1" paragraph>
                    Message :
                  </Typography>
                )}
                <Typography variant="body1" paragraph>
                  {msgbody}
                </Typography>
              </Grid>

              {msgUrls.length > 0 && (
                <Grid item xs={12}>
                  {/*{msgUrls.map((url1, index) => (*/}
                  {/*    <div key={index} style={{marginTop: '10px'}}>*/}
                  {/*        <a*/}
                  {/*            href={url1}*/}
                  {/*            onClick={(e) => handledownload(e, url1)}*/}
                  {/*            style={{textDecoration: 'none', color: '#3f51b5', fontWeight: 'bold'}}*/}
                  {/*        >*/}
                  {/*            {msgUrls.length > 1 ? `Download File ${index + 1}` : `Download File`}*/}
                  {/*        </a>*/}
                  {/*    </div>*/}
                  {/*))}*/}
                  {msgUrls.map((url1, index) => (
                    <div key={index} style={{ marginTop: "10px" }}>
                      <a
                        href={url1}
                        download
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "#3f51b5", fontWeight: "bold" }}
                        target="_blank"
                      >
                        {msgUrls.length > 1 ? `Download File ${index + 1}` : `Download File`}
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
                  {msgTitle}
                </Typography>
              </Grid>
            </Grid>
          </Card>
          {/* <Grid container spacing={2} > */}
          <div style={{ top: "0", right: "0", padding: "8px" }}>
            <Link to={`/clinic/${clinicSlug}/policy`} style={{ color: "black" }}>
              Clinic Policy
            </Link>
          </div>
          {/* </Grid> */}
        </div>
      ) : (
        <div></div>
      )}
    </Layout>
  );
};

export default RecordOauth;
