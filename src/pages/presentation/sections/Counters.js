// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon"; // Importing Icon component

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";

// Material Kit 2 PRO React examples
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";
import { useEffect, useState } from "react";
import API_BASE_PATH from "../../../apiConfig";

function Counters() {
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [appMonthlyAve, setAppMonthlyAve] = useState(0);
  const [hcvCount, setHcvCount] = useState(0);
  const [emailCount, setEmailCount] = useState(0);

  useEffect(() => {
    const fetchappointmentCount = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/liveappointmentCount/`);
        //
        const data = await response.json();
        if (data.message === "success") {
          console.log(`average_appointments_monthly:${JSON.stringify(data)}`);
          setAppointmentCount(data.data.count);
          setAppMonthlyAve(data.data.average_appointments_monthly);
          setHcvCount(data.data.total_hcv_count.total_sum);
          setEmailCount(data.data.total_email_sent);
        }

      } catch (error) {
        console.error("Error fetching clinic information:", error);
      }
    };
    fetchappointmentCount().then(r => {
    });
  }, []);
  return (
    <MKBox component="section" py={3}>
      <Container>
        <Grid container item xs={12} lg={9} sx={{ mx: "auto" }}>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              color="info" // Specifying the color for the text gradient
              icon={<Icon>book_online</Icon>} // Adding an icon
              count={appointmentCount}
              suffix="+"
              title="Appointments Booked"
              description="Patients prefer our hassle-free online booking"
            />
          </Grid>
          <Grid item xs={12} md={4} display="flex">
            {/*<Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />*/}
            <DefaultCounterCard
              color="dark" // Specifying the color for the text gradient
              icon={<Icon>book_online</Icon>} // Adding an icon
              count={appMonthlyAve}
              suffix="+"
              title="Monthly Average Booked"
              description="Average monthly online appointments booked to a clinic"
            />
          </Grid>
          <Grid item xs={12} md={4} display="flex">
            {/*<Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />*/}
            <DefaultCounterCard
              color="error" // Specifying the color for the text gradient
              icon={<Icon>email</Icon>} // Adding an icon
              count={emailCount}
              suffix="+"
              title="Secure email sent"
              description="Average secured email sent to patients by one clinic"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              color="warning" // Another color for visual distinction
              icon={<Icon>apps</Icon>} // Adding an icon
              count={hcvCount}
              suffix="+"
              title="Average health card validated"
              description="Average health card validated by one clinic"
            />
          </Grid>
          <Grid item xs={12} md={4} display="flex">
            {/*<Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />*/}

            <DefaultCounterCard
              color="primary" // Another color for visual distinction
              icon={<Icon>apps</Icon>} // Adding an icon
              count={4}
              title="Applications Offered"
              description="Diverse applications to meet all your needs"
            />
          </Grid>
          <Grid item xs={12} md={4} display="flex">
            <DefaultCounterCard
              color="success" // Different color for different stats
              icon={<Icon>timer</Icon>} // Adding an icon
              count={300}
              suffix="+"
              title="Hours Saved Monthly"
              description="Average Monthly hours saved by one clinic"
              // description="Save workforce time, enhance productivity"
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;