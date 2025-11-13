// src/components/clinicInfo.js
import API_BASE_PATH from "../../apiConfig";

import React, {useState, useEffect, useRef} from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardActionArea, Box, useTheme, useMediaQuery,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";

import {Grid, Card, CardContent, Typography, CardHeader} from "@mui/material";
import Layout from "./Layout";
import "./css/Marquee.css";

import {formatDob, formatHin, redirectHomeM} from "./resources/utils";
import HelmetComponent from "./SEO/HelmetComponent";
import NdLoader from "nd_health/components/resources/Ndloader";

import hcv_with_version_code from "../assets/images/hcv_version_code.png";
import MKTypography from "components/MKTypography";
import GoHome from "./resources/GoHome";
import Divider from "@mui/material/Divider";
import MKButton from "../../components/MKButton";
import PdfViewer from "./resources/PdfViewer";

const Lab = () => {
  const {clinicSlug} = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [locationsData, setLocations] = useState(null);
  const [buttonpressed, setButtonPressed] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [hin, setHin] = useState("");
  const [dob, setDob] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [notice, setNotice] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);

  // PDF related state
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const dobRef = useRef(null);

  const [hcvValidate, setHcvValidate] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [submitbutton, setSubmitbutton] = useState(true);

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
      fetchClinicInfo().then(r => {
      });
      setClinicInfoFetched(true);
    }
  }, [clinicSlug, hin, locationsData, clinicInfoFetched]);

  const handleHinChange = (e) => {
    const formattedHin = formatHin(e.target.value);
    setHin(formattedHin);

    if (formatHin(hin).length > 11 && dobRef.current) {
      dobRef.current.focus();
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `lab_results_${hin.replace(/\D/g, '')}_${dob.replace(/\D/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRequest = async () => {
    try {
      setHcvValidate(false);
      setSubmitbutton(false);
      if (hin.length < 12 || dob.length < 10) {
        setSubmitbutton(true);
        setModalContent("Please enter your health-card number and date of birth.");
        setOpenModal(true);
        setButtonPressed(true);
        return;
      }
      setButtonPressed(false);

      const url = `${API_BASE_PATH}/doctors/${dob.replace(/\//g, "")}/${hin.replace(
        /\//g,
        "",
      )}/${clinicSlug}/lab/`;

      const response = await fetch(url);

      // Check if response is PDF
      const contentType = response.headers.get('content-type');
      console.log(`contentType:${contentType}`);
      console.log(`contentType.includes('application/pdf'):${contentType.includes('application/pdf')}`);
      if (contentType && contentType.includes('application/pdf')) {
        // Handle PDF response

        const blob = await response.blob();
        const pdfObjectUrl = URL.createObjectURL(blob);
        setPdfUrl(pdfObjectUrl);
        setShowPdfModal(true);
        setButtonPressed(true);
      } else {
        // Handle JSON response (existing logic)
        const data = await response.json();
        if (data.status === "success") {
          // Handle success case
        } else if (data.vld && data.vld.data && data.vld.data.payment === "no") {
          setHcvValidate(true);
        } else if (data.status === "failed") {
          setModalContent(data.message);
          setOpenModal(true);
          setButtonPressed(true);
        }
      }
      setSubmitbutton(true);
    } catch (error) {
      console.error("Error fetching lab results:", error);
      setModalContent("An Error occurred while fetching your lab results. Please try again.");
      setOpenModal(true);
      setButtonPressed(true);
      setSubmitbutton(true);
    }
  };

  const handleHCVDialog = () => {
    setOpenModal(false);
    setHcvValidate(false);
    setInputValue("");
    window.location.reload();
  };

  const updateVersionCode = async () => {
    setSubmitbutton(false);
    setHcvValidate(false);
    try{
      const response = await fetch(`${API_BASE_PATH}/updateHCV/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hin: hin,
          dob: dob,
          clinicSlug: clinicSlug,
          newversion: inputValue,
          update: true,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setModalContent(data.message);
        setOpenModal(true);
        setButtonPressed(true);
        setHcvValidate(false);
        setInputValue("");
      } else if (data.status === "failed") {
        setModalContent(data.message);
        setOpenModal(true);
        setButtonPressed(true);
        setHcvValidate(false);
        setInputValue("");
      }
    } catch {

    } finally {
      setSubmitbutton(true);
    }
  };

  const changeVersionCode = (event) => {
    let value = event.target.value.toUpperCase();
    value = value.replace(/[^A-Z]/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    setInputValue(value);
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <HelmetComponent/>

        {clinicInfo ? (
          <>
            <Grid item xs={12} md={8}>
              <MKTypography fontWeight={"bold"} color={"black"}>
                See your latest lab if you are patient at {clinicInfo.name}
              </MKTypography>
              <Card>
                {notice && (
                  <Grid item xs={12} md={12}>
                    <Typography style={{color: "red", fontSize: "1rem", padding: "0.8rem"}}>
                      <strong>Please note:</strong> {clinicInfo.name} does not create or control your lab results, and we are not responsible for any delays or issues with them. We simply provide this service to make it easier for you to view your results. Our goal is to support you by giving you convenient access to your information.
                    </Typography>
                  </Grid>
                )}

                <GoHome clinicSlug={clinicSlug}/>

                <CardHeader
                  title="Verify Your Identity"
                  titleTypographyProps={{style: {fontSize: "1rem", fontWeight: "bold"}}}
                />

                <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingTop={-1}>
                  <Grid item xs={12}>
                    <TextField
                      label="Health Card Number"
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
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      style={{color: "red", fontSize: "0.8rem", fontWeight: "bold"}}
                    >
                      In case of emergency, do not use this service, please call 911 or go to the
                      nearest emergency department.
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="info"
                      variant="contained"
                      disabled={!buttonpressed}
                      onClick={handleRequest}
                      fullWidth
                      style={{
                        maxWidth: "100%",
                        height: "100%",
                        fontSize: "1rem",
                        fontWeight: "bold"
                      }}
                    >
                      See latest lab result
                    </Button>
                  </Grid>
                </Grid>
                <Divider/>

              </Card>

            </Grid>
            <Grid item xs={12} md={8}></Grid>
          </>
        ) : (
          <p>Loading...</p>
        )}

        {/* Existing Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>{modalContent}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* PDF Display Modal */}


        {/* HCV Validation Dialog */}
        <Dialog open={hcvValidate} onClose={handleHCVDialog}>
          <DialogTitle sx={{color: "red"}}>Health Card Expired</DialogTitle>
          <DialogTitle sx={{color: "primary"}}>
            Your health card is not valid for booking an appointment. Please update it with the new
            version code to proceed.
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Enter the two-digit new version code to update your health card"
              value={inputValue}
              onChange={changeVersionCode}
              fullWidth
              InputProps={{
                inputProps: {
                  style: {fontSize: "1rem"},
                },
              }}
              InputLabelProps={{
                style: {fontSize: "0.7rem"},
              }}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "0.7rem",
                },
                marginTop: "1rem",
              }}
            />
          </DialogContent>
          <DialogContent>
            <img
              alt="hcv-validation-check"
              src={hcv_with_version_code}
              style={{marginTop: "20px", maxWidth: "100%"}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleHCVDialog} variant="contained" color={"error"}>Close</Button>
            <Button onClick={updateVersionCode} disabled={inputValue.length!==2} variant="contained" color={"info"}>Update</Button>
          </DialogActions>
        </Dialog>

        {!submitbutton && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <NdLoader size="lg" variant="solid" value={70} color="primary"/>
          </div>
        )}
      </div>
      <PdfViewer
        open={showPdfModal}
        onClose={handleClosePdfModal}
        pdfUrl={pdfUrl}
        title="Lab Results"
        filename={`lab_results_${hin.replace(/\D/g, '')}_${dob.replace(/\D/g, '')}.pdf`}
      />
    </Layout>
  );
};

export default Lab;