import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CardHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,


  Button,

  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import PlaceholderAwareInput from './../../../resources/PlaceholderAwareInput';
import API_BASE_PATH from '../../../../apiConfig';

import { APPOINTMENTTYPE, } from './../../../resources/variables';
const useStyles = makeStyles((theme) => ({
  resizableTextField: {
    resize: 'vertical',  // Allow vertical resizing
    overflow: 'auto',    // Enable overflow scrolling if the content exceeds the size
    '& textarea': {
      resize: 'none',    // Disable resizing in all directions except bottom right
    },
  },
}));
const EmailTemplateEditor = () => {
  const [template, setTemplate] = useState({
    body: ''
  });
  const [static_contents, setStatic_Contents] = useState(generateAppointmentDetails());
  const [preview, setPreview] = useState('<p><strong>please arrive at least 15 minutes prior </strong>to your appointment time to check your BP, wt. etc. Your appointment can be cancelled if you arrive more than 15 minutes late. <strong>If you miss the appointment, you may be charged </strong>according to the OMA policy.</p><p>Please, cancel the appointment if you are unable to attend at least 24 hours prior, so we can use this appointment for another patient. </p><p>Please bring all current medication in a bag for refill. Check from pharmacy also if you need any refills and can bring list from pharmacy.</p><p>Please read our clinic"s appointment <strong><a href="https://www.nd-health.ca/clinic/{slug}/policy" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" data-linkindex="0">policy</a></strong> </p>');
  const classes = useStyles();

  const [contentGretings, setContentGretings] = useState('');
  const [contentGretingsReminder, setContentGretingsReminder] = useState('');
  const [content, setContent] = useState('');
  const [staticClinicConformation, setClinicConfirmation] = useState('<p>Hello John,<br><br>You received this email as a confirmation of your appointment at Maple Clinic.</p>');
  const [staticPhoneConformation, setPhoneConfirmation] = useState('<p>Hello John,<br><br>You received this email as a confirmation of your phone consultation appointment with Dr. Olivia Smith. </p>');
  const [staticVideoConformation, setVideoConfirmation] = useState('<p>Hello John,<br><br>You received this email as a confirmation of your video consultation appointment with Dr. Olivia Smith. </p>');

  const [contentID, setContentID] = useState('');
  const [staticClinicReminder, setClinicReminder] = useState('<p>Dear John,<br><br>This is a friendly reminder of your appointment at Maple Clinic scheduled for tomorrow.</p>');
  const [staticPhoneReminder, setPhoneReminder] = useState('<p>Dear John,<br><br>This is a friendly reminder of your scheduled phone consultation appointment with Dr. Olivia Smith.  tomorrow.</p>');
  const [staticVideoReminder, setVideoReminder] = useState('<p>Dear John,<br><br>This is a friendly reminder of your scheduled video consultation appointment with Dr. Olivia Smith.  tomorrow.</p>');
  const [staticEnd, setEnd] = useState("<p>We encourage you to review our clinic's appointment <strong><a href='#'>policy</a></strong>.</p>");

  const [video_status, setVideoStatus] = useState(false);
  const [phone_status, setPhoneStatus] = useState(false);

  const [clinicContentConfirmation, setClinicContentConfirmation] = useState('');
  const [appointmenttype, setAppointmentType] = useState('');
  const [emailtemplatetype, setEmailtemplatetype] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    // Fetch initial template data from backend when component mounts
    // fetchTemplate();
    fetchTemplate();
  }, []);

  useEffect(() => {

    for (let index = 0; index < content.length; index++) {
      const element = content[index];
      if (element.apptype === appointmenttype) {
        setClinicContentConfirmation(element.content);
        // Clinic

        setContentID(element.id);
        setEmailtemplatetype(element.emailtemplatetype);

      }
      else if (element.apptype === appointmenttype) {
        setClinicContentConfirmation(element.content);
        // phone 

        setContentID(element.id);
        setEmailtemplatetype(element.emailtemplatetype);



      }
      else if (element.apptype === appointmenttype) {
        setClinicContentConfirmation(element.content);
        //Video

        setContentID(element.id);
        setEmailtemplatetype(element.emailtemplatetype);



      }
    }
    if (0 === appointmenttype) {
      // Clinic
      setContentGretings(staticClinicConformation);
      setContentGretingsReminder(staticClinicReminder);
      setPhoneStatus(false);
      setVideoStatus(false);
    }
    else if (1 === appointmenttype) {
      // phone 
      setContentGretings(staticPhoneConformation);
      setContentGretingsReminder(staticPhoneReminder);
      setPhoneStatus(true);
      setVideoStatus(false);
    }
    else if (2 === appointmenttype) {
      //Video
      setContentGretings(staticVideoConformation);
      setContentGretingsReminder(staticVideoReminder);
      setPhoneStatus(false);
      setVideoStatus(true);
    }




  }, [appointmenttype]);

  function generateAppointmentDetails() {
    // Get today's date
    const today = new Date();
    // Calculate the next day's date
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    // Format the date to 'Day Date Month Year' format
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = nextDay.toLocaleDateString('en-US', options);

    // Construct the appointment details string
    const appointmentDetails = `<p><strong>Appointment Details:</strong></p>
        Date: <strong>${formattedDate}</strong><br>
        Time: <strong>15:00</strong><br>
        Doctor: <strong>Dr. Olivia Smith</strong><br>
        Address: <strong>1051 Markham road, M1H 2Y5</strong><br><br>
        <p><strong>Please note that this email is autogenerated and not monitored. Please do not reply to this email. Thank
        you.</strong></p>
        <p>If you want to cancel your appointment, please visit here: <a href='#'>Cancel Appointment</a>`;

    return appointmentDetails;
  }

  const fetchTemplate = async () => {
    try {

      const response = await fetch(`${API_BASE_PATH}/emailtemplate/`,

        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('accessToken')}`,
          }
        });
      const data = await response.json();
      setContent(data);


    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  const updateTemplate = async () => {
    try {

      const response = await fetch(`${API_BASE_PATH}/emailtemplate/${contentID}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ id: contentID, apptype: appointmenttype, emailtemplatetype: emailtemplatetype, content: clinicContentConfirmation, clinic_id: 1 }),

        });
      const data = await response.json();
      setOpenModal(true);
      setModalContent('Email template Updated Successfully');
      // setContent(data);
    } catch (error) {
      setOpenModal(true);
      setModalContent('Error Updating Email template');
      console.error('Error fetching template:', error);
    }
  };

  const handleChange = (value) => {
    // const { name, value } = e.target;

    // setTemplate({ ...template, [name]: value });
    setClinicContentConfirmation(value);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

  };


  return (
    <div>

      <Grid container spacing={2} style={{ padding: '1rem' }}>

        <Grid item xs={12} md={12} lg={12}>
          <FormControl fullWidth>
            <InputLabel id="account">Select Appointment Type</InputLabel>
            <Select
              labelId="appointmenttype"
              id="appointmenttype"
              label="Select Appointment Type"
              fullWidth
              value={appointmenttype}
              onChange={(e) => setAppointmentType(e.target.value)}
            >
              {APPOINTMENTTYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <TextField
            label="Body"
            value={clinicContentConfirmation}
            inputMode="text"
            // onChange={handleChangehandleChange}
            onChange={(e) => handleChange(e.target.value)}

            Placeholder="Body"
            fullWidth
            multiline
            variant="outlined"
            rows={12}
          />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Button onClick={updateTemplate}>Save</Button>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Typography>Conformation Email :</Typography>
          <div dangerouslySetInnerHTML={{ __html: contentGretings }}></div>
          <div dangerouslySetInnerHTML={{ __html: static_contents }}></div>
          {(() => {
            {
              if (phone_status) {
                return (
                  <div>
                    <p>
                      <strong>Please wait for the doctor's phone call. Dr. will call you on this phone number 123-123-1234</strong>
                    </p>
                  </div>
                );
              } else {
                return (
                  <></>
                );
              }
            }
          })()}

          {(() => {
            {
              if (video_status) {
                return (
                  <div>
                    <strong>Click <a href='{{link}}'>here</a>  to start video consultation with doctor.</strong>
                    <a>Please, use this link on appointment date and allocated time only.</a>
                  </div>
                );
              } else {
                return (
                  <></>
                );
              }
            }
          })()}

          <div dangerouslySetInnerHTML={{ __html: clinicContentConfirmation }}></div>
          <div dangerouslySetInnerHTML={{ __html: staticEnd }}></div>

        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Typography>Reminder Email :</Typography>

          <div dangerouslySetInnerHTML={{ __html: contentGretingsReminder }}></div>
          <div dangerouslySetInnerHTML={{ __html: static_contents }}></div>

          {(() => {
            {
              if (phone_status) {
                return (
                  <div>
                    <p>
                      <strong>Please wait for the doctor's phone call. Dr. will call you on this phone number 123-123-1234</strong>
                    </p>
                  </div>
                );
              } else {
                return (
                  <></>
                );
              }
            }
          })()}

          {(() => {
            {
              if (video_status) {
                return (
                  <div>
                    <strong>Click <a href='{{link}}'>here</a>  to start video consultation with doctor.</strong>
                    <a>Please, use this link on appointment date and allocated time only.</a>
                  </div>
                );
              } else {
                return (
                  <></>
                );
              }
            }
          })()}

          <div dangerouslySetInnerHTML={{ __html: clinicContentConfirmation }}></div>
          <div dangerouslySetInnerHTML={{ __html: staticEnd }}></div>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>

        </Grid>


      </Grid>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmailTemplateEditor;
