import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import EventIcon from '@material-ui/icons/Event';
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { Grid, TextField } from "@mui/material";

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

function formatDateToISO(date) {
  return date.toISOString().split("T")[0];
}

function DateRangeSelector({ onDateChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    // const currentDate = dayjs();
    // const earlierDate = dayjs().subtract(30, 'day');
    // const dayBeforeCurrentDate = currentDate.subtract(1, 'day');
    // setStartDate(earlierDate);
    // setEndDate(dayBeforeCurrentDate);
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && onDateChange) {
      onDateChange(date.toISOString(), endDate.toISOString());
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && onDateChange) {
      onDateChange(startDate.toISOString(), date.toISOString());
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </>
  );
}

export default DateRangeSelector;
