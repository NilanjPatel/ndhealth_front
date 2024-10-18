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
// import DefaultFooter from "examples/Footers/DefaultFooter";
import CenteredFooter from "examples/Footers/CenteredFooter";

import FilledInfoCard from "examples/Cards/InfoCards/FilledInfoCard";

// Presentation page sections
import Counters from "pages/presentation/sections/Counters";
import Information from "pages/presentation/sections/Information";
import GettingStart from "pages/presentation/sections/GettingStart";
// import DesignBlocks from "pages/presentation/sections/DesignBlocks";
// import AuthPages from "pages/presentation/sections/AuthPages";
// import Pages from "pages/presentation/sections/Pages";
import Testimonials from "pages/presentation/sections/Testimonials";
// import Pricing from "pages/presentation/sections/Pricing";
import PricingOne from "layouts/sections/page-sections/pricing/components/PricingOne/index";
import Features from "pages/presentation/components/Features";


// Presentation page components
// import BuiltByDevelopers from "pages/presentation/components/BuiltByDevelopers";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
// import bgImage from "nd_health/assets/images/medical_clinic_2.jpeg";
import bgImage from "nd_health/assets/images/4919727.jpg";
// import bgImage from "nd_health/assets/images/4919727.jpg";

// import MKButton from "../../components/MKButton";
import logoCT from "nd_health/assets/images/clinic_landing_page/Basic Animations (1).svg";

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
      strings: ["Welcome to ND Health", "Enhance patient care", "Streamline daily tasks", "Secure and reliable technology"],
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 200,
      startDelay: 500,
      loop: true,
    });

    return () => typedJS.destroy();
  }, []);

  return (<>
      <DefaultNavbar
        routes={routes}
        // action={{
        //   type: "external", route: "/join", label: "Start Improving Your Practice Today", color: "info",
        //
        // }}
        sticky
        fontWeight={"bold"}
        icon={logoCT}
      />
      <MKBox
        ref={headerRef}
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: ({
                              functions: { linearGradient, rgba },
                              palette: { gradients },
                            }) => `${linearGradient(rgba(gradients.dark.main, 0.2), rgba(gradients.dark.state, 0.6))}, url(${bgImage})`,
          backgroundSize: "cover",
          // backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
          paddingTop:'1rem'

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
                fontSize: "4rem",
                // [breakpoints.down("xl")]: {
                //   fontSize: size["4rem"],
                // },
                // [breakpoints.down("lg")]: { fontSize: size["4rem"] },
                // [breakpoints.down("md")]: { fontSize: size["4rem"] },
                [breakpoints.down("sm")]: { fontSize: size["xl"] },
                [breakpoints.down("xs")]: { fontSize: size["md"] },


              })}
            >
              <span ref={typedJSRef} />
            </MKTypography>
            <MKTypography variant="h1" opacity={0.8} mt={1} mb={3}
                          color="white"
                          sx={({ breakpoints, typography: { size } }) => ({
                            fontSize: "2rem",
                            // [breakpoints.down("xl")]: {
                            //   fontSize: size["4rem"],
                            // },
                            // [breakpoints.down("lg")]: { fontSize: size["4rem"] },
                            // [breakpoints.down("md")]: { fontSize: size["4rem"] },
                            [breakpoints.down("sm")]: { fontSize: size["2rem"] },
                            [breakpoints.down("xs")]: { fontSize: size["2rem"] },
                          })}

            >
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
          mx: { xs: 0, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.6),
          // background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0.6))",
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <Counters />
        <Information />
        <GettingStart />
        {/*<Features />*/}
        {/*<DesignBlocks />*/}
        {/*<AuthPages />*/}
        {/*<Pages />*/}
        {/*<Container sx={{ mt: 6 }}>*/}
        {/*  <BuiltByDevelopers />*/}
        {/*</Container>*/}

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
        <CenteredFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
