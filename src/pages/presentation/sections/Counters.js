// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon"; // Importing Icon component

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";

// Material Kit 2 PRO React examples
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  return (
    <MKBox component="section" py={3}>
      <Container>
        <Grid container item xs={12} lg={9} sx={{ mx: "auto" }}>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              color="info" // Specifying the color for the text gradient
              icon={<Icon>book_online</Icon>} // Adding an icon
              count={10000}
              suffix="+"
              title="Appointments Booked"
              description="Patients prefer our hassle-free online booking"
            />
          </Grid>
          <Grid item xs={12} md={4} display="flex">
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />
            <DefaultCounterCard
              color="success" // Different color for different stats
              icon={<Icon>timer</Icon>} // Adding an icon
              count={200}
              suffix="+"
              title="Hours Saved"
              description="Save workforce time, enhance productivity"
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              color="primary" // Another color for visual distinction
              icon={<Icon>apps</Icon>} // Adding an icon
              count={4}
              title="Applications Offered"
              description="Diverse applications to meet all your needs"
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;