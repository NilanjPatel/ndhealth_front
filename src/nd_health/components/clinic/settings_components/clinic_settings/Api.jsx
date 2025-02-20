import API_BASE_PATH from "../../../../../apiConfig";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CardHeader,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import NotificationDialog from "../../../resources/Notification";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: "100%",
  },
}));

const Api = ({ clinicSlug, clinicId }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [key, setKey] = useState("");
  const [secret, setSecret] = useState("");
  const [clinicWebsite, setClinicWebsite] = useState("");
  const [emrWebsite, setEmrWebsite] = useState("");
  const [clinicData, setClinicData] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    // Fetch clinic notices

    const fetchClinicApis = async () => {
      try {
        const response = await fetch(
          `${API_BASE_PATH}/clinic/data/api/`,

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        setClinicData(data);
        setKey(data.key);
        setSecret(data.secret);
        setClinicWebsite(data.website);
        setEmrWebsite(data.emrHome);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching clinic notices:", error);
      }
    };

    fetchClinicApis();
  }, []);

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  const handleSecretChange = (event) => {
    setSecret(event.target.value);
  };

  const handleClinicWebsiteChange = (event) => {
    setClinicWebsite(event.target.value);
  };

  const handleEmrWebsiteChange = (event) => {
    setEmrWebsite(event.target.value);
  };

  const updateClinicApi = async () => {
    try {
      const response = await fetch(
        `${API_BASE_PATH}/clinic/data/api/update/`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            key: key,
            secret: secret,
            website: clinicWebsite,
            emrHome: emrWebsite,
          }),
        }
      );
      const data = await response.json();
      handleSuccess("Api Data Successfully Updated");
    } catch (error) {
      handleFailure("Unable to update the api, something went wrong");
      console.error("Error fetching clinic notices:", error);
    }
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

  return (
    <div>
      {isDataLoaded ? (
        <div>
          <Grid container style={{ background: "transparent" }}>
            {/* <Grid item xs={12} md={12}> */}
            <Card style={{ width: "fit-content", minWidth: "50rem", margin: 4 }}>
              <Grid style={{ padding: "1rem" }}>
                <TextField
                  label="Key"
                  placeholder="Key"
                  value={key}
                  onChange={handleKeyChange}
                  fullWidth
                  multiline
                  variant="outlined"
                />
              </Grid>

              <Grid style={{ padding: "1rem" }}>
                <TextField
                  label="Secret"
                  placeholder="Secret"
                  value={secret}
                  onChange={handleSecretChange}
                  fullWidth
                  multiline
                  variant="outlined"
                />
              </Grid>

              <Grid style={{ padding: "1rem" }}>
                <TextField
                  label="Clinic Website"
                  placeholder="Clinic Website"
                  value={clinicWebsite}
                  onChange={handleClinicWebsiteChange}
                  fullWidth
                  multiline
                  variant="outlined"
                />
              </Grid>

              <Grid style={{ padding: "1rem" }}>
                <TextField
                  label="Clinic EMR Link"
                  placeholder="Clinic EMR Link"
                  value={emrWebsite}
                  onChange={handleEmrWebsiteChange}
                  fullWidth
                  multiline
                  variant="outlined"
                />
              </Grid>
              <Grid style={{ padding: "1rem" }}>
                <Button variant="outlined" color="primary" type="submit" onClick={updateClinicApi}>
                  Update
                </Button>
              </Grid>
            </Card>
            {/* </Grid> */}
          </Grid>
        </div>
      ) : (
        <div>
          <Card>
            <CardHeader title="Loading..." />
          </Card>
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

export default Api;
