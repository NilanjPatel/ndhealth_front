// src/pages/presentation/sections/TrustBadges.js
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function TrustBadges() {
  // Trust indicators - Psychological: Build credibility early
  const trustIndicators = [
    {
      icon: "verified_user",
      title: "HIPAA Compliant",
      description: "Full compliance with healthcare privacy regulations",
      color: "success",
    },
    {
      icon: "lock",
      title: "Bank-Level Security",
      description: "256-bit SSL encryption for all data",
      color: "info",
    },
    {
      icon: "cloud_done",
      title: "99.9% Uptime",
      description: "Reliable cloud infrastructure with redundancy",
      color: "primary",
    },
    {
      icon: "support_agent",
      title: "24/7 Support",
      description: "Real human support whenever you need it",
      color: "warning",
    },
  ];

  // Compliance badges
  const complianceBadges = [
    {
      name: "PHIPA",
      description: "Personal Health Information Protection Act",
    },
    {
      name: "PIPEDA",
      description: "Privacy Compliant",
    },
    {
      name: "ISO 27001",
      description: "Information Security",
    },
    {
      name: "SOC 2",
      description: "Security Certified",
    },
  ];

  return (
    <MKBox component="section" py={4}>
      <Container>
        {/* Trust Indicators */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {trustIndicators.map((indicator, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MKBox
                sx={{
                  textAlign: "center",
                  p: 2,
                }}
              >
                <MKBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="3rem"
                  height="3rem"
                  borderRadius="md"
                  color="white"
                  bgColor={indicator.color}
                  variant="gradient"
                  mx="auto"
                  mb={1}
                >
                  <Icon fontSize="medium">{indicator.icon}</Icon>
                </MKBox>
                <MKTypography variant="h6" color="dark" fontWeight="bold" mb={0.5}>
                  {indicator.title}
                </MKTypography>
                <MKTypography variant="caption" color="text">
                  {indicator.description}
                </MKTypography>
              </MKBox>
            </Grid>
          ))}
        </Grid>

        {/* Compliance Badges */}
        <MKBox
          sx={{
            backgroundColor: ({ palette: { grey } }) => grey[50],
            borderRadius: 2,
            py: 3,
            px: 2,
          }}
        >
          <MKTypography
            variant="caption"
            color="text"
            textAlign="center"
            display="block"
            mb={2}
            fontWeight="bold"
          >
            CERTIFIED & COMPLIANT
          </MKTypography>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {complianceBadges.map((badge, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <MKBox
                  sx={{
                    textAlign: "center",
                    border: "2px solid",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    p: 1.5,
                    backgroundColor: "white",
                  }}
                >
                  <MKTypography variant="h6" color="dark" fontWeight="bold" mb={0.5}>
                    {badge.name}
                  </MKTypography>
                  <MKTypography variant="caption" color="text">
                    {badge.description}
                  </MKTypography>
                </MKBox>
              </Grid>
            ))}
          </Grid>
        </MKBox>

        {/* Additional Trust Signals */}
        <MKBox textAlign="center" mt={3}>
          <MKTypography variant="body2" color="text">
            Trusted by 50+ clinics  •  Featured in Healthcare IT News  •  Canadian-made
          </MKTypography>
        </MKBox>
      </Container>
    </MKBox>
  );
}

export default TrustBadges;