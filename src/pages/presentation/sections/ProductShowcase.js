// Product Showcase Section
import { motion } from "framer-motion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function ProductShowcase() {
  // Product features with visual descriptions
  const productFeatures = [
    {
      title: "Appointment Scheduling",
      description: "24/7 online booking system that syncs with your EMR. Patients can book, reschedule, or cancel appointments instantly.",
      benefits: ["Reduce no-shows by 40%", "24/7 automated booking", "SMS & Email reminders"],
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: "📅",
    },
    {
      title: "Health Card Validation",
      description: "Instant OHIP card verification before appointments. Automatically checks eligibility and prevents billing errors.",
      benefits: ["99% error reduction", "Real-time validation", "Automated updates"],
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icon: "🏥",
    },
    {
      title: "Smart Billing Assistant",
      description: "billing suggestions based on diagnosis codes. Maximize revenue with accurate claim submissions.",
      benefits: ["25% revenue increase", "Error detection", "Service Code tracking"],
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: "💰",
    },
    {
      title: "Patient Self-Service Kiosk",
      description: "Modern check-in experience that reduces front desk workload. Patients update their information independently.",
      benefits: ["Save 1 hours daily",  "Real-time updates"],
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      icon: "🖥️",
    },
  ];

  return (
    <MKBox component="section" py={12} sx={{ position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <MKBox
        sx={{
          position: "absolute",
          top: "10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <MKBox
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)",
          filter: "blur(60px)",
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
            <MKTypography
              variant="h2"
              color="dark"
              fontWeight="bold"
              mb={2}
              sx={{
                fontSize: "2.5rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Powerful Features Built for Healthcare
            </MKTypography>
            <MKTypography
              variant="body1"
              color="text"
              sx={{
                maxWidth: "700px",
                mx: "auto",
                fontSize: "1.2rem",
                lineHeight: "1.8",
              }}
            >
              Everything you need to run a modern, efficient medical practice—all in one integrated platform
            </MKTypography>
          </MKBox>
        </motion.div>

        {/* Product Features Grid */}
        <Grid container spacing={4}>
          {productFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MKBox
                  sx={{
                    position: "relative",
                    p: 4,
                    height: "100%",
                    borderRadius: "20px",
                    background: "white",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "5px",
                      background: feature.gradient,
                      borderRadius: "20px 20px 0 0",
                    },
                  }}
                >
                  {/* Icon */}
                  <MKBox
                    sx={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "15px",
                      background: feature.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      mb: 3,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    {feature.icon}
                  </MKBox>

                  {/* Title */}
                  <MKTypography variant="h4" color="dark" fontWeight="bold" mb={2}>
                    {feature.title}
                  </MKTypography>

                  {/* Description */}
                  <MKTypography variant="body1" color="text" mb={3} sx={{ lineHeight: "1.8" }}>
                    {feature.description}
                  </MKTypography>

                  {/* Benefits */}
                  <MKBox component="ul" sx={{ pl: 0, listStyle: "none" }}>
                    {feature.benefits.map((benefit, idx) => (
                      <MKBox
                        component="li"
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1.5,
                        }}
                      >
                        <MKBox
                          sx={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: feature.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                            flexShrink: 0,
                          }}
                        >
                          <MKTypography variant="caption" color="white" fontWeight="bold">
                            ✓
                          </MKTypography>
                        </MKBox>
                        <MKTypography variant="body2" color="text" fontWeight="medium">
                          {benefit}
                        </MKTypography>
                      </MKBox>
                    ))}
                  </MKBox>
                </MKBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox
            sx={{
              mt: 8,
              p: 6,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
            }}
          >
            <MKTypography variant="h3" color="white" fontWeight="bold" mb={2}>
              Ready to Transform Your Practice?
            </MKTypography>
            <MKTypography variant="body1" color="white" opacity={0.9} mb={4} sx={{ fontSize: "1.1rem" }}>
              Join 50+ clinics already saving time and increasing revenue with ND Health
            </MKTypography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <MKButton
                variant="contained"
                color="white"
                size="large"
                href="/demo"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#667eea",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(255,255,255,0.3)",
                  },
                }}
              >
                Schedule a Demo
              </MKButton>
              <MKButton
                variant="outlined"
                color="white"
                size="large"
                href="/join"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Start Free Trial
              </MKButton>
            </Box>
          </MKBox>
        </motion.div>
      </Container>
    </MKBox>
  );
}

export default ProductShowcase;
