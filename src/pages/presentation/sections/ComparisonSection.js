// Comparison Section - Before/After using ND Health
import { motion } from "framer-motion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function ComparisonSection() {
  const comparisons = [
    {
      category: "Appointment Management",
      before: {
        icon: "😰",
        title: "Manual phone bookings",
        points: [
          "Staff overwhelmed with calls",
          "High no-show rates (30-40%)",
          "Double bookings and errors",
          "Limited to office hours",
        ],
      },
      after: {
        icon: "😊",
        title: "Automated online system",
        points: [
          "24/7 self-service booking",
          "No-shows reduced to 15%",
          "Zero booking conflicts",
          "Automatic reminders sent",
        ],
      },
    },
    {
      category: "Billing & Claims",
      before: {
        icon: "😫",
        title: "Manual billing process",
        points: [
          "25% error rate in claims",
          "Hours spent on corrections",
          "Delayed revenue collection",
          "Frequent claim rejections",
        ],
      },
      after: {
        icon: "🎯",
        title: "Smart billing",
        points: [
          "Less than 2% error rate",
          "Instant accuracy checks",
          "Faster claim processing",
          "95%+ acceptance rate",
        ],
      },
    },
    {
      category: "Patient Check-in",
      before: {
        icon: "📝",
        title: "Paper-based process",
        points: [
          "15-20 min check-in time",
          "Outdated patient information",
          "Manual data entry errors",
          "Lost paperwork",
        ],
      },
      after: {
        icon: "⚡",
        title: "Digital self-serve kiosk",
        points: [
          "2-3 min check-in time",
          "Real-time data updates",
          "Automated sync to EMR",
          "100% paperless",
        ],
      },
    },
    {
      category: "Staff Productivity",
      before: {
        icon: "😓",
        title: "Manual workflows",
        points: [
          "10+ hours on admin tasks",
          "Constant phone interruptions",
          "Burnout and turnover",
          "Patient care compromised",
        ],
      },
      after: {
        icon: "🚀",
        title: "Automated workflows",
        points: [
          "Save 10+ hours monthly",
          "Focus on patient care",
          "Higher job satisfaction",
          "Better patient outcomes",
        ],
      },
    },
  ];

  return (
    <MKBox component="section" py={12} sx={{ backgroundColor: "#f8f9fa" }}>
      <Container>
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
              sx={{ fontSize: "2.5rem" }}
            >
              Before & After ND Health
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
              See the transformation clinics experience when they switch to ND Health
            </MKTypography>
          </MKBox>
        </motion.div>

        {/* Comparison Cards */}
        <Grid container spacing={4}>
          {comparisons.map((comparison, index) => (
            <Grid item xs={12} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MKBox sx={{ mb: 4 }}>
                  {/* Category Title */}
                  <MKTypography
                    variant="h5"
                    color="info"
                    fontWeight="bold"
                    mb={3}
                    sx={{ textAlign: "center" }}
                  >
                    {comparison.category}
                  </MKTypography>

                  <Grid container spacing={3}>
                    {/* BEFORE Column */}
                    <Grid item xs={12} md={6}>
                      <MKBox
                        sx={{
                          p: 4,
                          height: "100%",
                          borderRadius: "15px",
                          background: "white",
                          border: "2px solid #ffebee",
                          position: "relative",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        {/* Badge */}
                        <MKBox
                          sx={{
                            position: "absolute",
                            top: -15,
                            left: 20,
                            px: 3,
                            py: 1,
                            borderRadius: "20px",
                            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                            boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
                          }}
                        >
                          <MKTypography variant="caption" color="white" fontWeight="bold">
                            WITHOUT ND HEALTH
                          </MKTypography>
                        </MKBox>

                        {/* Icon */}
                        <MKTypography variant="h1" sx={{ fontSize: "3rem", mb: 2, mt: 2 }}>
                          {comparison.before.icon}
                        </MKTypography>

                        {/* Title */}
                        <MKTypography variant="h5" color="dark" fontWeight="bold" mb={3}>
                          {comparison.before.title}
                        </MKTypography>

                        {/* Points */}
                        <MKBox component="ul" sx={{ pl: 0, listStyle: "none" }}>
                          {comparison.before.points.map((point, idx) => (
                            <MKBox
                              component="li"
                              key={idx}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 2,
                              }}
                            >
                              <MKTypography
                                variant="body1"
                                color="error"
                                sx={{ mr: 1.5, fontWeight: "bold", fontSize: "1.2rem" }}
                              >
                                ✗
                              </MKTypography>
                              <MKTypography variant="body2" color="text" sx={{ lineHeight: "1.6" }}>
                                {point}
                              </MKTypography>
                            </MKBox>
                          ))}
                        </MKBox>
                      </MKBox>
                    </Grid>

                    {/* AFTER Column */}
                    <Grid item xs={12} md={6}>
                      <MKBox
                        sx={{
                          p: 4,
                          height: "100%",
                          borderRadius: "15px",
                          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                          border: "2px solid #2196f3",
                          position: "relative",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 30px rgba(33, 150, 243, 0.3)",
                          },
                        }}
                      >
                        {/* Badge */}
                        <MKBox
                          sx={{
                            position: "absolute",
                            top: -15,
                            left: 20,
                            px: 3,
                            py: 1,
                            borderRadius: "20px",
                            background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                          }}
                        >
                          <MKTypography variant="caption" color="white" fontWeight="bold">
                            WITH ND HEALTH
                          </MKTypography>
                        </MKBox>

                        {/* Icon */}
                        <MKTypography variant="h1" sx={{ fontSize: "3rem", mb: 2, mt: 2 }}>
                          {comparison.after.icon}
                        </MKTypography>

                        {/* Title */}
                        <MKTypography variant="h5" color="dark" fontWeight="bold" mb={3}>
                          {comparison.after.title}
                        </MKTypography>

                        {/* Points */}
                        <MKBox component="ul" sx={{ pl: 0, listStyle: "none" }}>
                          {comparison.after.points.map((point, idx) => (
                            <MKBox
                              component="li"
                              key={idx}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 2,
                              }}
                            >
                              <MKTypography
                                variant="body1"
                                color="success"
                                sx={{ mr: 1.5, fontWeight: "bold", fontSize: "1.2rem" }}
                              >
                                ✓
                              </MKTypography>
                              <MKTypography variant="body2" color="dark" fontWeight="medium" sx={{ lineHeight: "1.6" }}>
                                {point}
                              </MKTypography>
                            </MKBox>
                          ))}
                        </MKBox>
                      </MKBox>
                    </Grid>
                  </Grid>
                </MKBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox
            sx={{
              mt: 6,
              p: 5,
              borderRadius: "20px",
              background: "white",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            }}
          >
            <MKTypography variant="h4" color="dark" fontWeight="bold" mb={2}>
              Don't Let Manual Processes Hold You Back
            </MKTypography>
            <MKTypography variant="body1" color="text" mb={3} sx={{ fontSize: "1.1rem" }}>
              Join modern clinics that have already made the switch to ND Health
            </MKTypography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <MKTypography variant="body2" color="success" fontWeight="bold">
                ⏱️ Average setup time: 5 minutes
              </MKTypography>
              <MKTypography variant="body2" color="info" fontWeight="bold">
                💳 No credit card required
              </MKTypography>
              <MKTypography variant="body2" color="warning" fontWeight="bold">
                🎁 Free forever plan available
              </MKTypography>
            </Box>
          </MKBox>
        </motion.div>
      </Container>
    </MKBox>
  );
}

export default ComparisonSection;
