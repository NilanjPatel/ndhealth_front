// src/components/clinicPolicy.js
import API_BASE_PATH from "../../apiConfig";

import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { Grid, Card, Typography } from "@mui/material";
import Layout from "./Layout";
import "./css/Marquee.css";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import Breadcrumbs from "../../examples/Breadcrumbs";
import Icon from "@mui/material/Icon";
import { useClinicInfo } from "./resources/useClinicInfo.js";

const ClinicPolicy = () => {
  const { clinicSlug } = useParams();
  // const [clinicInfo, setClinicInfo] = useState(null);
  const [termsInfo, settermsInfo] = useState(null);
  const { clinicInfo, locationsData, notice, loading } = useClinicInfo(clinicSlug);

  useEffect(() => {
    const fetchClinicPolicy = async () => {
      if (!termsInfo) {
        try {
          const response = await fetch(`${API_BASE_PATH}/terms/${clinicSlug}/Appointment Booking/`);

          const data = await response.json();
          settermsInfo(data.message.text);
        } catch (error) {
          console.error("Error fetching clinic information:", error);
        }
      }
    };

    fetchClinicPolicy();
  }, [clinicSlug]);

  return (
    <Layout clinicInfo={clinicInfo}>
      <div>
        {clinicInfo ? (
          <>
            <h2>Policy of {clinicInfo.name}</h2>

            <Card>
              {/* <CardHeader title="Verify Your Identity" /> */}
              <Grid container spacing={2} padding={2}>
                <Grid item xs={12} md={12}>
                  <Breadcrumbs
                    routes={[
                      { label: "Home", route: `/clinic/${clinicSlug}/`, icon: <Icon>home</Icon> },
                      { label: "Clinic policy",icon: <Icon>policy</Icon> },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MKBox m={2}>
                    <MKTypography variant="body1" gutterBottom>
                      <div dangerouslySetInnerHTML={{ __html: termsInfo }} />
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>
            </Card>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Layout>
  );
};

export default ClinicPolicy;
