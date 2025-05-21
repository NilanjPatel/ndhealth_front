import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import API_BASE_PATH from "../../../../apiConfig";
import Layout1 from "./../../Layout1";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { CardActions } from "@mui/material";
import { createRoot } from "react-dom/client";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RefreshIcon from "@mui/icons-material/Refresh";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";
import Link from "@mui/material/Link";
import Item from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import { RosterTerminatedPatients } from "./RosterTerminatedPatients";
import NotificationDialog from "../../resources/Notification";
// Row component for expandable table
// Enhanced SummaryRow with roster fetching


const SummaryRow = ({ row, clinicSlug, rosterOptions }) => {
  const [open, setOpen] = useState(false);
  const [rosterEnrolledTo, setRosterEnrolledTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchedRef = useRef(false); // Track if we've already fetched
  const providerNo = localStorage.getItem("providerNo");
  const updateCachedData = (hin, newRosterValue) => {
    try {
      const cachedDataStr = localStorage.getItem("outsideUseData");
      if (!cachedDataStr) return;

      const cachedData = JSON.parse(cachedDataStr);

      // Find and update the specific row
      const updatedSummary = cachedData.summary.map(item =>
        item.hin === hin ? { ...item, rosterEnrolledTo: newRosterValue } : item,
      );

      // Update cache with new data
      localStorage.setItem(
        "outsideUseData",
        JSON.stringify({
          ...cachedData,
          summary: updatedSummary,
        }),
      );
    } catch (error) {
      console.error("Error updating cached data:", error);
    }
  };


  useEffect(() => {
    // Only fetch if:
    // 1. We haven't fetched yet (fetchedRef.current is false)
    // 2. We have all required data
    // 3. rosterEnrolledTo is still null

    if (!fetchedRef.current && row.hin && row.bDay && clinicSlug && rosterEnrolledTo === "") {
      fetchedRef.current = true; // Mark as fetched

      const fetchRosterInfo = async () => {
        setIsLoading(true);
        try {
          const url = `${API_BASE_PATH}/doctors/${
            row.bDay.replace(/\//g, "")
          }/${row.hin.replace(/\//g, "")}/${clinicSlug}/outside/`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.status === "success") {
            const newRosterValue = data.rosterEnrolledTo || "Unknown";
            setRosterEnrolledTo(newRosterValue);
            updateCachedData(row.hin, newRosterValue);
          }
        } catch (error) {
          console.error("Error fetching roster info:", error);
          setRosterEnrolledTo("Unknown");
        } finally {
          setIsLoading(false);
        }
      };

      // fetchRosterInfo();
    }
  }, [row.hin, row.bDay, clinicSlug]); // Removed rosterEnrolledTo from

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

      >
        <TableCell component="th" scope="row" onClick={() => setOpen(!open)}>{row.hin}</TableCell>
        <TableCell onClick={() => setOpen(!open)}>{`${row.lname}, ${row.fname}`}</TableCell>
        <TableCell align="right"
                   onClick={() => setOpen(!open)}>${(row.capitationTotal.toFixed(2) * 3).toFixed(2)}</TableCell>
        <TableCell align="right" onClick={() => setOpen(!open)}>${row.outsideUseTotal.toFixed(2)}</TableCell>
        <TableCell align="right"
                   onClick={() => setOpen(!open)}>${((row.capitationTotal * 3) - row.outsideUseTotal).toFixed(2)}</TableCell>
        <TableCell align="right"><Link fontWeight={"bolder"} target="_blank"
                                       href={`https://mapledoctors.ca:8443/oscar/billing/CA/ON/billingOB.jsp?billRegion=ON&billForm=MFP&hotclick=&appointment_no=0&demographic_name=${row.lname} ${row.fname}&demographic_no=${row.demo}&providerview=${providerNo}&user_no=${providerNo}&apptProvider_no=none`}>{row.demo}</Link></TableCell>
        <TableCell align="right" onClick={() => setOpen(!open)}>
          {isLoading ? (
            <CircularProgress size={16} />
          ) : (
            row.rosterEnrolledTo || "Unknown"
          )}
        </TableCell>
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
const OutsideUseDialog1 = ({ open, onClose, data, loading, clinicSlug, onDataUpdate }) => {
  // Original state variables
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicInfoError, setClinicInfoError] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState("all");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isRefreshingRosters, setIsRefreshingRosters] = useState(false);
  const [rosterUpdateError, setRosterUpdateError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Batch fetch roster information for current page patients only
  const refreshRosters = async () => {
    if (!filteredData?.summary || filteredData.summary.length === 0) return;

    setIsRefreshingRosters(true);
    setRosterUpdateError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      // Get only the current page's patients
      const currentPagePatients = getCurrentPageData().map(row => ({
        hin: row.hin,
        bDay: row.bDay,
      }));

      const requestData = {
        data: JSON.stringify({
          summary: currentPagePatients,
        }),
      };

      const response = await fetch(`${API_BASE_PATH}/outsideuse/getletestRoster/letest/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.rosterupdate) {
        setUpdateSuccess(true); // Show success notification

        // Update only the patients that were refreshed
        const updatedSummary = data.summary.map(row => {
          const updatedRoster = result.rosterupdate.find(item => item.hin === row.hin);
          if (updatedRoster) {
            return {
              ...row,
              rosterEnrolledTo: updatedRoster.rosterEnrolledTo || row.rosterEnrolledTo || "Unknown",
              rosterTerminationDate: updatedRoster.rosterTerminationDate || row.rosterTerminationDate || "Unknown",
              rosterStatus: updatedRoster.rosterStatus || row.rosterStatus || "Unknown",
            };
          }
          return row;
        });

        // Update the cache
        const cachedDataStr = localStorage.getItem("outsideUseData");
        if (cachedDataStr) {
          const cachedData = JSON.parse(cachedDataStr);
          localStorage.setItem(
            "outsideUseData",
            JSON.stringify({
              ...cachedData,
              summary: updatedSummary,
              lastRosterUpdate: new Date().toISOString(),
            }),
          );
        }

        // Create the updated data structure
        const updatedData = {
          ...data,
          summary: updatedSummary,
        };

        // Notify parent component of the update
        if (onDataUpdate) {
          onDataUpdate(updatedData);
        }

        // Return the updated data structure
        return updatedData;
      }
    } catch (error) {
      console.error("Error refreshing rosters:", error);
      setRosterUpdateError(error.message);
      return data; // Return original data on error
    } finally {
      setIsRefreshingRosters(false);
    }
  };

  useEffect(() => {
    console.log(`Data:${data}`);
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
  }, [clinicInfoFetched, clinicSlug, data]);

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
      row.rosterEnrolledTo === selectedRoster,
    );

    // Calculate new totals for filtered data
    const totalCapitation = filteredSummary.reduce(
      (sum, row) => sum + row.capitationTotal, 0,
    );

    const totalOutsideUse = filteredSummary.reduce(
      (sum, row) => sum + row.outsideUseTotal, 0,
    );

    return {
      ...data,
      summary: filteredSummary,
      totalCapitation,
      totalOutsideUse,
    };
  }, [data, selectedRoster]);

  // Get current page data
  const getCurrentPageData = () => {
    if (!filteredData || !filteredData.summary) return [];

    return filteredData.summary.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
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

  const handleRosterChange = (event) => {
    setSelectedRoster(event.target.value);
    setPage(0); // Reset to first page when filter changes
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
    <Layout1 clinicInfo={clinicInfo}>
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
            title="Last 3 months Outside Use Summary"
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
                    <Box sx={{
                      mb: 4,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: 3,
                    }}>
                      <Box sx={{
                        p: 3,
                        bgcolor: "#e3f2fd",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <i className="fas fa-wallet"
                           style={{ fontSize: "24px", color: "#1976d2", marginBottom: "12px" }}></i>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          letterSpacing: "0.5px",
                        }}>
                          TOTAL CAPITATION
                        </Typography>
                        <Typography variant="h4" sx={{
                          fontWeight: "600",
                          color: "#1976d2",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        }}>
                          ${(filteredData.totalCapitation.toFixed(2) * 3).toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{
                        p: 3,
                        bgcolor: "#fff8e1",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <i className="fas fa-hospital"
                           style={{ fontSize: "24px", color: "#ff9800", marginBottom: "12px" }}></i>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          letterSpacing: "0.5px",
                        }}>
                          TOTAL OUTSIDE USE
                        </Typography>
                        <Typography variant="h4" sx={{
                          fontWeight: "600",
                          color: "#ff9800",
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                        }}>
                          ${filteredData.totalOutsideUse.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{
                        p: 3,
                        bgcolor: ((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse) < 0 ? "#ffebee" : "#e8f5e9",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <i
                          className={`fas fa-${((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse) < 0 ? "exclamation-triangle" : "check-circle"}`}
                          style={{
                            fontSize: "24px",
                            color: ((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse) < 0 ? "#d32f2f" : "#2e7d32",
                            marginBottom: "12px",
                          }}></i>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          letterSpacing: "0.5px",
                        }}>
                          BALANCE
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "600",
                            color: ((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse) < 0 ? "#d32f2f" : "#2e7d32",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          }}
                        >
                          ${((filteredData.totalCapitation * 3) - filteredData.totalOutsideUse).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3, mt: 2 }}>
                      {/* Roster Filter */}
                      {rosterOptions.length > 1 && (
                        <Grid item>
                          <FormControl sx={{ minWidth: 200 }} size="small">
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
                        </Grid>
                      )}

                      {/* Optional Active Filter Info */}
                      {rosterOptions.length > 1 && activeFilterInfo && (
                        <Grid item>
                          {activeFilterInfo}
                        </Grid>
                      )}

                      {/* Refresh Button */}
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={async () => {
                            await refreshRosters();
                            // Handle the updated data if needed
                          }}
                          disabled={isRefreshingRosters}
                          startIcon={isRefreshingRosters ? <CircularProgress size={16} /> : <RefreshIcon />}
                          sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontFamily: "sans-serif",
                            fontVariantCaps: "normal",
                            color: "white",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              borderColor: "rgba(255, 255, 255, 0.5)",
                              color: "black",
                            },
                          }}
                        >
                          {isRefreshingRosters ? "Updating..." : "Refresh Current Page"}
                        </Button>
                      </Grid>

                      {/* Page info */}
                      <Grid item sx={{ ml: "auto", mr: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Showing page {page + 1} of {Math.ceil(filteredData.summary.length / rowsPerPage)}
                        </Typography>
                      </Grid>
                    </Grid>

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
                            }}>Bill</TableCell>
                            <TableCell align="right" sx={{
                              fontWeight: "600",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                              fontSize: "1rem",
                            }}>Roster Enrolled To</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getCurrentPageData().map((row) => (
                            <SummaryRow key={row.hin} row={row} clinicSlug={clinicSlug} rosterOptions={rosterOptions} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pagination controls */}
                    <TablePagination
                      // rowsPerPageOptions={[15, 25, 50]}
                      rowsPerPageOptions={false}
                      component="div"
                      count={filteredData.summary.length}
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

        <Snackbar
          open={updateSuccess}
          autoHideDuration={3000}
          onClose={() => setUpdateSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setUpdateSuccess(false)} severity="success">
            Rosters updated successfully!
          </Alert>
        </Snackbar>

        {rosterUpdateError && (
          <Snackbar
            open={!!rosterUpdateError}
            autoHideDuration={5000}
            onClose={() => setRosterUpdateError(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setRosterUpdateError(null)} severity="error">
              Error updating rosters: {rosterUpdateError}
            </Alert>
          </Snackbar>
        )}
      </div>
    </Layout1>
  );
};

const OutsideUseDialog = ({ open, onClose, data, loading, clinicSlug, onDataUpdate }) => {
  // Original state variables
  const [clinicInfo, setClinicInfo] = useState(null);
  const [clinicInfoError, setClinicInfoError] = useState(null);
  const [clinicInfoFetched, setClinicInfoFetched] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState("all");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [isRefreshingRosters, setIsRefreshingRosters] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // State for individual roster updates
  const [individualRosterUpdating, setIndividualRosterUpdating] = useState(false);

  // Batch fetch roster information for current page patients only
  const refreshRosters = async () => {
    if (!filteredData?.summary || filteredData.summary.length === 0) return;

    setIsRefreshingRosters(true);

    try {
      const accessToken = localStorage.getItem("accessToken");

      // Get only the current page's patients
      const currentPagePatients = getCurrentPageData().map(row => ({
        hin: row.hin,
        bDay: row.bDay,
      }));

      const requestData = {
        data: JSON.stringify({
          summary: currentPagePatients,
        }),
      };

      const response = await fetch(`${API_BASE_PATH}/outsideuse/getletestRoster/letest/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.rosterupdate) {
        handleSuccess("Current pages's roster enrollment status updated successfully!");
        // Update only the patients that were refreshed
        const updatedSummary = data.summary.map(row => {
          const updatedRoster = result.rosterupdate.find(item => item.hin === row.hin);
          if (updatedRoster) {
            return {
              ...row,
              rosterEnrolledTo: updatedRoster.rosterEnrolledTo || row.rosterEnrolledTo || "Unknown",
            };
          }
          return row;
        });

        // Update the cache
        const cachedDataStr = localStorage.getItem("outsideUseData");
        if (cachedDataStr) {
          const cachedData = JSON.parse(cachedDataStr);
          localStorage.setItem(
            "outsideUseData",
            JSON.stringify({
              ...cachedData,
              summary: updatedSummary,
              lastRosterUpdate: new Date().toISOString(),
            }),
          );
        }

        // Create the updated data structure
        const updatedData = {
          ...data,
          summary: updatedSummary,
        };

        // Notify parent component of the update
        if (onDataUpdate) {
          onDataUpdate(updatedData);
        }

        // Return the updated data structure
        return updatedData;
      }
    } catch (error) {
      console.error("Error refreshing rosters:", error);

      handleFailure(error.message);
      return data; // Return original data on error
    } finally {
      setIsRefreshingRosters(false);
    }
  };

  // Function to update a single patient's roster
  const updatePatientRoster = async (hin, newRosterValue) => {
    setIndividualRosterUpdating(true);

    try {
      // Find the patient in the data
      const patient = data.summary.find(row => row.hin === hin);
      if (!patient) {
        throw new Error("Patient not found");
      }

      const accessToken = localStorage.getItem("accessToken");

      // Create request data for a single patient
      const requestData = {
        data: JSON.stringify({
          summary: [{
            hin: patient.hin,
            bDay: patient.bDay,
            rosterEnrolledTo: newRosterValue,
            demographic: patient.demo,
          }],
        }),
      };

      // You might need to adjust this endpoint to handle single roster updates
      const response = await fetch(`${API_BASE_PATH}/outsideuse/updateRoster/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update the patient in the data
        const updatedSummary = data.summary.map(row =>
          row.hin === hin ? { ...row, rosterEnrolledTo: newRosterValue } : row,
        );

        // Update the cache
        const cachedDataStr = localStorage.getItem("outsideUseData");
        if (cachedDataStr) {
          const cachedData = JSON.parse(cachedDataStr);
          localStorage.setItem(
            "outsideUseData",
            JSON.stringify({
              ...cachedData,
              summary: updatedSummary,
            }),
          );
        }

        // Create the updated data structure
        const updatedData = {
          ...data,
          summary: updatedSummary,
        };

        // Notify parent component of the update
        if (onDataUpdate) {
          onDataUpdate(updatedData);
        }
        handleSuccess(`Roster enrollment status updated successfully for Patient ${patient.lname} ${patient.fname}`);
        return updatedData;
      } else {
        throw new Error("Failed to update roster");
      }
    } catch (error) {
      console.error("Error updating patient roster:", error);
      handleFailure(error.message);
      return data;
    } finally {
      setIndividualRosterUpdating(false);
    }
  };

  useEffect(() => {
    console.log(`Data:${data}`);
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
  }, [clinicInfoFetched, clinicSlug, data]);

  // Extract unique roster values
  const rosterOptions = useMemo(() => {
    if (!data || !data.summary || data.summary.length === 0) return [];

    // Get unique roster values
    const uniqueRosters = [...new Set(data.summary.map(row => row.rosterEnrolledTo))];
    return uniqueRosters.sort();
  }, [data]);

  // Filter data based on selected roster
  const filteredData = useMemo(() => {

    if (data.network_base_rate === null) {
      localStorage.removeItem("outsideUseData");
    }

    if (!data || !data.summary) return null;

    if (selectedRoster === "all") {
      return data;
    }

    // Filter summary rows
    const filteredSummary = data.summary.filter(row =>
      row.rosterEnrolledTo === selectedRoster,
    );

    // Calculate new totals for filtered data
    const totalCapitation = filteredSummary.reduce(
      (sum, row) => sum + row.capitationTotal, 0,
    );

    const totalOutsideUse = filteredSummary.reduce(
      (sum, row) => sum + row.outsideUseTotal, 0,
    );

    return {
      ...data,
      summary: filteredSummary,
      totalCapitation,
      totalOutsideUse,
    };
  }, [data, selectedRoster]);

  // Get current page data
  const getCurrentPageData = () => {
    if (!filteredData || !filteredData.summary) return [];

    return filteredData.summary.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
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

  const handleRosterChange = (event) => {
    setSelectedRoster(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

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

  // Custom SummaryRow component with roster toggle functionality
  const EnhancedSummaryRow = ({ row }) => {
    const [open, setOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const providerNo = localStorage.getItem("providerNo");
    const handleRosterChange = async (event) => {
      const newRosterValue = event.target.value;
      setIsUpdating(true);

      try {
        await updatePatientRoster(row.hin, newRosterValue);
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <>
        <TableRow sx={{
          "& > *": { borderBottom: "unset" },
          cursor: "pointer",
          ...(open && {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          }),
        }}>
          <TableCell component="th" scope="row" onClick={() => setOpen(!open)}>{row.hin}</TableCell>
          <TableCell onClick={() => setOpen(!open)}>{`${row.lname}, ${row.fname}`}</TableCell>
          <TableCell align="right"
                     onClick={() => setOpen(!open)}>${(row.capitationTotal.toFixed(2) * 3).toFixed(2)}</TableCell>
          <TableCell align="right" onClick={() => setOpen(!open)}>${row.outsideUseTotal.toFixed(2)}</TableCell>
          <TableCell align="right"
                     onClick={() => setOpen(!open)}>${((row.capitationTotal * 3) - row.outsideUseTotal).toFixed(2)}</TableCell>
          <TableCell align="right">{row.code}</TableCell>
          <TableCell align="right">
            <Link
              fontWeight={"bolder"}
              target="_blank"
              href={`https://mapledoctors.ca:8443/oscar/billing/CA/ON/billingOB.jsp?billRegion=ON&billForm=MFP&hotclick=&appointment_no=0&demographic_name=${row.lname} ${row.fname}&demographic_no=${row.demo}&providerview=${providerNo}&user_no=${providerNo}&apptProvider_no=none`}
            >
              {row.demo}
            </Link>
          </TableCell>
          <TableCell align="right">
            {isUpdating ? (
              <CircularProgress size={20} />
            ) : (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={row.rosterEnrolledTo || "Unknown"}
                  onChange={handleRosterChange}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    fontSize: "0.875rem",
                    ".MuiSelect-select": {
                      padding: "6px 8px",
                    },
                  }}
                >
                  {rosterOptions.map((roster) => (
                    <MenuItem key={roster} value={roster}>
                      {roster}
                    </MenuItem>
                  ))}
                  {/*<MenuItem value="Unknown">Unknown</MenuItem>*/}
                  {/*<MenuItem value="Not Enrolled">Not Enrolled</MenuItem>*/}
                </Select>
              </FormControl>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  return clinicInfo ? (
    <Layout1 clinicInfo={clinicInfo}>
      <div>
        {/* Title Card */}
        <CardHeader
          title="Last 3 months Outside Use Summary"
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
            {data.summary && data.summary.length > 0 ? (

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
                        bgcolor: "#e3f2fd",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        {/*<i className="fas fa-wallet" style={{ fontSize: "24px", color: "#1976d2", marginBottom: "12px" }}></i>*/}
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          letterSpacing: "0.5px",
                        }}>
                          MAXIMUM BONUS
                        </Typography>
                        <Typography
                          // variant="h4"
                          sx={{
                            fontWeight: "600",
                            color: "#1976d2",
                            fontSize: "1.5rem",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          }}>
                          ${(3 * (filteredData.network_base_rate + filteredData.compare_care) * 0.1859).toFixed(2)}
                        </Typography>
                      </Box>
                      {/* TOTAL current_roster_patients */}
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
                        {/*<i className="fas fa-wallet" style={{ fontSize: "24px", color: "#1976d2", marginBottom: "12px" }}></i>*/}
                        <Typography
                          // variant="subtitle2"
                          variant="subtitle2" color="text.secondary" gutterBottom sx={{
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          letterSpacing: "0.5px",
                        }}>
                          CURRENT ROSTER PATIENTS
                        </Typography>
                        <Typography
                          // variant="h4"
                          sx={{
                            fontWeight: "600",
                            fontSize: "1.5rem",
                            color: "#1976d2",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          }}>
                          ${filteredData.current_roster_patients}
                        </Typography>
                      </Box>
                      {/* TOTAL OUTSIDE USE */}
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
                        {/*<i className="fas fa-hospital" style={{ fontSize: "24px", color: "#ff9800", marginBottom: "12px" }}></i>*/}
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          letterSpacing: "0.5px",
                        }}>
                          TOTAL OUTSIDE USE
                        </Typography>
                        <Typography
                          // variant="h4"
                          sx={{
                            fontWeight: "600",
                            color: "#ff9800",
                            fontSize: "1.5rem",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          }}>
                          ${filteredData.totalOutsideUse.toFixed(2)}
                        </Typography>
                      </Box>

                      {/* BALANCE */}
                      <Box sx={{
                        p: 1,
                        bgcolor: (((filteredData.network_base_rate + filteredData.compare_care) * 3) * 0.1859 - filteredData.totalOutsideUse) < 0 ? "#ffebee" : "#e8f5e9",
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                        <i
                          className={`fas fa-${(((filteredData.network_base_rate + filteredData.compare_care) * 3) * 0.1859 - filteredData.totalOutsideUse) < 0 ? "exclamation-triangle" : "check-circle"}`}
                          style={{
                            fontSize: "24px",
                            color: (((filteredData.network_base_rate + filteredData.compare_care) * 3) * 0.1859 - filteredData.totalOutsideUse) < 0 ? "#d32f2f" : "#2e7d32",
                            marginBottom: "12px",
                          }}></i>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{
                          fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          letterSpacing: "0.5px",
                        }}>
                          BALANCE
                        </Typography>
                        <Typography
                          // variant="h4"
                          sx={{
                            fontWeight: "600",
                            fontSize: "1.5rem",
                            color: (((filteredData.network_base_rate + filteredData.compare_care) * 3) * 0.1859 - filteredData.totalOutsideUse) < 0 ? "#d32f2f" : "#2e7d32",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          }}
                        >
                          ${(((filteredData.network_base_rate + filteredData.compare_care) * 3) * 0.1859 - filteredData.totalOutsideUse).toFixed(2)}
                        </Typography>
                      </Box>
                      <a href={`/clinic/${clinicSlug}/rosterterminated?token=${localStorage.getItem('accessToken')}`} target="_blank" rel="noopener noreferrer"
                         style={{ textDecoration: "none" }}>

                        <Box sx={{
                          p: 1,
                          bgcolor: "#c2cee1",
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
                            FROM MCEDT
                          </Typography>
                          <Typography
                            // variant="h4"
                            sx={{
                              fontWeight: "600",
                              fontSize: "1.5rem",
                              color: "#045ae1",
                              fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                            }}
                          >
                            Roster Termination
                          </Typography>
                        </Box>
                      </a>
                      {/* warning */}
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
                          WARNING
                        </Typography>
                        <Typography
                          // variant="h4"
                          sx={{
                            fontWeight: "600",
                            fontSize: "1.5rem",
                            color: "#d32f2f",
                            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                          }}
                        >
                          Data is approximate
                        </Typography>
                      </Box>

                    </Box>
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
                            {/* Filters and controls - STICKY */}
                            <Box sx={{
                              // position: "sticky",
                              // top: 0,
                              // backgroundColor: "white",
                              // zIndex: 10,
                              // paddingBottom: 2,
                              // borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                            }}>
                              <Grid container spacing={2} alignItems="center" sx={{ mb: 3, mt: 0 }}>
                                {/* Roster Filter */}
                                {rosterOptions.length > 1 && (
                                  <Grid item>
                                    <FormControl sx={{ minWidth: 200 }} size="small">
                                      <InputLabel id="roster-filter-label">Filter by Roster</InputLabel>
                                      <Select
                                        labelId="roster-filter-label"
                                        id="roster-filter"
                                        value={selectedRoster}
                                        label="Filter by Roster"
                                        onChange={handleRosterChange}
                                      >
                                        <MenuItem value="all">All Rosters ({filteredData.summary.length})</MenuItem>
                                        {rosterOptions.map((roster) => (
                                          <MenuItem key={roster} value={roster}>
                                            {roster} ({filteredData.summary.filter(row => row.rosterEnrolledTo === roster).length})
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                )}

                                {/* Optional Active Filter Info */}
                                {rosterOptions.length > 1 && activeFilterInfo && (
                                  <Grid item>
                                    {activeFilterInfo}
                                  </Grid>
                                )}

                                {/* Refresh Button */}
                                <Grid item>
                                  <Button
                                    variant="contained"
                                    onClick={refreshRosters}
                                    disabled={isRefreshingRosters || individualRosterUpdating}
                                    startIcon={isRefreshingRosters ? <CircularProgress size={16} /> : <RefreshIcon />}
                                    sx={{
                                      textTransform: "none",
                                      fontWeight: "bold",
                                      fontFamily: "sans-serif",
                                      fontVariantCaps: "normal",
                                      color: "white",
                                      borderColor: "rgba(255, 255, 255, 0.3)",
                                      "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderColor: "rgba(255, 255, 255, 0.5)",
                                        color: "black",
                                      },
                                    }}
                                  >
                                    {isRefreshingRosters ? "Updating..." : "Refresh Enrolled Status"}
                                  </Button>
                                </Grid>

                                {/* Page info */}
                                <Grid item sx={{ ml: "auto", mr: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Showing page {page + 1} of {Math.ceil(filteredData.summary.length / rowsPerPage)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>

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
                                  <TableHead>
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
                                      <TableCell align="right" sx={{
                                        fontWeight: "600",
                                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                        fontSize: "0.875rem",
                                      }}>Capitation</TableCell>
                                      <TableCell align="right" sx={{
                                        fontWeight: "600",
                                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                        fontSize: "0.875rem",
                                      }}>Outside Use</TableCell>
                                      <TableCell align="right" sx={{
                                        fontWeight: "600",
                                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                        fontSize: "0.875rem",
                                      }}>Difference</TableCell>
                                      <TableCell align="right" sx={{
                                        fontWeight: "600",
                                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                        fontSize: "0.875rem",
                                      }}>Code</TableCell>
                                      <TableCell align="right" sx={{
                                        fontWeight: "600",
                                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                        fontSize: "0.875rem",
                                      }}>Bill</TableCell>
                                      <TableCell align="right" sx={{
                                        fontWeight: "600",
                                        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
                                        fontSize: "0.875rem",
                                      }}>Roster Enrolled To</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {getCurrentPageData().map((row) => (
                                      <EnhancedSummaryRow key={row.hin} row={row} />
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>

                            {/* Pagination controls - STICKY to bottom */}
                            <Box sx={{
                              position: "sticky",
                              bottom: 0,
                              backgroundColor: "white",
                              zIndex: 10,
                              paddingTop: 2,
                              borderTop: "1px solid rgba(224, 224, 224, 0.5)",
                            }}>
                              <TablePagination
                                rowsPerPageOptions={false}
                                component="div"
                                count={filteredData.summary.length}
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

                              <Box sx={{
                                mt: 1,
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "rgba(25, 118, 210, 0.05)",
                                p: 1,
                                borderRadius: 1,
                              }}>
                                <i className="fas fa-info-circle"
                                   style={{
                                     color: "#1976d2",
                                     marginRight: "8px",
                                     fontSize: "16px",
                                   }}></i>
                                <Typography variant="body2" color="text.secondary"
                                            sx={{ fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif" }}>
                                  Click on any patient row to view detailed outside use information. You can also change
                                  a
                                  patient's roster enrollment directly from the dropdown menu.
                                </Typography>
                              </Box>
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
        <NotificationDialog
          open={openModal}
          onClose={handleCloseApp}
          content={modalContent}
          isError={isError}
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
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenurl = urlParams.get("token");
    const username = urlParams.get("username");
    const loggedIn = urlParams.get("loggedIn");
    const providerNo = urlParams.get("providerNo");
    if (!localStorage.getItem("accessToken") || localStorage.getItem("accessToken") !== accessTokenurl) {
      if (accessTokenurl && username && loggedIn && providerNo) {
        localStorage.setItem("accessToken", accessTokenurl);
        localStorage.setItem("username", username);
        localStorage.setItem("loggedIn", loggedIn);
        localStorage.setItem("providerNo", providerNo);
        localStorage.removeItem("outsideUseData");
        // Proceed with authenticated actions
      }
    }

    try {
      // Clear existing data before fetching
      this.data = null;
      this.isLoading = true;
      this.render();

      // Check if we have cached data
      const cachedData = this.getCachedData();
      const outsideUseData = localStorage.getItem("outsideUseData");
      if (outsideUseData) {
        const parsedData = JSON.parse(outsideUseData);
        const latest_ref_date = parsedData.latest_ref_date;
        const username = localStorage.getItem("username");

        if (latest_ref_date) {
          formData.append("latest_ref_date", latest_ref_date);
        }
        if (username) {
          formData.append("username", username);
        }
      }
      // If we have cached data, use it initially while fetching fresh
      console.log(`CachedData:${cachedData}`);
      if (cachedData) {
        this.data = cachedData;
        this.isLoading = false;
        this.render();
        // Continue loading in the background
        this.isLoading = true;
      }

      // Fetch fresh data from the API
      console.log(`fetching outside use`);
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
          this.cacheData(freshData);
          localStorage.setItem("username", freshData.username);

        }

        // Compare with cached data to decide what to display
        if (cachedData) {
          if (this.shouldUpdateCache(cachedData, freshData)) {
            this.data = freshData;
          }
        } else {
          // No cached data, so use fresh data
          this.data = freshData;
        }
      }
    } catch (error) {
      console.error("Error fetching outside use data:", error);

      // If we have cached data, use it on error
      const cachedData = this.getCachedData();
      if (cachedData && !this.data) {
        this.data = cachedData;
      } else if (!this.data) {
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

  getCachedData() {
    try {
      const cachedDataStr = localStorage.getItem(OutsideUseManager.CACHE_KEY);
      console.log(`cachedDataStr:${cachedDataStr}`);
      if (cachedDataStr) {
        const cachedData = JSON.parse(cachedDataStr);


        return cachedData;
      }
    } catch (error) {
      console.error("Error reading from cache:", error);
    }
    return null;
  }

  cacheData(data) {
    try {
      localStorage.setItem(OutsideUseManager.CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(`${OutsideUseManager.CACHE_KEY}_timestamp`, Date.now().toString());
    } catch (error) {
      console.error("Error caching data:", error);
    }
  }

  shouldUpdateCache(cachedData, freshData) {
    if (!cachedData) return true;

    // If fresh data has a newer refDate, update the cache
    if (freshData.latestRefDate && cachedData.latestRefDate) {
      return new Date(freshData.latestRefDate) > new Date(cachedData.latestRefDate);
    }

    // If we can't compare refDates, check if the data is different
    return JSON.stringify(freshData.summary) !== JSON.stringify(cachedData.summary);
  }

  render() {
    if (!this.container) return;
    if (this.container) {
      // Check if we're using cached data
      // const cachedDataStr = localStorage.getItem(OutsideUseManager.CACHE_KEY);
      // const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

      // We're using cached data if:
      // 1. We're not loading
      // 2. We have data
      // 3. The data matches what's in the cache
      // const isCached = !this.isLoading &&
      //   !!this.data &&
      //   !!cachedData &&
      //   JSON.stringify(this.data) === JSON.stringify(cachedData);

      this.root.render(
        <BrowserRouter>
          <OutsideUseDialog
            open={this.isOpen}
            onClose={() => this.closeDialog()}
            data={this.data}
            loading={this.isLoading}
            isCached={!!this.getCachedData() && !this.isLoading}
            clinicSlug={this.clinicSlug}
            onDataUpdate={(updatedData) => {
              this.data = updatedData;
              this.render(); // Re-render with updated data
            }}
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