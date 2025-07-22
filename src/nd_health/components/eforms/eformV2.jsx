import React, { useState, useEffect } from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";

import API_BASE_PATH from "../../../apiConfig";

import Layout from "nd_health/components/Layout";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Radio, RadioGroup } from "@mui/material";

import {
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const renderInput = (item, handleInputChange, formValues) => {
  switch (item.type) {
    case "yesno":
      return (
        <FormGroup style={{ minWidth: "100%" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formValues[item.question] === "Yes"}
                onChange={(event) => handleInputChange(event, item.type, item.question, "Yes")}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formValues[item.question] === "No"}
                onChange={(event) => handleInputChange(event, item.type, item.question, "No")}
              />
            }
            label="No"
          />
        </FormGroup>
      );

    case "text":
      return (
        <TextField
          style={{ minWidth: "100%" }}
          // Remove label here to avoid duplication
          value={formValues[item.question] || ""}
          onChange={(event) => handleInputChange(event, item.type, item.question)}
        />
      );
    case "checkbox":
      return (
        <FormControl component="fieldset">
          {/* Remove FormLabel to avoid duplication */}
          <FormGroup>
            {item.options.map((option, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={formValues[item.question]?.includes(option) || false}
                    onChange={(event) =>
                      handleInputChange(event, item.type, item.question, option)
                    }
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        </FormControl>
      );
    case "radio":
      return (
        <FormControl component="fieldset">
          {/* Remove FormLabel to avoid duplication */}
          <RadioGroup
            aria-label={item.question}
            name={item.question}
            value={formValues[item.question] || ''}
            onChange={(event) => handleInputChange(event, item.type, item.question)}
          >
            {item.options.map((option, index) => (
              <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
            ))}
          </RadioGroup>
        </FormControl>
      );
    case "select":
      return (
        <FormControl>
          {/* Remove InputLabel to avoid duplication */}
          <Select
            labelId={item.question}
            id={item.question}
            value={formValues[item.question] || ''}
            onChange={(event) => handleInputChange(event, item.type, item.question)}
            style={{ minWidth: "20rem" }}
          >
            {item.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    case "date":
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // Remove label here to avoid duplication
            disableFuture={true}
            value={formValues[item.question] ? dayjs(formValues[item.question]) : null}
            onChange={(newValue) => handleInputChange(newValue, item.type, item.question)}
            renderInput={(params) => (
              <TextField {...params} style={{ minWidth: "100%" }} />
            )}
          />
        </LocalizationProvider>
      );
    case "time":
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            // Remove label here to avoid duplication
            // value={formValues[item.question] ? dayjs(formValues[item.question]) : null}
            value={formValues[item.question] || null}
            onChange={(newValue) => handleInputChange(newValue, item.type, item.question)}
            renderInput={(params) => (
              <TextField {...params} style={{ minWidth: "100%" }} />
            )}
          />
        </LocalizationProvider>
      );
    default:
      return null;
  }
};

const renderSectionItems = (items, handleInputChange, parentName, formValues) => {
  return (
    <Grid container spacing={2}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <Grid item xs={12} sm={12} md={12} lg={8}>
            {/* Display question only once */}
            {item.question && (
              <Typography variant="subtitle1" style={{ marginBottom: "10px", fontWeight: "500" }}>
                {item.question}
              </Typography>
            )}

            {item.subheading && (
              <Typography variant="body2" style={{ marginBottom: "8px" }}>
                {item.subheading}
              </Typography>
            )}

            {item.image && (
              <img
                src={item.image}
                alt="Question Image"
                style={{ maxWidth: "100%", height: "auto", marginBottom: "8px" }}
              />
            )}

            {renderInput(item, handleInputChange, formValues)}

            {item.items &&
              renderSectionItems(item.items, handleInputChange, `${parentName}-${item.question}`, formValues)}
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={8}>
            <Divider style={{ margin: "5px 0", backgroundColor: "black" }} />
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};

const DynamicForm = () => {
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const location = useLocation();
  const { clinicSlug } = useParams();
  const clinicInfo = location.state && location.state.clinicInfo;
  const demo = location.state && location.state.demo;
  const eformId = location.state && location.state.eformId;
  const [openApp, setOpenApp] = useState(false);
  const [buttonRedirect, setButtonRedirect] = useState("");
  const [appointmentBookContent, setAppointmentBookContent] = useState("");

  useEffect(() => {
    const fetchEform = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/eform/fill/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clinicid: clinicInfo.id,
            demo: demo,
            eformId: eformId,
          }),
        });

        const data = await response.json();

        if (data.status === "success") {
          setFormData(data.form);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEform().then(r => {});
  });



  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedForm = {
      ...formValues,
      "Time of Accident": formValues["Time of Accident"]
        ? dayjs(formValues["Time of Accident"]).format("hh:mm A")
        : "",
    };

    try {
      const response = await fetch(`${API_BASE_PATH}/eform/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinicid: clinicInfo.id,
          demo: demo,
          form: formattedForm,
          eformId: eformId,
          title: formData.title,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setOpenApp(true);
        setButtonRedirect("Home");
        setAppointmentBookContent("Form Successfully submitted.");
      } else {
        setOpenApp(true);
        setButtonRedirect("Try Again");
        setAppointmentBookContent("Something Went Wrong.");
      }
    } catch (error) {
      setAppointmentBookContent("Something went wrong.");
      setButtonRedirect("Try Again");
      setOpenApp(true);
    }
  };

  const redirectHome = () => {
    setOpenApp(false);
    window.location.href = `/clinic/${clinicSlug}/`;
  };

  const handleCloseApp = () => {
    setOpenApp(false);
    redirectHome();
  };

  const handleInputChange = (event, type, name, optionValue) => {
    if (type === "date") {
      // Handle date picker value
      if (event && event.$d) {
        const date = new Date(event.$d);
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        });
        setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: formattedDate }));
      }
    } else if (type === "time") {
      // Handle time picker value
      if (event && event.$d) {
        // const date = new Date(event.$d);
        // const time = date.toLocaleTimeString("en-US", {
        //   hour: "2-digit",
        //   minute: "2-digit",
        //   hour12: true,
        // });
        // setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: time }));
        setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: event }));

      }
    } else if (type === "checkbox") {
      // Handle checkbox options
      if (optionValue) {
        // For multi-select checkboxes
        const currentValues = [...(formValues[name] || [])];
        const checked = event.target.checked;

        if (checked && !currentValues.includes(optionValue)) {
          currentValues.push(optionValue);
        } else if (!checked && currentValues.includes(optionValue)) {
          const index = currentValues.indexOf(optionValue);
          currentValues.splice(index, 1);
        }

        setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: currentValues }));
      } else {
        // For single checkboxes (like yes/no)
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          [name]: event.target.checked
        }));
      }
    } else if (type === "yesno") {
      // Handle yes/no radio buttons
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: optionValue
      }));
    } else {
      // Handle text, radio, select inputs
      const value = event.target.value;
      setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: value }));
    }
  };

  return (
    <Layout clinicInfo={clinicInfo}>
      <>
        {formData ? (
          <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingTop={-1}>
            <form onSubmit={handleSubmit}>
              <Grid item xs={12} sm={12} md={12} style={{ padding: "1rem" }}>
                <Typography variant="h4">{formData.title}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} style={{ padding: "1rem" }}>
                <Typography variant="body1">{formData.subheading}</Typography>
              </Grid>

              {formData.sections.map((section, index) => (
                <div key={index}>
                  <Grid item xs={12} sm={12} md={12} style={{ padding: "1rem" }}>
                    <Typography variant="h5">{section.title}</Typography>
                    <Typography variant="body2">{section.subheading}</Typography>
                    {renderSectionItems(section.items, handleInputChange, `section-${index}`, formValues)}
                  </Grid>
                </div>
              ))}
              <Grid item xs={12} sm={6} md={4} style={{ padding: "1rem" }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </form>
          </Grid>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
      </>
      <Dialog open={openApp} onClose={handleCloseApp}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>{appointmentBookContent}</DialogContent>
        <DialogActions>
          <Button onClick={redirectHome}>{buttonRedirect}</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default DynamicForm;