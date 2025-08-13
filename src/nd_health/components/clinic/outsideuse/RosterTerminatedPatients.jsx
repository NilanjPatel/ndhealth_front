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
import AdvancedDashboardLoading from "../../processes/AdvancedDashboardLoading";

// Dynamic color generator for different codes
const getCodeColor = (code, index) => {
  const colors = [
    { bg: "#ffebee", text: "#d32f2f" }, // Red
    { bg: "#fff8e1", text: "#ff9800" }, // Orange
    { bg: "#e8f5e8", text: "#2e7d32" }, // Green
    { bg: "#e3f2fd", text: "#1976d2" }, // Blue
    { bg: "#f3e5f5", text: "#7b1fa2" }, // Purple
    { bg: "#fff3e0", text: "#f57c00" }, // Deep Orange
    { bg: "#e0f2f1", text: "#00695c" }, // Teal
    { bg: "#fce4ec", text: "#c2185b" }, // Pink
    { bg: "#f1f8e9", text: "#558b2f" }, // Light Green
    { bg: "#e8eaf6", text: "#3f51b5" }  // Indigo
  ];
  return colors[index % colors.length];
};

// Row component for collapsible detail view
const EnhancedTerminatedRow = ({ row, onUpdate , emrHomeUrl}) => {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(row);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <TableRow hover sx={{
        "& > *": { borderBottom: "unset" },
        cursor: "pointer",
        ...(open && {
          backgroundColor: "rgba(25, 118, 210, 0.08)",
        }),
      }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
      >
        <TableCell align="left">{row.hin || "N/A"}</TableCell>
        <TableCell component="th" scope="row">{row.name || "N/A"}</TableCell>
        <TableCell component="th" scope="row">{row.rosterStatus || "N/A"}</TableCell>
        <TableCell>
          <Link
            color={"blue"}
            fontWeight={"bolder"}
            target="_blank"
            href={`${emrHomeUrl}oscar/demographic/demographiccontrol.jsp?demographic_no=${row.demo}&displaymode=edit&dboperation=search_detail`}
          >
            Demographic
          </Link>
        </TableCell>
        <TableCell align="right">{row.code || "N/A"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{
              margin: 2,
              backgroundColor: "#f5f7fa",
              p: 3,
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e0e4e8",
            }}>
              <Typography variant="h6" component="div" sx={{
                fontWeight: "600",
                color: "#2c3e50",
                mb: 2,
                borderBottom: "2px solid #3498db",
                pb: 1,
                display: "flex",
                alignItems: "center",
              }}>
                <PersonIcon sx={{ mr: 1, color: "#3498db" }} />
                Patient Details
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: "rgba(52, 152, 219, 0.04)", height: "100%" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: "600", color: "#174665" }}>
                      OSCAR Information
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>HIN:</Typography>
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>{row.hin || "N/A"}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Roster Status:</Typography>
                        <Chip
                          sx={{ fontSize: "1rem" }}
                          size="small"
                          label={row.rosterStatus || "N/A"}
                          color={row.rosterStatus === "Active" ? "success" : "default"}
                          variant="outlined"
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Termination Date:</Typography>
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>{row.rosterTerminationDate || "N/A"}</Typography>
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
                            maxWidth: 200,
                            fontSize: "1rem",
                            alignItems: "center",
                          }}
                        >
                          {isUpdating ? "Processing..." : "Terminate in OSCAR"}
                        </Button>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: "rgba(52, 152, 219, 0.04)", height: "100%" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: "600", color: "#174665" }}>
                      MCDET Information
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Base Rate:</Typography>
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>{row.baseRate || "N/A"}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Comp Care:</Typography>
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>{row.compCare || "N/A"}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Termination Code:</Typography>
                        <Chip
                          sx={{ fontSize: "1rem" }}
                          size="small"
                          label={row.code || "N/A"}
                          variant="outlined"
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "500", color: "#566573" }}>Termination Date:</Typography>
                        <Typography variant="body2" sx={{ fontSize: "1rem" }}>{row.terminatedDate || "N/A"}</Typography>
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
  const [isRefreshingRosters, setIsRefreshingRosters] = useState(false);
  const [isTerminatingBulk, setTerminatingBulk] = useState(false);
  const [individualRosterUpdating, setIndividualRosterUpdating] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // NotificationDialog state
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { clinicSlug } = useParams();

  const CACHE_KEY = "terminatedPatientsCache";

  // Dynamic computation of code statistics
  const codeStatistics = useMemo(() => {
    if (!Array.isArray(terminatedPatients) || terminatedPatients.length === 0) {
      return [];
    }

    const codeMap = terminatedPatients.reduce((acc, patient) => {
      const code = patient.code?.toString() || 'Unknown';
      acc[code] = (acc[code] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(codeMap)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.code.localeCompare(b.code);
      });
  }, [terminatedPatients]);

  // Dynamic roster options for filtering
  const rosterOptions = useMemo(() => {
    return codeStatistics.map(stat => stat.code);
  }, [codeStatistics]);

  // Modified fetchTerminatedPatients function
  const fetchTerminatedPatients = async (forceRefresh = false) => {
    setLoading(true);

    try {
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          setTerminatedPatients(Array.isArray(parsedCache.data) ? parsedCache.data : []); //old processPatientData(data);
          return;
        }
      }

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

      // Handle the response data properly
      let patientsData = [];

      if (result.terminatedPatients) {
        // Check if we need to parse or if it's already parsed
        patientsData = typeof result.terminatedPatients === 'string'
          ? JSON.parse(result.terminatedPatients)
          : result.terminatedPatients;

        // Ensure we always have an array
        if (!Array.isArray(patientsData)) {
          console.warn('Expected array but got:', patientsData);
          patientsData = [];
        }
      }

      setTerminatedPatients(patientsData);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: patientsData,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error("Error fetching terminated patients:", error);
      handleFailure(`Failed to load terminated patients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const processPatientData = (patientsData) => {
    const parsedPatients = JSON.parse(patientsData);
    setTerminatedPatients(parsedPatients);
  };

  // Refresh terminated roster data
  const refreshTerminatedRosters = async () => {
    setIsRefreshingRosters(true);
    try {
      await fetchTerminatedPatients(true);
      handleSuccess("Roster termination data updated successfully!");
    } catch (error) {
      console.error("Error refreshing rosters:", error);
      handleFailure(error.message);
    } finally {
      setIsRefreshingRosters(false);
    }
  };


  // terminate all the patient who are not terminated
  const terminateBulk = async () => {
    setTerminatingBulk(true);
    setIndividualRosterUpdating(true);
    // get the current cached list of patients
    try{
      const cachedData = localStorage.getItem(CACHE_KEY);
      // filter the list by rosterStatus != "TE"
      let filteredPatients = [];

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        filteredPatients = parsedData.data.filter(patient => {
          return (
            patient.rosterStatus !== "TE" && // match status
            patient.rosterTerminationDate === null // or any condition you need
          );
        });
        // hit api call with this list
        await handleUpdatePatient(filteredPatients);
      }
    } catch (error) {
      console.error("Error terminate bulk:", error);
    }finally {
      setTerminatingBulk(false);
      setIndividualRosterUpdating(false);
    }



  }

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
      fetchClinicInfo().then(r => {});
      setClinicInfoFetched(true);
    }
  }, [clinicInfoFetched, clinicSlug]);

  useEffect(() => {
    if (clinicInfoFetched && clinicSlug) {
      fetchTerminatedPatients().then(r => {});
    }
  }, [clinicInfoFetched, clinicSlug]);

  // Filter data based on selected roster
  const filteredData = useMemo(() => {
    if (selectedCode === "all") {
      return terminatedPatients;
    }
    return terminatedPatients.filter(patient => patient.code?.toString() === selectedCode);
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
        <AdvancedDashboardLoading />
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

      // Always convert to array for consistent processing
      const patientsToUpdate = Array.isArray(patientData) ? patientData : [patientData];

      const response = await fetch(`${API_BASE_PATH}/outsideuse/getletestRoster/terminated/`, {
        method: "PUT",
        headers: {
          "Authorization": `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientsToUpdate),
      });

      if (response.status === 204) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data } = JSON.parse(cachedData);
          const patientsData = typeof data === "string" ? JSON.parse(data) : data;

          const updatedPatients = patientsData.map(patient => {
            // Find if this patient is in the update list
            const match = patientsToUpdate.find(p => p.hin === patient.hin);
            if (match) {
              return {
                ...patient,
                rosterTerminationDate: match.terminatedDate,
                rosterStatus: "TE",
              };
            }
            return patient;
          });

          setTerminatedPatients(updatedPatients);

          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: JSON.stringify(updatedPatients),
            timestamp: Date.now(),
          }));
        }

        handleSuccess(
          patientsToUpdate.length > 1
            ? `${patientsToUpdate.length} patients terminated successfully!`
            : "Patient terminated successfully!"
        );

      } else {
        throw new Error(`Failed to update patient(s)`);
      }
    } catch (error) {
      handleFailure(`Failed to update patient(s)`);
      throw error;
    }
  };

  return clinicInfo ? (
    <Layout1 clinicInfo={clinicInfo} title={"Roster Termination"} tabtitle={"Roster Termination"}>
      <div>
        {/* Main Content */}
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          <Grid container spacing={2}>
            {/* Dynamic Summary Cards */}
            <Grid item xs={12} md={2}
                  sx={{ position: "sticky", top: 16, height: "fit-content", alignSelf: "flex-start" }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                height: "100%",
              }}>
                {/* Dynamic code summary cards */}
                {codeStatistics.map((stat, index) => {
                  const colors = getCodeColor(stat.code, index);
                  return (
                    <Box key={stat.code} sx={{
                      p: 1,
                      bgcolor: colors.bg,
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
                        CODE {stat.code}
                      </Typography>
                      <Typography variant="h4" sx={{
                        fontWeight: "600",
                        color: colors.text,
                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                      }}>
                        {stat.count}
                      </Typography>
                    </Box>
                  );
                })}

                {/* Total patients card */}
                <Box sx={{
                  p: 1,
                  bgcolor: "#e8f5e8",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderTop: "2px solid #2e7d32",
                  mt: 1,
                }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                    letterSpacing: "0.5px",
                    fontWeight: "600",
                  }}>
                    TOTAL PATIENTS
                  </Typography>
                  <Typography variant="h4" sx={{
                    fontWeight: "700",
                    color: "#2e7d32",
                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                  }}>
                    {terminatedPatients.length}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Table content area */}
            <Grid item xs={12} md={10}>
              <Card sx={{
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                overflow: "hidden",
                maxHeight: "calc(100vh - 120px)",
                display: "flex",
                flexDirection: "column",
              }}>
                <CardContent sx={{ padding: "24px", paddingTop: "24px", flex: 1, overflow: "auto" }}>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                      <AdvancedDashboardLoading />
                      <Typography sx={{ ml: 2 }}>Loading termination data...</Typography>
                    </Box>
                  ) : (
                    <>
                      {/* Filters and controls */}
                      <Box>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 3, mt: 2 }}>
                          {/* Dynamic Roster Filter */}
                          {rosterOptions.length > 1 && (
                            <Grid item>
                              <FormControl sx={{
                                minWidth: 200,
                                height: 40,
                                "& .MuiInputBase-root": {
                                  height: 40,
                                },
                              }} size="small">
                                <InputLabel id="code-filter-label">Filter by Code</InputLabel>
                                <Select
                                  labelId="code-filter-label"
                                  id="code-filter"
                                  value={selectedCode}
                                  label="Filter by Code"
                                  onChange={handleCodeChange}
                                >
                                  <MenuItem value="all">All Codes ({terminatedPatients.length})</MenuItem>
                                  {codeStatistics.map((stat) => (
                                    <MenuItem key={stat.code} value={stat.code}>
                                      Code {stat.code} ({stat.count})
                                    </MenuItem>
                                  ))}
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
                                  backgroundColor: "#1565c0",
                                  borderColor: "rgba(255, 255, 255, 0.5)",
                                  color: "black",
                                },
                              }}
                            >
                              {isRefreshingRosters ? "Updating..." : "Refresh Data"}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              onClick={terminateBulk}
                              disabled={isTerminatingBulk || individualRosterUpdating}
                              startIcon={isTerminatingBulk ? <CircularProgress size={16} /> : <RefreshIcon />}
                              sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                fontFamily: "sans-serif",
                                fontVariantCaps: "normal",
                                color: "white",
                                borderColor: "rgba(255, 255, 255, 0.3)",
                                backgroundColor: "#1976d2",
                                "&:hover": {
                                  backgroundColor: "#1565c0",
                                  borderColor: "rgba(255, 255, 255, 0.5)",
                                  color: "black",
                                },
                              }}
                            >
                              {isTerminatingBulk ? "Updating..." : "Terminate all"}
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
                              {/*<TableHead>*/}
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                  <TableCell sx={{
                                    fontWeight: "600",
                                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                    fontSize: "0.875rem",
                                  }}>HIN</TableCell>
                                  <TableCell sx={{
                                    fontWeight: "600",
                                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                    fontSize: "0.875rem",
                                  }}>Patient Name</TableCell>
                                  <TableCell sx={{
                                    fontWeight: "600",
                                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                    fontSize: "0.875rem",
                                  }}>Oscar Status</TableCell>
                                  <TableCell sx={{
                                    fontWeight: "600",
                                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                    fontSize: "0.875rem",
                                  }}>Demographic</TableCell>
                                  <TableCell align="right" sx={{
                                    fontWeight: "600",
                                    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                    fontSize: "0.875rem",
                                  }}>Code</TableCell>
                                </TableRow>
                              {/*</TableHead>*/}
                              <TableBody>
                                {getCurrentPageData().map((row) => (
                                  <EnhancedTerminatedRow key={row.hin} row={row} onUpdate={handleUpdatePatient} emrHomeUrl={localStorage.getItem("emrHomeUrl")} />
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

                      {/* Pagination controls */}
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
        <NotificationDialog open={openModal} onClose={handleCloseApp} isError={isError} content={modalContent} />
      </div>
    </Layout1>
  ) : (
      <AdvancedDashboardLoading />
  );
};