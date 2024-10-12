// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 PRO React examples
import DefaultReviewCard from "examples/Cards/ReviewCards/DefaultReviewCard";

// Images
import appleLogo from "assets/images/logos/gray-logos/logo-apple.svg";
import facebookLogo from "assets/images/logos/gray-logos/logo-facebook.svg";
import nasaLogo from "assets/images/logos/gray-logos/logo-nasa.svg";
import vodafoneLogo from "assets/images/logos/gray-logos/logo-vodafone.svg";
import digitalOceanLogo from "assets/images/logos/gray-logos/logo-digitalocean.svg";

function Information() {
  const testimonialData = [
    {
      name: "Dr. Balchandra Dhawan",
      role: "Family Physician",
      clinic: "Family Physician at Maple Clinic",
      avatar:
        "https://static.wixstatic.com/media/9f27bf_4c6cb50b3a8941a5b837fa677bb5e5a1~mv2.jpg",
      testimonial:
        "ND Health transformed our clinic. With 9 physicians, daily administrative tasks and patient calls were overwhelming. The platform streamlined our workflow, reducing workload and enhancing patient satisfaction. Highly recommend it to other clinics!",
      backgroundColor: "info",
      rating: 5,
    },
    {
      name: "Riddhi Parmar",
      role: "Clinic Administrative",
      clinic: "Clinic Administrative at Noble Clinic",
      avatar:
        "https://media.licdn.com/dms/image/v2/C5603AQH4M0GDSO8uZg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1643374291751?e=1732147200&v=beta&t=bhwNS9JxsTFytHIiY3EauPtAANJtmbWy9ro5npslPM4",
      testimonial:
        "ND Health helped us to improved our clinic's operations. We were facing heavy administrative tasks and constant patient calls. ND Health significantly reduced our workload and our patient are satisfied with this service.",
      backgroundColor: "light",
      rating: 4.5,
    },
    // Add more testimonials as needed
  ];

  return (
    <MKBox component="section" py={12}>
      {/*<Container>*/}
      <Grid
        container
        item
        xs={12}
        lg={6}
        justifyContent="center"
        sx={{ mx: "auto", textAlign: "center" }}
      >
        <MKTypography variant="h2" color="info" textGradient mb={2}>Ask them,&nbsp;</MKTypography>
        <MKTypography variant="h2">
          Who are using our services
        </MKTypography>
        <MKTypography variant="body1" color="text" mb={2}>
          Join the growing number of clinics that have improved their services with our platform.
        </MKTypography>
      </Grid>
      <Grid
        container
        spacing={1}
        sx={{ mt: 3 }}
        alignItems="center"
        justifyContent="center" // Center items horizontally
      >
        {testimonialData.map((testimonial, index) => (
          <Grid item xs={12} md={6} lg={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "1rem",
                }}
                key={index}
          >
            <DefaultReviewCard
              name={testimonial.name}
              date={testimonial.clinic}
              review={testimonial.testimonial}
              rating={testimonial.rating}
              image={testimonial.avatar}
              color={testimonial.backgroundColor}
            />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 6 }} />
      {/*<Grid container spacing={3} justifyContent="center">*/}
      {/*  <Grid item xs={6} md={4} lg={2}>*/}
      {/*    <MKBox component="img" src={appleLogo} alt="Apple" width="100%" opacity={0.6} />*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={6} md={4} lg={2}>*/}
      {/*    <MKBox component="img" src={facebookLogo} alt="Facebook" width="100%" opacity={0.6} />*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={6} md={4} lg={2}>*/}
      {/*    <MKBox component="img" src={nasaLogo} alt="Nasa" width="100%" opacity={0.6} />*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={6} md={4} lg={2}>*/}
      {/*    <MKBox component="img" src={vodafoneLogo} alt="Vodafone" width="100%" opacity={0.6} />*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={6} md={4} lg={2}>*/}
      {/*    <MKBox*/}
      {/*      component="img"*/}
      {/*      src={digitalOceanLogo}*/}
      {/*      alt="DigitalOcean"*/}
      {/*      width="100%"*/}
      {/*      opacity={0.6}*/}
      {/*    />*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}
      {/*</Container>*/}
    </MKBox>
  );
}

export default Information;
