import React, { useEffect, useMemo, useState } from "react";
import API_BASE_PATH from "../../../../apiConfig";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Link from "@mui/material/Link";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Layout1 from "../../Layout1";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import NotificationDialog from "../../resources/Notification";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams } from "react-router-dom";

// Row component for collapsible detail view
const EnhancedTerminatedRow = ({ row, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(row); // Pass the complete row to parent component
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <>
      <TableRow
        hover
        sx={{
          "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
          cursor: "pointer",
          borderLeft: open ? "4px solid #1976d2" : "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <TableCell
          align="left"
          sx={{
          }}
        >
          {row.name || "N/A"}
        </TableCell>
        <TableCell
          align="center"
          sx={{
          }}
        >
          {row.hin || "N/A"}
        </TableCell>
        <TableCell
          align="right"
          sx={{
          }}
        >
          {row.code}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, backgroundColor: "#f5f7fa", p: 3, borderRadius: 2, boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)", border: "1px solid #e0e4e8" }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: "600", color: "#2c3e50", mb: 2, borderBottom: "2px solid #3498db", pb: 1, display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1, color: "#3498db" }} />
                Patient Details
              </Typography>

              <Grid container spacing={1}>
                {/* Left column - OSCAR data */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: "rgba(52, 152, 219, 0.04)", height: "100%" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: "600", color: "#174665" }}>
                      OSCAR Information
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>HIN:</Typography>
                        <Typography variant="body2" sx={{fontSize:'1rem'}}>{row.hin || "N/A"}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Roster Status:</Typography>
                        <Chip
                          sx={{fontSize:'1rem'}}
                          size="small"
                          label={row.rosterStatus}
                          color={row.rosterStatus === "Active" ? "success" : "default"}
                          variant="outlined"
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Termination Date:</Typography>
                        <Typography variant="body2" sx={{fontSize:'1rem'}}>{row.rosterTerminationDate || "N/A"}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}></Typography>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate().then(r => {});
                          }}
                          variant="contained"
                          size="small"
                          endIcon={isUpdating ? <CircularProgress size={16} /> : <CancelIcon />}
                          fullWidth
                          disabled={isUpdating}
                          sx={{
                            backgroundColor: "#e74c3c",
                            "&:hover": { backgroundColor: "#c0392b" },
                            mt: 1,
                            maxWidth:200,
                            fontSize:'1rem',
                            alignItems: "center",
                          }}
                        >
                          {isUpdating ? "Processing..." : "Terminate in OSCAR"}
                        </Button>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Right column - MCDET data */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: "rgba(52, 152, 219, 0.04)", height: "100%" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: "600", color: "#174665" }}>
                      MCDET Information
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Base Rate:</Typography>
                        <Typography variant="body2" sx={{fontSize:'1rem'}}>{row.baseRate || "N/A"}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Comp Care:</Typography>
                        <Typography variant="body2" sx={{fontSize:'1rem'}}>{row.compCare || "N/A"}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Termination Code:</Typography>
                        <Chip
                          sx={{fontSize:'1rem'}}
                          size="small"
                          label={row.code || "N/A"}
                          variant="outlined"
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Termination Date:</Typography>
                        <Typography variant="body2" sx={{fontSize:'1rem'}}>{row.terminatedDate || "N/A"}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
export const RosterTerminatedPatients = () => {
  // State variables
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicInfoError, setClinicInfoError] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [terminatedPatients, setTerminatedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState("all");
  const [rosterOptions, setRosterOptions] = useState([]);
  const [isRefreshingRosters, setIsRefreshingRosters] = useState(false);
  const [individualRosterUpdating, setIndividualRosterUpdating] = useState(false);
  const [totalTerminated, setTotalTerminated] = useState(0);
  const [totalDeceased, setTotalDeceased] = useState(0);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // NotificationDialog state
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { clinicSlug } = useParams();


  // Fetch terminated patients data
// Add this constant at the top of your component
  const CACHE_KEY = 'terminatedPatientsCache';

// Modified fetchTerminatedPatients function
  const fetchTerminatedPatients = async (forceRefresh = false) => {
    setLoading(true);

    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data } = JSON.parse(cachedData);
          processPatientData(data);
          return;
        }
      }

      // No cache or forcing refresh - make API call
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_PATH}/outsideuse/getletestRoster/terminated/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.terminatedPatients) {
        // Process and cache the new data
        processPatientData(result.terminatedPatients);

        // Update cache with new data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: result.terminatedPatients,
          timestamp: Date.now() // Optional: keep timestamp for debugging
        }));
      }
    } catch (error) {
      console.error("Error fetching terminated patients:", error);
      handleFailure(`Failed to load terminated patients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

// Keep the same processPatientData helper function
  const processPatientData = (patientsData) => {
    const parsedPatients = JSON.parse(patientsData);
    setTerminatedPatients(parsedPatients);

    const terminated = parsedPatients.filter(p => p.code === 91).length;
    const deceased = parsedPatients.filter(p => p.code === 44).length;
    setTotalTerminated(terminated);
    setTotalDeceased(deceased);

    if (parsedPatients.length > 0 && parsedPatients.some(p => p.code.toString())) {
      const uniqueProviders = [...new Set(parsedPatients.map(p => p.code.toString()))].filter(Boolean);
      setRosterOptions(uniqueProviders);
    }
  };

  // Refresh terminated roster data
  const refreshTerminatedRosters = async () => {
    setIsRefreshingRosters(true);
    try {
      await fetchTerminatedPatients(true); // Force refresh
      handleSuccess("Roster termination data updated successfully!");
    } catch (error) {
      console.error("Error refreshing rosters:", error);
      handleFailure(error.message);
    } finally {
      setIsRefreshingRosters(false);
    }
  };


  // Fetch clinic info on component mount
  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setClinicInfo(result.clinic || null);
        setClinicInfoFetched(true);
      } catch (error) {
        console.error("Error fetching clinic info:", error);
        setClinicInfoError(error.message);
        setClinicInfoFetched(true);
      }
    };
    if (!clinicInfoFetched && clinicSlug) {
      console.log(`clinicInfo:${clinicInfoFetched}, ${clinicSlug}`);
      fetchClinicInfo().then(r => {
      });
      setClinicInfoFetched(true);
    }
  }, [clinicInfoFetched, clinicSlug, fetchTerminatedPatients]);

  useEffect(() => {
    if (clinicInfoFetched && clinicSlug) {
      console.log(`clinicInfo:${clinicInfoFetched}, ${clinicSlug}`);
      fetchTerminatedPatients().then(r => {
      });
    }
  }, [clinicInfoFetched, clinicSlug]);
  // Filter data based on selected roster
  const filteredData = useMemo(() => {
    if (selectedCode === "all") {
      return terminatedPatients;
    }
    return terminatedPatients.filter(patient => patient.code.toString() === selectedCode);
  }, [terminatedPatients, selectedCode]);

  // Get current page data
  const getCurrentPageData = () => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle code filter change
  const handleCodeChange = (event) => {
    setSelectedCode(event.target.value);
    setPage(0);
  };
  // Notification handlers
  const handleSuccess = (message) => {
    setModalContent(message);
    setIsError(false);
    setOpenModal(true);
  };

  const handleFailure = (message) => {
    setModalContent(message);
    setIsError(true);
    setOpenModal(true);
  };

  const handleCloseApp = () => {
    setOpenModal(false);
  };

  // Display loading indicator
  if (!clinicInfoFetched) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error case
  if (clinicInfoError) {
    return (
      <Box sx={{ p: 3, color: "error.main" }}>
        <Typography>Error loading clinic information: {clinicInfoError}</Typography>
      </Box>
    );
  }

  const handleUpdatePatient = async (patientData) => {
    try {

      const urlParams = new URLSearchParams(window.location.search);
      const accessTokenurl = urlParams.get("token");
      const accessToken = localStorage.getItem("accessToken") || accessTokenurl;
      const response = await fetch(`${API_BASE_PATH}/outsideuse/getletestRoster/terminated/`, {
        method: "PUT",
        headers: {
          "Authorization": `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      console.log(response.status);
      if (response.status === 204) {
        // Update the cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data } = JSON.parse(cachedData);

          // Find and update the patient in cached data
          const updatedPatients = JSON.parse(data).map(patient => {
            if (patient.hin === patientData.hin) {
              return {
                ...patient,
                rosterTerminationDate: patientData.terminatedDate,
                rosterStatus: 'TE'
              };
            }
            return patient;
          });

          // Update both local state and localStorage cache
          setTerminatedPatients(updatedPatients);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: JSON.stringify(updatedPatients),
            timestamp: Date.now()
          }));

          // Update totals if needed (e.g., if code changed)
          const terminated = updatedPatients.filter(p => p.code === 91).length;
          const deceased = updatedPatients.filter(p => p.code === 44).length;
          setTotalTerminated(terminated);
          setTotalDeceased(deceased);
        }
        handleSuccess("Patient terminated in oscar successfully!");
      }
      else {
        throw new Error(`HTTP error! Status: ${response.status}`);

      }

      // fetchTerminatedPatients(); // Refresh the data
    } catch (error) {
      console.error("Error updating patient:", error);
      handleFailure(`Failed to update patient: ${error.message}`);
      throw error;
    }
  };

  return clinicInfo ? (
    <Layout1 clinicInfo={clinicInfo}>
      <div>

          {/* Title Card */}
          <CardHeader
            title="Roster Termination"
            sx={{
              backgroundColor: "#1976d2",
              color: "white !important", // Force white color
              "& .MuiCardHeader-title": {
                color: "white !important", // Specifically target title
              },
              display: "flex",
              alignItems: "center",
              padding: "16px 24px",
            }}
          />

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
              {/* Summary blocks in a column on the left - FIXED */}
              <Grid item xs={12} md={2}
                    sx={{ position: "sticky", top: 16, height: "fit-content", alignSelf: "flex-start" }}>
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  height: "100%",
                }}>
                  {/* TOTAL TERMINATED */}
                  <Box sx={{
                    p: 1,
                    bgcolor: "#ffebee",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}>

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                      letterSpacing: "0.5px",
                    }}>
                      CODE 91
                    </Typography>
                    <Typography variant="h4" sx={{
                      fontWeight: "600",
                      color: "#d32f2f",
                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    }}>
                      {totalTerminated}
                    </Typography>
                  </Box>

                  {/* TOTAL DECEASED */}
                  <Box sx={{
                    p: 1,
                    bgcolor: "#fff8e1",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}>

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                      letterSpacing: "0.5px",
                    }}>
                      CODE 44
                    </Typography>
                    <Typography variant="h4" sx={{
                      fontWeight: "600",
                      color: "#ff9800",
                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    }}>
                      {totalDeceased}
                    </Typography>
                  </Box>

                  {/* TOTAL PATIENTS */}
                  <Box sx={{
                    p: 1,
                    bgcolor: "#e3f2fd",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}>

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                      letterSpacing: "0.5px",
                    }}>
                      TOTAL PATIENTS
                    </Typography>
                    <Typography variant="h4" sx={{
                      fontWeight: "600",
                      color: "#1976d2",
                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    }}>
                      {terminatedPatients.length}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Table content area - SCROLLABLE */}
              <Grid item xs={12} md={10}>
                <Card
                  sx={{
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    maxHeight: "calc(100vh - 120px)",  // Set max height for scrolling
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{
                    padding: "24px",
                    paddingTop: "24px",
                    // flexDirection: "column",
                    flex: 1,
                    overflow: "auto", // Make this content area scrollable
                  }}>
                    {loading ? (
                      <Box
                        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading termination data...</Typography>
                      </Box>
                    ) : (
                      <>
                        {/* Filters and controls - STICKY */}
                        <Box sx={{
                          // position: "sticky",
                          // top: 0,
                          // backgroundColor: "white",
                          // zIndex: 10,
                          // paddingBottom: 2,
                          // borderBottom: "1px solid rgba(224, 224, 224, 0.5)"
                        }}>
                          <Grid container spacing={2} alignItems="center" sx={{ mb: 3, mt: 2 }}>
                            {/* Roster Filter */}
                            {rosterOptions.length > 1 && (
                              <Grid item>
                                <FormControl sx={{
                                  minWidth: 200,
                                  height: 40, // Explicit height
                                  "& .MuiInputBase-root": {
                                    height: 40, // Controls the inner input height
                                  },
                                }} size="small">
                                  <InputLabel id="code-filter-label">Filter by Last Roster</InputLabel>
                                  <Select
                                    labelId="code-filter-label"
                                    id="code-filter"
                                    value={selectedCode}
                                    label="Filter by Last Roster"
                                    onChange={handleCodeChange}

                                  >
                                    <MenuItem value="all">All Codes ({terminatedPatients.length})</MenuItem>
                                    {/*{terminatedPatients.map((code) => (*/}
                                    {/*  <MenuItem key={code} value={code}>*/}
                                    {/*    {code} ({terminatedPatients.filter(row => row.code === code).length})*/}
                                    {/*  </MenuItem>*/}
                                    {/*))}*/}
                                    <MenuItem value="91">Code 91
                                      ({terminatedPatients.filter(row => row.code === 91).length})</MenuItem>
                                    <MenuItem value="44">Code 44
                                      ({terminatedPatients.filter(row => row.code === 44).length})</MenuItem>
                                    {/* Add other codes if needed */}
                                  </Select>
                                </FormControl>
                              </Grid>
                            )}

                            {/* Refresh Button */}
                            <Grid item>
                              <Button
                                variant="contained"
                                onClick={refreshTerminatedRosters}
                                disabled={isRefreshingRosters || individualRosterUpdating}
                                startIcon={isRefreshingRosters ? <CircularProgress size={16} /> : <RefreshIcon />}
                                sx={{
                                  textTransform: "none",
                                  fontWeight: "bold",
                                  fontFamily: "sans-serif",
                                  fontVariantCaps: "normal",
                                  color: "white",
                                  borderColor: "rgba(255, 255, 255, 0.3)",
                                  backgroundColor: "#1976d2",
                                  "&:hover": {
                                    backgroundColor: "#1565c0", // Slightly darker on hover
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                    color: "black",
                                  },
                                }}
                              >
                                {isRefreshingRosters ? "Updating..." : "Refresh Data"}
                              </Button>
                            </Grid>

                            {/* Page info */}
                            <Grid item sx={{ ml: "auto", mr: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Showing page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Scrollable table area */}
                        <Box sx={{ overflow: "auto" }}>
                          {filteredData.length > 0 ? (
                            <TableContainer
                              component={Paper}
                              sx={{
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                borderRadius: "8px",
                                overflow: "hidden",
                              }}
                            >
                              <Table aria-label="collapsible table" stickyHeader>
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell
                                      align="left"
                                      sx={{
                                        fontWeight: "600",
                                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                        fontSize: "0.875rem",
                                        width: "50%", // Explicit width
                                        paddingLeft: "16px", // Match body cell padding
                                      }}
                                    >
                                      Patient
                                    </TableCell>
                                    {/*<TableCell*/}
                                    {/*  align="center"*/}
                                    {/*  sx={{*/}
                                    {/*    fontWeight: "600",*/}
                                    {/*    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",*/}
                                    {/*    fontSize: "0.875rem",*/}
                                    {/*    width: "50%", // Explicit width*/}
                                    {/*    paddingLeft: "16px", // Match body cell padding*/}
                                    {/*  }}*/}
                                    {/*>*/}
                                    {/*  Name*/}
                                    {/*</TableCell>*/}

                                    {/*<TableCell*/}
                                    {/*  align="right"*/}
                                    {/*  sx={{*/}
                                    {/*    fontWeight: "600",*/}
                                    {/*    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",*/}
                                    {/*    fontSize: "0.875rem",*/}
                                    {/*    width: "50%", // Explicit width*/}
                                    {/*    paddingRight: "16px", // Match body cell padding*/}
                                    {/*  }}*/}
                                    {/*>*/}
                                    {/*  Status Code*/}
                                    {/*</TableCell>*/}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {getCurrentPageData().map((row) => (
                                    <EnhancedTerminatedRow key={row.hin} row={row} onUpdate={handleUpdatePatient} />
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "200px",
                              flexDirection: "column",
                              backgroundColor: "#f5f5f5",
                              borderRadius: "8px",
                            }}>
                              <i className="fas fa-info-circle"
                                 style={{ fontSize: "32px", color: "#1976d2", marginBottom: "16px" }}></i>
                              <Typography variant="h6" color="text.secondary">
                                No terminated patients found
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                There are no patients terminated from roster in the last 3 months.
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Pagination controls - STICKY to bottom */}
                        {filteredData.length > 0 && (
                          <Box sx={{
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "background.paper",
                            zIndex: 2,
                            pt: 2,
                            pb: 1,
                            borderTop: "1px solid",
                            borderColor: "divider",
                            boxShadow: "0 -2px 4px rgba(0,0,0,0.05)",
                          }}
                          >
                            <TablePagination
                              rowsPerPageOptions={[15, 25, 50]}
                              component="div"
                              count={filteredData.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              sx={{
                                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                                  fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                },
                                ".MuiTablePagination-select": {
                                  fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                },
                              }}
                            />

                            {/*<Box sx={{*/}
                            {/*  mt: 1,*/}
                            {/*  display: "flex",*/}
                            {/*  alignItems: "center",*/}
                            {/*  backgroundColor: "rgba(25, 118, 210, 0.05)",*/}
                            {/*  p: 1,*/}
                            {/*  borderRadius: 1,*/}
                            {/*}}>*/}
                            {/*  <i className="fas fa-info-circle"*/}
                            {/*     style={{*/}
                            {/*       color: "#1976d2",*/}
                            {/*       marginRight: "8px",*/}
                            {/*       fontSize: "16px",*/}
                            {/*     }}></i>*/}
                            {/*  <Typography variant="body2" color="text.secondary"*/}
                            {/*              sx={{ fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif" }}>*/}
                            {/*    Click on any patient row to view detailed termination information. Code 91 indicates*/}
                            {/*    a*/}
                            {/*    terminated patient, while code 44 indicates deceased.*/}
                            {/*  </Typography>*/}
                            {/*</Box>*/}
                          </Box>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

        {/* Notification Dialog */}
        <NotificationDialog
          open={openModal}
          onClose={handleCloseApp}
          isError={isError}
          content={modalContent}
        />
      </div>
    </Layout1>
  ) : (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading Clinic Data...</Typography>
    </Box>
  );
};