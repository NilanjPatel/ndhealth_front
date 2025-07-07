import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Fade,
  FormHelperText,
  TextField,
  colors,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import axios from "axios";
import HelmetComponent from "../../SEO/HelmetComponent";
import Layout from "../../Layout";
import API_BASE_PATH from "../../../../apiConfig";
import { useLocation, useNavigate } from "react-router-dom";

export default function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(null);
  const [message, setMessage] = useState("");
  const [fileType, setFileType] = useState("");  // Changed to empty string initially
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const [clinicInfo, setClinicInfo] = useState(null);
  const clinicInfo1 = location.state && location.state.clinicInfo;
  const [clinicName, setClinicName] = useState(null);
  const [clinicSlug, setClinicSlug] = useState(null);
  const [clinicUsername, setClinicUsername] = useState(null);
  const [clinicId, setClinicId] = useState(null);
  const navigate = useNavigate();
  const [direct_login, setDirect_login] = useState(false);

  const steps = ["Select File Type", "Upload File", "Choose Date", "Submit"];

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
        } else if (data.user_type === "doctor") {
          setClinicName(data.doctor.name);
          setClinicSlug(data.doctor.slug);
          setClinicUsername(data.username);
          setClinicId(data.doctor.id);
        } else if (data.user_type === "staff") {
          setClinicName(data.staff.name);
          setClinicSlug(data.staff.slug);
          setClinicUsername(data.username);
          setClinicId(data.staff.id);
        }
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
        getClinicInfo(accessToken);
        window.location.reload();
      } else {
        navigate("/");
      }
    }
  }, [direct_login]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setActiveStep(2);
    }
  };

  const handleFileTypeChange = (event) => {
    const selectedFileType = event.target.value;
    setFileType(selectedFileType);
    // Always move to the next step, regardless of which option is selected
    setActiveStep(1);
  };

  const handleDateChange = (newDate) => {
    if (newDate) {
      setDate(newDate.toDate());
      setActiveStep(3);
    } else {
      setDate(null);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDate(null);
    setMessage("");
    setFileType("");
    setActiveStep(0);
    setUploadSuccess(false);
    setErrorMessage("");
  };

  const handleFileRemove = () => {
    setFile(null);
    setActiveStep(1);
  };

  const handleUpload = async () => {
    if (!file || !date || !fileType) {
      setErrorMessage("Please select a file type, upload a file, and choose a date.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    console.log(`Date: ${date.toISOString().split("T")[0]}`);
    const formData = new FormData();
    formData.append("xml_file", file);
    formData.append("date_field", date.toISOString().split("T")[0]);
    formData.append("file", fileType);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_PATH}/outsideuse/upload/`,
        formData,
        {
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setMessage(response.data.ok || "Upload successful!");
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage(error.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFileTypeName = () => {
    return fileType === "outside" ? "Outside Use File" : fileType === "radetails" ? "RA Details File" : "Capitation File";
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              File Type
            </Typography>
            <Select
              fullWidth
              displayEmpty
              value={fileType}
              onChange={handleFileTypeChange}
              sx={{ padding: "11px" }}

            >
              <MenuItem sx={{ padding: "0px" }} value="" disabled>
                <em>Select a file type</em>
              </MenuItem>
              <MenuItem value="outside">Outside Use File</MenuItem>
              <MenuItem value="capitation">Capitation File</MenuItem>
              <MenuItem value="radetails">RA Details File</MenuItem>
            </Select>
            <FormHelperText>Please select the type of file you wish to upload</FormHelperText>
          </FormControl>
        );
      case 1:
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".xml,.*"
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  p: 2,
                  border: "2px dashed #1976d2",
                  borderRadius: 2,
                  width: "100%",
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                <Typography variant="body1" gutterBottom>
                  Click to upload {getFileTypeName()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Only .xml files are accepted
                </Typography>
              </Button>
            </label>
            {getFileTypeName() === "Capitation File" && (
              <>
                <Typography variant="caption" color="textSecondary" sx={{"color":"red"}}>
                Please note that the name of RCX file should be "RCX-OHIP-GROUP-H-DMonYYYY.xml"
                </Typography><br/>
                <Typography variant="caption" color="textSecondary" sx={{"color":"danger"}}>
                  Like this example : "RCX-034278-0BDC9-H-5May2025.xml"
                </Typography>
              </>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <CalendarTodayIcon sx={{ mr: 1, color: "action.active" }} />
                          {params.InputProps?.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>Review & Submit</Typography>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">File Type</Typography>
                    <Typography variant="body1">{getFileTypeName()}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">File Name</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" noWrap>{file?.name}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">Selected Date</Typography>
                    <Typography variant="body1">
                      {date ? dayjs(date).format("MMMM D, YYYY") : "No date selected"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  // Determine if the continue button should be disabled
  const isContinueDisabled = () => {
    if (activeStep === 0) return !fileType; // Disabled if no file type selected
    if (activeStep === 1) return !file; // Disabled if no file selected
    if (activeStep === 2) return !date; // Disabled if no date selected
    return false;
  };

  // Handle continue button click based on current step
  const handleContinue = () => {
    if (activeStep === 3) {
      handleUpload();
    } else if (activeStep < steps.length - 1) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <HelmetComponent />
        <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                // bgcolor: 'primary.main',
                color: "primary.main",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h5">
                {uploadSuccess ? "Upload Complete" : "File Upload Portal"}
              </Typography>
            </Box>

            {!uploadSuccess ? (
              <>
                <Box sx={{ p: 3 }}>
                  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  {getStepContent(activeStep)}

                  {file && activeStep >= 1 && activeStep < 3 && (
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 2,
                      p: 1,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                    }}>
                      <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {file.name}
                      </Typography>
                      <IconButton size="small" onClick={handleFileRemove}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  {errorMessage && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Alert>
                  )}
                </Box>

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, bgcolor: "background.default" }}>
                  <Button
                    onClick={handleReset}
                    disabled={activeStep === 0 || isLoading}
                  >
                    Reset
                  </Button>

                  <Box sx={{ position: "relative" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleContinue}
                      disabled={isContinueDisabled() || isLoading}
                    >
                      {activeStep === 3 ? "Upload File" : "Continue"}
                    </Button>
                    {isLoading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </>
            ) : (
              <Fade in={uploadSuccess}>
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {message}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    Your {getFileTypeName()} has been uploaded successfully.
                  </Typography>
                  <Typography variant="body2" paragraph>

                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                    sx={{ mt: 2 }}
                  >
                    Upload Another File
                  </Button>
                </Box>
              </Fade>
            )}
          </Paper>
        </Box>
      </div>
    </Layout>
  );
}