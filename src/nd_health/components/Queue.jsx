// src/components/Queue.jsx
import API_BASE_PATH from "../../apiConfig";
import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";
import Layout from "./Layout";
import "nd_health/components/css/Marquee.css";

const ClinicQueue = () => {
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const clinicSlugcurrent = pathSegments[pathSegments.indexOf("queue") + 1];
  const clinic_location = pathSegments[pathSegments.indexOf("queue") + 2];

  const fetchQueueData = async () => {
    try {
      console.log(`clinicslug:${clinicSlugcurrent}`);
      console.log(`clinic_location:${clinic_location}`);
      const response = await fetch(
        `${API_BASE_PATH}/queue/${clinicSlugcurrent}/${clinic_location}/`
      );
      const data = await response.json();

      if (data.status === "success") {
        setClinicInfo(data.clinic);
        setAppointments(data.appointments);
        setDoctors(data.doctors_info);
        setNotices(data.notices || []);
        setLastUpdated(new Date());
      } else {
        console.error("Error in API response:", data);
      }
    } catch (error) {
      console.error("Error fetching clinic information:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchQueueData();
    }, 15000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [clinicSlugcurrent, clinic_location]);

  // Group appointments by doctor and sort by appointment time
  const appointmentsByDoctor = {};
  appointments.forEach(appointment => {
    const doctorId = appointment.doctorLocation__id;
    if (!appointmentsByDoctor[doctorId]) {
      appointmentsByDoctor[doctorId] = [];
    }
    appointmentsByDoctor[doctorId].push(appointment);
  });

  // Sort appointments by time for each doctor
  Object.keys(appointmentsByDoctor).forEach(doctorId => {
    appointmentsByDoctor[doctorId].sort((a, b) => {
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });
  });

  // Find doctor name by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.doctor__user__first_name} ${doctor.doctor__user__last_name}` : `Doctor #${doctorId}`;
  };

  // Format time to be more readable
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  // Get unique doctor IDs
  const doctorIds = Object.keys(appointmentsByDoctor).map(id => parseInt(id));

  // Create a table with rows for each appointment position (up to 10)
  const maxAppointments = 10;
  const tableRows = [];

  for (let i = 0; i < maxAppointments; i++) {
    const row = { position: i + 1 };

    doctorIds.forEach(doctorId => {
      const doctorAppointments = appointmentsByDoctor[doctorId] || [];
      row[doctorId] = doctorAppointments[i] || null;
    });

    // Only add row if at least one doctor has an appointment at this position
    if (doctorIds.some(doctorId => row[doctorId] !== null)) {
      tableRows.push(row);
    }
  }

  return (
    <Layout clinicInfo={clinicInfo}>
      <Box>
        <Paper elevation={3} sx={{ p: 3, mt:-2, bgcolor: "#f8f9fa" }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
            Walk-In Patient Queue
          </Typography>
          {/*<Typography variant="subtitle1" align="center" sx={{ mb: 1, color: "#7f8c8d" }}>*/}
          {/*  {clinicInfo?.name || "Clinic Queue"}*/}
          {/*</Typography>*/}
          {/*<Typography variant="caption" align="center" sx={{ display: "block", mb: 2, color: "#95a5a6" }}>*/}
          {/*  Last updated: {lastUpdated.toLocaleTimeString()}*/}
          {/*</Typography>*/}
          {notices && notices.length > 0 && (
            <Paper elevation={2} sx={{ p: 2, bgcolor: "#fffde7" }}>
              <Typography variant="h6" sx={{ color: "#d35400" }}>
                Important Notice: {notices}
              </Typography>
            </Paper>
          )}
          {/*<Divider sx={{ mb: 1 }} />*/}

          {loading ? (
            <Typography variant="body1" align="center">Loading queue information...</Typography>
          ) : appointments.length === 0 ? (
            <Typography variant="body1" align="center">No patients currently in appointment queue</Typography>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#ecf0f1" }}>
                    {/*<TableCell sx={{ fontWeight: "bold", width: "80px" }}>Position</TableCell>*/}
                    {doctorIds.map(doctorId => (
                      <TableCell key={doctorId} sx={{ fontWeight: "bold" }}>
                        {getDoctorName(doctorId)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' },
                        '&:first-of-type': { bgcolor: '#e3f2fd' }  // Highlight next patient row
                      }}
                    >
                      <TableCell>
                        {index === 0 ? (
                          <Chip
                            label="NEXT"
                            color="primary"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        ) : (
                          `#${index + 1}`
                        )}
                      </TableCell>

                      {doctorIds.map(doctorId => {
                        const appointment = row[doctorId];
                        return (
                          <TableCell key={doctorId}>
                            {appointment ? (
                              <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                // p: 1,
                                borderRadius: "4px",
                                bgcolor: index === 0 ? "rgba(33, 150, 243, 0.1)" : "transparent",
                                border: index === 0 ? "1px solid rgba(33, 150, 243, 0.3)" : "none"
                              }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "bold",
                                    color: index === 0 ? "#1976d2" : "#2c3e50",
                                    fontSize: "1.5rem"
                                  }}
                                >
                                  {doctorId}
                                  {appointment.appointmentNumber != null && appointment.appointmentNumber.toString().padStart(2, '0')}

                                </Typography>
                                <Typography variant="caption" sx={{ color: "#7f8c8d" }}>
                                  {formatTime(appointment.appointmentTime)}
                                </Typography>
                              </Box>
                            ) : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ClinicQueue;