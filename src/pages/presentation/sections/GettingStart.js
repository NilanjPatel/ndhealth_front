// src/pages/presentation/sections/GettingStart.js
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { FaChrome, FaFirefox } from "react-icons/fa";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 PRO React examples
import FilledInfoCard from "examples/Cards/InfoCards/FilledInfoCard";

function GettingStart() {
  // Implementation steps - Psychological: Show ease of adoption
  const steps = [
    {
      number: "1",
      title: "Sign Up Free",
      description: "Create your account in under 2 minutes. No credit card required.",
      time: "2 min",
    },
    {
      number: "2",
      title: "Install Extension",
      description: "Add our Chrome or Firefox extension with one click.",
      time: "1 min",
    },
    {
      number: "3",
      title: "Configure Settings",
      description: "Customize your clinic preferences and notifications.",
      time: "2 min",
    },
    {
      number: "4",
      title: "Start Saving Time",
      description: "Begin using all features immediately. Support available 24/7.",
      time: "0 min",
    },
  ];

  return (
    <MKBox component="section" py={8}>
      <Container>
        {/* Section Header */}
        <MKBox textAlign="center" mb={6}>
          <MKTypography variant="h2" color="dark" fontWeight="bold" mb={2}>
            Get Started in Minutes, Not Hours
          </MKTypography>
          <MKTypography
            variant="body1"
            color="text"
            sx={{ maxWidth: "650px", mx: "auto", fontSize: "1.1rem" }}
          >
            Our streamlined onboarding process means you can start improving your practice today
          </MKTypography>
        </MKBox>

        {/* Implementation Steps */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MKBox
                sx={{
                  textAlign: "center",
                  position: "relative",
                  height: "100%",
                }}
              >
                {/* Step Number */}
                <MKBox
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "info.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    margin: "0 auto 1rem",
                  }}
                >
                  {step.number}
                </MKBox>

                {/* Content */}
                <MKTypography variant="h5" color="dark" fontWeight="bold" mb={1}>
                  {step.title}
                </MKTypography>
                <MKTypography variant="body2" color="text" mb={1}>
                  {step.description}
                </MKTypography>
                <MKTypography variant="caption" color="success" fontWeight="bold">
                  ⏱️ {step.time}
                </MKTypography>

                {/* Connector Line (except for last step) */}
                {index < steps.length - 1 && (
                  <MKBox
                    sx={{
                      position: "absolute",
                      top: "25px",
                      right: "-50%",
                      width: "100%",
                      height: "2px",
                      backgroundColor: "grey.300",
                      display: { xs: "none", md: "block" },
                      zIndex: -1,
                    }}
                  />
                )}
              </MKBox>
            </Grid>
          ))}
        </Grid>

        {/* Browser Extensions Section */}
        <MKBox
          sx={{
            backgroundColor: ({ palette: { grey } }) => grey[100],
            borderRadius: 2,
            p: 4,
            mt: 6,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Left Column - Info */}
            <Grid item xs={12} lg={5}>
              <MKBox>
                <MKTypography variant="h4" color="dark" fontWeight="bold" mb={2}>
                  Install Our Browser Extension
                </MKTypography>
                <MKTypography variant="body1" color="text" mb={2}>
                  Access all ND Health features directly from your browser. Works seamlessly with
                  your existing EMR system.
                </MKTypography>
                <MKBox component="ul" pl={3} mb={0}>
                  <MKTypography component="li" variant="body2" color="text" mb={1}>
                    ✓ One-click installation
                  </MKTypography>
                  <MKTypography component="li" variant="body2" color="text" mb={1}>
                    ✓ Auto-updates with new features
                  </MKTypography>
                  <MKTypography component="li" variant="body2" color="text" mb={1}>
                    ✓ Works with Chrome and Firefox
                  </MKTypography>
                  <MKTypography component="li" variant="body2" color="text" mb={1}>
                    ✓ Secure and privacy-focused
                  </MKTypography>
                </MKBox>
              </MKBox>
            </Grid>

            {/* Right Column - Extension Cards */}
            <Grid item xs={12} lg={7}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FilledInfoCard
                    color="info"
                    icon={<FaChrome size={24} />}
                    title="Chrome Extension"
                    description="Install for Chrome and Chromium-based browsers. Rated 4.8/5 by users."
                    action={{
                      type: "external",
                      route:
                        "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem",
                      label: "Add to Chrome - Free",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FilledInfoCard
                    color="warning"
                    icon={<FaFirefox size={24} />}
                    title="Firefox Add-on"
                    description="Get the Firefox version. Full feature parity with Chrome extension."
                    action={{
                      type: "external",
                      route: "https://addons.mozilla.org/en-CA/firefox/addon/nd-health/",
                      label: "Add to Firefox - Free",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MKBox>

        {/* Support Note */}
        <MKBox textAlign="center" mt={4}>
          <MKTypography variant="body2" color="text" fontStyle="italic">
            Need help getting started? Our support team is available 24/7 via chat, email, or phone.
          </MKTypography>
        </MKBox>
      </Container>
    </MKBox>
  );
}

export default GettingStart;