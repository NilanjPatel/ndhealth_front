import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import HelmetComponent from "../SEO/HelmetComponent";
import API_BASE_PATH from "../../../apiConfig";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 200,
    width: "100%",
  },
  editorContainer: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "300px",
    padding: "10px",
    fontFamily: "monospace",
    fontSize: "14px",
  },
  progressContainer: {
    marginTop: "20px",
  },
  statsBox: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
}));

const Broadcast = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  // Filter states
  const [ageFrom, setAgeFrom] = useState("");
  const [everyDayLimit, setEveryDayLimit] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [activePatients, setActivePatients] = useState("all");

  // Email template states
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateTitle, setTemplateTitle] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");
  const [isTemplateLoaded, setIsTemplateLoaded] = useState(false);
  const [clinicId, setClinicId] = useState(null);

  // Save template dialog
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [saveTemplateName, setSaveTemplateName] = useState("");
  const [saveTemplateTitle, setSaveTemplateTitle] = useState("");

  // CSV upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // Broadcast status states
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [notifiedPatients, setNotifiedPatients] = useState(0);
  const [remainingPatients, setRemainingPatients] = useState(0);
  const [broadcastComplete, setBroadcastComplete] = useState(false);

  const [lastBatch, setLastBatch] = useState(null);
  const [batchLoading, setBatchLoading] = useState(true);
  const [currentBatchId, setCurrentBatchId] = useState(null);

// add new state
  const [previewTemplate, setPreviewTemplate] = useState("");


  useEffect(() => {
    // Fetch all email templates from backend using ViewSet
    const fetchEmailTemplates = async () => {
      try {
        // ViewSet automatically provides list endpoint
        const url = clinicId
          ? `${API_BASE_PATH}/Broadcast/?clinic=${clinicId}`
          : `${API_BASE_PATH}/Broadcast/`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();

        if (data.detail === "Invalid token.") {
          navigate("/");
          return;
        }

        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
          setIsTemplateLoaded(true);
          // Auto-select first template
          setSelectedTemplateId(data[0].id);
          setTemplateName(data[0].name);
          setTemplateTitle(data[0].title);
          setEmailTemplate(data[0].content);
          setPreviewTemplate(data[0].merged_content);

        } else {
          // Set default template if no templates exist
          setEmailTemplate("[Your message content here]");
          setPreviewTemplate(data[0].merged_content.replace("{{ broadcastTemplate }}", "[Your message content here]"));

          setIsTemplateLoaded(true);
        }
      } catch (error) {
        console.log("Error fetching templates:", error);
        setIsTemplateLoaded(true);
      }
    };

    if (clinicId !== null) {
      fetchEmailTemplates();
    } else {
      // Fetch without clinic filter if clinic ID not available yet
      fetchEmailTemplates();
    }
  }, [navigate, clinicId]);

  const handleTemplateChange = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplateId(template.id);
      setTemplateName(template.name);
      setTemplateTitle(template.title);
      setEmailTemplate(template.content);          // raw content for editor
      setPreviewTemplate(template.merged_content); // full merged content for preview

    }
  };

  const handleSaveTemplate = async () => {
    if (!saveTemplateName.trim() || !saveTemplateTitle.trim()) {
      alert("Please provide both template name and title");
      return;
    }

    if (!emailTemplate.trim()) {
      alert("Please provide email template content");
      return;
    }

    try {
      // ViewSet POST to create new template
      const response = await fetch(`${API_BASE_PATH}/Broadcast/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: saveTemplateName,
          title: saveTemplateTitle,
          content: emailTemplate,
          clinic: clinicId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Template saved successfully!");
        setOpenSaveDialog(false);
        setSaveTemplateName("");
        setSaveTemplateTitle("");

        // Refresh templates list
        const refreshUrl = clinicId
          ? `${API_BASE_PATH}/Broadcast/?clinic=${clinicId}`
          : `${API_BASE_PATH}/Broadcast/`;

        const refreshResponse = await fetch(refreshUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setTemplates(Array.isArray(refreshData) ? refreshData : []);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Error saving template");
      }
    } catch (error) {
      console.log("Error saving template:", error);
      alert("Error saving template");
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplateId) {
      alert("Please select a template first");
      return;
    }

    try {
      // ViewSet PUT/PATCH to update existing template
      const response = await fetch(
        `${API_BASE_PATH}/Broadcast/${selectedTemplateId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            name: templateName,
            title: templateTitle,
            content: emailTemplate,
            clinic: clinicId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        alert("Template updated successfully!");

        // Refresh templates list
        const refreshUrl = clinicId
          ? `${API_BASE_PATH}/Broadcast/?clinic=${clinicId}`
          : `${API_BASE_PATH}/Broadcast/`;

        const refreshResponse = await fetch(refreshUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setTemplates(Array.isArray(refreshData) ? refreshData : []);
        }
      } else {
        const errorData = await response.json();

        if (errorData.detail) {
          alert(errorData.detail);
        } else {
          // Collect field errors into a readable message
          const messages = Object.entries(errorData)
            .map(([field, errs]) => `${field}: ${errs.join(", ")}`)
            .join("\n");
          alert(messages || "Error saving template");
        }
      }
    } catch (error) {
      console.log("Error updating template:", error);
      alert("Error updating template");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setFileName(file.name);
    } else {
      alert("Please select a valid CSV file");
      event.target.value = null;
    }
  };

  const handleBroadcast = async () => {
    if (!emailTemplate.trim()) {
      alert("Please provide an email template");
      return;
    }
    if (!selectedFile) {
      alert("Please select a CSV file first");
      return;
    }
    setIsBroadcasting(true);
    setBroadcastComplete(false);
    setNotifiedPatients(0);

    try {
      const formData = new FormData();
      formData.append("csv_file", selectedFile);
      formData.append("email_template", emailTemplate);
      formData.append("template_title", templateTitle);
      formData.append("template_name", templateName);
      formData.append("template_id", selectedTemplateId);
      formData.append("everyDayLimit", everyDayLimit);
      formData.append("previewTemplate", previewTemplate.replace("{{ broadcastTemplate }}", emailTemplate));

      const response = await fetch(`${API_BASE_PATH}/broadcast/send/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
        body: formData,

      });

      const data = await response.json();

      if (data.status === "success") {
        setCurrentBatchId(data.batch_id);
        await fetchBatchStatus(data.batch_id);

        setSelectedFile(null);
        setFileName("");
        setIsBroadcasting(false);

        // Simulate progress updates
        const total = data.total_patients || totalPatients;
        setTotalPatients(total);

        let notified = 0;
        const interval = setInterval(() => {
          notified += Math.floor(Math.random() * 5) + 1;
          if (notified >= total) {
            notified = total;
            clearInterval(interval);
            setIsBroadcasting(false);
            setBroadcastComplete(true);
          }
          setNotifiedPatients(notified);
          setRemainingPatients(total - notified);
        }, 500);
      } else {
        alert(data.message || "Error sending broadcast");
        setIsBroadcasting(false);
      }
    } catch (error) {
      console.log("Error broadcasting:", error);
      alert("Error sending broadcast");
      setIsBroadcasting(false);
    }
  };

  useEffect(() => {
    const fetchLastBatch = async () => {
      try {
        setBatchLoading(true);
        const response = await fetch(`${API_BASE_PATH}/broadcast/last-batch/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.batch) {
            setLastBatch(data.batch);
            setCurrentBatchId(data.batch.batch_id);
          }
        }
      } catch (error) {
        console.log("Error fetching last batch:", error);
      } finally {
        setBatchLoading(false);
      }
    };

    fetchLastBatch();

    const interval = setInterval(() => {
      if (currentBatchId) {
        fetchBatchStatus(currentBatchId);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentBatchId]);

  const fetchBatchStatus = async (batchId) => {
    try {
      const response = await fetch(`${API_BASE_PATH}/broadcast/status/${batchId}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLastBatch(data);
      }
    } catch (error) {
      console.log("Error fetching batch status:", error);
    }
  };

// Add these helper functions before the return statement
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
        return 'info';
      case 'SCHEDULED':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '✓';
      case 'PROCESSING':
        return '⟳';
      case 'SCHEDULED':
        return '⏰';
      case 'FAILED':
        return '✗';
      default:
        return '●';
    }
  };

  const progressPercentage = totalPatients > 0
    ? (notifiedPatients / totalPatients) * 100
    : 0;

  return (
    <div>
      <HelmetComponent />
      {lastBatch && (
        <Card style={{ width: "100%", marginBottom: "20px" }}>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6">Last Broadcast Campaign</Typography>
                <Chip
                  label={lastBatch.batch_status || lastBatch.status}
                  color={getStatusColor(lastBatch.batch_status || lastBatch.status)}
                  icon={<span>{getStatusIcon(lastBatch.batch_status || lastBatch.status)}</span>}
                />
              </Box>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Paper className={classes.statsBox} style={{ backgroundColor: '#e3f2fd' }}>
                  <Typography variant="h4" color="primary">
                    {lastBatch.total_recipients}
                  </Typography>
                  <Typography variant="subtitle2">Total Recipients</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper className={classes.statsBox} style={{ backgroundColor: '#e8f5e9' }}>
                  <Typography variant="h4" style={{ color: '#4caf50' }}>
                    {lastBatch.emails_sent}
                  </Typography>
                  <Typography variant="subtitle2">Emails Sent</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper className={classes.statsBox} style={{ backgroundColor: '#fff3e0' }}>
                  <Typography variant="h4" style={{ color: '#ff9800' }}>
                    {lastBatch.remaining_emails}
                  </Typography>
                  <Typography variant="subtitle2">Remaining</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper className={classes.statsBox} style={{ backgroundColor: '#fce4ec' }}>
                  <Typography variant="h4" style={{ color: '#e91e63' }}>
                    {lastBatch.emails_failed || 0}
                  </Typography>
                  <Typography variant="subtitle2">Failed</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress: {lastBatch.emails_sent} / {lastBatch.total_recipients}
                    {lastBatch.success_rate && ` (${lastBatch.success_rate.toFixed(1)}% success rate)`}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(lastBatch.emails_sent / lastBatch.total_recipients) * 100}
                    style={{ height: "8px", borderRadius: "4px" }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Template:</strong> {lastBatch.template_name || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Daily Limit:</strong> {lastBatch.daily_limit} emails/night
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Started:</strong> {lastBatch.started_at ? new Date(lastBatch.started_at).toLocaleString() : 'N/A'}
                </Typography>
              </Grid>

              {/*<Grid item xs={12} md={6}>*/}
              {/*  <Typography variant="body2" color="textSecondary">*/}
              {/*    <strong>Completed:</strong> {lastBatch.completed_at ? new Date(lastBatch.completed_at).toLocaleString() : 'In Progress'}*/}
              {/*  </Typography>*/}
              {/*</Grid>*/}

              {lastBatch.remaining_emails > 0 && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    {lastBatch.remaining_emails} emails remaining. Will resume at next sending window (12:00 AM - 8:00 AM).
                  </Alert>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
      {
        lastBatch?.batch_status === 'COMPLETED' &&(
          <Card style={{ width: "100%", marginBottom: "20px" }}>
            <CardHeader title="Broadcast Message to Patients" />
            <CardContent>
              <Grid container spacing={3}>
                {/* Email Template Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
                    1. Select or Create Email Template
                  </Typography>
                </Grid>

                {templates.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Select Template</InputLabel>
                      <Select
                        value={selectedTemplateId}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        label="Select Template"
                      >
                        {templates.map((template) => (
                          <MenuItem key={template.id} value={template.id}>
                            {template.name} - {template.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid item xs={12} md={templates.length > 0 ? 6 : 12}>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setOpenSaveDialog(true)}
                      fullWidth
                    >
                      Save as New Template
                    </Button>
                    {selectedTemplateId && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleUpdateTemplate}
                        fullWidth
                      >
                        Update Current Template
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Template Name"
                    variant="outlined"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Welcome Email"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Subject/Title"
                    variant="outlined"
                    value={templateTitle}
                    onChange={(e) => setTemplateTitle(e.target.value)}
                    placeholder="e.g., Welcome to Our Clinic"
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>
                    Template Editor
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={15}
                    variant="outlined"
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    placeholder="Edit your HTML email template here..."
                    InputProps={{
                      className: classes.editorContainer,
                      style: { height: "440px", overflow: "auto" }, // fixed height
                    }}
                  />

                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Live Preview
                  </Typography>
                  <Paper
                    elevation={2}
                    style={{
                      height: "440px",          // ✅ match with editor
                      overflow: "auto",
                      padding: "10px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: previewTemplate.replace("{{ broadcastTemplate }}", emailTemplate),
                      }}
                    />
                  </Paper>

                </Grid>
                {/* Filter Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    2. Conditions
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="EveryDay limit"
                    type="number"
                    variant="outlined"
                    value={everyDayLimit}
                    onChange={(e) => setEveryDayLimit(e.target.value)}
                    placeholder="e.g., 18"
                  />
                </Grid>

                {/*<Grid item xs={12} md={4}>*/}
                {/*  <TextField*/}
                {/*    fullWidth*/}
                {/*    label="Age From"*/}
                {/*    type="number"*/}
                {/*    variant="outlined"*/}
                {/*    value={ageFrom}*/}
                {/*    onChange={(e) => setAgeFrom(e.target.value)}*/}
                {/*    placeholder="e.g., 18"*/}
                {/*  />*/}
                {/*</Grid>*/}

                {/*<Grid item xs={12} md={4}>*/}
                {/*  <TextField*/}
                {/*    fullWidth*/}
                {/*    label="Age To"*/}
                {/*    type="number"*/}
                {/*    variant="outlined"*/}
                {/*    value={ageTo}*/}
                {/*    onChange={(e) => setAgeTo(e.target.value)}*/}
                {/*    placeholder="e.g., 65"*/}
                {/*  />*/}
                {/*</Grid>*/}

                {/*<Grid item xs={12} md={4}>*/}
                {/*  <FormControl className={classes.formControl}>*/}
                {/*    <InputLabel>Patient Status</InputLabel>*/}
                {/*    <Select*/}
                {/*      value={activePatients}*/}
                {/*      onChange={(e) => setActivePatients(e.target.value)}*/}
                {/*      label="Patient Status"*/}
                {/*    >*/}
                {/*      <MenuItem value="all">All Patients</MenuItem>*/}
                {/*      <MenuItem value="active">Active Patients Only</MenuItem>*/}
                {/*    </Select>*/}
                {/*  </FormControl>*/}
                {/*</Grid>*/}

                {/* CSV Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
                    3. Upload Patient List (CSV)
                  </Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                  <input
                    accept=".csv"
                    style={{ display: "none" }}
                    id="csv-file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="csv-file-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      Choose CSV File
                    </Button>
                  </label>
                  {fileName && (
                    <Chip
                      label={fileName}
                      onDelete={() => {
                        setSelectedFile(null);
                        setFileName("");
                      }}
                      style={{ marginTop: "10px" }}
                    />
                  )}
                </Grid>


                {/* Broadcast Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleBroadcast}
                    // disabled={isBroadcasting || totalPatients === 0}
                    fullWidth
                    style={{ marginTop: "20px" }}
                  >
                    {isBroadcasting ? "Broadcasting..." : "Send Broadcast"}
                  </Button>
                </Grid>

                {/* Progress Section */}
                {(isBroadcasting || broadcastComplete) && (
                  <Grid item xs={12}>
                    <Box className={classes.progressContainer}>
                      <Typography variant="h6" gutterBottom>
                        4. Broadcast Status
                      </Typography>

                      {broadcastComplete && (
                        <Alert severity="success" style={{ marginBottom: "20px" }}>
                          Broadcast completed successfully!
                        </Alert>
                      )}

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Paper className={classes.statsBox}>
                            <Typography variant="h4" color="primary">
                              {totalPatients}
                            </Typography>
                            <Typography variant="subtitle1">Total Patients</Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper className={classes.statsBox}>
                            <Typography variant="h4" color="success">
                              {notifiedPatients}
                            </Typography>
                            <Typography variant="subtitle1">Notified</Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper className={classes.statsBox}>
                            <Typography variant="h4" color="warning">
                              {remainingPatients}
                            </Typography>
                            <Typography variant="subtitle1">Remaining</Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Box style={{ marginTop: "20px" }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressPercentage}
                          style={{ height: "10px", borderRadius: "5px" }}
                        />
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ marginTop: "10px", textAlign: "center" }}
                        >
                          {progressPercentage.toFixed(1)}% Complete
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )
      }

      {/* Save Template Dialog */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Save Email Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            type="text"
            fullWidth
            variant="outlined"
            value={saveTemplateName}
            onChange={(e) => setSaveTemplateName(e.target.value)}
            placeholder="e.g., Welcome Email"
            style={{ marginBottom: "15px" }}
          />
          <TextField
            margin="dense"
            label="Email Subject/Title"
            type="text"
            fullWidth
            variant="outlined"
            value={saveTemplateTitle}
            onChange={(e) => setSaveTemplateTitle(e.target.value)}
            placeholder="e.g., Welcome to Our Clinic"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTemplate} variant="contained" color="primary">
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Broadcast;