
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";

import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import API_BASE_PATH from "../../../../apiConfig";
import Layout from "./../../Layout";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";


// Row component for expandable table
const SummaryRow = ({ row }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(`row:${row.hin}, ${row.bDay}`);

  });

  return (
    <>
      <TableRow sx={{
        "& > *": { borderBottom: "unset" },
        cursor: "pointer",
        ...(open && {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          "& .MuiTableCell-root": {
            color: "primary.contrastText",
          },
        }),
      }}
                onClick={() => setOpen(!open)}
      >
        <TableCell component="th" scope="row">{row.hin}</TableCell>
        <TableCell>{`${row.lname}, ${row.fname}`}</TableCell>
        <TableCell align="right">${row.capitationTotal.toFixed(2)}</TableCell>
        <TableCell align="right">${row.outsideUseTotal.toFixed(2)}</TableCell>
        <TableCell align="right">${((row.capitationTotal * 3) - row.outsideUseTotal).toFixed(2)}</TableCell>
        <TableCell align="right">{row.rosterEnrolledTo}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box sx={{ margin: 1 }}>
                <Typography variant="subtitle1" sx={{
                  fontWeight: "600",
                  fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                  fontSize: "0.8rem",
                }}>
                  Capitation: Base Rate ${row.capitation?.baseRate?.toFixed(2) || "0.00"},
                  Comprehensive Care ${row.capitation?.compCare?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Table size="small" aria-label="outside use details">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.serviceDate}</TableCell>
                      <TableCell>{record.serviceCode}</TableCell>
                      <TableCell>{record.ServiceDescr}</TableCell>
                      <TableCell align="right">${record.serviceAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Update the dialog component to show debug info when there's no data
const OutsideUseDialog = ({ open, onClose, data, loading, clinicSlug }) => {
  // const location = useLocation();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicInfoError, setClinicInfoError] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState("all");

  useEffect(() => {
    const fetchClinicInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
        if (!response.ok) throw new Error("Failed to fetch clinic info");
        const data = await response.json();
        setClinicInfo(data.clinic || null);
      } catch (error) {
        setClinicInfoError(error.message);
      } finally {
        setClinicInfoFetched(true);
      }
    };

    if (!clinicInfoFetched && clinicSlug) {
      fetchClinicInfo().then(r => {
      });
      setClinicInfoFetched(true);
    }

  }, [clinicInfoFetched, clinicSlug]);

  // Extract unique roster values
  const rosterOptions = useMemo(() => {
    if (!data || !data.summary || data.summary.length === 0) return [];

    // Get unique roster values
    const uniqueRosters = [...new Set(data.summary.map(row => row.rosterEnrolledTo))];
    return uniqueRosters.sort();
  }, [data]);

  // Filter data based on selected roster
  const filteredData = useMemo(() => {
    if (!data || !data.summary) return null;

    if (selectedRoster === "all") {
      return data;
    }

    // Filter summary rows
    const filteredSummary = data.summary.filter(row =>
      row.rosterEnrolledTo === selectedRoster
    );

    // Calculate new totals for filtered data
    const totalCapitation = filteredSummary.reduce(
      (sum, row) => sum + row.capitationTotal, 0
    );

    const totalOutsideUse = filteredSummary.reduce(
      (sum, row) => sum + row.outsideUseTotal, 0
    );

    return {
      ...data,
      summary: filteredSummary,
      totalCapitation,
      totalOutsideUse
    };
  }, [data, selectedRoster]);

  const handleRosterChange = (event) => {
    setSelectedRoster(event.target.value);
  };

  // Provide fallback UI if clinic info is still loading
  // Add memoization to prevent unnecessary re-renders
  const memoizedData = React.useMemo(() => data, [JSON.stringify(data)]);

  // Display filtered count when filter is active
  const activeFilterInfo = selectedRoster !== "all" && filteredData && (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography variant="body2" sx={{ mr: 1 }}>
        Showing {filteredData.summary.length} of {data.summary.length} patients
      </Typography>
      <Chip
        label={`Roster: ${selectedRoster}`}
        onDelete={() => setSelectedRoster("all")}
        color="primary"
        size="small"
      />
    </Box>
  );

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


  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        <Card
          open={open}
          maxwidth="md"
          fullwidth="true"
          paperprops={{
            sx: {
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "hidden",
            },
          }}
        >
          <CardHeader
            title="Outside Use Summary"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              padding: "16px 24px",
            }}

          />

          <CardContent sx={{ padding: "24px", paddingTop: "24px" }}>
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

                {data.summary && data.summary.length > 0 ? (
                  <>
                    {/* Summary cards at the top */}
                    <Box sx={{ mt: 0.3, mb: 1, display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Box sx={{
                        flex: 1,
                        p: 2,
                        bgcolor: "#e3f2fd",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        minWidth: "180px",
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Total Capitation
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                          ${filteredData.totalCapitation.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{
                        flex: 1,
                        p: 2,
                        bgcolor: "#fff8e1",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        minWidth: "180px",
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Total Outside Use
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ff9800" }}>
                          ${filteredData.totalOutsideUse.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{
                        flex: 1,
                        p: 2,
                        bgcolor: ((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse) < 0 ? "#ffebee" : "#e8f5e9",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        minWidth: "180px",
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Difference
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            color: ((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse) < 0 ? "#d32f2f" : "#2e7d32",
                          }}
                        >
                          ${((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Roster filter */}
                    {rosterOptions.length > 1 && (
                      <Box sx={{ mb: 3, mt: 2, display: "flex", alignItems: "center" }}>
                        <FormControl sx={{ minWidth: 200, mr: 2 }} size="small">
                          <InputLabel id="roster-filter-label">Filter by Roster</InputLabel>
                          <Select
                            labelId="roster-filter-label"
                            id="roster-filter"
                            value={selectedRoster}
                            label="Filter by Roster"
                            onChange={handleRosterChange}
                          >
                            <MenuItem value="all">All Rosters ({data.summary.length})</MenuItem>
                            {rosterOptions.map((roster) => (
                              <MenuItem key={roster} value={roster}>
                                {roster} ({data.summary.filter(row => row.rosterEnrolledTo === roster).length})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {activeFilterInfo}
                      </Box>
                    )}

                    <TableContainer
                      component={Paper}
                      sx={{
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Table aria-label="collapsible table">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell sx={{
                              fontWeight: "600",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                              fontSize: "1rem",
                            }}>HIN</TableCell>
                            <TableCell sx={{
                              fontWeight: "600",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                              fontSize: "1rem",
                            }}>Patient Name</TableCell>
                            <TableCell align="right" sx={{
                              fontWeight: "600",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                              fontSize: "1rem",
                            }}>Capitation</TableCell>
                            <TableCell align="right" sx={{
                              fontWeight: "600",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                              fontSize: "1rem",
                            }}>Outside Use</TableCell>
                            <TableCell align="right" sx={{
                              fontWeight: "600",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                              fontSize: "1rem",
                            }}>Difference</TableCell>
                            <TableCell align="right" sx={{
                              fontWeight: "600",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                              fontSize: "1rem",
                            }}>Roster Enrolled To</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData.summary.map((row) => (
                            <SummaryRow key={row.hin} row={row} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
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
                    <Typography variant="h6" gutterBottom>No outside use data found</Typography>
                    <Typography variant="body2" color="textSecondary">
                      There are no outside use records matching your criteria.
                    </Typography>
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Create a singleton instance to manage the dialog state
class OutsideUseManager {
  static instance;
  static CACHE_KEY = "outsideUseData";

  constructor(clinicSlug) {
    // Create container for the dialog
    this.clinicSlug = clinicSlug; // Store the slug
    this.container = document.createElement("div");
    this.container.id = "outside-use-dialog-container";
    document.body.appendChild(this.container);
    this.root = createRoot(this.container); // Create root once
    this.data = null;
    this.isOpen = false;
    this.isLoading = false;
    this.originalMetaRefresh = null;
    this.render();

    // Add event listener for page unload to ensure refresh is re-enabled
    window.addEventListener("beforeunload", () => {
      if (this.originalMetaRefresh) {
        this.enablePageRefresh();
      }
    });
  }

  static getInstance(clinicSlug) {
    if (!OutsideUseManager.instance ||
      (clinicSlug && OutsideUseManager.instance.clinicSlug !== clinicSlug)) {
      OutsideUseManager.instance = new OutsideUseManager(clinicSlug);
    }
    return OutsideUseManager.instance;
  }

  async showDialog() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.isLoading = true;
      this.disablePageRefresh();
      this.fetchData().finally(() => {
        this.isLoading = false;
        this.render();
      });
    }
  }


  closeDialog() {
    this.isOpen = false;

    // Re-enable page refresh
    this.enablePageRefresh();

    this.render();
  }

  disablePageRefresh() {
    // Find and store the refresh meta tag
    this.originalMetaRefresh = document.querySelector("meta[http-equiv=\"refresh\"]");

    if (this.originalMetaRefresh) {
      // Remove it from the DOM temporarily
      this.originalMetaRefresh.parentNode?.removeChild(this.originalMetaRefresh);
    }
  }

  enablePageRefresh() {
    // If we stored a meta refresh tag, put it back
    if (this.originalMetaRefresh) {
      document.head.appendChild(this.originalMetaRefresh);
    }
  }

  async fetchData() {
    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("demo", "NO");
    formData.append("period", "3");
    // formData.append("provider", "034288");
    if (!localStorage.getItem("accessToken")) {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("token");
      const username = urlParams.get("username");
      const loggedIn = urlParams.get("loggedIn");
      if (accessToken && username && loggedIn) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("username", username);
        localStorage.setItem("loggedIn", loggedIn);
        // Proceed with authenticated actions
      }
    }

    try {
      // Clear existing data before fetching
      this.data = null;
      this.isLoading = true;
      this.render();



      // Fetch fresh data from the API
      const fetchResponse = await fetch(API_BASE_PATH + "/outsideuse/schedule/", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Token ${accessToken}`,
        },
      });

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! Status: ${fetchResponse.status}`);
      }

      const freshData = await fetchResponse.json();
      if (freshData.data === "New Data") {
        // Always cache the fresh data if it has content
        if (freshData.summary && freshData.summary.length > 0) {
          this.data = freshData;
        }


      } else {
        //
      }
    } catch (error) {
      console.error("Error fetching outside use data:", error);
      if (!this.data) {
        this.data = {
          error: `Failed to fetch data: ${error instanceof Error ? error.message : String(error)}`,
          summary: [],
          totalOutsideUse: 0,
          totalCapitation: 0,
          latestRefDate: null,
        };
      }
    }
  }

  render() {
    if (!this.container) return;
    if (this.container) {
      this.root.render(
        <BrowserRouter>
          <OutsideUseDialog
            open={this.isOpen}
            onClose={() => this.closeDialog()}
            data={this.data}
            loading={this.isLoading}
            // isCached={!!this.getCachedData() && !this.isLoading}
            clinicSlug={this.clinicSlug}
          />
        </BrowserRouter>,
      );
    }
  }

  // Add cleanup method
  unmount() {
    if (this.root) {
      this.root.unmount();
      document.body.removeChild(this.container);
    }
  }
}

export const InitallOutsideUse = () => {
  const { clinicSlug } = useParams();

  // Verify we have the slug before proceeding
  if (!clinicSlug) {
    console.error("clinicSlug is undefined!");
    return (
      <Box sx={{ p: 3, color: "error.main" }}>
        <Typography>Error: Missing clinic identifier</Typography>
      </Box>
    );
  }
  const manager = OutsideUseManager.getInstance(clinicSlug);
  manager.showDialog();
  // Cleanup on unmount
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    return () => {
      manager.closeDialog();
      manager.unmount();
    };
  }, [manager]);

  return null; // The dialog manages its own rendering
};