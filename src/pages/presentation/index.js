// home

import { useEffect, useRef } from "react";

// rellax
import Rellax from "rellax";

// typed-js
import Typed from "typed.js";

// framer-motion for animations
import { motion } from "framer-motion";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
// import MKBadge from "components/MKBadge";
import MKTypography from "components/MKTypography";
import MKSocialButton from "components/MKSocialButton";
import MKButton from "components/MKButton";

// Material Kit 2 PRO React examples
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
// import DefaultFooter from "examples/Footers/DefaultFooter";
import CenteredFooter from "examples/Footers/CenteredFooter";

// import FilledInfoCard from "examples/Cards/InfoCards/FilledInfoCard";

// Presentation page sections
import Counters from "pages/presentation/sections/Counters";
import Information from "pages/presentation/sections/Information";
import GettingStart from "pages/presentation/sections/GettingStart";
// import DesignBlocks from "pages/presentation/sections/DesignBlocks";
// import AuthPages from "pages/presentation/sections/AuthPages";
// import Pages from "pages/presentation/sections/Pages";
// import Testimonials from "pages/presentation/sections/Testimonials";
// import Pricing from "pages/presentation/sections/Pricing";
import PricingOne from "layouts/sections/page-sections/pricing/components/PricingOne/index";
// import Features from "pages/presentation/components/Features";


// Presentation page components
// import BuiltByDevelopers from "pages/presentation/components/BuiltByDevelopers";

// Routes
import routes from "routes";
import footerRoutes from "footer.routes";

// Images
// import bgImage from "nd_health/assets/images/medical_clinic_2.jpeg";
import bgImage from "nd_health/assets/images/4919727.jpg";

// import MKButton from "../../components/MKButton";
import logoCT from "nd_health/assets/images/ND(1).png";

// import { FaChrome } from "react-icons/fa";
// import { FaFirefox } from "react-icons/fa";

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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <MKTypography
                variant="h1"
                color="white"
                sx={({ breakpoints, typography: { size } }) => ({
                  fontSize: "4rem",
                  [breakpoints.down("sm")]: { fontSize: size["xl"] },
                  [breakpoints.down("xs")]: { fontSize: size["md"] },
                })}
              >
                <span ref={typedJSRef} />
              </MKTypography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <MKTypography
                variant="h1"
                opacity={0.9}
                mt={1}
                mb={4}
                color="white"
                sx={({ breakpoints, typography: { size } }) => ({
                  fontSize: "2rem",
                  [breakpoints.down("sm")]: { fontSize: size["2rem"] },
                  [breakpoints.down("xs")]: { fontSize: size["2rem"] },
                })}
              >
                Improve your clinic&apos;s workflow with us.
              </MKTypography>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <MKButton
                  variant="gradient"
                  color="info"
                  size="large"
                  href="/demo"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    boxShadow: "0 8px 20px rgba(0,188,212,0.4)",
                    "&:hover": {
                      boxShadow: "0 12px 28px rgba(0,188,212,0.5)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Request Demo
                </MKButton>

                <MKButton
                  variant="outlined"
                  color="white"
                  size="large"
                  href="/join"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderWidth: "2px",
                    "&:hover": {
                      borderWidth: "2px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Get Started Free
                </MKButton>
              </Stack>

              <MKTypography
                variant="caption"
                color="white"
                opacity={0.8}
                sx={{ mt: 2, display: "block" }}
              >
                ✓ No credit card required • ✓ Setup in 5 minutes • ✓ Free forever plan
              </MKTypography>
            </motion.div>
          </Grid>
        </Container>
      </MKBox>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        sx={{
          p: 2,
          mx: { xs: 0, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.6),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Counters />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <GettingStart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Information />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <PricingOne />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox pt={18} pb={6}>
            <Container>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={5} ml="auto" sx={{ textAlign: { xs: "center", lg: "left" } }}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <MKTypography variant="h4" fontWeight="bold" mb={0.5}>
                      Thank you for your support!
                    </MKTypography>
                    <MKTypography variant="body1" color="white">
                      We care for doctors.
                    </MKTypography>
                  </motion.div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={5}
                  my={{ xs: 5, lg: "auto" }}
                  mr={{ xs: 0, lg: "auto" }}
                  sx={{ textAlign: { xs: "center", lg: "right" } }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <MKSocialButton
                      component={motion.a}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://www.instagram.com/nd.health.ca/"
                      target="_blank"
                      color="instagram"
                      sx={{ mr: 1 }}
                    >
                      <i className="fab fa-instagram" />
                      &nbsp; Instagram
                    </MKSocialButton>
                    <MKSocialButton
                      component={motion.a}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://www.facebook.com/profile.php?id=61555491107393"
                      target="_blank"
                      color="facebook"
                      sx={{ mr: 1 }}
                    >
                      <i className="fab fa-facebook" />
                      &nbsp; Facebook
                    </MKSocialButton>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
          </MKBox>
        </motion.div>
      </Card>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <MKBox pt={6} px={1} mt={6}>
          <CenteredFooter content={footerRoutes} />
        </MKBox>
      </motion.div>
    </>
  );
}

export default Presentation;
