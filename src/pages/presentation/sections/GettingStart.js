// Enhanced Professional Getting Started Section
import { motion } from "framer-motion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import { FaChrome, FaFirefox, FaApple, FaMobile } from "react-icons/fa";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function GettingStart() {
  // Enhanced implementation steps with icons and details
  const steps = [
    {
      number: "1",
      icon: "person_add",
      title: "Create Account",
      description: "Sign up in under 2 minutes with just your email. No credit card required to get started.",
      time: "2 min",
      features: ["Instant access", "No payment needed", "Email verification"],
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      number: "2",
      icon: "download",
      title: "Install Extension",
      description: "Add our browser extension with one click. Works seamlessly with your existing EMR system.",
      time: "1 min",
      features: ["Auto-sync data", "One-click install", "Works offline"],
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      number: "3",
      icon: "settings",
      title: "Configure Clinic",
      description: "Set up your clinic profile, preferences, and team members. Our wizard guides you through each step.",
      time: "5 min",
      features: ["Guided setup", "Team invites", "Custom workflows"],
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      number: "4",
      icon: "rocket_launch",
      title: "Go Live!",
      description: "Start using all features immediately. Book your first appointment and see the magic happen.",
      time: "0 min",
      features: ["Full feature access", "24/7 support", "Free training"],
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  // Platform compatibility
  const platforms = [
    { icon: <FaChrome size={32} />, name: "Chrome", link: "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem" },
    { icon: <FaFirefox size={32} />, name: "Firefox", link: "https://addons.mozilla.org/en-CA/firefox/addon/nd-health/" },
    { icon: <FaApple size={32} />, name: "Safari", link: "#" },
    { icon: <FaMobile size={32} />, name: "Mobile", link: "#" },
  ];

  // Success metrics
  const successMetrics = [
    { value: "5 min", label: "Average Setup Time", icon: "schedule" },
    { value: "98%", label: "Setup Success Rate", icon: "check_circle" },
    { value: "4.8/5", label: "Ease of Use Rating", icon: "star" },
    { value: "24/7", label: "Setup Support", icon: "support_agent" },
  ];

  return (
    <MKBox component="section" py={12} sx={{ position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <MKBox
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox textAlign="center" mb={8}>
            {/* Pre-headline */}
            <MKTypography
              variant="overline"
              color="success"
              fontWeight="bold"
              sx={{ fontSize: "1rem", letterSpacing: "2px" }}
            >
              QUICK ONBOARDING
            </MKTypography>

            {/* Main headline */}
            <MKTypography
              variant="h2"
              color="dark"
              fontWeight="bold"
              mb={2}
              sx={{
                fontSize: "2.5rem",
                mt: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get Started in Minutes, Not Hours
            </MKTypography>

            {/* Subheadline */}
            <MKTypography
              variant="body1"
              color="text"
              sx={{
                maxWidth: "750px",
                mx: "auto",
                fontSize: "1.2rem",
                lineHeight: "1.8",
                mb: 3,
              }}
            >
              Our streamlined onboarding process gets your clinic up and running in less than 10 minutes. No technical expertise required.
            </MKTypography>

            {/* Success Metrics */}
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
              {successMetrics.map((metric, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <MKBox textAlign="center">
                    <Icon
                      sx={{
                        fontSize: "2rem",
                        color: "success.main",
                        mb: 1,
                      }}
                    >
                      {metric.icon}
                    </Icon>
                    <MKTypography variant="h4" color="dark" fontWeight="bold">
                      {metric.value}
                    </MKTypography>
                    <MKTypography variant="caption" color="text">
                      {metric.label}
                    </MKTypography>
                  </MKBox>
                </Grid>
              ))}
            </Grid>
          </MKBox>
        </motion.div>

        {/* Implementation Steps */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MKBox
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: 4,
                    borderRadius: "20px",
                    background: "white",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "5px",
                      background: step.gradient,
                      borderRadius: "20px 20px 0 0",
                    },
                  }}
                >
                  {/* Step Number Badge */}
                  <MKBox
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: 20,
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: step.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <MKTypography variant="h4" color="white" fontWeight="bold">
                      {step.number}
                    </MKTypography>
                  </MKBox>

                  {/* Icon */}
                  <MKBox
                    sx={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "15px",
                      background: step.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <Icon sx={{ fontSize: "2rem", color: "white" }}>{step.icon}</Icon>
                  </MKBox>

                  {/* Title */}
                  <MKTypography variant="h5" color="dark" fontWeight="bold" mb={2}>
                    {step.title}
                  </MKTypography>

                  {/* Description */}
                  <MKTypography variant="body2" color="text" mb={3} sx={{ lineHeight: "1.8" }}>
                    {step.description}
                  </MKTypography>

                  {/* Features */}
                  <MKBox component="ul" sx={{ pl: 0, listStyle: "none", mb: 2 }}>
                    {step.features.map((feature, idx) => (
                      <MKBox
                        component="li"
                        key={idx}
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Icon sx={{ fontSize: "1rem", color: "success.main", mr: 1 }}>
                          check_circle
                        </Icon>
                        <MKTypography variant="caption" color="text">
                          {feature}
                        </MKTypography>
                      </MKBox>
                    ))}
                  </MKBox>

                  {/* Time Badge */}
                  <MKBox
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                    }}
                  >
                    <Icon sx={{ fontSize: "1rem", color: "success.main" }}>schedule</Icon>
                    <MKTypography variant="caption" color="success" fontWeight="bold">
                      {step.time}
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Platform Compatibility Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox
            sx={{
              p: 6,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              mb: 6,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            <MKBox
              sx={{
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                filter: "blur(60px)",
              }}
            />

            <Grid container spacing={4} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
              {/* Left Column */}
              <Grid item xs={12} lg={6}>
                <MKTypography variant="h3" color="white" fontWeight="bold" mb={2}>
                  Works on Your Favorite Platforms
                </MKTypography>
                <MKTypography variant="body1" color="white" opacity={0.9} mb={3} sx={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                  Access ND Health from any device, anywhere. Our platform is optimized for desktop browsers and mobile devices, ensuring you can manage your practice on the go.
                </MKTypography>

                {/* Feature list */}
                <Grid container spacing={2}>
                  {[
                    "Cross-platform compatibility",
                    "Automatic updates",
                    "Offline mode support",
                    "Seamless data sync",
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <MKBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Icon sx={{ color: "white" }}>check_circle</Icon>
                        <MKTypography variant="body2" color="white">
                          {feature}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Right Column - Platform Icons */}
              <Grid item xs={12} lg={6}>
                <Grid container spacing={3}>
                  {platforms.map((platform, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <MKBox
                        component="a"
                        href={platform.link}
                        target="_blank"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                          p: 3,
                          borderRadius: "15px",
                          backgroundColor: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          transition: "all 0.3s ease",
                          textDecoration: "none",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.25)",
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                          },
                          "& svg": {
                            color: "white",
                          },
                        }}
                      >
                        {platform.icon}
                        <MKTypography variant="caption" color="white" fontWeight="bold">
                          {platform.name}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </MKBox>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox
            sx={{
              p: 6,
              borderRadius: "20px",
              background: "white",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            <Icon
              sx={{
                fontSize: "3rem",
                color: "success.main",
                mb: 2,
              }}
            >
              support_agent
            </Icon>
            <MKTypography variant="h4" color="dark" fontWeight="bold" mb={2}>
              Need Help Getting Started?
            </MKTypography>
            <MKTypography variant="body1" color="text" mb={4} sx={{ fontSize: "1.1rem", maxWidth: "600px", mx: "auto" }}>
              Our support team is available 24/7 via chat, email, or phone to help you get set up and answer any questions you may have.
            </MKTypography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <MKButton
                variant="gradient"
                color="info"
                size="large"
                href="/join"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                }}
              >
                Start Free Trial
              </MKButton>
              <MKButton
                variant="outlined"
                color="info"
                size="large"
                href="/demo"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                }}
              >
                Schedule Demo
              </MKButton>
            </Box>

            {/* Trust indicators */}
            <MKBox sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4, flexWrap: "wrap" }}>
              <MKTypography variant="caption" color="text">
                <Icon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "middle" }}>check_circle</Icon>
                No credit card required
              </MKTypography>
              <MKTypography variant="caption" color="text">
                <Icon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "middle" }}>check_circle</Icon>
                Free 30-day trial
              </MKTypography>
              <MKTypography variant="caption" color="text">
                <Icon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "middle" }}>check_circle</Icon>
                Cancel anytime
              </MKTypography>
            </MKBox>
          </MKBox>
        </motion.div>
      </Container>
    </MKBox>
  );
}

export default GettingStart;
