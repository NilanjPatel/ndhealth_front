// src/pages/presentation/sections/Information.js
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 PRO React examples
import DefaultReviewCard from "examples/Cards/ReviewCards/DefaultReviewCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

function Information() {
  // Testimonial data - Psychological: Real names and photos build trust
  const testimonialData = [
    {
      name: "Dr. Balchandra Dhawan",
      clinic: "Family Physician at Maple Clinic",
      avatar:
        "https://static.wixstatic.com/media/9f27bf_4c6cb50b3a8941a5b837fa677bb5e5a1~mv2.jpg",
      testimonial:
        "ND Health transformed our clinic. With 9 physicians, daily administrative tasks and patient calls were overwhelming. The platform streamlined our workflow, reducing workload and enhancing patient satisfaction. Highly recommend it to other clinics!",
      rating: 5,
      color: "info",
    },
    {
      name: "Dr. Ramesh Asirwatham",
      clinic: "Family Physician at Hope Medical Clinic",
      avatar:
        "https://media.licdn.com/dms/image/v2/C5603AQH4M0GDSO8uZg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1643374291751?e=1732147200&v=beta&t=bhwNS9JxsTFytHIiY3EauPtAANJtmbWy9ro5npslPM4",
      testimonial:
        "Managing billing for our clinic was always complicated, with frequent errors and delayed reconciliations. ND Health provided clear billing suggestions and streamlined the entire process. Their system flagged inconsistencies early, saving us countless hours of manual checking. We now feel more confident in our billing accuracy and financial management.",
      rating: 5,
      color: "light",
    },
  ];

  // Key features - Psychological: Benefits-focused messaging
  const features = [
    {
      icon: "notifications_active",
      title: "Smart Notifications",
      description:
        "Automated appointment reminders and confirmations reduce no-shows by up to 40%",
      color: "info",
    },
    {
      icon: "lock",
      title: "Secure Communication",
      description:
        "HIPAA-compliant encrypted messaging keeps patient information confidential",
      color: "success",
    },
    {
      icon: "attach_money",
      title: "Increase Revenue",
      description:
        "Reduce billing errors by 25% and improve claim acceptance rates",
      color: "warning",
    },
    {
      icon: "desktop_windows",
      title: "Patient Self-Service",
      description:
        "Modern kiosk allows patients to check-in and update information independently",
      color: "primary",
    },
  ];

  return (
    <MKBox component="section" py={8}>
      <Container>
        {/* Testimonials Section - Psychological: Social proof first */}
        <Grid
          container
          item
          xs={12}
          lg={8}
          justifyContent="center"
          sx={{ mx: "auto", textAlign: "center", mb: 6 }}
        >
          <MKBox display="flex" alignItems="center" justifyContent="center" flexWrap="wrap" mb={1}>
            <MKTypography variant="h2" color="info" textGradient>
              Loved by Doctors,
            </MKTypography>
            <MKTypography variant="h2" ml={1}>
              Trusted by Clinics
            </MKTypography>
          </MKBox>
          <MKTypography
            variant="body1"
            color="text"
            sx={{ fontSize: "1.1rem", maxWidth: "600px" }}
          >
            Join healthcare professionals who have already transformed their practice with ND Health
          </MKTypography>
        </Grid>

        {/* Testimonial Cards */}
        <Grid container spacing={3} sx={{ mb: 8 }} justifyContent="center">
          {testimonialData.map((testimonial, index) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={5}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DefaultReviewCard
                name={testimonial.name}
                date={testimonial.clinic}
                review={testimonial.testimonial}
                rating={testimonial.rating}
                image={testimonial.avatar}
                color={testimonial.color}
              />
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 6 }} />

        {/* Features Section */}
        <MKBox textAlign="center" mb={6}>
          <MKTypography variant="h3" color="dark" fontWeight="bold" mb={2}>
            Everything You Need in One Platform
          </MKTypography>
          <MKTypography variant="body1" color="text" sx={{ fontSize: "1.1rem" }}>
            Powerful features designed specifically for modern healthcare practices
          </MKTypography>
        </MKBox>

        {/* Feature Cards */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DefaultInfoCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            </Grid>
          ))}
        </Grid>

        {/* Additional Value Proposition */}
        <MKBox
          textAlign="center"
          mt={8}
          p={4}
          sx={{
            backgroundColor: ({ palette: { grey } }) => grey[100],
            borderRadius: 2,
          }}
        >
          <MKTypography variant="h5" color="dark" fontWeight="bold" mb={2}>
            Why Clinics Choose ND Health
          </MKTypography>
          <Grid container spacing={3} justifyContent="center" mt={2}>
            <Grid item xs={12} sm={6} md={3}>
              <MKBox>
                <MKTypography variant="h4" color="info" fontWeight="bold">
                  5 min
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  Average setup time
                </MKTypography>
              </MKBox>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MKBox>
                <MKTypography variant="h4" color="success" fontWeight="bold">
                  24/7
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  Technical support
                </MKTypography>
              </MKBox>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MKBox>
                <MKTypography variant="h4" color="warning" fontWeight="bold">
                  99.9%
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  Uptime guarantee
                </MKTypography>
              </MKBox>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MKBox>
                <MKTypography variant="h4" color="error" fontWeight="bold">
                  Free
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  Forever plan available
                </MKTypography>
              </MKBox>
            </Grid>
          </Grid>
        </MKBox>
      </Container>
    </MKBox>
  );
}

export default Information;