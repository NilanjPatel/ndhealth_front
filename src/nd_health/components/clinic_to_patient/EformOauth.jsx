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

import Layout from "nd_health/components/Layout";
import "nd_health/components/css/Marquee.css";
import { formatDob, formatHin, redirectHomeM } from "../resources/utils";
import HelmetComponent from "./../SEO/HelmetComponent";
import NotificationDialog from "../resources/Notification";
// import MKTypography from "../../../components/MKTypography";
// import MKBox from "../../../components/MKBox";
import MKButton from "../../../components/MKButton";
import GoHome from "../resources/GoHome";

const EformOauth = () => {
  // const location = useLocation();
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [buttonpressed, setButtonPressed] = useState(true);
  const navigate = useNavigate();

  // const pathSegments = location.pathname.split('/');
  // const clinicSlugcurrent = clinicSlug || pathSegments[pathSegments.indexOf('clinic') + 1]
  const [hin, setHin] = useState("");
  const [dob, setDob] = useState("");

  // const [appointmentData, setAppointmentData] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

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
      fetchClinicInfo().then(r => {});
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
        handleFailure("Please enter your health-card number and date of birth.");
        setButtonPressed(true);

        return;
      }
      setButtonPressed(false);

      const url = `${API_BASE_PATH}/doctors/${dob.replace(/\//g, "")}/${hin.replace(/\//g, "")}/${clinicSlug}/eform/`;
      const response = await fetch(url);
      // Handle the response as needed

      const data = await response.json();
      if (data.status === "success") {
        navigate(`/clinic-forms/${clinicSlug}`, {
          state: { demo: data.demo, clinicInfo: clinicInfo },
        }); // TODO change the demo
      } else if (data.status === "failed") {
        setButtonPressed(true);
        handleFailure(data.message);
      }
    } catch (error) {
      console.error("Error making request:", error, hin);
      setButtonPressed(true);
    }
  };

  // const handleSuccess = (message) => {
  //   setModalContent(message);
  //   setIsError(false);
  //   setOpenModal(true);
  // };
  const handleFailure = (message) => {
    setModalContent(message);
    setIsError(true);
    setOpenModal(true);
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <HelmetComponent />

        {clinicInfo ? (
          <>
            {/* <h3>Book appointment at {clinicInfo.name}</h3> */}
            <h3>Find forms assigned to you</h3>
            <Card>

              <GoHome clinicSlug={clinicSlug}/>
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
              <CardActionArea>
                <CardContent></CardContent>
              </CardActionArea>
            </Card>

            {/* <Grid container spacing={2} > */}



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

      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
    </Layout>
  );
};

export default EformOauth;
