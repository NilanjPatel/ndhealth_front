import React, { useState } from "react";
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
  const classes = useStyles();
  const [startMonth, setStartMonth] = useState(dayjs().startOf('month'));
  const [endMonth, setEndMonth] = useState(dayjs().endOf('month'));

  const handleStartMonthChange = (date) => {
    const newStart = dayjs(date).startOf("month");
    setStartMonth(newStart);

    if (onDateChange) {
      const end = endMonth || dayjs().endOf("month");
      onDateChange(newStart.toISOString(), end.toISOString());
    }
  };

  const handleEndMonthChange = (date) => {
    const newEnd = dayjs(date).endOf("month");
    setEndMonth(newEnd);

    if (onDateChange) {
      const start = startMonth || dayjs().startOf("month");
      onDateChange(start.toISOString(), newEnd.toISOString());
    }
  };

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year', 'month']}
            openTo="month"
            label="Start Month"
            minDate={dayjs().subtract(10, 'year')}
            maxDate={endMonth || dayjs().add(1, 'year')}
            value={startMonth}
            onChange={handleStartMonthChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                // helperText="Select start month"
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year', 'month']}
            openTo="month"
            label="End Month"
            minDate={startMonth || dayjs().subtract(10, 'year')}
            maxDate={dayjs().add(1, 'year')}
            value={endMonth}
            onChange={handleEndMonthChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                // helperText="Select end month"
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}

export default DateRangeSelector;