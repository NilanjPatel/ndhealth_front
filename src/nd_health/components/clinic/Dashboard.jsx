import API_BASE_PATH from "../../../apiConfig";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  Fade,
  CircularProgress,
  Chip,
  Avatar,
} from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { BiSolidClinic } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";
import { GiTimeBomb } from "react-icons/gi";
import { RiMessage2Fill } from "react-icons/ri";
import { RiCalendarFill } from "react-icons/ri";
import { FormControlLabel, Checkbox } from "@mui/material";
import SearchIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import CalendarIcon from "@heroicons/react/24/solid/CalendarDaysIcon";

import { NumberBlock } from "./dashboardcomponents/number_block";
import HelmetComponent from "../SEO/HelmetComponent";
import DateRangeSelector from "./dashboardcomponents/DateRangeSelector";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  blueGrey,
  cyan,
  lightGreen,
  indigo,
  deepPurple,
  orange,
  teal,
  lightBlue,
} from "@mui/material/colors";
import { LineChart, Line } from "recharts";
import { format } from "date-fns";

// Styled components for enhanced UI
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
  minHeight: '100vh',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  '& .MuiCardHeader-title': {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
    transform: 'translateY(-2px)',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  '& .MuiTableHead-root': {
    '& .MuiTableRow-root': {
      background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
      '& .MuiTableCell-root': {
        fontWeight: 700,
        color: theme.palette.text.primary,
        borderBottom: 'none',
      },
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        transform: 'scale(1.01)',
      },
      '&:nth-of-type(even)': {
        backgroundColor: alpha(theme.palette.grey[50], 0.5),
      },
    },
  },
}));

const MetricChip = styled(Chip)(({ theme, severity }) => {
  const colors = {
    high: { bg: theme.palette.success.main, text: theme.palette.success.contrastText },
    medium: { bg: theme.palette.warning.main, text: theme.palette.warning.contrastText },
    low: { bg: theme.palette.error.main, text: theme.palette.error.contrastText },
  };

  return {
    fontWeight: 600,
    backgroundColor: colors[severity]?.bg || theme.palette.grey[300],
    color: colors[severity]?.text || theme.palette.text.secondary,
  };
});

const LoadingOverlay = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  borderRadius: theme.spacing(2),
}));

const Dashboard = ({ clinicSlug }) => {
  const theme = useTheme();
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const navigate = useNavigate();

  // State variables (keeping existing state structure)
  const [total_count_online_appointment, set_total_count_online_appointment] = useState(0);
  const [total_count_offline_appointment, set_total_count_offline_appointment] = useState(0);
  const [total_count_profile, set_total_count_profile] = useState(0);
  const [approved_total_count, set_approved_total_count] = useState(0);
  const [doctorData, setDoctorData] = useState([]);
  const [processedDoctorsData, setProcessedDoctorsData] = useState({});
  const [checkin_status_counts, setCheckinStatusCounts] = useState(0);
  const [confirmationSent, setConfirmationSent] = useState(0);
  const [reminderSent, setReminderSent] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState(null);
  const [formattedEndDate, setFormattedEndDate] = useState(null);
  const [cumulativePercentage, setCumulativePercentage] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [visibleLines, setVisibleLines] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Existing useEffect hooks (keeping the same logic)
  useEffect(() => {
    const total = total_count_online_appointment + total_count_offline_appointment;
    setCumulativePercentage(
      total > 0 ? ((total_count_online_appointment / total) * 100).toFixed(2) : 0
    );
  }, [total_count_online_appointment, total_count_offline_appointment]);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
    } else {
      setIsDataLoaded(true);
    }
    handleDateSelection();

    if (total_count_offline_appointment !== 0) {
      handleSaveDoctorData();
    }
  }, [total_count_offline_appointment]);

  useEffect(() => {
    setFormattedStartDate(formatDateToISO(startDate));
    setFormattedEndDate(formatDateToISO(endDate));
  }, [startDate, endDate]);

  // Existing functions (keeping the same logic but adding loading states)
  const demographicData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_PATH}/dashboard/profile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
        body: JSON.stringify({
          startdate: formattedStartDate,
          enddate: formattedEndDate,
        }),
      });
      const data = await response.json();
      set_total_count_profile(data.total_count);
      set_approved_total_count(data.approved_total_count);
    } catch (err) {
      console.error("Error fetching demographic data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const allappointmentData = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_PATH}/allappointmentdash/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
        body: JSON.stringify({
          startdate: formattedStartDate,
          enddate: formattedEndDate,
        }),
      });
      const data = await response.json();

      if (data.doctor_counts) {
        setDoctorData(data.doctor_counts);
      }
      if (data.bookmode_count) {
        set_total_count_online_appointment(data.bookmode_count);
      }
      if (data.confirmation_sent) {
        setConfirmationSent(data.confirmation_sent);
      }
      if (data.reminder_sent) {
        setReminderSent(data.reminder_sent);
      }

      data.bookmode_counts?.forEach((item) => {
        if (item.bookmode === 1) {
          set_total_count_offline_appointment(item.total);
        } else if (item.bookmode === 0) {
          set_total_count_online_appointment(item.total);
        }
      });

      try {
        if (data.checkin_status_counts[0]?.total) {
          setCheckinStatusCounts(data.checkin_status_counts[0].total);
        }
      } catch (e) {
        console.error("Error processing checkin status:", e);
      }

      try {
        const transformedData = transformData(data.monthly_data);
        setMonthlyData(transformedData);
        initializeVisibleLines(transformedData);
      } catch (e) {
        console.error("Error processing monthly data:", e);
      }
    } catch (err) {
      console.error("Error fetching appointment data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Keeping existing utility functions
  function formatDateToISO(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleSaveDoctorData = () => {
    const processed = {};
    doctorData.forEach((doctor) => {
      const doctorName = doctor["doctor__user__first_name"];
      if (!processed[doctorName]) {
        processed[doctorName] = {
          name: doctorName,
          onlineTotal: 0,
          offlineTotal: 0,
        };
      }
      processed[doctorName].onlineTotal += doctor["online_total"] || 0;
      processed[doctorName].offlineTotal += doctor["offline_total"] || 0;
    });
    setProcessedDoctorsData(processed);
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleDateSelection = () => {
    if (startDate !== null && endDate !== null) {
      allappointmentData();
      demographicData();
    }
    if (total_count_offline_appointment !== 0) {
      handleSaveDoctorData();
    }
  };

  const transformData = (data) => {
    const groupedData = {};
    data?.forEach((item) => {
      const month = format(new Date(item.month), "yyyy-MM");
      const doctor = item["doctor__user__first_name"];
      if (!groupedData[month]) {
        groupedData[month] = { month, total: 0 };
      }
      groupedData[month][doctor] = item.online_total;
      groupedData[month].total += item.online_total;
    });
    return Object.values(groupedData);
  };

  const getColor = (index) => {
    const colors = [
      "#8884d8", "#82ca9d", "#ffc658", "#ff7300",
      "#387908", "#ff0000", "#00ff00", "#0000ff"
    ];
    return colors[index % colors.length];
  };

  const initializeVisibleLines = (data) => {
    if (data.length > 0) {
      const initialVisibleLines = Object.keys(data[0]).reduce((acc, key) => {
        if (key !== "month") {
          acc[key] = true;
        }
        return acc;
      }, {});
      setVisibleLines(initialVisibleLines);
    }
  };

  const handleCheckboxChange = (lineKey) => {
    setVisibleLines((prevState) => ({
      ...prevState,
      [lineKey]: !prevState[lineKey],
    }));
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };

  const numberBlocksConfig = [
    {
      difference: total_count_profile * 0.5,
      positive: true,
      value: total_count_profile,
      title: "Profile Requests",
      icon: <UserPlusIcon />,
      colo: cyan,
      task_per_minute: "0.5",
    },
    {
      difference: approved_total_count * 8,
      positive: true,
      value: approved_total_count,
      title: "Profiles Approved",
      icon: <FaPersonCircleCheck />,
      colo: deepPurple,
      task_per_minute: "8",
    },
    {
      difference: total_count_online_appointment * 5,
      positive: true,
      value: total_count_online_appointment,
      title: "Online Appointments",
      icon: <BiSolidClinic />,
      colo: indigo,
      task_per_minute: "5",
    },
    {
      difference: 0,
      positive: true,
      value: total_count_offline_appointment,
      title: "Offline Appointments",
      icon: <BiSolidClinic />,
      colo: teal,
      task_per_minute: "",
    },
    {
      difference: checkin_status_counts * 0.17,
      positive: true,
      value: checkin_status_counts,
      title: "Total Check-ins",
      icon: <FaUserCheck />,
      colo: lightGreen,
      task_per_minute: "0.17",
    },
    {
      difference: confirmationSent * 0.5,
      positive: true,
      value: confirmationSent,
      title: "Confirmations Sent",
      icon: <RiMessage2Fill />,
      colo: orange,
      task_per_minute: "0.5",
    },
    {
      difference: reminderSent * 0.5,
      positive: true,
      value: reminderSent,
      title: "Reminders Sent",
      icon: <RiCalendarFill />,
      colo: lightBlue,
      task_per_minute: "0.5",
    },
    {
      difference: 0,
      positive: true,
      value: (
        (reminderSent * 0.5 +
          confirmationSent * 0.5 +
          checkin_status_counts * 0.17 +
          total_count_online_appointment * 5 +
          approved_total_count * 8 +
          total_count_profile * 0.5) / 60
      ),
      title: "Total Time Saved",
      icon: <GiTimeBomb />,
      colo: blueGrey,
    },
  ];

  if (!isDataLoaded) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading Dashboard...
          </Typography>
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <HelmetComponent />

      {/* Header Section */}
      {/*<Box sx={{ mb: 4 }}>*/}
      {/*  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>*/}
      {/*    Healthcare Dashboard*/}
      {/*  </Typography>*/}
      {/*  <Typography variant="body1" sx={{ color: 'text.secondary' }}>*/}
      {/*    Monitor your clinic's performance and efficiency metrics*/}
      {/*  </Typography>*/}
      {/*</Box>*/}

      {/* Date Filter Section */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {/*<Grid item xs={12} md={2}>*/}
            {/*  <Box display="flex" alignItems="center" gap={1}>*/}
            {/*    <CalendarIcon style={{ width: 20, height: 20, color: theme.palette.primary.main }} />*/}
            {/*    <Typography variant="subtitle2" fontWeight={600}>*/}
            {/*      Date Range*/}
            {/*    </Typography>*/}
            {/*  </Box>*/}
            {/*</Grid>*/}
            <Grid item xs={12} md={8}>
              <DateRangeSelector onDateChange={handleDateChange} />
            </Grid>
            <Grid item xs={12} md={2}>
              <SearchButton
                variant="contained"
                fullWidth
                onClick={handleDateSelection}
                disabled={isLoading}
                startIcon={<SearchIcon style={{ width: 18, height: 18 }} />}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </SearchButton>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {numberBlocksConfig.map((config, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Fade in timeout={200 + index * 100}>
              <div>
                <NumberBlock
                  difference={config.difference}
                  positive={config.positive}
                  value={config.value}
                  title={config.title}
                  icon={config.icon}
                  colo={config.colo}
                  task_per_minute={config.task_per_minute}
                  size={'extrasmall'}
                />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      {monthlyData.length > 0 && (
        <Fade in timeout={600}>
          <StyledCard sx={{ mb: 4 }}>
            <StyledCardHeader title="Online Appointments Comparison" />
            <CardContent>
              <Box display="flex" flexDirection="row" flexWrap="wrap" mb={3} gap={1}>
                {Object.keys(visibleLines).map((lineKey) => (
                  <FormControlLabel
                    key={lineKey}
                    control={
                      <Checkbox
                        checked={visibleLines[lineKey]}
                        onChange={() => handleCheckboxChange(lineKey)}
                        name={lineKey}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {lineKey}
                      </Typography>
                    }
                  />
                ))}
              </Box>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: theme.shape.borderRadius,
                      boxShadow: theme.shadows[8],
                    }}
                  />
                  <Legend />
                  {Object.keys(visibleLines)
                    .filter((key) => key !== "month" && visibleLines[key])
                    .map((doctor, index) => (
                      <Line
                        key={doctor}
                        type="monotone"
                        dataKey={doctor}
                        stroke={getColor(index)}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, stroke: getColor(index), strokeWidth: 2 }}
                      />
                    ))}
                  {visibleLines["total"] && (
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke={theme.palette.primary.main}
                      strokeWidth={4}
                      dot={{ r: 5, fill: theme.palette.primary.main }}
                      activeDot={{ r: 7, stroke: theme.palette.primary.main, strokeWidth: 3 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Fade>
      )}

      {/* Doctor Performance Table */}
      {cumulativePercentage > 0 && (
        <Fade in timeout={800}>
          <StyledCard>
            <StyledCardHeader
              title="Doctor Performance Analytics"
              subheader={`Overall Online Appointment Rate: ${cumulativePercentage}%`}
            />
            <CardContent>
              <StyledTableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>Dr</Avatar>
                          <Typography variant="subtitle2" fontWeight={700}>
                            Doctor
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={700}>
                          Online
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={700}>
                          Offline
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={700}>
                          Total
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={700}>
                          Online Rate
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={700}>
                          Performance
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(processedDoctorsData)
                      .sort((a, b) => b.onlineTotal - a.onlineTotal)
                      .map((doctor, index) => {
                        const total = doctor.onlineTotal + doctor.offlineTotal;
                        const onlinePercentage = total > 0
                          ? ((doctor.onlineTotal / total) * 100).toFixed(1)
                          : "0.0";
                        const performanceLevel = getPerformanceLevel(parseFloat(onlinePercentage));

                        return (
                          <TableRow key={doctor.name}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: getColor(index),
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {doctor.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="body2" fontWeight={600}>
                                  Dr. {doctor.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight={600} color="primary.main">
                                {doctor.onlineTotal.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight={600} color="text.secondary">
                                {doctor.offlineTotal.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight={700}>
                                {total.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color={performanceLevel === 'high' ? 'success.main' :
                                  performanceLevel === 'medium' ? 'warning.main' : 'error.main'}
                              >
                                {onlinePercentage}%
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <MetricChip
                                label={performanceLevel.toUpperCase()}
                                size="small"
                                severity={performanceLevel}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </StyledTableContainer>

              {/* Summary Stats */}
              <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        {Object.values(processedDoctorsData).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Doctors
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {(total_count_online_appointment + total_count_offline_appointment).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Appointments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight={700} color="warning.main">
                        {cumulativePercentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Digital Adoption Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </StyledCard>
        </Fade>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;