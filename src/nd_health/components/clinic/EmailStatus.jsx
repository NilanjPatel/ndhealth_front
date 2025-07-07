import API_BASE_PATH from "../../../apiConfig";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  TextField,
  CardHeader,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,

  Button,

  Pagination,

} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {

  sendCheckEmailSms,
} from "../resources/utils";
import {  useNavigate } from "react-router-dom";
import HelmetComponent from "../SEO/HelmetComponent";
import { Grid } from "@mui/material";
import { styled } from "@mui/system";
import NdLoader from "../resources/Ndloader";
import NotificationDialog from "../resources/Notification";
import SmsIcon from "@mui/icons-material/Sms";
import Stack from "@mui/material/Stack";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
}));

// Define styles for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#333",
  color: "#f5f5f5",
}));

const StyledTableRow = styled(TableRow)(({ theme, isOdd }) => ({
  backgroundColor: isOdd ? "#d5d4d4" : "#ffffff",
}));

const formatDateString = (isoString) => {
  const date = new Date(isoString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const EmailStatus = ({ clinicSlug }) => {
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const [clinic, setClinic] = React.useState(null);
  const [demographicList, setDemographicList] = React.useState([]);
  const classes = useStyles();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    firstName: "",
    birthday: "",
    healthcard: "",
    sender: "",
  });
  const [submitbutton, setSubmitbutton] = useState(false);

  // NotificationDialog
  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [sent_to_bulk, set_Sent_to_bulk] = useState("");
  const [sent_not_to_bulk, set_not_Sent_to_bulk] = useState("");
  const [total_sent_sms, set_total_sent_sms] = useState(0);
  const [total_failed_sms, set_total_failed_sms] = useState(0);

  //pagination
  const [files, setFiles] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagetofetch, setPagetoFetch] = useState(`?page=${currentPage}`);
  const [emailStatusURL, setEmailStatusURL] = useState(`${API_BASE_PATH}/email-status/`);
  const [currentEmailStatusURL, setCurrentEmailStatusURL] = useState(emailStatusURL);

  useEffect(() => {
    // fetch list of demographics using access token and clinic slug
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
    }

    fetchData().then((r) => {});
  }, []);

  const fetchData = async () => {
    setSubmitbutton(true);
    try {
      const params = {
        page: currentPage,
        ...filters,
      };

      const response = await fetch(currentEmailStatusURL, {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      console.log(`data:${JSON.stringify(data)}`);
      setData(data.results);
      setTotalPages(Math.ceil(data.count / 20));
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setIsDataLoaded(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitbutton(false);
      // setCurrentEmailStatusURL(emailStatusURL);
    }
  };

  useEffect(() => {
    fetchData().then((r) => {});
  }, [currentPage]);

  useEffect(() => {
    setCurrentEmailStatusURL(`${emailStatusURL}?page=${currentPage}`);
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  function formatDateString(isoString) {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  function formatDateTimeString(isoString) {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const updateRecordSmsSent = (index) => {
    const updatedRecords = [...data];
    updatedRecords[index].smsSent = true;
    setData(updatedRecords);
  };

  async function send_check_email_sms_bulk() {
    setSubmitbutton(true);
    let successfulSends = [];
    let failedSends = [];
    let totalSent = 0;
    let totalFailed = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].is_accessible === false) {
        try {
          const response = await sendCheckEmailSms(data[i].newid);
          const data1 = await response.json();

          if (data1 && data1.message === "success") {
            successfulSends.push(data[i].firstName);
            totalSent++;
          } else {
            failedSends.push(data[i].firstName);
            totalFailed++;
          }
        } catch (error) {
          console.error(`Error sending SMS to ${data[i].firstName}:`, error);
          failedSends.push(data[i].firstName);
          totalFailed++;
        }
      }
    }

    setSubmitbutton(false);

    const successMessage =
      successfulSends.length > 0
        ? `Total ${totalSent} SMS sent successfully, list of patients: ${successfulSends.join(", ")}\n`
        : "";
    const failureMessage =
      failedSends.length > 0
        ? `Total ${totalFailed} SMS failed to send, list of patients: ${failedSends.join(", ")}\n`
        : "";

    if (totalSent > 0 && totalFailed > 0) {
      handleSuccess(`${successMessage}${failureMessage}`);
    } else if (totalSent > 0) {
      handleSuccess(`${successMessage}0 SMS failed.`);
    } else if (totalFailed > 0) {
      handleFailure(`${failureMessage}0 SMS sent.`);
    } else {
      handleSuccess("No SMS were sent. All patients might be accessible.");
    }

    // Reset state variables
    set_Sent_to_bulk("");
    set_not_Sent_to_bulk("");
    set_total_sent_sms(0);
    set_total_failed_sms(0);
  }

  async function send_Check_Email_Sms(number, index) {
    setSubmitbutton(true);
    const response = await sendCheckEmailSms(number);
    const data = await response.json();
    if (data) {
      setSubmitbutton(false);
      if (data.message === "success") {
        handleSuccess("SMS sent successfully.");
        updateRecordSmsSent(index);
      } else {
        handleFailure("SMS did not sent successfully. Something went wrong.");
      }
    } else {
      setSubmitbutton(false);
      handleFailure("SMS did not sent successfully. Something went wrong.");
    }
  }

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

  return (
    <div>
      {(() => {
        if (isDataLoaded) {
          // let smsSent;
          return [
            <div>
              <HelmetComponent />
              {/* <Grid item xs={12} md={12}> */}
              <Card style={{ width: "130%" }}>
                <CardHeader title="Secure Files" />
                <CardContent sx={{ overflowX: "scroll" }}>
                  <Grid container spacing={2} mb={4}>
                    {/*<Grid item xs={12} sm={6} md={3}>*/}
                    {/*    <Select*/}
                    {/*// TODO dropdown is opned or not*/}
                    {/*        labelId="doctor-select-label"*/}
                    {/*        id="doctor-select"*/}
                    {/*        value={selectedDoctor?.doctor__id || ''}*/}
                    {/*        onChange={(e) => {*/}
                    {/*            const selectedDoctorId = e.target.value;*/}
                    {/*            const selectedDoctor = doctors.find(doctor => doctor.doctor__id === selectedDoctorId);*/}
                    {/*            handleDoctorSelect(selectedDoctor);*/}
                    {/*        }}*/}
                    {/*        label="Select Doctor"*/}
                    {/*    >*/}
                    {/*        <MenuItem key={true}>*/}
                    {/*            Opened*/}
                    {/*        </MenuItem>*/}
                    {/*        <MenuItem key={false}>*/}
                    {/*            Not Opened*/}
                    {/*        </MenuItem>*/}

                    {/*    </Select>*/}
                    {/*</Grid>*/}
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Patient's Name"
                        name="firstName"
                        value={filters.firstName}
                        onChange={handleFilterChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Birthday"
                        name="birthday"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={filters.birthday}
                        onChange={handleFilterChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Healthcard"
                        name="healthcard"
                        value={filters.healthcard}
                        onChange={handleFilterChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Sender"
                        name="sender"
                        value={filters.sender}
                        onChange={handleFilterChange}
                      />
                    </Grid>

                    <Grid container item xs={6} sm={6} md={6} spacing={2}>
                      <Grid item xs={6} sm={6} md={3}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={fetchData}
                          fullWidth
                          disabled={submitbutton}
                        >
                          Search
                        </Button>
                      </Grid>
                      <Grid item xs={6} sm={6} md={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={send_check_email_sms_bulk}
                          fullWidth
                          disabled={submitbutton}
                        >
                          Notify via SMS <SmsIcon sx={{ paddingLeft: 1 }}></SmsIcon>
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">First Name</StyledTableCell>
                          <StyledTableCell align="center">Sent Date</StyledTableCell>
                          {/*<StyledTableCell align="center">Status</StyledTableCell>*/}
                          <StyledTableCell align="center">
                            Opened At /<br />
                            <span>send sms</span>
                          </StyledTableCell>
                          <StyledTableCell align="center">Healthcard</StyledTableCell>
                          <StyledTableCell align="center">Birthday</StyledTableCell>
                          <StyledTableCell align="center">Email</StyledTableCell>
                          <StyledTableCell align="center">Total Files</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((record, index) => (
                          <StyledTableRow key={record.newid} isOdd={index % 2 !== 0}>
                            <TableCell align="center">{record.firstName}</TableCell>
                            <TableCell align="center">
                              {formatDateTimeString(record.created_at)}
                            </TableCell>
                            {/*<TableCell align="center">{record.is_accessible === true ? 'Opened' : 'Not Opened'}</TableCell>*/}
                            <TableCell align="center">
                              {record.is_accessible ? (
                                formatDateTimeString(record.mailoppned)
                              ) : (
                                <>
                                  {record.smsSent ? (
                                    "Notified"
                                  ) : (
                                    <Button
                                      onClick={() => send_Check_Email_Sms(record.newid, index)}
                                      disabled={submitbutton}
                                    >
                                      Notify via SMS
                                    </Button>
                                  )}
                                </>
                              )}
                            </TableCell>

                            <TableCell align="center">{record.healthcard}</TableCell>
                            <TableCell align="center">{record.birthday}</TableCell>
                            <TableCell align="center">{record.email}</TableCell>
                            <TableCell align="center">{record.file_sent}</TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      sx={{ mt: 2 }}
                      boundaryCount={2}
                      siblingCount={2}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </div>,
          ];
        } else {
          return (
            <div>
              <Card>
                <CardHeader title="No email to check status" />
              </Card>
            </div>
          );
        }
      })()}

      {submitbutton && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9000,
          }}
        >
          <NdLoader />
        </div>
      )}
      <NotificationDialog
        open={openModal}
        onClose={setOpenModal}
        content={modalContent}
        isError={isError}
      />
    </div>
  );
};

export default EmailStatus;
