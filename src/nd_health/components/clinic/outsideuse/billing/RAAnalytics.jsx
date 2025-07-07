import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ExpandMore, ExpandLess, ErrorOutline } from "@mui/icons-material";
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
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import NotificationDialog from "../../../resources/Notification";
import Link from "@mui/material/Link";
import DoughnutGraph from "../../../resources/DoughnutGraph";
const RAServiceCodeAnalytics = () => {

  const [filters, setFilters] = useState({
    target_service_code: "K030A",
    service_date_from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0], // Jan 1st of current year
    service_date_to: new Date().toISOString().split("T")[0],
    // min_occurrences: 2,
  });
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const { clinicSlug } = useParams();

  const [inputValues, setInputValues] = useState({
    target_service_code: "K030A",
    service_date_from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0], // Jan 1st of current year
    service_date_to: new Date().toISOString().split("T")[0],
    // min_occurrences: 2,
  });

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [expandedRows, setExpandedRows] = useState(new Set());
  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [buttonRedirect, setButtonRedirect] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


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
      window.location.href = `/clinic/${clinicSlug}/billing/raanalytics`;
    }
  };
  const tabtitle = "ND Health - RA Analytics";
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_PATH}/billing/ra-analytics?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        handleFailure("Something went wrong!");
        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const data = await response.json();
      setAnalyticsData(data);
      handleSuccess("Data calculations done.")
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
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
      fetchClinicInfo().then(r => {
      });
      setClinicInfoFetched(true);
    }
    // change clinic_locations_multiple if there are multiple locations
    // if (locationsData && locationsData.length > 1) {
    //     set_clinic_locations_multiple("Serving at Multiple Locations.");
    // }
  }, [clinicSlug, clinicInfoFetched]);
  useEffect(() => {
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
      // min_occurrences: 2,
    };
    setInputValues(defaultValues);
    setFilters(defaultValues);
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
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const paginatedData =
    analyticsData?.detailed_analysis?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    ) || [];

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage-1);
  };
  return (
    <Layout1 clinicInfo={clinicInfo} tabtitle={tabtitle} title="Service Code Analytics Dashboard">
      <div>

        <Box sx={{ minHeight: "100vh", p: 1, bgcolor: "background.default" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", }}>
                  {/*<CircularProgress />*/}
                </Box>
              ) : error ? (
                <></>
              ) : analyticsData ? (
                <>
                  {/* Summary Cards */}
                  <Grid container spacing={1} sx={{ mb: 4 }} justifyContent="center">
                    <Grid item xs={6} md={1.5}>
                      <MetricCard
                        title="Patients"
                        value={analyticsData.summary.total_hins_with_multiple_codes}
                        suffix=""
                        icon="users"
                        // trend="up"
                        // trendValue="+0.3%"
                        color="success"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                      <MetricCard
                        title="Billed"
                        value={analyticsData.summary.total_service_code_instances}
                        suffix=""
                        icon="invoice"
                        // trend="up"
                        // trendValue="+0.3%"
                        color="warning"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                      <MetricCard
                        title="Errors"
                        value={analyticsData.summary.total_erros}
                        suffix=""
                        icon="Error"
                        // trend="up"
                        // trendValue="+0.3%"
                        color="error"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                      <MetricCard
                        title="Eligible for Q040A"
                        value={analyticsData.summary.total_eligable_for_q040}
                        suffix=""
                        icon="yes"
                        // trend="up"
                        // trendValue="+0.3%"
                        color="success"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                      <MetricCard
                        title="Claimed"
                        value={formatCurrency(
                          analyticsData.summary.total_amount_claimed
                        )}
                        suffix=""
                        icon="invoice"
                        // trend="up"
                        // trendValue="+0.3%"
                        color="secondary"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                      <MetricCard
                        title="Total Paid"
                        value={formatCurrency(
                          analyticsData.summary.total_amount_paid
                        )}
                        suffix=""
                        icon="paid"
                        // trend="up"
                        // trendValue="+0.3%"
                        color="success"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                      <MetricCard
                        title="Potential"
                        value={formatCurrency(
                          analyticsData.summary.total_potential
                        )}
                        suffix=""
                        icon="creditCard"
                        // trend="up"
                        // trendValue="+0.3%"
                        color="info"
                        size="small"
                        subtitle={`+ ${formatCurrency(analyticsData.summary.total_amount_claimed - analyticsData.summary.total_amount_paid)}`}

                      />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", }}>
                {/*<CircularProgress />*/}
              </Box>
            ) : error ? (
              <></>
            ) : analyticsData ? (
              <>
                 {/*Filters Panel*/}
                <Grid item xs={12} md={3}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Analysis Filters
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <TextField
                        label="Target Service Code"
                        value={inputValues.target_service_code}
                        onChange={(e) =>
                          handleInputChange("target_service_code", e.target.value)
                        }
                        fullWidth
                      />
                      {/*<TextField*/}
                      {/*  label="Minimum Occurrences"*/}
                      {/*  type="number"*/}
                      {/*  value={inputValues.min_occurrences}*/}
                      {/*  onChange={(e) =>*/}
                      {/*    handleInputChange("min_occurrences", parseInt(e.target.value))*/}
                      {/*  }*/}
                      {/*  fullWidth*/}
                      {/*/>*/}
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
                          onClick={handleSearch}
                          fullWidth
                        >
                          Analyze
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleClear}
                          fullWidth
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                  <Box >
                    <DoughnutGraph
                      title="Breakdown"
                      data={analyticsData.summary.occurrence_distribution}
                      size="large"
                      xAxisTitle="x Times"
                      yAxisTitle="Billed"
                    />
                  </Box>
                </Grid>

              </>
            ) : (
              <></>
            )}

            {/* Main Content */}
            <Grid item xs={12} md={9}>
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
                            fontSize: "0.875rem",}}>Name</TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>HIN</TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>KO30A<MKTypography variant="caption" color={"error"}>(with error)</MKTypography>
                          </TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>Q040A<MKTypography variant="caption" color={"error"}>(with error)</MKTypography>
                          </TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>Amount Claimed</TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>Amount Paid</TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>BH</TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>Demographic</TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>Bill Suggestion</TableCell>
                          <TableCell sx={{
                            fontWeight: "600",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            fontSize: "0.875rem",}}>Phone</TableCell>
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
                                {item.details.demo ?(
                                  <Link
                                    fontWeight={"bolder"}
                                    target="_blank"
                                    href={`${analyticsData.url}oscar/billing/CA/ON/billinghistory.jsp?demographic_no=${item.details.demo}&last_name=${item?.details?.name?.includes(",") ? item.details.name.split(",")[1].trim() : ""}&first_name=${item?.details?.name?.includes(",") ? item.details.name.split(",")[0].trim() : ""}&orderby=appointment_date&displaymode=appt_history&dboperation=appt_history&limit1=0&limit2=10`}
                                  >BH
                                  </Link>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>
                                {item.details.demo ?(
                                  <Link

                                    fontWeight={"bolder"}
                                    target="_blank"
                                    href={`${analyticsData.url}oscar/demographic/demographiccontrol.jsp?demographic_no=${item.details.demo}&displaymode=edit&dboperation=search_detail`}
                                  >Demo</Link>
                                ):(
                                  "-"
                                )}

                              </TableCell>
                              <TableCell>
                                <TableCell>
                                  {(item.total_occurrences - item.error < 3 && (item.q040 - item.q040Error) < 1) ? (<>Call Patient and Bill K030</>) :
                                    (item.total_occurrences - item.error < 3 && (item.q040 - item.q040Error) === 1) ? (<>Call Patient and Bill K030</>) :
                                    (item.total_occurrences - item.error ===0 && (item.q040 - item.q040Error) === 0) ? (<>Call Patient and Bill K030</>) :
                                    (item.total_occurrences - item.error ===0 && (item.q040 - item.q040Error) > 1) ? (<>Call Patient and Bill K030</>) :
                                      (item.total_occurrences - item.error === 3 && (item.q040 - item.q040Error) < 1) ? (<>Bill Q040A</>) :
                                        (<><OfflinePinIcon></OfflinePinIcon></>)
                                  }
                                </TableCell>

                              </TableCell>
                              <TableCell>{item.details.phone}</TableCell>
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
                      page={page+1}
                      onChange={handleChangePage}
                      showFirstButton
                      showLastButton
                      component="div"
                      color="primary"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                        '& .MuiPaginationItem-root': {
                          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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