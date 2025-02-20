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
  useTheme /*  */,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import { FcApprove } from "react-icons/fc";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { BiSolidClinic, BiClinic } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { FcViewDetails } from "react-icons/fc";
import { GiTimeBomb } from "react-icons/gi";
import { RiCalendar2Line } from "react-icons/ri";
import { RiChat4Line } from "react-icons/ri";
import { RiMessage2Fill } from "react-icons/ri";
import { RiCalendarFill } from "react-icons/ri";
import { FormControlLabel, Checkbox, Box } from "@mui/material";

import { NumberBlock } from "./dashboardcomponents/number_block";
import HelmetComponent from "../SEO/HelmetComponent";
import DateRangeSelector from "./dashboardcomponents/DateRangeSelector";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  blueGrey,
  red,
  cyan,
  lime,
  lightGreen,
  amber,
  brown,
  indigo,
  deepPurple,
  purple,
  orange,
  pink,
  green,
  blue,
  teal,
  lightBlue,
} from "@mui/material/colors";
import { fontWeight } from "@mui/system";
import { LineChart, Line } from "recharts";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
  container: {
    marginBottom: theme.spacing(4),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const Dashboard = ({ clinicSlug }) => {
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const theme = useTheme();

  const navigate = useNavigate();
  // const [profile_approved_count, set_profile_approved_count] = useState(0);
  // const [profile_current_month_count, set_profile_current_month_count] = useState(0);
  // const [profile_change_percentage_last_month, set_profile_change_percentage_last_month] = useState(0);
  // const [demographic_positive_status, set_demographic_positive_status] = useState(true);
  // const [profile_previoud_month_count, set_profile_previoud_month_count] = useState(0);

  const [total_count_appointment, set_total_count_appointment] = useState(0);
  const [total_count_online_appointment, set_total_count_online_appointment] = useState(0);
  const [total_count_offline_appointment, set_total_count_offline_appointment] = useState(0);
  // const [new_demographics_count, set_new_demographics_count] = useState(0);
  const [total_count_profile, set_total_count_profile] = useState(0);
  const [approved_total_count, set_approved_total_count] = useState(0);
  // const [approved_current_month_count, set_approved_current_month_count] = useState(0);
  // const [approved_last_month_count, set_approved_last_month_count] = useState(0);
  // const [approved_percentage_change, set_approved_percentage_change] = useState(0);
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

    if (total_count_offline_appointment != 0) {
      handleSaveDoctorData();
    }
  }, [total_count_offline_appointment]);
  useEffect(() => {
    setFormattedStartDate(formatDateToISO(startDate));
    setFormattedEndDate(formatDateToISO(endDate));
  }, [startDate, endDate]); // useEffect will now run every time startDate changes

  const demographicData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
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
      // set_profile_approved_count(data.approved_count);
      // set_profile_current_month_count(data.current_month_count);
      // set_profile_previoud_month_count(data.previous_month_count);
      // set_profile_change_percentage_last_month(data.percentage_change);
      // set_demographic_positive_status(data.positive_demographic_change);
      // set_new_demographics_count(data.new_demographics_count);
      set_approved_total_count(data.approved_total_count);
      // set_approved_current_month_count(data.approved_current_month_count);
      // set_approved_last_month_count(data.approved_last_month_count);
      // set_approved_percentage_change(data.approved_percentage_change);
    } catch (err) {}
  };

  const appointmentData = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_PATH}/appointmentdash/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${accessToken}`,
        },
      });

      const data = await response.json();
      set_total_count_appointment(data.online_count + data.ofline_count);
      //set_total_count_online_appointment(data.online_count);
      //set_total_count_offline_appointment(data.ofline_count);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const allappointmentData = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
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

      data.bookmode_counts.forEach((item) => {
        if (item.bookmode === 1) {
          set_total_count_offline_appointment(item.total);
        } else if (item.bookmode === 0) {
          set_total_count_online_appointment(item.total);
        }
      });

      try {
        if (data.checkin_status_counts[0].total) {
          setCheckinStatusCounts(data.checkin_status_counts[0].total);
        }
      } catch (e) {}

      try {
        const transformedData = transformData(data.monthly_data);
        console.log(`transformedData:${transformedData}`);
        setMonthlyData(transformedData);
        initializeVisibleLines(transformedData);
      } catch (e) {}
    } catch (err) {
      console.log("Error:", err);
    }
  };

  function formatDateToISO(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  // Assuming the data is available in a variable named `doctorData`

  const handleSaveDoctorData = () => {
    doctorData.forEach((doctor) => {
      const doctorName = doctor["doctor__user__first_name"];
      processedDoctorsData[doctorName] = {
        name: doctorName,
        onlineTotal: 0,
        offlineTotal: 0,
      };
    });

    // Loop through each doctor entry
    doctorData.forEach((doctor) => {
      const doctorName = doctor["doctor__user__first_name"];
      const onlineTotal = doctor["online_total"] || 0; // Handle null values
      const offlineTotal = doctor["offline_total"] || 0; // Handle null values

      // Check if doctor already exists in processed data
      if (!processedDoctorsData[doctorName]) {
        processedDoctorsData[doctorName] = {
          name: doctorName,
          onlineTotal: 0,
          offlineTotal: 0,
        };
      }
      // Combine totals for existing doctor
      processedDoctorsData[doctorName].onlineTotal += onlineTotal;
      processedDoctorsData[doctorName].offlineTotal += offlineTotal;
      // You can call your API endpoint here to save the data:
      // fetch(`/api/save-doctor-data`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     doctorName,
      //     onlineTotal,
      //     offlineTotal,
      //   }),
      // })
      // .then(() => console.log('Data saved successfully'))
      // .catch((Error) => console.Error('Error saving data:', Error));
    });
  };

  // Callback function to update the selected dates
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Method to do something with the selected dates
  const handleDateSelection = () => {
    // Use startDate and endDate for further processing
    if (startDate !== null && endDate !== null) {
      allappointmentData();
      demographicData();
    }
    if (total_count_offline_appointment != 0) {
      handleSaveDoctorData();
    }
  };

  const transformData = (data) => {
    const groupedData = {};

    data.forEach((item) => {
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
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#387908",
      "#ff0000",
      "#00ff00",
      "#0000ff",
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

  const numberBlocksConfig = [
    {
      difference: total_count_profile,
      positive: true,
      value: total_count_profile,
      title: "Profile requests",
      icon: <UserPlusIcon color={cyan[100]} />,
      colo: cyan,
      task_per_minute: "1",
    },
    {
      difference: approved_total_count * 8,
      positive: true,
      value: approved_total_count,
      title: "Profile Approved",
      icon: <FaPersonCircleCheck color={deepPurple[100]} />,
      colo: deepPurple,
      task_per_minute: "8",
    },
    {
      difference: total_count_online_appointment * 5,
      positive: true,
      value: total_count_online_appointment,
      title: "Online Appointments",
      icon: <BiSolidClinic color={indigo[100]} />,
      colo: indigo,
      task_per_minute: "5",
    },
    {
      difference: 0,
      positive: true,
      value: total_count_offline_appointment,
      title: "Offline Appointments",
      icon: <BiSolidClinic color={teal[100]} />,
      colo: teal,
      task_per_minute: "",
    },
    {
      difference: checkin_status_counts * 0.3,
      positive: true,
      value: checkin_status_counts,
      title: "Total Checkins",
      icon: <FaUserCheck color={lightGreen[100]} />,
      colo: lightGreen,
      task_per_minute: "0.3",
    },
    {
      difference: confirmationSent,
      positive: true,
      value: confirmationSent,
      title: "Confirmation Sent",
      icon: <RiMessage2Fill color={orange[100]} />,
      colo: orange,
      task_per_minute: "1",
    },
    {
      difference: reminderSent,
      positive: true,
      value: reminderSent,
      title: "Reminder Sent",
      icon: <RiCalendarFill color={lightBlue[100]} />,
      colo: lightBlue,
      task_per_minute: "1",
    },
    {
      difference: 0,
      positive: true,
      value:
        (reminderSent * 2 +
          confirmationSent * 2 +
          checkin_status_counts * 0.3 +
          total_count_online_appointment * 6 +
          approved_total_count * 8 +
          total_count_profile * 2) /
        60,
      title: "Total Time Saved",
      icon: <GiTimeBomb color={blueGrey[100]} />,
      colo: blueGrey,
    },
  ];

  return (
    <>
      {(() => {
        if (isDataLoaded) {
          return (
            <>
              <HelmetComponent />
              <div>
                {/* Place the DateRangeSelector component where you want it to appear */}
                <Grid container spacing={2} sx={{ mt: 1, mb: 1, ml: 1 }}>
                  <Grid item xs={8} md={8} lg={8}>
                    {/* Pass the callback function to DateRangeSelector */}
                    <DateRangeSelector onDateChange={handleDateChange} />
                  </Grid>
                  {/* Other dashboard components can go here */}
                  <Grid item xs={4} md={4} lg={4}>
                    <Button variant="contained" color="primary" onClick={handleDateSelection}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
                {/* Button to trigger the method with selected dates */}
              </div>

              {/* <Grid container spacing={4} >
                                    <Grid item xs={6} md={12} lg={12}>
                                        <CardHeader titleTypographyProps={{ style: { fontSize: '1rem', fontWeight: 'bold' } }}
                                            title="Please note that the data was updated before 24 hours." />
                                    </Grid>
                                </Grid> */}

              <Grid container spacing={4} sx={{ mt: 1, mb: 1, ml: 1 }}>
                {numberBlocksConfig.map((config, index) => (
                  <Grid key={index} xs={6} sm={6} md={3} lg={3} padding={0.4}>
                    <NumberBlock
                      difference={config.difference}
                      positive={config.positive}
                      sx={{ height: "100%", marginLeft: "0.5rem" }}
                      value={config.value}
                      title={config.title}
                      icon={config.icon}
                      colo={config.colo}
                      task_per_minute={config.task_per_minute}
                    />
                  </Grid>
                ))}
              </Grid>
              {monthlyData.length > 0 && (
                <Grid container spacing={4} sx={{ mt: 1, mb: 1, ml: 1 }}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Card>
                      <CardHeader title="Online Appointments Comparision" />
                      <CardContent>
                        <Box display="flex" flexDirection="row" flexWrap="wrap" mb={2}>
                          {Object.keys(visibleLines).map((lineKey, index) => (
                            <FormControlLabel
                              key={lineKey}
                              control={
                                <Checkbox
                                  checked={visibleLines[lineKey]}
                                  onChange={() => handleCheckboxChange(lineKey)}
                                  name={lineKey}
                                  color="primary"
                                />
                              }
                              label={lineKey}
                            />
                          ))}
                        </Box>
                        <ResponsiveContainer width="fit-content" height={400}>
                          <LineChart
                            width={500}
                            height={300}
                            data={monthlyData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {monthlyData.length > 0 &&
                              Object.keys(visibleLines)
                                .filter((key) => key !== "month" && visibleLines[key])
                                .map((doctor, index) => (
                                  <Line
                                    key={doctor}
                                    type="monotone"
                                    dataKey={doctor}
                                    stroke={getColor(index)}
                                  />
                                ))}
                            {visibleLines["total"] && (
                              <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#000000"
                                strokeWidth={3}
                              />
                            )}
                          </LineChart>
                        </ResponsiveContainer>{" "}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {cumulativePercentage > 0 && (
                <Grid container spacing={4} sx={{ mt: 1, mb: 1, ml: 1 }}>
                  {/* table to display processedDoctorsData */}
                  <Grid item xs={12} md={12} lg={12}>
                    <Card>
                      <CardHeader title="Online Appointments by Doctor" />
                      <CardContent>
                        <TableContainer component={Paper} className={useStyles.tableContainer}>
                          <Table sx={{ textAlign: "center" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Doctor</TableCell>
                                <TableCell>Online</TableCell>
                                <TableCell>Offline</TableCell>
                                <TableCell
                                  style={{
                                    transition: "font-weight 0.3s ease-in-out",
                                    fontWeight: "normal",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.fontWeight = "bolder")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.fontWeight = "normal")
                                  }
                                >
                                  Online Appointments %<br />
                                  <span style={{ fontWeight: "bold" }}>
                                    {cumulativePercentage}%
                                  </span>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.values(processedDoctorsData)
                                .sort((a, b) => b.onlineTotal - a.onlineTotal) // Sort by onlineTotal in descending order
                                .map((doctor) => {
                                  const total = doctor.onlineTotal + doctor.offlineTotal;
                                  const onlinePercentage =
                                    total > 0
                                      ? ((doctor.onlineTotal / total) * 100).toFixed(2)
                                      : "0.00";
                                  return (
                                    <TableRow
                                      key={doctor.name}
                                      onMouseEnter={(e) => {
                                        const cells = e.currentTarget.querySelectorAll("td");
                                        cells.forEach((cell) => {
                                          cell.style.fontWeight = "bolder";
                                          cell.style.fontSize = "1rem";
                                        });
                                      }}
                                      onMouseLeave={(e) => {
                                        const cells = e.currentTarget.querySelectorAll("td");
                                        cells.forEach((cell) => {
                                          cell.style.fontWeight = "normal";
                                        });
                                      }}
                                      style={{
                                        transition: "font-weight 0.3s ease-in-out",
                                      }}
                                    >
                                      <TableCell>Dr. {doctor.name}</TableCell>
                                      <TableCell>{doctor.onlineTotal}</TableCell>
                                      <TableCell>{doctor.offlineTotal}</TableCell>
                                      <TableCell>{onlinePercentage} %</TableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </>
          );
        } else {
          return (
            <>
              <Card>
                <CardHeader title="Loading data. . ." />
              </Card>
            </>
          );
        }
      })()}
    </>
  );
};

export default Dashboard;
