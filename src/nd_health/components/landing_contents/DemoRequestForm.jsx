import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardActions,
  InputLabel,
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// import book_demo from "../../images/book_demo.gif";
import API_BASE_PATH from "../../../apiConfig";

import { formatDob, formatHin } from "nd_health/components/resources/utils";

const DemoRequestForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    contactPerson: "",
    clinicName: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    // Your existing useEffect logic, including clearInterval

    // Include Calendly script
    const head = document.querySelector("head");
    const calendlyScript = document.createElement("script");
    calendlyScript.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js");
    head.appendChild(calendlyScript);

    // Clean up the Calendly script when the component is unmounted
    return () => {
      head.removeChild(calendlyScript);
    };
  }, []); // Ensure the effect runs only once on mount

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleInputChange = (field, value) => {
    let formattedValue = value;

    // Check if the field is 'phone' and apply phone number formatting
    if (field === "phone") {
      value = formatHin(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Email validation
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(value);

      if (!isValidEmail) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your API here to submit the form data
    try {
      const response = await fetch(`${API_BASE_PATH}/clinic-reg/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // const data = await response.json();
      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        setOpenModal(true);
        setModalContent(
          "Thank you for trusting ND Health. You successfully booked a demo, In shourt time we will contact with you."
        );
        setFormData({
          phone: "",
          email: "",
          contactPerson: "",
          clinicName: "",
        });
        setEmailError("");
        //  also clear contents of other all the form fields
      } else {
        // Handle Error response from the server
        setOpenModal(true);
        setModalContent("Please correct the information you entered and try again.");
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      setOpenModal(true);
      setModalContent("Please correct the information you entered and try again.");
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={3}
          style={{ paddingTop: "2rem", display: "flex", justifyContent: "center" }}
        >
          {/* <Grid item xs={12} md={6}>
                        <img src={book_demo} alt="ND Health, book online family and walkin appointment" style={{ width: '100%', height: 'auto' }} />
                    </Grid> */}

          <Grid item xs={12} md={12}>
            <Card
              sx={{
                width: "100%",
                height: "100%",
                marginBottom: 2,
                borderRadius: "1rem",
                backgroundColor: "transparent",
              }}
            >
              {/* <CardHeader title="Book Demo for free" fontSize="large"> */}
              {/* </CardHeader> */}
              <Grid container spacing={2} padding={2}>
                <div
                  className="calendly-inline-widget"
                  data-url="https://calendly.com/nd-health"
                  style={{ minWidth: "320px", height: "580px" }}
                ></div>

                {/* <Grid item xs={12}>
                                    <Typography variant="h4" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold', }}>
                                        Book a demo
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Clinic Name"
                                        placeholder='Clinic Name'
                                        fullWidth
                                        required
                                        value={formData.clinicName}
                                        onChange={(e) => handleInputChange('clinicName', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Contact Person Name"
                                        placeholder='Contact Person Name'
                                        fullWidth
                                        required
                                        value={formData.contactPerson}
                                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Phone Number"
                                        placeholder='Phone Number'
                                        fullWidth
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email Address"
                                        placeholder='Email Address'
                                        fullWidth
                                        required
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        Error={Boolean(emailError)}
                                        helperText={emailError}
                                    />
                                </Grid>


                                <Grid item xs={12} style={{ textAlign: 'center', paddingTop: '1rem' }}>
                                    <Button type="submit" variant="contained" color="primary" style={{ textAlign: 'center' }}>
                                        Submit
                                    </Button>
                                </Grid> */}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </form>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DemoRequestForm;
