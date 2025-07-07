// RADx250.jsx
import React, { useState, useEffect } from "react";
import API_BASE_PATH from "../../../../../apiConfig";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import Layout1 from "../../../Layout1";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const RADx250 = () => {
  const tabtitle = "ND Health - RA Dx 250 Analysis";
  const [filters, setFilters] = React.useState({
    service_code: "",
    hin: "",
    billing_no: "",
    error_code: "",
    claim_no: "",
    raHeader_no: "",
    service_date_from: "",       // optional range filter
    service_date_to: "",
  });
  const [inputValues, setInputValues] = React.useState({
    service_code: "",
    hin: "",
    billing_no: "",
    error_code: "",
    claim_no: "",
    raHeader_no: "",
    service_date_from: "",       // optional range filter
    service_date_to: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [totalCount, setTotalCount] = useState(0); // Total number of items
  const { clinicSlug } = useParams();
  const [analysisCode, setAnalysisCode] = useState("");
  const [frequencyData, setFrequencyData] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

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
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      params.append("page", page + 1); // Backend pages are usually 1-indexed
      params.append("page_size", rowsPerPage);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const accessToken = localStorage.getItem("accessToken");
      const queryString = params.toString();
      const url = `${API_BASE_PATH}/billing/radetails/${queryString ? `?${queryString}` : ""}`;
      setLoading(true);
      try{
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setData(data);
        if (data) {
          setProducts(data.results || []); // Use the `results` array for rows
          setTotalCount(data.count || 0);
        }
      } catch (error) {
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filters, page, rowsPerPage]); // Only depend on filters

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };
  const handleChange = () => {
    // const { name, value } = e.target;
    // setFilters((prev) => ({ ...prev, [name]: value }));
    setProducts([]);
    setFilters(inputValues);
  };
  const handleClear = () => {
    setInputValues({
      service_code: "",
      hin: "",
      billing_no: "",
      error_code: "",
      claim_no: "",
      raHeader_no: "",
      service_date_from: "",
      service_date_to: "",
    });
    setFilters({
      service_code: "",
      hin: "",
      billing_no: "",
      error_code: "",
      claim_no: "",
      raHeader_no: "",
      service_date_from: "",
      service_date_to: "",
    });
  };
  const handleDateFromChange = (date) => {
    setInputValues(prev => ({
      ...prev,
      service_date_from: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const handleDateToChange = (date) => {
    setInputValues(prev => ({
      ...prev,
      service_date_to: date ? date.format("YYYY-MM-DD") : "",
    }));
  };

  const fetchServiceCodeFrequency = async () => {
    if (!analysisCode) return;

    setLoadingAnalysis(true);
    const params = new URLSearchParams();
    params.append("service_code", analysisCode);

    // Use existing date filters if available
    if (inputValues.service_date_from) {
      params.append("service_date_from", inputValues.service_date_from);
    }
    if (inputValues.service_date_to) {
      params.append("service_date_to", inputValues.service_date_to);
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = `${API_BASE_PATH}/billing/radetails/dx250/?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Token ${accessToken}`,
        },
      });
      const data = await response.json();
      setFrequencyData(data);
    } catch (error) {
      console.error("Error fetching frequency data:", error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <Layout1 clinicInfo={clinicInfo} tabtitle={tabtitle}>
      <div>
        <CardHeader
          title="RA Details"
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            padding: "16px 24px",
          }}
        />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading summary data...</Typography>
          </Box>
        ) : data ? (
          <>
            {data.error && (
              <Box sx={{
                mb: 3,
                p: 2,
                bgcolor: "#ffebee",
                borderRadius: 1,
                border: "1px solid #ffcdd2",
                display: "flex",
                alignItems: "center",
              }}>
                <i className="fas fa-exclamation-circle"
                   style={{ color: "#d32f2f", marginRight: "12px" }}></i>
                <Typography color="error">{data.error}</Typography>
              </Box>
            )}
            {products && products.length > 0 ? (

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
                      {/* TOTAL CAPITATION */}
                      <Box sx={{
                        p: 1,
                        // bgcolor: "#e3f2fd",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>

                        <TextField
                          // color="#1976d2"
                          label="Service Code"
                          name="service_code"
                          placeholder="Search service code..."
                          onChange={handleInputChange}
                          value={inputValues.service_code}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Box>
                      {/* TOTAL current_roster_patients */}
                      <Box sx={{
                        p: 1,
                        // bgcolor: "#e3f2fd",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <TextField
                          label="Health Card Number"
                          name="hin"
                          placeholder="Search Health Card number..."
                          onChange={handleInputChange}
                          value={inputValues.hin}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Box>
                      <Box sx={{
                        p: 1,
                        // bgcolor: "#fff8e1",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>

                        <TextField
                          label="Billing Number"
                          name="billing_no"
                          placeholder="Search Billing Number..."
                          onChange={handleInputChange}
                          value={inputValues.billing_no}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Box>

                      {/* BALANCE */}
                      <Box sx={{
                        p: 1,
                        // bgcolor: "#ffebee",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <TextField
                          label="Error Code"
                          name="error_code"
                          placeholder="Search Error Code..."
                          onChange={handleInputChange}
                          value={inputValues.error_code}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Box>
                      <Box sx={{
                        p: 1,
                        // bgcolor: "#c2cee1",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <TextField
                          label="Claim Number"
                          name="claim_no"
                          placeholder="Search Claim Number..."
                          onChange={handleInputChange}
                          value={inputValues.claim_no}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Box>


                      <Box sx={{
                        p: 1,
                        // bgcolor: "#c2cee1",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <TextField
                          label="Header Number"
                          name="raHeader_no"
                          placeholder="Search Header Number..."
                          onChange={handleInputChange}
                          value={inputValues.raHeader_no}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Box>

                      {/* warning */}
                      <Box sx={{
                        p: 1,
                        // bgcolor: "#ffebee",
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
                          Service Date
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                            <DatePicker
                              label="From"
                              value={inputValues.service_date_from ? dayjs(inputValues.service_date_from) : null}
                              onChange={handleDateFromChange}
                              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                            />
                            <DatePicker
                              label="To"
                              value={inputValues.service_date_to ? dayjs(inputValues.service_date_to) : null}
                              onChange={handleDateToChange}
                              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                            />
                          </Box>
                        </LocalizationProvider>

                      </Box>
                      <Box sx={{
                        p: 1,
                        // bgcolor: "#ffebee",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleChange}
                              fullWidth
                              sx={{
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                textTransform: "none",
                              }}
                            >
                              Search
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              color="primary"
                              variant="outlined"
                              onClick={handleClear}
                              fullWidth
                              sx={{
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                textTransform: "none",
                              }}
                            >
                              Clear
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>

                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 3 }}>
                    <Card sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      backgroundColor: '#f8f9fa'
                    }}>
                      <CardHeader
                        title="Service Code Frequency Analysis"
                        sx={{
                          backgroundColor: '#2c3e50',
                          color: 'white',
                          py: 1.5
                        }}
                      />
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Analyze Service Code"
                              value={analysisCode}
                              onChange={(e) => setAnalysisCode(e.target.value.toUpperCase())}
                              variant="outlined"
                              size="small"
                              placeholder="e.g., X123"
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button
                              fullWidth
                              variant="containedcontained"
                              color="primary"
                              onClick={fetchServiceCodeFrequency}
                              disabled={!analysisCode || loadingAnalysis}
                              sx={{ py: 1 }}
                            >
                            </Button>
                          </Grid>

                          {frequencyData && (
                            <Grid item xs={12} md={7}>
                              <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                flexWrap: 'wrap',
                                gap: 2
                              }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6" color="primary">
                                    {frequencyData.total_hins}
                                  </Typography>
                                  <Typography variant="body2">
                                    Unique HINs with {analysisCode}
                                  </Typography>
                                </Box>

                                {Object.entries(frequencyData.frequency_distribution).map(([count, hins]) => (
                                  <Box key={count} sx={{ textAlign: 'center', minWidth: 80 }}>
                                    <Typography variant="h6" color="secondary">
                                      {hins}
                                    </Typography>
                                    <Typography variant="body2">
                                      {count === '4+' ? '4+ Occurrences' : `${count} Occurrence${count > 1 ? 's' : ''}`}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Grid>
                          )}
                        </Grid>

                        {frequencyData && frequencyData.details.length > 0 && (
                          <Box sx={{ mt: 3, maxHeight: 200, overflow: 'auto' }}>
                            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                    <TableCell><strong>HIN</strong></TableCell>
                                    <TableCell align="right"><strong>Occurrences</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {frequencyData.details.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.hin}</TableCell>
                                      <TableCell align="right">{item.count}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Table content area - SCROLLABLE */}
                  <Grid item xs={12} md={9}>
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
                        flexGrow: 1,
                        overflow: "auto", // Make this content area scrollable
                      }}>
                        {loading ? (
                          <Box
                            sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Loading summary data...</Typography>
                          </Box>
                        ) : (
                          <>
                            {/* Scrollable table area */}
                            <Box sx={{ overflow: "auto" }}>
                              <TableContainer
                                component={Paper}
                                sx={{
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                }}
                              >
                                <Table aria-label="collapsible table" stickyHeader>
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
                                    }}>Billing Number</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Service Code</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Service Count</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Amount Claim</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Amount Paid</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Service Date</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Error</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Bill Type</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>Claim Number</TableCell>
                                    <TableCell sx={{
                                      fontWeight: "600",
                                      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                      fontSize: "0.875rem",
                                    }}>RA Header</TableCell>
                                  </TableRow>

                                  <TableBody>
                                    {products?.map((row, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{row.hin}, {row.versionCode}</TableCell>
                                        <TableCell>{row.billing_no}</TableCell>
                                        <TableCell>{row.service_code}</TableCell>
                                        <TableCell>{row.service_count}</TableCell>
                                        <TableCell>{row.amountClaim}</TableCell>
                                        <TableCell>{row.amountPay}</TableCell>
                                        <TableCell>{row.service_date}</TableCell>
                                        <TableCell>{row.error_code}</TableCell>
                                        <TableCell>{row.billType}</TableCell>
                                        <TableCell>{row.claim_no}</TableCell>
                                        <TableCell>{row.raHeader.raHeader_no}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                <TablePagination
                                  rowsPerPageOptions={[5, 10, 25]}
                                  component="div"
                                  count={totalCount}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  onPageChange={handleChangePage}
                                  onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                              </TableContainer>
                            </Box>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                border: "1px dashed #ccc",
              }}>
                <i className="fas fa-search"
                   style={{ fontSize: "48px", color: "#9e9e9e", marginBottom: "16px" }}></i>
                <Typography variant="h6" gutterBottom>Please Reload</Typography>
                <Typography variant="body2" color="textSecondary">
                  There are no RA details matching your criteria.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleChange}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Search
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={handleClear}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
          }}>
            <Typography>No data available</Typography>
          </Box>
        )}

      </div>
    </Layout1>
  );
};


export default RADx250;



