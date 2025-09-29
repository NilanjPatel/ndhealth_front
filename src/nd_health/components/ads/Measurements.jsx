// src/components/Measurements.js
import React, { useState, useEffect } from "react";
import API_BASE_PATH from "../../../apiConfig";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Stack,
  Alert,
} from "@mui/material";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Card, CardContent, Typography, CardHeader } from "@mui/material";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import "../css/Marquee.css";

import HelmetComponent from "../SEO/HelmetComponent";
import NdLoader from "nd_health/components/resources/Ndloader";
import Layout1 from "../Layout1";

const Measurements = () => {
  const { clinicSlug } = useParams();
  const [searchParams] = useSearchParams();

  const demographicNo = searchParams.get("demographicNo");
  const token = searchParams.get("token");
  const [clinicInfo, setClinicInfo] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [measurementValuesFetched, setMeasurementValuesFetched] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [submitbutton, setSubmitbutton] = useState(true);
  const [measurementsData, setMeasurementsData] = useState({});

  // New state for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);

  // Helper function to format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to process measurements data for table display
  const processMeasurementsForTable = (data) => {
    if (!data.measurements) return { dates: [], measurementRows: [] };

    const allDates = new Set();
    const measurementMap = {};

    const normalizeToDate = (timestamp) => {
      const date = new Date(timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    };

    Object.keys(data.measurements).forEach(measurementType => {
      measurementMap[measurementType] = {};

      data.measurements[measurementType].forEach(measurement => {
        const normalizedDate = normalizeToDate(measurement.dateObserved);
        allDates.add(normalizedDate);
        measurementMap[measurementType][normalizedDate] = measurement.dataField;
      });
    });

    const sortedDates = Array.from(allDates).sort((a, b) => b - a);

    const measurementRows = Object.keys(measurementMap).map(measurementType => {
      const row = { measurementType };
      const chartData = [];

      sortedDates.forEach(date => {
        const value = measurementMap[measurementType][date] || "";
        row[date] = value;

        // Parse numeric value for chart
        if (value) {
          const numericValue = parseFloat(String(value).replace(/[^\d.-]/g, ''));
          if (!isNaN(numericValue)) {
            chartData.push({ date, value: numericValue });
          }
        }
      });

      // Sort chart data chronologically (oldest to newest for proper line chart)
      row.chartData = chartData.sort((a, b) => a.date - b.date);

      return row;
    });

    return { dates: sortedDates, measurementRows };
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
      fetchClinicInfo().then(r => {});
      setClinicInfoFetched(true);
    }
  }, [clinicSlug, clinicInfoFetched]);

  useEffect(() => {
    const fetchMeasurementsInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/measurements/${clinicSlug}/${demographicNo}`, {
          headers: {
            "Authorization": `Token ${token}`,
          },
        });
        const data = await response.json();
        setMeasurementsData(data);
        setSubmitbutton(true);
      } catch (error) {
        console.error("Error fetching measurements information:", error);
        setSubmitbutton(true);
      }
    };

    if (!measurementValuesFetched) {
      setSubmitbutton(false);
      fetchMeasurementsInfo().then(r => {});
      setMeasurementValuesFetched(true);
    }
  }, [clinicSlug, demographicNo, measurementValuesFetched, token]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Export to CSV functionality
  const handleExportToCSV = () => {
    const { dates, measurementRows } = processMeasurementsForTable(measurementsData);

    let csv = "Measurement Type," + dates.map(d => formatDate(d)).join(",") + "\n";

    measurementRows.forEach(row => {
      csv += row.measurementType + ",";
      csv += dates.map(date => row[date] || "-").join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `measurements_${demographicNo}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Process the measurements data for table display
  const { dates, measurementRows } = processMeasurementsForTable(measurementsData);

  // Filter measurements based on search term
  const filteredRows = measurementRows.filter(row =>
    row.measurementType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique measurement types for quick filter chips
  const measurementTypes = measurementRows.map(row => row.measurementType);

  return (
    <Layout1 clinicInfo={clinicInfo} title={"Patient Measurements"}>
      <div>
        <HelmetComponent />

        {clinicInfo ? (
          <Box sx={{ padding: isMobile ? 1 : 3 }}>
            {measurementsData.measurements && Object.keys(measurementsData.measurements).length > 0 ? (
              <Card elevation={2}>
                <CardHeader
                  // title={
                  //   <Box display="flex" alignItems="center" gap={1}>
                  //     <TimelineIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                  //     <Typography variant="h5" component="div" fontWeight={600}>
                  //       Patient Measurements
                  //     </Typography>
                  //   </Box>
                  // }
                  subheader={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {Object.keys(measurementsData.measurements || {}).length} measurement types •
                      {dates.length > 0 ? ` ${formatDate(dates[dates.length - 1])} to ${formatDate(dates[0])}` : " No data"}
                    </Typography>
                  }
                  action={
                    !isMobile && (
                      <Tooltip title="Export to CSV">
                        <IconButton
                          onClick={handleExportToCSV}
                          color="primary"
                          sx={{
                            mr: 1,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light + '20',
                            }
                          }}
                        >
                          <FileDownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                  sx={{
                    backgroundColor: theme.palette.grey[50],
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    pb: 2
                  }}
                />

                <CardContent sx={{ p: 3, backgroundColor: theme.palette.grey[50] }}>
                  {/* Search and Filter Section */}
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Search measurements (e.g., Blood Pressure, Weight, Temperature...)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchTerm("")}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        backgroundColor: '#ffffff',
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                          }
                        }
                      }}
                    />

                    {/* Quick Filter Chips */}
                    {!isMobile && measurementTypes.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: "center" }}>
                          Quick filters:
                        </Typography>
                        {measurementTypes.slice(0, 5).map((type) => (
                          <Chip
                            key={type}
                            label={type}
                            onClick={() => setSearchTerm(type)}
                            size="small"
                            variant={searchTerm === type ? "filled" : "outlined"}
                            color={searchTerm === type ? "primary" : "default"}
                            sx={{ cursor: "pointer" }}
                          />
                        ))}
                        {searchTerm && (
                          <Chip
                            label="Clear"
                            onClick={() => setSearchTerm("")}
                            size="small"
                            color="error"
                            variant="outlined"
                            onDelete={() => setSearchTerm("")}
                            sx={{ cursor: "pointer" }}
                          />
                        )}
                      </Stack>
                    )}
                  </Box>

                  {/* Results count */}
                  {searchTerm && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Showing {filteredRows.length} of {measurementRows.length} measurements
                    </Alert>
                  )}

                  {/* Table */}
                  <TableContainer
                    component={Paper}
                    sx={{
                      maxHeight: isMobile ? "30rem" : "50rem",
                      overflow: "auto",
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      boxShadow: theme.shadows[3],
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Table stickyHeader size={isMobile ? "small" : "medium"} aria-label="measurements table">
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                              color: '#ffffff',
                              width: 200,
                              maxWidth: 200,
                              minWidth: 150,
                              position: "sticky",
                              left: 0,
                              zIndex: 3,
                              fontSize: isMobile ? "0.875rem" : "1rem",
                              borderRight: `2px solid ${theme.palette.primary.light}`,
                            }}
                          >
                            Measurement Type
                          </TableCell>
                          {!isMobile && (
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                color: '#ffffff',
                                width: 140,
                                maxWidth: 140,
                                minWidth: 120,
                                position: "sticky",
                                top: 0,
                                zIndex: 2,
                                fontSize: "0.875rem",
                                borderRight: `2px solid ${theme.palette.primary.light}`,
                              }}
                              align="center"
                            >
                              Trend
                            </TableCell>
                          )}
                          {dates.map((date, index) => (
                            <TableCell
                              key={date}
                              align="center"
                              sx={{
                                fontWeight: 600,
                                background: index === 0
                                  ? `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`
                                  : `linear-gradient(135deg, ${theme.palette.grey[300]} 0%, ${theme.palette.grey[200]} 100%)`,
                                color: index === 0
                                  ? '#ffffff'
                                  : theme.palette.text.primary,
                                minWidth: 120,
                                position: "sticky",
                                top: 0,
                                zIndex: 2,
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                                borderRight: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              {formatDate(date)}
                              {index === 0 && (
                                <Chip
                                  label="Latest"
                                  size="small"
                                  sx={{
                                    ml: 0.5,
                                    height: 18,
                                    fontSize: "0.65rem",
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      <TableBody>
                        {filteredRows.length > 0 ? (
                          filteredRows.map((row, rowIndex) => (
                            <TableRow
                              key={row.measurementType}
                              sx={{
                                "&:nth-of-type(even)": {
                                  backgroundColor: theme.palette.grey[50]
                                },
                                "&:nth-of-type(odd)": {
                                  backgroundColor: '#ffffff'
                                },
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.light + '15',
                                  transition: 'background-color 0.2s ease',
                                },
                                borderBottom: `1px solid ${theme.palette.grey[200]}`,
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                sx={{
                                  fontWeight: 600,
                                  width: 200,
                                  maxWidth: 200,
                                  minWidth: 150,
                                  position: "sticky",
                                  left: 0,
                                  zIndex: 1,
                                  backgroundColor: rowIndex % 2 === 0
                                    ? theme.palette.grey[50]
                                    : '#ffffff',
                                  fontSize: isMobile ? "0.875rem" : "1rem",
                                  borderRight: `1px solid ${theme.palette.grey[300]}`,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {row.measurementType}
                              </TableCell>
                              {!isMobile && (
                                <TableCell
                                  align="center"
                                  sx={{
                                    width: 140,
                                    maxWidth: 140,
                                    minWidth: 120,
                                    backgroundColor: rowIndex % 2 === 0
                                      ? theme.palette.grey[50]
                                      : '#ffffff',
                                    borderRight: `1px solid ${theme.palette.grey[300]}`,
                                    padding: '8px',
                                  }}
                                >
                                  {row.chartData && row.chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={40}>
                                      <LineChart data={row.chartData}>
                                        <Line
                                          type="monotone"
                                          dataKey="value"
                                          stroke={theme.palette.primary.main}
                                          strokeWidth={2.5}
                                          dot={false}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  ) : (
                                    <Typography variant="caption" color="text.disabled">
                                      -
                                    </Typography>
                                  )}
                                </TableCell>
                              )}
                              {dates.map((date, dateIndex) => (
                                <TableCell
                                  key={`${row.measurementType}-${date}`}
                                  align="center"
                                  sx={{
                                    color: row[date]
                                      ? theme.palette.text.primary
                                      : theme.palette.text.disabled,
                                    fontStyle: row[date] ? "normal" : "italic",
                                    fontWeight: dateIndex === 0 && row[date] ? 600 : "normal",
                                    fontSize: isMobile ? "0.875rem" : "1rem",
                                    backgroundColor: dateIndex === 0 && row[date]
                                      ? theme.palette.success.light + '25'
                                      : "transparent",
                                    borderRight: dateIndex !== dates.length - 1 ? `1px solid ${theme.palette.grey[200]}` : 'none',
                                  }}
                                >
                                  {row[date] || "-"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={dates.length + 2} align="center" sx={{ py: 4, backgroundColor: theme.palette.grey[50] }}>
                              <Typography variant="body2" color="text.secondary">
                                No measurements match your search
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Mobile Export Button */}
                  {isMobile && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<FileDownloadIcon />}
                      onClick={handleExportToCSV}
                      sx={{ mt: 2 }}
                    >
                      Export to CSV
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              measurementValuesFetched && (
                <Card>
                  <CardContent sx={{ py: 8 }}>
                    <Box textAlign="center">
                      <TimelineIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Measurements Available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        There are no recorded measurements for this patient yet.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )
            )}
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <NdLoader size="lg" variant="solid" value={70} color="primary" />
          </Box>
        )}

        {/* Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>{modalContent}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Loading Overlay */}
        {!submitbutton && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <NdLoader size="lg" variant="solid" value={70} color="primary" />
              <Typography variant="body1" align="center" sx={{ mt: 2, fontWeight: 500 }}>
                Loading measurements...
              </Typography>
            </Paper>
          </Box>
        )}
      </div>
    </Layout1>
  );
};

export default Measurements;