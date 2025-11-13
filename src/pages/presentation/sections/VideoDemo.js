// Video Demo Section
import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function VideoDemo() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const demoFeatures = [
    {
      icon: "🎯",
      title: "See It in Action",
      description: "Watch how ND Health streamlines your entire workflow in under 2 minutes",
    },
    {
      icon: "⚡",
      title: "Quick Setup",
      description: "Learn how to get your clinic up and running in just 5 minutes",
    },
    {
      icon: "📊",
      title: "Real Results",
      description: "Discover how clinics are saving 10+ hours weekly with automation",
    },
  ];

  return (
    <MKBox component="section" py={12} sx={{ position: "relative", overflow: "hidden" }}>
      {/* Animated background */}
      <MKBox
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          opacity: 0.05,
          zIndex: 0,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Column - Text Content */}
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MKTypography
                variant="h2"
                color="dark"
                fontWeight="bold"
                mb={3}
                sx={{ fontSize: "2.5rem" }}
              >
                See How ND Health Works
              </MKTypography>

              <MKTypography
                variant="body1"
                color="text"
                mb={4}
                sx={{ fontSize: "1.1rem", lineHeight: "1.8" }}
              >
                Take a 2-minute tour of our platform and discover why 50+ clinics across Canada trust
                ND Health to power their practice.
              </MKTypography>

              {/* Feature Points */}
              <MKBox sx={{ mb: 4 }}>
                {demoFeatures.map((feature, index) => (
                  <MKBox
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mb: 3,
                    }}
                  >
                    <MKBox
                      sx={{
                        fontSize: "2rem",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h6" color="dark" fontWeight="bold" mb={0.5}>
                        {feature.title}
                      </MKTypography>
                      <MKTypography variant="body2" color="text">
                        {feature.description}
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                ))}
              </MKBox>

              {/* CTA Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <MKButton
                  variant="gradient"
                  color="info"
                  size="large"
                  onClick={handleOpen}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  ▶️ Watch Demo Video
                </MKButton>
                <MKButton
                  variant="outlined"
                  color="info"
                  size="large"
                  href="/demo"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Schedule Live Demo
                </MKButton>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column - Video Placeholder */}
          <Grid item xs={12} lg={7}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MKBox
                sx={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
                onClick={handleOpen}
              >
                {/* Video Thumbnail */}
                <MKBox
                  sx={{
                    position: "relative",
                    paddingTop: "56.25%", // 16:9 aspect ratio
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  {/* Play Button Overlay */}
                  <MKBox
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "white",
                        transform: "translate(-50%, -50%) scale(1.1)",
                      },
                    }}
                  >
                    <MKTypography
                      variant="h3"
                      color="info"
                      sx={{ ml: 0.5 }}
                    >
                      ▶
                    </MKTypography>
                  </MKBox>

                  {/* Text Overlay */}
                  <MKBox
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      pt: 10,
                    }}
                  >
                    <MKTypography variant="h3" color="white" fontWeight="bold" mb={2}>
                      Platform Overview
                    </MKTypography>
                    <MKTypography variant="body1" color="white" opacity={0.9}>
                      Click to watch demo video
                    </MKTypography>
                  </MKBox>
                </MKBox>

                {/* Duration Badge */}
                <MKBox
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <MKTypography variant="caption" color="white" fontWeight="bold">
                    2:15
                  </MKTypography>
                </MKBox>
              </MKBox>
            </motion.div>
          </Grid>
        </Grid>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Grid container spacing={3} sx={{ mt: 6 }}>
            {[
              { number: "2:15", label: "Watch in just over 2 minutes" },
              { number: "50+", label: "Clinics using ND Health" },
              { number: "10+", label: "Hours saved monthly" },
              { number: "4.8/5", label: "Average customer rating" },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <MKBox textAlign="center">
                  <MKTypography variant="h3" color="info" fontWeight="bold" mb={1}>
                    {stat.number}
                  </MKTypography>
                  <MKTypography variant="body2" color="text">
                    {stat.label}
                  </MKTypography>
                </MKBox>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Video Modal */}
      <Modal
        open={modalOpen}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MKBox
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: "1200px",
            backgroundColor: "black",
            borderRadius: "10px",
            overflow: "hidden",
            outline: "none",
          }}
        >
          {/* Close Button */}
          <MKBox
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            <MKButton variant="contained" color="white" circular iconOnly>
              ✕
            </MKButton>
          </MKBox>

          {/* Video Embed - Replace with your actual video URL */}
          <MKBox
            sx={{
              position: "relative",
              paddingTop: "56.25%",
              backgroundColor: "#000",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="ND Health Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </MKBox>
        </MKBox>
      </Modal>
    </MKBox>
  );
}

export default VideoDemo;
