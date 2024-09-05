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
import { useEffect, useRef } from "react";
// rellax
import Rellax from "rellax";

// typed-js
import Typed from "typed.js";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
// import MKBadge from "components/MKBadge";
import MKTypography from "components/MKTypography";
import MKSocialButton from "components/MKSocialButton";

// Material Kit 2 PRO React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import FilledInfoCard from "examples/Cards/InfoCards/FilledInfoCard";

// Presentation page sections
import Counters from "pages/presentation/sections/Counters";
import Information from "pages/presentation/sections/Information";
// import DesignBlocks from "pages/presentation/sections/DesignBlocks";
// import AuthPages from "pages/presentation/sections/AuthPages";
// import Pages from "pages/presentation/sections/Pages";
import Testimonials from "pages/presentation/sections/Testimonials";
// import Pricing from "pages/presentation/sections/Pricing";
import PricingOne from "layouts/sections/page-sections/pricing/components/PricingOne/index";

// Presentation page components
// import BuiltByDevelopers from "pages/presentation/components/BuiltByDevelopers";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/bg-presentation.jpg";

// import MKButton from "../../components/MKButton";
import { FaChrome } from "react-icons/fa";
import { FaFirefox } from "react-icons/fa";

function Presentation() {
  const headerRef = useRef(null);
  const typedJSRef = useRef(null);

  // Setting up rellax
  useEffect(() => {
    const parallax = new Rellax(headerRef.current, {
      speed: -6,
    });

    return () => parallax.destroy();
  }, []);

  // Setting up typedJS
  useEffect(() => {
    const typedJS = new Typed(typedJSRef.current, {
      strings: ["Welcome to", "improve efficiency using", "save time using"],
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 200,
      startDelay: 500,
      loop: true,
    });

    return () => typedJS.destroy();
  }, []);

  return (
    <>
      <DefaultNavbar
        routes={routes}
        action={{
          type: "external",
          route: "/join",
          label: "Join now",
          color: "info",
        }}
        sticky
      />
      <MKBox
        ref={headerRef}
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={8}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{ mx: "auto", textAlign: "center" }}
          >
            <MKTypography
              variant="h1"
              color="white"
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              <span ref={typedJSRef} /> ND Health
            </MKTypography>
            <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
              Improve your clinic&apos;s workflow with us.
            </MKTypography>
            {/*<MKButton color="default" sx={{ color: ({ palette: { dark } }) => dark.main }}>*/}
            {/*  create account*/}
            {/*</MKButton>*/}
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <Counters />
        <Information />
        {/*<DesignBlocks />*/}
        {/*<AuthPages />*/}
        {/*<Pages />*/}
        {/*<Container sx={{ mt: 6 }}>*/}
        {/*  <BuiltByDevelopers />*/}
        {/*</Container>*/}
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                variant="gradient"
                color="info"
                icon="flag"
                title="Getting Started"
                description="Check the possible ways of working with our products."
                action={{
                  type: "external",
                  route: "https://www.creative-tim.com/learning-lab/react/overview/material-kit/",
                  label: "Start with Demo",
                }}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                color="info"
                icon="precision_manufacturing"
                title="Plugins"
                description="Get inspiration and have an overview about the plugin that we have developed, which can improve your practice."
                action={{
                  type: "external",
                  route: "https://www.creative-tim.com/learning-lab/react/datepicker/material-kit/",
                  label: "Read more",
                }}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                color="info"
                icon="apps"
                title="Components"
                description="ND Health is giving you a lot of pre-made components, that will help you to work faster."
                action={{
                  type: "external",
                  route: "https://www.creative-tim.com/learning-lab/react/alerts/material-kit/",
                  label: "Read more",
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}></Grid>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                color="info"
                icon=<FaChrome />
                title="Chrome Plugin"
                action={{
                  type: "external",
                  route:
                    "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem?hl=en-US&utm_source=ext_sidebar",
                  label: "install",
                }}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FilledInfoCard
                color="info"
                icon=<FaFirefox />
                title="FireFox Plugin"
                action={{
                  type: "external",
                  route:
                    "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem?hl=en-US&utm_source=ext_sidebar",
                  label: "install",
                }}
              />
            </Grid>
          </Grid>
        </Container>
        <Testimonials />
        <PricingOne />
        <MKBox pt={18} pb={6}>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={5} ml="auto" sx={{ textAlign: { xs: "center", lg: "left" } }}>
                <MKTypography variant="h4" fontWeight="bold" mb={0.5}>
                  Thank you for your support!
                </MKTypography>
                <MKTypography variant="body1" color="text">
                  We care for doctors.
                </MKTypography>
              </Grid>
              <Grid
                item
                xs={12}
                lg={5}
                my={{ xs: 5, lg: "auto" }}
                mr={{ xs: 0, lg: "auto" }}
                sx={{ textAlign: { xs: "center", lg: "right" } }}
              >
                <MKSocialButton
                  component="a"
                  href="https://www.instagram.com/nd.health.ca/"
                  target="_blank"
                  color="instagram"
                  sx={{ mr: 1 }}
                >
                  <i className="fab fa-instagram" />
                  &nbsp; Instagram
                </MKSocialButton>
                <MKSocialButton
                  component="a"
                  href="https://www.facebook.com/profile.php?id=61555491107393"
                  target="_blank"
                  color="facebook"
                  sx={{ mr: 1 }}
                >
                  <i className="fab fa-facebook" />
                  &nbsp; Facebook
                </MKSocialButton>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </Card>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
