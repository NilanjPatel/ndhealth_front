import API_BASE_PATH from "../../../apiConfig";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  TextField,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Pagination,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  Stack,
  Grid,
  AppBar,
  Toolbar,
  Divider,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { sendCheckEmailSms } from "../resources/utils";
import { useNavigate } from "react-router-dom";
import HelmetComponent from "../SEO/HelmetComponent";
import NdLoader from "../resources/Ndloader";
import NotificationDialog from "../resources/Notification";
import SmsIcon from "@mui/icons-material/Sms";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  borderRadius: theme.spacing(2),
  overflow: 'visible',
  border: `1px solid ${theme.palette.divider}`,
}));

const StickyFilterSection = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

// Improved smaller stats card
const StatsCard = styled(Card)(({ theme, variant }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  background: variant === 'success'
    ? `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}05)`
    : variant === 'warning'
    ? `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.main}05)`
    : variant === 'info'
    ? `linear-gradient(135deg, ${theme.palette.info.main}15, ${theme.palette.info.main}05)`
    : `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
  border: variant === 'success'
    ? `1px solid ${theme.palette.success.main}40`
    : variant === 'warning'
    ? `1px solid ${theme.palette.warning.main}40`
    : variant === 'info'
    ? `1px solid ${theme.palette.info.main}40`
    : `1px solid ${theme.palette.primary.main}40`,
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  minHeight: 100,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '0.875rem',
  padding: theme.spacing(2),
  whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme, isOdd }) => ({
  backgroundColor: isOdd ? theme.palette.grey[50] : theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.001)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  transition: 'all 0.2s ease',
  '& .MuiTableCell-root': {
    padding: theme.spacing(2),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  minWidth: 90,
  ...(status === 'opened' && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  }),
  ...(status === 'pending' && {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  }),
  ...(status === 'notified' && {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  }),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 80,
  padding: theme.spacing(0.75, 1.5),
  fontSize: '0.75rem',
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
}));

const LoadingOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(4px)',
});

// Fixed sticky pagination at bottom with no space after
const StickyPagination = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(3),
  zIndex: 1000,
  boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
}));

const formatDateString = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatDateTimeString = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const EmailStatus = ({ clinicSlug }) => {
  const navigate = useNavigate();

  // State management
  const [pageSize] = useState(20);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    firstName: "",
    birthday: "",
    healthcard: "",
    sender: "",
  });

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Notification handlers
  const handleSuccess = useCallback((message) => {
    setModalContent(message);
    setIsError(false);
    setOpenModal(true);
  }, []);

  const handleFailure = useCallback((message) => {
    setModalContent(message);
    setIsError(true);
    setOpenModal(true);
  }, []);

  // Actual API fetch function
  const fetchData = useCallback(async (page, searchFilters) => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
      return;
    }

    setLoading(page === 1);
    setSubmitting(true);

    try {
      const params = {
        page,
        ...searchFilters,
      };

      const response = await fetch(`${API_BASE_PATH}/email-status/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const responseData = await response.json();

      setData(responseData.results || []);
      setTotalPages(Math.ceil((responseData.count || 0) / pageSize));
      setTotalCount(responseData.count || 0);

    } catch (error) {
      console.error('Error fetching email status:', error);
      handleFailure('Failed to load email status data. Please try again.');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }, [pageSize, navigate, handleFailure]);

  // Effect for initial load and page changes
  useEffect(() => {
    fetchData(currentPage, filters);
  }, [currentPage]); // Remove filters from dependency to fix pagination

  // Handle page changes
  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchData(1, filters);
  }, [fetchData, filters]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      firstName: "",
      birthday: "",
      healthcard: "",
      sender: "",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    fetchData(1, clearedFilters);
  }, [fetchData]);

  // Update record SMS sent status
  const updateRecordSmsSent = useCallback((index) => {
    setData(prevData => {
      const updatedRecords = [...prevData];
      updatedRecords[index] = { ...updatedRecords[index], smsSent: true };
      return updatedRecords;
    });
  }, []);

  // Send SMS to individual patient
  const sendPatientSMS = useCallback(async (patientId, index) => {
    setSubmitting(true);
    try {
      const response = await sendCheckEmailSms(patientId);
      const responseData = await response.json();

      if (responseData?.message === "success") {
        handleSuccess("SMS sent successfully.");
        updateRecordSmsSent(index);
      } else {
        handleFailure("Failed to send SMS. Please try again.");
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      handleFailure("Failed to send SMS. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [updateRecordSmsSent, handleSuccess, handleFailure]);

  // Send bulk SMS
  const sendBulkSMS = useCallback(async () => {
    const eligiblePatients = data.filter(patient => !patient.is_accessible);

    if (eligiblePatients.length === 0) {
      handleSuccess("No patients require SMS notifications.");
      return;
    }

    setSubmitting(true);
    let successCount = 0;
    let failedPatients = [];

    try {
      for (const patient of eligiblePatients) {
        try {
          const response = await sendCheckEmailSms(patient.newid);
          const responseData = await response.json();

          if (responseData?.message === "success") {
            successCount++;
          } else {
            failedPatients.push(patient.firstName);
          }
        } catch (error) {
          console.error(`Error sending SMS to ${patient.firstName}:`, error);
          failedPatients.push(patient.firstName);
        }
      }

      const totalAttempted = eligiblePatients.length;
      const failedCount = failedPatients.length;

      if (successCount > 0 && failedCount > 0) {
        handleSuccess(
          `${successCount}/${totalAttempted} SMS sent successfully. Failed: ${failedPatients.join(", ")}`
        );
      } else if (successCount > 0) {
        handleSuccess(`All ${successCount} SMS sent successfully.`);
      } else {
        handleFailure(`Failed to send all SMS. Failed patients: ${failedPatients.join(", ")}`);
      }

      // Refresh data after bulk send
      await fetchData(currentPage, filters);

    } catch (error) {
      console.error('Error in bulk SMS sending:', error);
      handleFailure("Failed to send bulk SMS. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [data, handleSuccess, handleFailure, fetchData, currentPage, filters]);

  // Memoized statistics
  const statistics = useMemo(() => ({
    total: totalCount,
    opened: data.filter(d => d.is_accessible).length,
    pending: data.filter(d => !d.is_accessible).length,
    notified: data.filter(d => d.smsSent && !d.is_accessible).length,
  }), [data, totalCount]);

  // Render status chip
  const renderStatusChip = (record, index) => {
    if (record.is_accessible) {
      return (
        <StatusChip
          status="opened"
          icon={<CheckCircleIcon />}
          label="Opened"
          size="small"
        />
      );
    } else if (record.smsSent) {
      return (
        <StatusChip
          status="notified"
          icon={<SmsIcon />}
          label="SMS Sent"
          size="small"
        />
      );
    } else {
      return (
        <Tooltip title="Send SMS reminder to patient" arrow>
          <Button
            variant="contained"
            size="small"
            startIcon={<SendIcon />}
            onClick={() => sendPatientSMS(record.newid, index)}
            disabled={submitting}
            color="warning"
            sx={{
              minWidth: 100,
              fontWeight: 600,
              boxShadow: 1,
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            Send SMS
          </Button>
        </Tooltip>
      );
    }
  };

  if (loading && data.length === 0) {
    return (
      <Box sx={{ p: 3, backgroundColor: 'grey.50', minHeight: '100vh' }}>
        <HelmetComponent />
        <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, mb: 2 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1.5 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, mb: 2 }}>
          <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: 'grey.50', pb: 8 }}>
      <HelmetComponent />

      <Box sx={{ width: '100%', }}>
        <Grid container spacing={0} sx={{ py: 0 }}>

          {/* Statistics Section */}
          <Grid item xs={12}>
            <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Email Status Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard variant="primary">
                    <EmailIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {statistics.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Total Emails Sent
                    </Typography>
                  </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard variant="success">
                    <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {statistics.opened}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Opened
                    </Typography>
                  </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard variant="warning">
                    <PendingIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {statistics.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Pending
                    </Typography>
                  </StatsCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatsCard variant="info">
                    <SmsIcon sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {statistics.notified}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      SMS Notified
                    </Typography>
                  </StatsCard>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Sticky Filters Section */}
          <Grid item xs={12}>
            <StickyFilterSection position="sticky" elevation={0}>
              <FilterContainer>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SearchIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Search & Filter
                    </Typography>
                  </Box>
                  <Tooltip title="Refresh data">
                    <IconButton
                      onClick={() => fetchData(currentPage, filters)}
                      disabled={submitting}
                      color="primary"
                      sx={{
                        border: 1,
                        borderColor: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        }
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Patient Name"
                      name="firstName"
                      value={filters.firstName}
                      onChange={handleFilterChange}
                      size="small"
                      variant="outlined"
                      placeholder="Search by name"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'background.paper',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="birthday"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={filters.birthday}
                      onChange={handleFilterChange}
                      size="small"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'background.paper',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Health Card"
                      name="healthcard"
                      value={filters.healthcard}
                      onChange={handleFilterChange}
                      size="small"
                      variant="outlined"
                      placeholder="Enter health card"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'background.paper',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Sender"
                      name="sender"
                      value={filters.sender}
                      onChange={handleFilterChange}
                      size="small"
                      variant="outlined"
                      placeholder="Search by sender"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'background.paper',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        disabled={submitting}
                        size="medium"
                        sx={{
                          minWidth: 100,
                          fontWeight: 600,
                          boxShadow: 2,
                          '&:hover': {
                            boxShadow: 4,
                          }
                        }}
                      >
                        Search
                      </Button>
                      <IconButton
                        color="default"
                        onClick={handleClearFilters}
                        disabled={submitting}
                        size="medium"
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        <Tooltip title="Clear filters">
                          <ClearIcon />
                        </Tooltip>
                      </IconButton>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Tooltip
                      title={statistics.pending === 0 ? "No pending notifications" : `Send SMS to ${statistics.pending} patient${statistics.pending > 1 ? 's' : ''}`}
                    >
                      <span>
                        <Button
                          variant="contained"
                          color="warning"
                          startIcon={<SendIcon />}
                          onClick={sendBulkSMS}
                          disabled={submitting || statistics.pending === 0}
                          size="medium"
                          fullWidth
                          sx={{
                            fontWeight: 600,
                            boxShadow: 2,
                            '&:hover': {
                              boxShadow: 4,
                            }
                          }}
                        >
                          Notify All
                          {statistics.pending > 0 && (
                            <Badge
                              badgeContent={statistics.pending}
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Button>
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </FilterContainer>
            </StickyFilterSection>
          </Grid>

          {/* Table Section */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent sx={{ p: 0 }}>
                {data.length === 0 ? (
                  <Box
                    sx={{
                      p: 8,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 400,
                      backgroundColor: 'grey.50',
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                      No Email Records Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                      There are no email records matching your criteria. Try adjusting your search filters or check back later.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={() => fetchData(currentPage, filters)}
                      disabled={submitting}
                    >
                      Refresh
                    </Button>
                  </Box>
                ) : (
                  <TableContainer component={Paper} sx={{ maxHeight: 600, borderRadius: 2 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Patient Name</StyledTableCell>
                          <StyledTableCell>Sent Date</StyledTableCell>
                          <StyledTableCell>Status / Action</StyledTableCell>
                          <StyledTableCell>Health Card</StyledTableCell>
                          <StyledTableCell>Date of Birth</StyledTableCell>
                          <StyledTableCell>Email Address</StyledTableCell>
                          <StyledTableCell>Attachments</StyledTableCell>
                          <StyledTableCell>Message</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((record, index) => (
                          <StyledTableRow key={record.newid} isOdd={index % 2 !== 0}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {record.firstName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {formatDateTimeString(record.created_at)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {record.is_accessible ? (
                                <Box>
                                  <StatusChip
                                    status="opened"
                                    icon={<CheckCircleIcon />}
                                    label="Opened"
                                    size="small"
                                  />
                                  <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                    {formatDateTimeString(record.mailoppned)}
                                  </Typography>
                                </Box>
                              ) : (
                                renderStatusChip(record, index)
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace" sx={{ fontSize: '0.875rem' }}>
                                {record.healthcard}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {formatDateString(record.birthday)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={record.email} arrow>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    maxWidth: 180,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                    color: 'primary.main',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {record.email}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${record.file_sent} file${record.file_sent > 1 ? 's' : ''}`}
                                size="small"
                                variant="outlined"
                                color={record.file_sent > 0 ? "primary" : "default"}
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={record.body} arrow>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    maxWidth: 250,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: 'text.secondary',
                                  }}
                                >
                                  {record.body || 'No message'}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>

      {/* Fixed Pagination at Bottom with No Space After */}
      {totalPages > 1 && (
        <StickyPagination>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: '100%', mx: 'auto' }}>
            <Box sx={{ minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Showing {data.length} of {totalCount} results
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                disabled={submitting}
                size="large"
                sx={{
                  '& .MuiPagination-ul': {
                    justifyContent: 'center',
                  },
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
            <Box sx={{ minWidth: 150, textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Page {currentPage} of {totalPages}
              </Typography>
            </Box>
          </Stack>
        </StickyPagination>
      )}

      {/* Loading overlay */}
      {submitting && (
        <LoadingOverlay>
          <NdLoader />
        </LoadingOverlay>
      )}

      {/* Notification dialog */}
      <NotificationDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        content={modalContent}
        isError={isError}
      />
    </Box>
  );
};

export default EmailStatus;