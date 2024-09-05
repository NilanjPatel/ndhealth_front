/*
=========================================================
* Material Kit 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

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
      clinic: "Maple Clinic",
      avatar:
        "https://static.wixstatic.com/media/9f27bf_4c6cb50b3a8941a5b837fa677bb5e5a1~mv2.jpg/v1/fill/w_210,h_160,al_c,lg_1,q_80,enc_auto/Bcdhawan.jpg",
      testimonial:
        "ND Health transformed our clinic. With 9 physicians, daily administrative tasks and patient calls were overwhelming. The platform streamlined our workflow, reducing workload and enhancing patient satisfaction. Highly recommend it to other clinics!",
      backgroundColor: "info",
      rating: 4,
    },
    // {
    //   name: 'Jane Smith',
    //   role: 'CFO, Company XYZ',
    //   avatar: 'https://example.com/avatar2.jpg',
    //   testimonial: 'Sed at tortor vel dui auctor fringilla. Ut tincidunt, sapien id tincidunt interdum, nunc est suscipit risus, non volutpat tortor tellus ut enim.',
    // },
    // Add more testimonials as needed
  ];

  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid
          container
          item
          xs={12}
          lg={6}
          justifyContent="center"
          sx={{ mx: "auto", textAlign: "center" }}
        >
          <MKTypography variant="h2">Trusted by over</MKTypography>
          <MKTypography variant="h2" color="info" textGradient mb={2}>
            1,679,477+ web developers
          </MKTypography>
          <MKTypography variant="body1" color="text" mb={2}>
            Many Fortune 500 companies, startups, universities and governmental institutions love
            Creative Tim&apos;s products.
          </MKTypography>
        </Grid>
        <Grid
          container
          spacing={3}
          sx={{ mt: 8 }}
          alignItems="center"
          justifyContent="center" // Center items horizontally
        >
          <Grid item xs={12} md={6} lg={4} sx={{ display: "flex", justifyContent: "center" }}>
            {testimonialData.map((testimonial, index) => (
              <div key={index}>
                <DefaultReviewCard
                  name={testimonial.name}
                  date={testimonial.clinic}
                  review={testimonial.testimonial}
                  rating={testimonial.rating}
                  image={testimonial.avatar}
                  color={testimonial.backgroundColor}
                />
              </div>
            ))}
          </Grid>
        </Grid>
        <Divider sx={{ my: 6 }} />
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={6} md={4} lg={2}>
            <MKBox component="img" src={appleLogo} alt="Apple" width="100%" opacity={0.6} />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox component="img" src={facebookLogo} alt="Facebook" width="100%" opacity={0.6} />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox component="img" src={nasaLogo} alt="Nasa" width="100%" opacity={0.6} />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox component="img" src={vodafoneLogo} alt="Vodafone" width="100%" opacity={0.6} />
          </Grid>
          <Grid item xs={6} md={4} lg={2}>
            <MKBox
              component="img"
              src={digitalOceanLogo}
              alt="DigitalOcean"
              width="100%"
              opacity={0.6}
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;
