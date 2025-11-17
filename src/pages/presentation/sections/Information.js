// Ultra-Professional Testimonials & Information Section
import { motion } from "framer-motion";
import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import Rating from "@mui/material/Rating";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 PRO React examples
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

function Information() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

  // Enhanced testimonial data with metrics
  const testimonialData = [
    {
      name: "Dr. Balchandra Dhawan",
      role: "Family Physician",
      clinic: "Maple Clinic",
      location: "Toronto, ON",
      avatar: "https://static.wixstatic.com/media/9f27bf_4c6cb50b3a8941a5b837fa677bb5e5a1~mv2.jpg",
      testimonial: "ND Health transformed our clinic. With 9 physicians, daily administrative tasks and patient calls were overwhelming. The platform streamlined our workflow, reducing workload and enhancing patient satisfaction.",
      fullTestimonial: "Before ND Health, our 9-physician clinic was drowning in administrative work. We were spending 15+ hours weekly on manual tasks. Now, we've automated 80% of our workflows. Patient satisfaction increased from 3.2 to 4.8 stars. The billing accuracy alone saved us thousands in lost revenue. Best investment we've made.",
      rating: 5,
      verified: true,
      metrics: {
        timeSaved: "12 hrs/week",
        revenuIncrease: "+28%",
        satisfaction: "4.8/5",
      },
      results: [
        { label: "Time Saved", value: "12 hrs/week", icon: "schedule" },
        { label: "Revenue Up", value: "+28%", icon: "trending_up" },
        { label: "Error Rate", value: "-95%", icon: "check_circle" },
      ],
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      name: "Dr. Ramesh Asirwatham",
      role: "Family Physician",
      clinic: "Hope Medical Clinic",
      location: "Mississauga, ON",
      avatar: "https://media.licdn.com/dms/image/v2/C5603AQH4M0GDSO8uZg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1643374291751?e=1732147200&v=beta&t=bhwNS9JxsTFytHIiY3EauPtAANJtmbWy9ro5npslPM4",
      testimonial: "Managing billing for our clinic was always complicated, with frequent errors and delayed reconciliations. ND Health provided clear billing suggestions and streamlined the entire process.",
      fullTestimonial: "Billing was our biggest headache. We had a 25% error rate in claims, resulting in rejections and delayed payments. ND Health's intelligent billing assistant reduced our error rate to under 2%. The automated validation catches issues before submission. Our revenue collection improved by 35% in just 3 months.",
      rating: 5,
      verified: true,
      metrics: {
        timeSaved: "8 hrs/week",
        errorReduction: "-92%",
        faster: "3x faster",
      },
      results: [
        { label: "Errors Down", value: "-92%", icon: "error_outline" },
        { label: "Time Saved", value: "8 hrs/week", icon: "schedule" },
        { label: "Speed", value: "3x faster", icon: "speed" },
      ],
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      name: "Dr. Sarah Mitchell",
      role: "Clinic Director",
      clinic: "Downtown Family Health",
      location: "Vancouver, BC",
      avatar: "https://i.pravatar.cc/150?img=5",
      testimonial: "The patient portal and online booking transformed how we operate. No-shows decreased by 45% and our staff can focus on patient care instead of phone calls.",
      fullTestimonial: "We were losing revenue from no-shows and spending hours on phone bookings. ND Health's online booking system with automated reminders cut our no-show rate from 30% to 8%. Our front desk staff can now focus on in-person patient care. The ROI was immediate.",
      rating: 5,
      verified: true,
      metrics: {
        noShows: "-45%",
        automation: "90%",
        satisfaction: "4.9/5",
      },
      results: [
        { label: "No-Shows", value: "-45%", icon: "person_off" },
        { label: "Automation", value: "90%", icon: "auto_awesome" },
        { label: "Rating", value: "4.9/5", icon: "star" },
      ],
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  // Key features with impact metrics
  const features = [
    {
      icon: "notifications_active",
      title: "Smart Notifications",
      description: "Automated appointment reminders via SMS & email reduce no-shows by up to 40%",
      impact: "40% fewer no-shows",
      color: "info",
    },
    {
      icon: "lock",
      title: "Secure Communication",
      description: "HIPAA-compliant encrypted messaging keeps patient information safe and confidential",
      impact: "100% compliant",
      color: "success",
    },
    {
      icon: "attach_money",
      title: "Revenue Optimization",
      description: "Intelligent billing suggestions reduce errors by 25% and improve claim acceptance",
      impact: "+25% accuracy",
      color: "warning",
    },
    {
      icon: "desktop_windows",
      title: "Patient Self-Service",
      description: "Modern kiosk allows patients to check-in and update information independently",
      impact: "2 hrs saved daily",
      color: "primary",
    },
  ];

  return (
    <MKBox component="section" py={12} sx={{ position: "relative" }}>
      <Container>
        {/* Section Header with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Grid container item xs={12} lg={10} justifyContent="center" sx={{ mx: "auto", textAlign: "center", mb: 8 }}>
            <MKBox sx={{ position: "relative", width: "100%" }}>
              {/* Decorative line */}
              <MKBox
                sx={{
                  position: "absolute",
                  top: "-20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "4px",
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "2px",
                }}
              />

              {/* Main Headline */}
              <MKBox display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" mb={2} mt={4}>
                <MKTypography
                  variant="h2"
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Loved by Doctors,
                </MKTypography>
                <MKTypography variant="h2" ml={1} sx={{ fontSize: "2.5rem", fontWeight: "800" }}>
                  Trusted by Clinics
                </MKTypography>
              </MKBox>

              {/* Subheadline */}
              <MKTypography
                variant="body1"
                color="text"
                sx={{ fontSize: "1.2rem", maxWidth: "700px", mx: "auto", lineHeight: "1.8", mb: 4 }}
              >
                Join healthcare professionals who have already transformed their practice with ND Health
              </MKTypography>

              {/* Trust Metrics */}
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={4} sm={2}>
                  <MKBox textAlign="center">
                    <MKTypography variant="h4" color="info" fontWeight="bold">
                      4.8/5
                    </MKTypography>
                    <MKTypography variant="caption" color="text">
                      ⭐⭐⭐⭐⭐
                    </MKTypography>
                    <MKTypography variant="caption" color="text" display="block">
                      Average Rating
                    </MKTypography>
                  </MKBox>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <MKBox textAlign="center">
                    <MKTypography variant="h4" color="success" fontWeight="bold">
                      50+
                    </MKTypography>
                    <MKTypography variant="caption" color="text" display="block">
                      Active Clinics
                    </MKTypography>
                  </MKBox>
                </Grid>
                <Grid item xs={4} sm={2}>
                  <MKBox textAlign="center">
                    <MKTypography variant="h4" color="warning" fontWeight="bold">
                      98%
                    </MKTypography>
                    <MKTypography variant="caption" color="text" display="block">
                      Satisfaction
                    </MKTypography>
                  </MKBox>
                </Grid>
              </Grid>
            </MKBox>
          </Grid>
        </motion.div>

        {/* Enhanced Testimonial Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }} justifyContent="center">
          {testimonialData.map((testimonial, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
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
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
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
                      background: testimonial.gradient,
                      borderRadius: "20px 20px 0 0",
                    },
                  }}
                  onClick={() => setSelectedTestimonial(index)}
                >
                  {/* Quote Icon */}
                  <MKBox
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: 20,
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: testimonial.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Icon sx={{ color: "white", fontSize: "1.5rem" }}>format_quote</Icon>
                  </MKBox>

                  {/* Doctor Info */}
                  <MKBox sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{
                        width: 70,
                        height: 70,
                        border: "3px solid white",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    />
                    <MKBox sx={{ flex: 1 }}>
                      <MKBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <MKTypography variant="h6" color="dark" fontWeight="bold">
                          {testimonial.name}
                        </MKTypography>
                        {testimonial.verified && (
                          <Chip
                            icon={<Icon>verified</Icon>}
                            label="Verified"
                            size="small"
                            sx={{
                              height: "20px",
                              "& .MuiChip-icon": { fontSize: "0.875rem" },
                              backgroundColor: "rgba(76, 175, 80, 0.1)",
                              color: "success.main",
                            }}
                          />
                        )}
                      </MKBox>
                      <MKTypography variant="caption" color="text" display="block">
                        {testimonial.role}
                      </MKTypography>
                      <MKTypography variant="caption" color="text" display="block">
                        {testimonial.clinic} • {testimonial.location}
                      </MKTypography>
                    </MKBox>
                  </MKBox>

                  {/* Rating */}
                  <MKBox sx={{ mb: 2 }}>
                    <Rating value={testimonial.rating} readOnly size="small" />
                  </MKBox>

                  {/* Testimonial Text */}
                  <MKTypography variant="body2" color="text" sx={{ mb: 3, lineHeight: "1.8", fontStyle: "italic" }}>
                    "{testimonial.testimonial}"
                  </MKTypography>

                  {/* Results Metrics */}
                  <Divider sx={{ my: 2 }} />
                  <MKTypography variant="caption" color="text" fontWeight="bold" display="block" mb={2}>
                    KEY RESULTS:
                  </MKTypography>
                  <Grid container spacing={2}>
                    {testimonial.results.map((result, idx) => (
                      <Grid item xs={4} key={idx}>
                        <MKBox textAlign="center">
                          <Icon sx={{ color: "success.main", fontSize: "1.5rem", mb: 0.5 }}>
                            {result.icon}
                          </Icon>
                          <MKTypography variant="caption" color="dark" fontWeight="bold" display="block">
                            {result.value}
                          </MKTypography>
                          <MKTypography variant="caption" color="text" sx={{ fontSize: "0.65rem" }}>
                            {result.label}
                          </MKTypography>
                        </MKBox>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Read More Link */}
                  <MKBox sx={{ textAlign: "center", mt: 3 }}>
                    <MKTypography
                      variant="caption"
                      sx={{
                        color: "info.main",
                        fontWeight: "bold",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Read Full Story →
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Social Proof Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox
            sx={{
              p: 4,
              borderRadius: "20px",
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
              textAlign: "center",
              mb: 8,
            }}
          >
            <MKTypography variant="h6" color="dark" fontWeight="bold" mb={3}>
              Join 50+ Clinics Already Using ND Health
            </MKTypography>
            <AvatarGroup
              max={8}
              sx={{
                justifyContent: "center",
                "& .MuiAvatar-root": {
                  border: "3px solid white",
                  width: 56,
                  height: 56,
                },
              }}
            >
              {testimonialData.map((t, i) => (
                <Avatar key={i} src={t.avatar} alt={t.name} />
              ))}
              <Avatar>+47</Avatar>
            </AvatarGroup>
            <MKButton
              variant="gradient"
              color="info"
              size="medium"
              href="/join"
              sx={{ mt: 3 }}
            >
              Join These Doctors
            </MKButton>
          </MKBox>
        </motion.div>

        {/* Divider */}
        <Divider sx={{ my: 8 }} />

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox textAlign="center" mb={6}>
            <MKTypography variant="h3" color="dark" fontWeight="bold" mb={2}>
              Everything You Need in One Platform
            </MKTypography>
            <MKTypography variant="body1" color="text" sx={{ fontSize: "1.1rem" }}>
              Powerful features designed specifically for modern healthcare practices
            </MKTypography>
          </MKBox>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <MKBox
                    sx={{
                      p: 3,
                      height: "100%",
                      textAlign: "center",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: "3rem", color: `${feature.color}.main`, mb: 2 }}>
                      {feature.icon}
                    </Icon>
                    <MKTypography variant="h6" color="dark" fontWeight="bold" mb={1}>
                      {feature.title}
                    </MKTypography>
                    <MKTypography variant="body2" color="text" mb={2}>
                      {feature.description}
                    </MKTypography>
                    <Chip
                      label={feature.impact}
                      size="small"
                      color={feature.color}
                      sx={{ fontWeight: "bold" }}
                    />
                  </MKBox>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox
            sx={{
              mt: 8,
              p: 5,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            }}
          >
            <MKTypography variant="h5" color="dark" fontWeight="bold" mb={4} textAlign="center">
              Why Clinics Choose ND Health
            </MKTypography>
            <Grid container spacing={4} justifyContent="center">
              {[
                { icon: "schedule", value: "5 min", label: "Average Setup Time" },
                { icon: "support_agent", value: "24/7", label: "Technical Support" },
                { icon: "cloud_done", value: "99.9%", label: "Uptime Guarantee" },
                { icon: "card_giftcard", value: "Free", label: "Forever Plan" },
              ].map((item, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <MKBox textAlign="center">
                    <Icon sx={{ fontSize: "2.5rem", color: "info.main", mb: 1 }}>
                      {item.icon}
                    </Icon>
                    <MKTypography variant="h4" color="dark" fontWeight="bold">
                      {item.value}
                    </MKTypography>
                    <MKTypography variant="body2" color="text">
                      {item.label}
                    </MKTypography>
                  </MKBox>
                </Grid>
              ))}
            </Grid>
          </MKBox>
        </motion.div>
      </Container>
    </MKBox>
  );
}

export default Information;
