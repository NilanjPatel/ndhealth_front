import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
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

function DateRangeSelector({ onDateChange }) {
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);

  const handleStartMonthChange = (date) => {
    setStartMonth(date);
    if (endMonth && onDateChange) {
      onDateChange(date.startOf("month").toISOString(), endMonth.endOf("month").toISOString());
    }
  };

  const handleEndMonthChange = (date) => {
    setEndMonth(date);
    if (startMonth && onDateChange) {
      onDateChange(startMonth.startOf("month").toISOString(), date.endOf("month").toISOString());
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year', 'month']}
            openTo="month"
            label="Start Month"
            value={startMonth}
            onChange={handleStartMonthChange}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year', 'month']}
            openTo="month"
            label="End Month"
            value={endMonth}
            onChange={handleEndMonthChange}
            renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}

export default DateRangeSelector;
