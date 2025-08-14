import React, { useState, useEffect, useRef } from "react";
import API_BASE_PATH from "../../../../../apiConfig";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Paper,
  Collapse,
  Chip, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  ExpandMore,
  ExpandLess,
  ErrorOutline,
  Visibility,
  VisibilityOff,
  FilterList,
  Dashboard as DashboardIcon, Phone, CallEnd,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import CardHeader from "@mui/material/CardHeader";
import Layout1 from "../../../Layout1";
import { useParams } from "react-router-dom";
import MKBox from "../../../../../components/MKBox";
import MetricCard from "../../../resources/MetricCard";
import TablePagination from "@mui/material/TablePagination";
import BillingBreakdownDataTable from "./billingComponents/BillingBreakdownDataTable";
import { fontSize } from "@mui/system";
import MKTypography from "../../../../../components/MKTypography";
import AdvancedDashboardLoading from "../../../processes/AdvancedDashboardLoading";
import ProfessionalGraph from "../../../resources/PatternBreakdownCard";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import NotificationDialog from "../../../resources/Notification";
import { Drawer } from "@mui/material";
import RingCentral from "@rc-ex/core";
import WebPhone from "ringcentral-web-phone";
import { Buffer } from "buffer";
import { getCurrentDate } from "../../../resources/utils";
import { makeStyles } from "@mui/styles";
import {useClinicInfo} from "../../../resources/useClinicInfo.js";

window.Buffer = Buffer;

// Global WebRTC variables
let webPhone = null;
let remoteStream = new MediaStream();
let session = null;

const RAServiceCodeAnalytics = () => {
  // Visibility states
  const [showSummaryCards, setShowSummaryCards] = useState(true);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const [filters, setFilters] = useState({
    target_service_code: "K030A",
    // service_date_from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0], // Jan 1st of current year
    service_date_from: new Date(new Date().setDate(new Date().getDate() - 365)).toISOString().split("T")[0], // 365 days ago
    service_date_to: new Date().toISOString().split("T")[0],
    // min_occurrences: 2,
  });
  // const [clinicInfo, setClinicInfo] = useState(null);
  // const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const { clinicSlug } = useParams();

  const [inputValues, setInputValues] = useState({
    target_service_code: "K030A",
    service_date_from: new Date(new Date().setDate(new Date().getDate() - 365)).toISOString().split("T")[0], // 365 days ago
    service_date_to: new Date().toISOString().split("T")[0], // today
  });


  const [analyticsData, setAnalyticsData] = useState(null);
  const [listDoctors, setListDoctors] = useState(null);
  const [selectdoctor, setSelectDoctor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const [activeFilter, setActiveFilter] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [buttonRedirect, setButtonRedirect] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState("Something went wrong!");
  const [user_type, setUserType] = useState("");
  const [title, setTitle] = useState("Diabetes Patient Billing Analytics");

  // WebRTC state variables
  const [webPhoneStatus, setWebPhoneStatus] = useState("Initializing");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState("Disconnected");
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [currentPatientPhone, setCurrentPatientPhone] = useState("");
  const [currentPatientName, setCurrentPatientName] = useState("");
  const remoteAudioRef = useRef(null);
  const [RINGCENTRAL_CONFIG, setRingCentralConfig] = useState(null);

  const handleCloseApp = () => {
    setOpenModal(false);
    redirectHome();
  };
  const handleFailure = (message) => {
    setModalContent(message);
    setIsError(true);
    setOpenModal(true);
  };
  const handleSuccess = (message) => {
    setModalContent(message);
    setIsError(false);
    setOpenModal(true);
  };
  const redirectHome = () => {
    setOpenModal(false);
    if (redirect) {
      window.location.href = `/clinic/${clinicSlug}/`;
    }
  };
  const tabtitle = "RA Analytics by ND Health";
  const { clinicInfo, locationsData, notice, loading1 } = useClinicInfo(clinicSlug);


  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    setUserType(localStorage.getItem("user_type"));
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const localData = JSON.parse(localStorage.getItem("analyticsData"));
      if (localData) {
        params.append("latest_ref_date", localData.latest_ref_date);
        if (localData.username) {
          params.append("username", localData.username);
        }
        if (user_type === "clinic" && localData.data !== "select doctor first" && localData.doctorOhip) {
          params.append("current_doctorOhip", localData.doctorOhip);

        }
      }

      const accessToken = localStorage.getItem("accessToken");
      params.append("user_type", user_type);
      const response = await fetch(
        `${API_BASE_PATH}/billing/ra-analytics?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage("Please Login first to use this service");
        }

      }
      const data = await response.json();
      // Check if the response indicates "Already latest"
      if (data.data === "Already latest") {
        setSelectDoctor(false);
        if (localData) {
          setAnalyticsData(localData);
          handleSuccess("Using locally stored data.");
        } else {
          handleFailure("No local data available.");
        }
      } else if (data.data === "select doctor first") {
        // goal popop for doctors , ask to select which doctor you are looking for
        localStorage.setItem("analyticsData", JSON.stringify(data));
        setListDoctors(data.doctors);
        setSelectDoctor(true);
      } else if (data.detail === "Invalid token.") {
        setError(
          <>
            Please Login first to use this service. -- {" "}
            <Link to="/login">Login</Link>
          </>,
        );
      } else {
        // Save the new data to localStorage
        localStorage.setItem("analyticsData", JSON.stringify(data));
        localStorage.setItem("latestRefDate", data.latest_ref_date);
        setAnalyticsData(data);
        handleSuccess("Data calculations done.");
        setSelectDoctor(false);
      }
    } catch (err) {
      throw err;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (analyticsData) {
      if (user_type === "clinic" && analyticsData.doctorOhip) {
        setTitle(`Diabetes Patient Billing Analytics : ${analyticsData.doctorOhip}`);
      }
    }
  }, [analyticsData]);
  useEffect(() => {
    const localLatestRefDate = localStorage.getItem("latestRefDate");
    // const currentFilters = JSON.stringify(filters);

    // // Check if the local data is still valid
    // if (localLatestRefDate && localLatestRefDate === filters.service_date_to) {
    //   const localData = JSON.parse(localStorage.getItem("analyticsData"));
    //   if (localData) {
    //     setAnalyticsData(localData);
    //     handleSuccess("Using locally stored data.");
    //     return;
    //   }
    // }
    fetchAnalytics().then(r => {});
  }, [filters]);
  //set pages
// Update your useEffect for pagination calculation
  useEffect(() => {
    const dataToUse = filteredData || analyticsData?.detailed_analysis;
    if (dataToUse) {
      const total = dataToUse.length;
      setTotalItems(total);
      setTotalPages(Math.ceil(total / rowsPerPage));
    }
  }, [analyticsData, filteredData, rowsPerPage]);

  const handleInputChange = (field, value) => {
    setInputValues((prev) => ({ ...prev, [field]: value }));
  };
  const handleSearch = () => {
    const localData = JSON.parse(localStorage.getItem("analyticsData"));
    if ( localData.analysis_parameters.date_range.from !== inputValues.service_date_from || localData.analysis_parameters.date_range.to !== inputValues.service_date_to) {
      setFilters(inputValues);
      setPage(0);
    }
    //

  };

  const handleClear = () => {
    const defaultValues = {
      target_service_code: "K030A",
      service_date_from: new Date(new Date().setDate(new Date().getDate() - 365)).toISOString().split("T")[0], // 365 days ago
      service_date_to: new Date().toISOString().split("T")[0],
      // min_occurrences: 2,
    };
    setInputValues(defaultValues);
    setFilters(defaultValues);
    // Clear local storage
    localStorage.removeItem("analyticsData");
    localStorage.removeItem("latestRefDate");
    setAnalyticsData(null);
    setSelectDoctor(true);
  };
  const getSeverityColor = (occurrences) => {
    if (occurrences >= 5) return "#dc2626";
    if (occurrences >= 3) return "#d97706";
    return "#2563eb";
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };
  const toggleRowExpansion = (index) => {
    const newExpanded = new Set();

    // If the clicked row is already expanded, close it (empty set)
    // If the clicked row is not expanded, open only that row
    if (!expandedRows.has(index)) {
      newExpanded.add(index);
    }

    setExpandedRows(newExpanded);
  };
  const applyFilter = (filterType) => {
    if (!analyticsData?.detailed_analysis) return;

    let filtered = [...analyticsData.detailed_analysis];

    if (activeFilter === filterType) {
      // If clicking the same filter, clear it
      setPage(0);
      setActiveFilter(null);
      setFilteredData(null);
      return;
    }

    switch (filterType) {
      case 'eligible_q040':
        filtered = filtered.filter(item => item.eligable_for_q040 > 0);
        break;
      case 'billing_error':
        filtered = filtered.filter(item => item.error > 0);
        break;
      case 'q040_error':
        filtered = filtered.filter(item => item.q040Error > 0);
        break;
      case 'twotimes_k030':
        filtered = filtered.filter(item => item.twotimes_k030 > 0);
        break;
      case 'billed':
        // Clear all filters - show all data
        setActiveFilter(null);
        setFilteredData(null);
        setPage(0); // Reset to first page
        return;
      default:
        filtered = analyticsData.detailed_analysis;
    }

    setActiveFilter(filterType);
    setFilteredData(filtered);
    setPage(0); // Reset to first page
  };

  // Update your paginatedData calculation
  const paginatedData = (filteredData || analyticsData?.detailed_analysis)?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  ) || [];

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };
  // Toggle functions
  const toggleSummaryCards = () => {
    setShowSummaryCards(!showSummaryCards);
  };

  // fetch third-party-calling-setup
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(
          `${API_BASE_PATH}/third-party-call-setup/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const config = data[0];
          setRingCentralConfig({
            server: config.serverurl,
            clientId: config.clientid,
            clientSecret: config.clientSecret,
            jwt: config.jwt,
          });
        } else {
          console.warn("No config found for this clinic/user.");
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
      }
    };

    fetchConfig().then(r => {
    });
  }, []);

  // Initialize WebRTC on component mount
  useEffect(() => {
    checkMicAccess().then(isGranted => {
      console.log("Mic access:", isGranted);
    });
    initWebPhone().then(r => {
    });
  }, [RINGCENTRAL_CONFIG]);

  useEffect(() => {
    if (!remoteAudioRef.current) {
      console.warn("Audio element is not yet available.");
      return;
    }
    remoteAudioRef.current.muted = false;
  }, []);

  // WebRTC Functions
  const checkMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.warn("🚫 Microphone access denied or unavailable:", err.name);
      return false;
    }
  };

  const initWebPhone = async () => {
    try {
      const rc = new RingCentral({
        server: RINGCENTRAL_CONFIG.server,
        clientId: RINGCENTRAL_CONFIG.clientId,
        clientSecret: RINGCENTRAL_CONFIG.clientSecret,
      });
      await rc.authorize({ jwt: RINGCENTRAL_CONFIG.jwt });

      const res = await rc.restapi()
        .clientInfo()
        .sipProvision()
        .post({ sipInfo: [{ transport: "WSS" }] });

      const sipInfo = res.sipInfo?.[0];
      if (!sipInfo) throw new Error("No sipInfo returned");

      webPhone = new WebPhone({
        sipInfo: [
          {
            username: sipInfo.username,
            password: sipInfo.password,
            authorizationId: sipInfo.authorizationId,
            domain: sipInfo.domain,
            outboundProxy: sipInfo.outboundProxy,
            transport: "WSS",
            wsServers: "wss://" + sipInfo.outboundProxy,
          },
        ],
        appKey: RINGCENTRAL_CONFIG.clientId,
        appName: "RA Analytics WebRTC",
        appVersion: "1.0.0",
      });

      // console.log('✅ webPhone ready', webPhone);

      if (!webPhone.userAgent) {
        // console.error('🚫 userAgent is not available');
        return;
      }

      webPhone.userAgent.on("registered", () => {
        // console.log('Registered event fired');
        setWebPhoneStatus("Registered");
      });

      webPhone.userAgent.on("invite", session => {
        // console.log('Incoming session', session);
      });

      webPhone.userAgent.register();
    } catch (err) {
      // console.error('WebPhone init failed', err);
      setWebPhoneStatus("Error: " + err.message);
    }
  };

  const makeCall = (phoneNumber, patientName) => {
    if (!webPhone || webPhoneStatus !== "Registered") {
      alert("WebPhone not ready. Please wait for registration.");
      return;
    }

    setCurrentPatientPhone(phoneNumber);
    setCurrentPatientName(patientName);
    setShowCallDialog(true);
    setCallStatus("Calling...");

    // Clean phone number (remove non-digits except +)
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");

    session = webPhone.userAgent.invite(`sip:${cleanPhone}@${webPhone.sipInfo.domain}`, {
      media: {
        constraints: {
          audio: true,
          video: false,
        },
        render: {
          remote: remoteAudioRef.current,
        },
      },
    });

    session.on("accepted", () => {
      const pc = session.sessionDescriptionHandler.peerConnection;

      pc.getReceivers().forEach(receiver => {
        if (receiver.track && receiver.track.kind === "audio") {
          remoteStream.addTrack(receiver.track);
        }
      });

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.muted = false;
        remoteAudioRef.current.play().catch((e) =>
          console.warn("Playback failed", e),
        );
      }

      setIsCallActive(true);
      setCallStatus("Connected");
    });

    session.on("terminated", () => {
      setCallStatus("Disconnected");
      setIsCallActive(false);
      // console.log('📴 Call ended');
    });

    session.on("failed", () => {
      setCallStatus("Failed");
      setIsCallActive(false);
      // console.log('📴 Call failed');
    });
  };

  const handleHangUp = () => {
    if (!session) return;
    session.terminate();
    setCallStatus("Disconnected");
    setIsCallActive(false);
  };

  const closeCallDialog = () => {
    if (isCallActive) {
      handleHangUp();
    }
    setShowCallDialog(false);
    setCurrentPatientPhone("");
    setCurrentPatientName("");
  };
  const useStyles = makeStyles(() => ({
    narrowCell: {
      padding:'0.3rem 1rem'
      // whiteSpace: 'nowrap',
      // overflow: 'hidden',
      // textOverflow: 'ellipsis',
    },
  }));

// In your component:
  const classes = useStyles();
  return (
    <Layout1 clinicInfo={clinicInfo} tabtitle={tabtitle} title={title}>
      <div>
        <Box sx={{ minHeight: "100vh", p: 1, bgcolor: "background.default" }}>

          {/*/!* WebRTC Status Indicator *!/*/}
          {/*<Box sx={{ mb: 2, p: 1, bgcolor: webPhoneStatus === 'Registered' ? 'success.light' : 'warning.light', borderRadius: 1 }}>*/}
          {/*  <Typography variant="caption">*/}
          {/*    WebPhone Status: {webPhoneStatus}*/}
          {/*  </Typography>*/}
          {/*</Box>*/}
          {/* Hidden Audio Element for WebRTC */}
          <audio
            ref={remoteAudioRef}
            autoPlay
            playsInline
            style={{ width: 0, height: 0, position: "absolute", left: "-9999px" }}
          />

          {/* Call Dialog */}
          <Dialog open={showCallDialog} onClose={closeCallDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              Calling {currentPatientName}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {currentPatientPhone}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Status: {callStatus}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  {!isCallActive ? (
                    <IconButton
                      color="primary"
                      size="large"
                      sx={{ bgcolor: "primary.main", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
                      disabled={callStatus === "Calling..."}
                    >
                      <Phone />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="error"
                      size="large"
                      onClick={handleHangUp}
                      sx={{ bgcolor: "error.main", color: "white", "&:hover": { bgcolor: "error.dark" } }}
                    >
                      <CallEnd />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeCallDialog}>Close</Button>
            </DialogActions>
          </Dialog>
          {/* Summary Cards - Collapsible */}
          <Collapse in={showSummaryCards}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    {/*<CircularProgress />*/}
                  </Box>
                ) : error ? (
                  <></>
                ) : analyticsData ? (
                  <>
                    {/* Summary Cards */}
                    <Grid container spacing={0} sx={{ mb: 4 }} justifyContent="center">
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Patients"
                          value={analyticsData.summary.total_hins_with_multiple_codes}
                          suffix=""
                          icon="users"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="success"
                          size="extraSmall"
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Billed"
                          value={analyticsData.summary.total_service_code_instances}
                          suffix=""
                          icon="invoice"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="warning"
                          size="extraSmall"
                          clickable={true}
                          isActive={activeFilter === 'billed'}
                          onClick={() => applyFilter('billed')}
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Errors"
                          value={analyticsData.summary.total_erros}
                          suffix=""
                          icon="error"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="error"
                          size="extraSmall"
                          clickable={true}
                          isActive={activeFilter === 'billing_error'}
                          onClick={() => applyFilter('billing_error')}
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Two K030As"
                          value={analyticsData.summary.total_twotimes_k030}
                          suffix=""
                          icon="yes"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="success"
                          size="extraSmall"
                          clickable={true}
                          isActive={activeFilter === 'twotimes_k030'}
                          onClick={() => applyFilter('twotimes_k030')}
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Eligible Q040A"
                          value={analyticsData.summary.total_eligable_for_q040}
                          suffix=""
                          icon="yes"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="success"
                          size="extraSmall"
                          clickable={true}
                          isActive={activeFilter === 'eligible_q040'}
                          onClick={() => applyFilter('eligible_q040')}
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Claimed"
                          value={`${formatCurrency(analyticsData.summary.total_amount_claimed)}K`}
                          suffix=""
                          icon="invoice"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="secondary"
                          size="extraSmall"
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Total Paid"
                          value={`${formatCurrency(analyticsData.summary.total_amount_paid)}K`}
                          suffix=""
                          icon="paid"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="success"
                          size="extraSmall"
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Potential"
                          value={`${formatCurrency(analyticsData.summary.total_potential)}K`}

                          suffix=""
                          icon="unpaid"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="info"
                          size="extraSmall"
                          subtitle={`+ ${formatCurrency(analyticsData.summary.total_amount_claimed - analyticsData.summary.total_amount_paid)}k`}
                        />
                      </Grid>
                      <Grid item xs={6} md={1}>
                        <MetricCard
                          title="Total"
                          value={`${formatCurrency(analyticsData.summary.total_potential + analyticsData.summary.total_amount_claimed)}K`}
                          suffix=""
                          icon="revenue"
                          // trend="up"
                          // trendValue="+0.3%"
                          color="primary"
                          size="extraSmall"
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Collapse>

          {/* Summary Cards Toggle Arrow */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Tooltip title={showSummaryCards ? "Hide Summary Cards" : "Show Summary Cards"}>
              <IconButton
                onClick={toggleSummaryCards}
                sx={{
                  backgroundColor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { backgroundColor: "action.hover" },
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {showSummaryCards ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={1}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                {/*<CircularProgress />*/}
              </Box>
            ) : error ? (
              <></>
            ) : analyticsData ? (
              <>
                {/* Filters Panel - Collapsible */}
                <Drawer
                  anchor="left"
                  open={showFiltersDrawer}
                  onClose={() => setShowFiltersDrawer(false)}
                  variant="temporary"
                >
                  <Box sx={{ width: 500, p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Analysis Filters
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {user_type === "clinic" &&
                        <FormControl fullWidth>
                          <InputLabel sx={{ minHeight: "2.5rem" }} id="province-label">Select Ohip Number</InputLabel>
                          <Select
                            labelId="Select-Ohip-Number"
                            id="select-ohip"
                            label="Select Ohip Number"
                            fullWidth
                            style={{ minWidth: "20rem", minHeight: "2.5rem" }}
                            // value={userData.province}
                            onChange={(e) => handleInputChange("doctorOhip", e.target.value)}
                          >
                            {listDoctors.map((option) => (
                              <MenuItem key={option.ohipBilling} value={option.ohipBilling}>
                                {option.user__first_name} {option.user__last_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      }

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="From Date"
                          value={inputValues.service_date_from}
                          onChange={(newValue) =>
                            handleInputChange("service_date_from", newValue?.format("YYYY-MM-DD"))
                          }
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <DatePicker
                          label="To Date"
                          value={inputValues.service_date_to}
                          onChange={(newValue) =>
                            handleInputChange("service_date_to", newValue?.format("YYYY-MM-DD"))
                          }
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleSearch();
                            setShowFiltersDrawer(false);
                          }}
                          fullWidth
                        >
                          Search
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            handleClear();
                            setShowFiltersDrawer(false);
                          }}
                          fullWidth
                        >
                          Last 365 Days
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    {/*Distribution of K030 Invoice Counts by Number of Times Billed per Patient,Frequency of K030 Billing Instances per Patient */}
                    <ProfessionalGraph
                      title="Frequency of K030A Billing Instances per Patient ( with errors )"
                      data={analyticsData.summary.occurrence_distribution}
                      size="large"
                      xAxisTitle="x Times"
                      yAxisTitle="Billed"
                    />
                  </Box>
                </Drawer>

                {/* Show Filter Panel Button when hidden */}
                {!showFiltersDrawer && (
                  <Box
                    sx={{
                      position: "fixed",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1300,
                    }}
                  >
                    <Tooltip title="Filter">
                      <IconButton
                        onClick={() => setShowFiltersDrawer(true)}
                        sx={{
                          backgroundColor: "background.paper",
                          boxShadow: 3,
                          "&:hover": { backgroundColor: "action.hover" },
                          border: "1px solid",
                          borderColor: "divider",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <FilterList />
                      </IconButton>
                    </Tooltip>
                  </Box>

                )}
              </>
            ) : (
              <></>
            )}

            {/* Main Content */}
            <Grid item xs={12} md={showFiltersDrawer ? 12 : 12}>
              {loading ? (
                // <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", }}>
                <AdvancedDashboardLoading />
                // </Box>
              ) : error ? (
                <Card sx={{ p: 1, bgcolor: "error.light", color: "white" }}>
                  <Typography variant="h6" color="#ffffff">
                    <ErrorOutline sx={{ mr: 1 }} />
                    {error}
                  </Typography>
                </Card>
              ) : selectdoctor ? (
                <>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    // sx={{ minHeight: "100vh" }} // optional: full height vertical center
                  >
                    <Grid item xs={12} md={6}>
                      <Grid item sx={{ p: 1, m: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Analysis Filters
                        </Typography>
                      </Grid>
                      {user_type === "clinic" &&
                        <Grid item sx={{ p: 1, m: 1 }}>
                          <FormControl fullWidth>
                            <InputLabel sx={{ minHeight: "2.5rem" }} id="province-label">Select Ohip Number</InputLabel>
                            <Select
                              labelId="Select-Ohip-Number"
                              id="select-ohip"
                              label="Select Ohip Number"
                              fullWidth
                              style={{ minWidth: "20rem", minHeight: "2.5rem" }}
                              // value={userData.province}
                              onChange={(e) => handleInputChange("doctorOhip", e.target.value)}
                            >
                              {listDoctors.map((option) => (
                                <MenuItem key={option.ohipBilling} value={option.ohipBilling}>
                                  {option.user__first_name} {option.user__last_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      }
                      <Grid item sx={{ p: 1, m: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="From Date"
                              value={inputValues.service_date_from}
                              onChange={(newValue) =>
                                handleInputChange("service_date_from", newValue?.format("YYYY-MM-DD"))
                              }
                              renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                            <DatePicker
                              label="To Date"
                              value={inputValues.service_date_to}
                              onChange={(newValue) =>
                                handleInputChange("service_date_to", newValue?.format("YYYY-MM-DD"))
                              }
                              renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                          </LocalizationProvider>

                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                handleSearch();
                                setShowFiltersDrawer(false);
                              }}
                              fullWidth
                            >
                              Search
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => {
                                handleClear();
                                setShowFiltersDrawer(false);
                              }}
                              fullWidth
                            >
                              Last 365 Days
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                </>
              ) : analyticsData ? (
                <>
                  {/* Detailed Analysis Table */}
                  <TableContainer component={Paper}>
                    <Table>
                      {/*<TableHead>*/}
                      <TableRow>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>Name</TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>HIN</TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>KO30A<MKTypography variant="caption" color={"error"}>(with error)</MKTypography>
                        </TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>Q040A<MKTypography variant="caption" color={"error"}>(with error)</MKTypography>
                        </TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>Amount Claimed</TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>Amount Paid</TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>BH</TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>Demographic</TableCell>
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>Bill Suggestion</TableCell>
                        {/*<TableCell sx={{*/}
                        {/*  fontWeight: "600",*/}
                        {/*  fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",*/}
                        {/*  fontSize: "0.875rem",*/}
                        {/*}}>Phone</TableCell>*/}
                        <TableCell sx={{
                          fontWeight: "600",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          fontSize: "0.875rem",
                        }}>Phone</TableCell>
                      </TableRow>
                      {/*</TableHead>*/}
                      <TableBody>
                        {paginatedData.map((item, index) => (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell onClick={() => toggleRowExpansion(index)}>{item.details.name}</TableCell>
                              <TableCell>{item.hin}</TableCell>
                              <TableCell>
                                <Typography
                                  sx={{
                                    color: getSeverityColor(item.total_occurrences),
                                  }}
                                >
                                  {item.total_occurrences}
                                  {item.error ? (
                                    <MKTypography variant="caption" color={"error"}>({item.error})</MKTypography>
                                  ) : (
                                    <span></span>
                                  )}

                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                >
                                  {item.q040}
                                  {item.q040Error ? (
                                    <MKTypography variant="caption" color={"error"}>({item.q040Error})</MKTypography>
                                  ) : (
                                    <span></span>
                                  )}

                                </Typography>
                              </TableCell>
                              <TableCell>
                                {formatCurrency(item.total_amount_claimed)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(item.total_amount_paid)}
                              </TableCell>
                              <TableCell>
                                {item.details.demo ? (
                                  <Link
                                    fontWeight={"bolder"}
                                    target="_blank"
                                    // href=
                                    to={`${analyticsData.url}oscar/billing/CA/ON/billinghistory.jsp?demographic_no=${item.details.demo}&last_name=${item?.details?.name?.includes(",") ? item.details.name.split(",")[1].trim() : ""}&first_name=${item?.details?.name?.includes(",") ? item.details.name.split(",")[0].trim() : ""}&orderby=appointment_date&displaymode=appt_history&dboperation=appt_history&limit1=0&limit2=10`}>BH
                                  </Link>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>
                                {item.details.demo ? (
                                  <Link
                                    fontWeight={"bolder"}
                                    target="_blank"
                                    to={`${analyticsData.url}oscar/demographic/demographiccontrol.jsp?demographic_no=${item.details.demo}&displaymode=edit&dboperation=search_detail`}
                                  >Demo</Link>
                                ) : (
                                  "-"
                                )}

                              </TableCell>
                              <TableCell>
                                <TableCell>
                                  {item.systemq040 ? (<>
                                    Q040 billed <br />
                                    for {item.systemq040.service_date} <br />
                                    on {item.systemq040.createdDate}
                                  </>):(
                                    (item.total_occurrences - item.error < 3 && (item.q040 - item.q040Error) < 1) ? (<>Call
                                      Patient and Bill K030</>) :
                                        (item.total_occurrences - item.error < 3 && (item.q040 - item.q040Error) === 1) ? (<>Call
                                      Patient and Bill K030</>) :
                                        (item.total_occurrences - item.error === 0 && (item.q040 - item.q040Error) === 0) ? (<>Call
                                      Patient and Bill K030</>) :
                                        (item.total_occurrences - item.error === 0 && (item.q040 - item.q040Error) > 1) ? (<>Call
                                      Patient and Bill K030</>) :
                                        (item.total_occurrences - item.error === 3 && (item.q040 - item.q040Error) < 1) ? (
                                      <Link
                                      target="_blank"
                                      to={`${analyticsData.url}oscar/billing/CA/ON/billingOB.jsp?billRegion=ON&billForm=MFP&hotclick=&appointment_no=0&demographic_name=${item.details.name}&demographic_no=${item.details.demo}&providerview=${analyticsData.apptProvider_no}&user_no=${analyticsData.user_no}&apptProvider_no=${analyticsData.apptProvider_no}&AppointmentDate=${getCurrentDate()}&deroster=Q040A&hin=${item.hin}`}>
                                  Bill Q040A
                                </Link>) :
                                (item.total_occurrences - item.error > 3 && (item.q040 - item.q040Error) < 1) ? (
                                <Link
                                  target="_blank"
                                  to={`${analyticsData.url}oscar/billing/CA/ON/billingOB.jsp?billRegion=ON&billForm=MFP&hotclick=&appointment_no=0&demographic_name=${item.details.name}&demographic_no=${item.details.demo}&providerview=${analyticsData.apptProvider_no}&user_no=${analyticsData.user_no}&apptProvider_no=${analyticsData.apptProvider_no}&AppointmentDate=${getCurrentDate()}&deroster=Q040A&hin=${item.hin}`}>
                                  Bill Q040A
                                </Link>) :
                                (<><OfflinePinIcon></OfflinePinIcon></>)

                                    )}
                                </TableCell>

                              </TableCell>
                              {/*<TableCell>{item.details.phone}</TableCell>*/}
                              <TableCell>
                                {item.details.phone && webPhoneStatus === "Registered" ? (
                                  <Tooltip title="Call Patient">
                                    <IconButton
                                      color="primary"
                                      onClick={() => makeCall(item.details.phone, item.details.name)}
                                      disabled={isCallActive}
                                    >
                                      <Phone />
                                    </IconButton>
                                    {item.details.phone}
                                  </Tooltip>
                                ) : (
                                  <Tooltip
                                    title={!item.details.phone ? "No phone number" : "Direct call not available"}>
                                    <span>
                                      <IconButton disabled>
                                        <Phone />
                                      </IconButton>
                                    </span>
                                    {item.details.phone}
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                            {expandedRows.has(index) && Object.keys(item.date_breakdown || {}).length > 0 && (
                              <BillingBreakdownDataTable dateBreakdown={item.date_breakdown} />
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* Pagination */}
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
                  }}>
                    <Pagination
                      count={totalPages} // Total number of rows, not pages
                      page={page + 1}
                      onChange={handleChangePage}
                      showFirstButton
                      showLastButton
                      component="div"
                      color="primary"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        "& .MuiPaginationItem-root": {
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        },
                      }}

                    />
                  </Box>
                </>
              ) : (
                <Card sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="h6">No billing Data Available</Typography>
                  <Typography variant="body2">
                    Click "Analyze" to generate service code analytics
                  </Typography>
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>
        <NotificationDialog
          open={openModal}
          onClose={handleCloseApp}
          content={modalContent}
          isError={isError}
          closeButtonLabel={buttonRedirect}
        />
      </div>
    </Layout1>
  );
};

export default RAServiceCodeAnalytics;