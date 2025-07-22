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
  Chip,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Dashboard as DashboardIcon,
  Phone,
  CallEnd,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";

// WebRTC imports
import WebPhone from 'ringcentral-web-phone';
import RingCentral from '@rc-ex/core';
import { Buffer } from 'buffer';
import NotificationDialog from "../../../resources/Notification";
import BillingBreakdownDataTable from "./billingComponents/BillingBreakdownDataTable";
import AdvancedDashboardLoading from "../../../processes/AdvancedDashboardLoading";
import Layout1 from "../../../Layout1";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
window.Buffer = Buffer;

// Global WebRTC variables
let webPhone = null;
let remoteStream = new MediaStream();
let session = null;

const RAServiceCodeAnalytics1 = () => {
  // Existing state variables
  const [showSummaryCards, setShowSummaryCards] = useState(true);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [filters, setFilters] = useState({
    target_service_code: "K030A",
    service_date_from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    service_date_to: new Date().toISOString().split("T")[0],
  });
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const { clinicSlug } = useParams();
  const [inputValues, setInputValues] = useState({
    target_service_code: "K030A",
    service_date_from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    service_date_to: new Date().toISOString().split("T")[0],
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [listDoctors, setListDoctors] = useState(null);
  const [selectdoctor, setSelectDoctor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [expandedRows, setExpandedRows] = useState(new Set());
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
  const [webPhoneStatus, setWebPhoneStatus] = useState('Initializing');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('Disconnected');
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [currentPatientPhone, setCurrentPatientPhone] = useState('');
  const [currentPatientName, setCurrentPatientName] = useState('');
  const remoteAudioRef = useRef(null);

  // WebRTC Configuration - Replace with your actual credentials
  const RINGCENTRAL_CONFIG = {
    server: 'https://platform.ringcentral.com', // or your sandbox URL
    clientId: '47jROtbFVxLf4wRYj4T0v1',
    clientSecret: 'efssXPdEG89eBb0PQQFG5JVFi5lfnRreYeoAoWLyfQPD',
    jwt: 'eyJraWQiOiI4NzYyZjU5OGQwNTk0NGRiODZiZjVjYTk3ODA0NzYwOCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJodHRwczovL3BsYXRmb3JtLnJpbmdjZW50cmFsLmNvbS9yZXN0YXBpL29hdXRoL3Rva2VuIiwic3ViIjoiMjI1NzI3MDUxIiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5yaW5nY2VudHJhbC5jb20iLCJleHAiOjM4OTg1Mzg3MTYsImlhdCI6MTc1MTA1NTA2OSwianRpIjoiSl90OGRveEpTMldvMXdFTHhMa1pRZyJ9.X8-9aLH4u3nmlOgSOq2Ewcdk5_tTD2xFullxk4N_WdmRkHSzBJqIM1HMK-dUbWbyNOdotqR3uxZIhadyc_RYP5R7Y_J3iICMSxFU2Zc4Uo2UgMEZF0OXJS1zhaqflpQamqPp3bsfzql6fQJF4l6ltdzGmc9tlcjir1-qyFFbU57E9vvCV8vFOymkutR47Whs_BYjX-1u0C-DF-p1RE58dhiCemM2bp9aZ4nHjpttJCKMZrzoIKQPVtDqFwp0Fd_uWKV3_-vnfBbRinLpQCK3z54jmraG7xtgXhgROgVsH5kRn_2lFFsM7W-eILHvqIMeB4l-WOv1fQf8drMQEFHPOw'
  };

  // Initialize WebRTC on component mount
  useEffect(() => {
    checkMicAccess().then(isGranted => {
      console.log("Mic access:", isGranted);
    });
    initWebPhone();
  }, []);

  useEffect(() => {
    if (!remoteAudioRef.current) {
      console.warn('Audio element is not yet available.');
      return;
    }
    remoteAudioRef.current.muted = false;
  }, []);

  // WebRTC Functions
  const checkMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Microphone access granted");
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
        .post({ sipInfo: [{ transport: 'WSS' }] });

      const sipInfo = res.sipInfo?.[0];
      if (!sipInfo) throw new Error('No sipInfo returned');

      webPhone = new WebPhone({
        sipInfo: [
          {
            username: sipInfo.username,
            password: sipInfo.password,
            authorizationId: sipInfo.authorizationId,
            domain: sipInfo.domain,
            outboundProxy: sipInfo.outboundProxy,
            transport: 'WSS',
            wsServers: 'wss://' + sipInfo.outboundProxy
          }
        ],
        appKey: RINGCENTRAL_CONFIG.clientId,
        appName: 'RA Analytics WebRTC',
        appVersion: '1.0.0'
      });

      console.log('✅ webPhone ready', webPhone);

      if (!webPhone.userAgent) {
        console.error('🚫 userAgent is not available');
        return;
      }

      webPhone.userAgent.on('registered', () => {
        console.log('Registered event fired');
        setWebPhoneStatus('Registered');
      });

      webPhone.userAgent.on('invite', session => {
        console.log('Incoming session', session);
      });

      webPhone.userAgent.register();
    } catch (err) {
      console.error('WebPhone init failed', err);
      setWebPhoneStatus('Error: ' + err.message);
    }
  };

  const makeCall = (phoneNumber, patientName) => {
    if (!webPhone || webPhoneStatus !== 'Registered') {
      alert('WebPhone not ready. Please wait for registration.');
      return;
    }

    setCurrentPatientPhone(phoneNumber);
    setCurrentPatientName(patientName);
    setShowCallDialog(true);
    setCallStatus('Calling...');

    // Clean phone number (remove non-digits except +)
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');

    session = webPhone.userAgent.invite(`sip:${cleanPhone}@${webPhone.sipInfo[0].domain}`, {
      media: {
        constraints: {
          audio: true,
          video: false
        },
        render: {
          remote: remoteAudioRef.current
        }
      }
    });

    session.on('accepted', () => {
      console.log('📞 Call connected');
      const pc = session.sessionDescriptionHandler.peerConnection;

      pc.getReceivers().forEach(receiver => {
        if (receiver.track && receiver.track.kind === 'audio') {
          remoteStream.addTrack(receiver.track);
        }
      });

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.muted = false;
        remoteAudioRef.current.play().catch((e) =>
          console.warn('Playback failed', e)
        );
      }

      setIsCallActive(true);
      setCallStatus('Connected');
    });

    session.on('terminated', () => {
      setCallStatus('Disconnected');
      setIsCallActive(false);
      console.log('📴 Call ended');
    });

    session.on('failed', () => {
      setCallStatus('Failed');
      setIsCallActive(false);
      console.log('📴 Call failed');
    });
  };

  const handleHangUp = () => {
    if (!session) return;
    session.terminate();
    setCallStatus('Disconnected');
    setIsCallActive(false);
  };

  const closeCallDialog = () => {
    if (isCallActive) {
      handleHangUp();
    }
    setShowCallDialog(false);
    setCurrentPatientPhone('');
    setCurrentPatientName('');
  };

  // Existing functions (keeping them as they were)
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

  const tabtitle = "ND Health - RA Analytics";

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
        if(localData.username){
          params.append("username", localData.username);
        }
      }
      if (user_type === "clinic" && localData.data !=="select doctor first" && localData.doctorOhip){
        params.append("current_doctorOhip", localData.doctorOhip);
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

      if (data.data === "Already latest") {
        setSelectDoctor(false);
        if (localData) {
          setAnalyticsData(localData);
          handleSuccess("Using locally stored data.");
        } else {
          handleFailure("No local data available.");
        }
      } else if (data.data === "select doctor first") {
        localStorage.setItem("analyticsData", JSON.stringify(data));
        setListDoctors(data.doctors);
        setSelectDoctor(true);
      } else if (data.detail === "Invalid token.") {
        setError(
          <>
            Please Login first to use this service. -- {" "}
            <Link to="/login">Login</Link>
          </>
        );
      } else {
        localStorage.setItem("analyticsData", JSON.stringify(data));
        localStorage.setItem("latestRefDate", data.latest_ref_date);
        setAnalyticsData(data);
        handleSuccess("Data calculations done.");
        setSelectDoctor(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your existing useEffects and functions remain the same...
  useEffect(() => {
    if(user_type==='clinic' && analyticsData?.doctorOhip){
      setTitle(`Diabetes Patient Billing Analytics : ${analyticsData.doctorOhip}`)
    }
  }, [analyticsData]);

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
  }, [clinicSlug, clinicInfoFetched]);

  useEffect(() => {
    const localLatestRefDate = localStorage.getItem("latestRefDate");
    if (localLatestRefDate && localLatestRefDate === filters.service_date_to) {
      const localData = JSON.parse(localStorage.getItem("analyticsData"));
      if (localData) {
        setAnalyticsData(localData);
        handleSuccess("Using locally stored data.");
        return;
      }
    }
    fetchAnalytics();
  }, [filters]);

  useEffect(() => {
    if (analyticsData?.detailed_analysis) {
      const total = analyticsData.detailed_analysis.length;
      setTotalPages(Math.ceil(total / rowsPerPage));
    }
  }, [analyticsData, rowsPerPage]);

  const handleInputChange = (field, value) => {
    setInputValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setFilters(inputValues);
    setPage(0);
  };

  const handleClear = () => {
    const defaultValues = {
      target_service_code: "K030A",
      service_date_from: "2024-01-01",
      service_date_to: new Date().toISOString().split("T")[0],
    };
    setInputValues(defaultValues);
    setFilters(defaultValues);
    localStorage.removeItem("analyticsData");
    localStorage.removeItem("latestRefDate");
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
    if (!expandedRows.has(index)) {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const paginatedData =
    analyticsData?.detailed_analysis?.slice(
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

  const toggleSummaryCards = () => {
    setShowSummaryCards(!showSummaryCards);
  };

  return (
    <Layout1 clinicInfo={clinicInfo} tabtitle={tabtitle} title={title}>
      <div>
        <Box sx={{ minHeight: "100vh", p: 1, bgcolor: "background.default" }}>
          {/* WebRTC Status Indicator */}
          <Box sx={{ mb: 2, p: 1, bgcolor: webPhoneStatus === 'Registered' ? 'success.light' : 'warning.light', borderRadius: 1 }}>
            <Typography variant="caption">
              WebPhone Status: {webPhoneStatus}
            </Typography>
          </Box>

          {/* Hidden Audio Element for WebRTC */}
          <audio
            ref={remoteAudioRef}
            autoPlay
            playsInline
            style={{ width: 0, height: 0, position: 'absolute', left: '-9999px' }}
          />

          {/* Call Dialog */}
          <Dialog open={showCallDialog} onClose={closeCallDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              Calling {currentPatientName}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
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
                      sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                      disabled={callStatus === 'Calling...'}
                    >
                      <Phone />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="error"
                      size="large"
                      onClick={handleHangUp}
                      sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
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

          {/* Rest of your existing UI remains the same until the table */}

          {/* Summary Cards - Collapsible */}
          <Collapse in={showSummaryCards}>
            {/* Your existing summary cards code */}
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
            {/* Your existing filters and content */}

            {/* Main Content with Modified Table */}
            <Grid item xs={12} md={showFiltersDrawer ? 12 : 12}>
              {loading ? (
                <AdvancedDashboardLoading />
              ) : error ? (
                <Card sx={{ p: 1, bgcolor: "error.light", color: "white" }}>
                  <Typography variant="h6" color="#ffffff">
                    <ErrorOutline sx={{ mr: 1 }} />
                    {error}
                  </Typography>
                </Card>
              ) : analyticsData ? (
                <>
                  {/* Modified Table with Call Button */}
                  <TableContainer component={Paper}>
                    <Table>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>HIN</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>KO30A</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Q040A</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Amount Claimed</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Amount Paid</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>BH</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Demographic</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Bill Suggestion</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: "600", fontSize: "0.875rem" }}>Action</TableCell>
                      </TableRow>
                      <TableBody>
                        {paginatedData.map((item, index) => (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell onClick={() => toggleRowExpansion(index)}>{item.details.name}</TableCell>
                              <TableCell>{item.hin}</TableCell>
                              <TableCell>
                                <Typography sx={{ color: getSeverityColor(item.total_occurrences) }}>
                                  {item.total_occurrences}
                                  {item.error && (
                                    <Typography variant="caption" color="error">({item.error})</Typography>
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {item.q040}
                                  {item.q040Error && (
                                    <Typography variant="caption" color="error">({item.q040Error})</Typography>
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell>{formatCurrency(item.total_amount_claimed)}</TableCell>
                              <TableCell>{formatCurrency(item.total_amount_paid)}</TableCell>
                              <TableCell>
                                {item.details.demo ? (
                                  <Link
                                    target="_blank"
                                    to={`${analyticsData.url}oscar/billing/CA/ON/billinghistory.jsp?demographic_no=${item.details.demo}&last_name=${item?.details?.name?.includes(",") ? item.details.name.split(",")[1].trim() : ""}&first_name=${item?.details?.name?.includes(",") ? item.details.name.split(",")[0].trim() : ""}&orderby=appointment_date&displaymode=appt_history&dboperation=appt_history&limit1=0&limit2=10`}
                                  >
                                    BH
                                  </Link>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>
                                {item.details.demo ? (
                                  <Link
                                    target="_blank"
                                    to={`${analyticsData.url}oscar/demographic/demographiccontrol.jsp?demographic_no=${item.details.demo}&displaymode=edit&dboperation=search_detail`}
                                  >
                                    Demo
                                  </Link>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>
                                {(item.total_occurrences - item.error < 3 && (item.q040 - item.q040Error) < 1) ? (
                                  <>Call Patient and Bill K030</>
                                ) : (item.total_occurrences - item.error < 3 && (item.q040 - item.q040Error) === 1) ? (
                                  <>Call Patient and Bill K030</>
                                ) : (item.total_occurrences - item.error === 0 && (item.q040 - item.q040Error) === 0) ? (
                                  <>Call Patient and Bill K030</>
                                ) : (item.total_occurrences - item.error === 0 && (item.q040 - item.q040Error) > 1) ? (
                                  <>Call Patient and Bill K030</>
                                ) : (item.total_occurrences - item.error === 3 && (item.q040 - item.q040Error) < 1) ? (
                                  <>Bill Q040A</>
                                ) : (
                                  <OfflinePinIcon />
                                )}
                              </TableCell>
                              <TableCell>{item.details.phone}</TableCell>
                              <TableCell>
                                {item.details.phone && webPhoneStatus === 'Registered' ? (
                                  <Tooltip title="Call Patient">
                                    <IconButton
                                      color="primary"
                                      onClick={() => makeCall(item.details.phone, item.details.name)}
                                      disabled={isCallActive}
                                    >
                                      <Phone />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title={!item.details.phone ? "No phone number" : "WebPhone not ready"}>
                                    <span>
                                      <IconButton disabled>
                                        <Phone />
                                      </IconButton>
                                    </span>
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
                      count={totalPages}
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

export default RAServiceCodeAnalytics1;