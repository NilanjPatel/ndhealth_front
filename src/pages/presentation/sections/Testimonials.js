// src/pages/presentation/sections/Testimonials.js
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Material Kit 2 PRO React examples
import DefaultReviewCard from "examples/Cards/ReviewCards/DefaultReviewCard";

function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Balchandra Dhawan",
      clinic: "Family Physician at Maple Clinic",
      avatar:
        "https://static.wixstatic.com/media/9f27bf_4c6cb50b3a8941a5b837fa677bb5e5a1~mv2.jpg",
      testimonial:
        "ND Health transformed our clinic. With 9 physicians, daily administrative tasks and patient calls were overwhelming. The platform streamlined our workflow, reducing workload and enhancing patient satisfaction. Highly recommend it to other clinics!",
      rating: 5,
      color: "info",
      highlight: "Reduced administrative workload by 40%",
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
      highlight: "Improved billing accuracy by 25%",
    },
  ];

  // Quick wins - Short testimonials for credibility
  const quickWins = [
    {
      quote: "Setup took less than 5 minutes. Started seeing results immediately.",
      author: "Dr. Sarah Chen",
      role: "Walk-in Clinic",
    },
    {
      quote: "Our patients love the online booking. Phone calls dropped by 60%.",
      author: "Dr. Michael Roberts",
      role: "Family Practice",
    },
    {
      quote: "The billing optimizer paid for itself in the first month.",
      author: "Dr. Lisa Martinez",
      role: "Multi-Physician Clinic",
    },
  ];

  return (
    <MKBox component="section" py={8} sx={{ backgroundColor: "white" }}>
      <Container>
        {/* Section Header */}
        <MKBox textAlign="center" mb={6}>
          <MKTypography variant="h2" color="dark" fontWeight="bold" mb={2}>
            Trusted by Healthcare Professionals
          </MKTypography>
          <MKTypography
            variant="body1"
            color="text"
            sx={{ maxWidth: "700px", mx: "auto", fontSize: "1.1rem" }}
          >
            See what doctors are saying about their experience with ND Health
          </MKTypography>
          {/* Star Rating */}
          <MKBox display="flex" justifyContent="center" alignItems="center" mt={2} gap={0.5}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon key={star} sx={{ color: "warning.main" }}>
                star
              </Icon>
            ))}
            <MKTypography variant="body2" color="text" ml={1}>
              4.9/5 from 50+ clinics
            </MKTypography>
          </MKBox>
        </MKBox>

        {/* Main Testimonials */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <MKBox sx={{ height: "100%" }}>
                {/* Highlight Badge */}
                <MKBox
                  sx={{
                    backgroundColor: "success.main",
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    display: "inline-block",
                    mb: 2,
                  }}
                >
                  <MKTypography variant="caption" color="white" fontWeight="bold">
                    ✓ {testimonial.highlight}
                  </MKTypography>
                </MKBox>

                <DefaultReviewCard
                  name={testimonial.name}
                  date={testimonial.clinic}
                  review={testimonial.testimonial}
                  rating={testimonial.rating}
                  image={testimonial.avatar}
                  color={testimonial.color}
                />
              </MKBox>
            </Grid>
          ))}
        </Grid>

        {/* Quick Wins Section */}
        <MKBox
          sx={{
            backgroundColor: ({ palette: { grey } }) => grey[100],
            borderRadius: 2,
            p: 4,
            mb: 4,
          }}
        >
          <MKTypography variant="h5" color="dark" fontWeight="bold" textAlign="center" mb={4}>
            What Our Users Say
          </MKTypography>
          <Grid container spacing={3}>
            {quickWins.map((win, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MKBox
                  sx={{
                    backgroundColor: "white",
                    p: 3,
                    borderRadius: 2,
                    height: "100%",
                    boxShadow: 2,
                  }}
                >
                  <MKTypography
                    variant="body1"
                    color="text"
                    fontStyle="italic"
                    mb={2}
                    sx={{ fontSize: "0.95rem" }}
                  >
                    "{win.quote}"
                  </MKTypography>
                  <MKTypography variant="body2" color="dark" fontWeight="bold">
                    {win.author}
                  </MKTypography>
                  <MKTypography variant="caption" color="text">
                    {win.role}
                  </MKTypography>
                </MKBox>
              </Grid>
            ))}
          </Grid>
        </MKBox>

        {/* Video Testimonial CTA */}
        <MKBox
          textAlign="center"
          sx={{
            backgroundColor: "info.main",
            backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 2,
            p: 4,
          }}
        >
          <Icon sx={{ fontSize: "3rem", mb: 2 }}>play_circle_outline</Icon>
          <MKTypography variant="h4" color="white" fontWeight="bold" mb={1}>
            See ND Health in Action
          </MKTypography>
          <MKTypography variant="body1" color="white" mb={3} opacity={0.9}>
            Watch a 3-minute demo showing how clinics are saving 30+ hours per month
          </MKTypography>
          <MKButton variant="contained" color="white" size="large">
            Watch Demo Video
          </MKButton>
        </MKBox>

        {/* Social Proof Stats */}
        <Grid container spacing={3} sx={{ mt: 4 }} justifyContent="center">
          <Grid item xs={12} sm={4} md={3}>
            <MKBox textAlign="center">
              <MKTypography variant="h3" color="info" fontWeight="bold">
                50+
              </MKTypography>
              <MKTypography variant="body2" color="text">
                Active Clinics
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <MKBox textAlign="center">
              <MKTypography variant="h3" color="success" fontWeight="bold">
                98%
              </MKTypography>
              <MKTypography variant="body2" color="text">
                Satisfaction Rate
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <MKBox textAlign="center">
              <MKTypography variant="h3" color="warning" fontWeight="bold">
                30+
              </MKTypography>
              <MKTypography variant="body2" color="text">
                Hours Saved/Month
              </MKTypography>
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Testimonials;