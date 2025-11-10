// src/pages/presentation/sections/Counters.js
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 PRO React examples
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

import API_BASE_PATH from "../../../apiConfig";

function Counters() {
  const [stats, setStats] = useState({
    appointmentCount: 0,
    appMonthlyAve: 0,
    hcvCount: 0,
    emailCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_PATH}/liveappointmentCount/`);
        const data = await response.json();

        if (data.message === "success") {
          setStats({
            appointmentCount: data.data.count,
            appMonthlyAve: data.data.average_appointments_monthly,
            hcvCount: data.data.total_hcv_count.total_sum,
            emailCount: data.data.total_email_sent,
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Main impact metrics - Psychological: Lead with strongest benefits
  const impactMetrics = [
    {
      color: "success",
      icon: "trending_up",
      count: 25,
      suffix: "%",
      title: "Improved Billing Accuracy",
      description: "Reduce errors and increase revenue",
    },
    {
      color: "error",
      icon: "error_outline",
      count: 99,
      suffix: "%",
      title: "Fewer EH2 Errors",
      description: "Nearly eliminate validation errors",
    },
    {
      color: "warning",
      icon: "groups",
      count: 95,
      suffix: "%",
      title: "Better Roster Management",
      description: "Keep patient records organized",
    },
  ];

  // Real usage metrics - Psychological: Social proof through numbers
  const usageMetrics = [
    {
      color: "info",
      icon: "event_available",
      count: stats.appointmentCount,
      suffix: "+",
      title: "Appointments Booked",
      description: "Patients prefer hassle-free online booking",
    },
    {
      color: "dark",
      icon: "calendar_month",
      count: stats.appMonthlyAve,
      suffix: "+",
      title: "Monthly Appointments",
      description: "Average per clinic using our platform",
    },
    {
      color: "primary",
      icon: "verified_user",
      count: stats.hcvCount,
      suffix: "+",
      title: "Health Cards Validated",
      description: "Accurate patient information guaranteed",
    },
    {
      color: "info",
      icon: "mark_email_read",
      count: stats.emailCount,
      suffix: "+",
      title: "Secure Emails Sent",
      description: "HIPAA-compliant patient communication",
    },
  ];

  // Efficiency metrics
  const efficiencyMetrics = [
    {
      color: "success",
      icon: "schedule",
      count: 30,
      suffix: "+",
      title: "Hours Saved Monthly",
      description: "Average time saved per clinic",
    },
    {
      color: "warning",
      icon: "dashboard",
      count: 4,
      title: "Integrated Applications",
      description: "All-in-one platform solution",
    },
  ];

  return (
    <MKBox component="section" py={6}>
      <Container>
        {/* Section Header - Psychological: Clear value proposition */}
        <MKBox textAlign="center" mb={6}>
          <MKTypography
            variant="h2"
            color="dark"
            fontWeight="bold"
            mb={2}
            sx={({ breakpoints }) => ({
              fontSize: "2.5rem",
              [breakpoints.down("md")]: { fontSize: "2rem" },
              [breakpoints.down("sm")]: { fontSize: "1.75rem" },
            })}
          >
            Real Results from Real Clinics
          </MKTypography>
          <MKTypography
            variant="body1"
            color="text"
            sx={{ maxWidth: "700px", mx: "auto", fontSize: "1.1rem" }}
          >
            See what one clinic achieved in their first year with ND Health
          </MKTypography>
        </MKBox>

        {/* Impact Metrics - Featured prominently */}
        <MKBox
          sx={{
            backgroundColor: ({ palette: { grey } }) => grey[100],
            borderRadius: 2,
            p: 3,
            mb: 4,
          }}
        >
          <MKTypography variant="h5" color="dark" fontWeight="bold" mb={3} textAlign="center">
            💡 Key Improvements
          </MKTypography>
          <Grid container spacing={3} justifyContent="center">
            {impactMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <DefaultCounterCard
                  color={metric.color}
                  icon={<Icon>{metric.icon}</Icon>}
                  count={metric.count}
                  suffix={metric.suffix}
                  title={metric.title}
                  description={metric.description}
                />
              </Grid>
            ))}
          </Grid>
        </MKBox>

        {/* Usage Statistics */}
        <MKBox mb={4}>
          <MKTypography variant="h5" color="dark" fontWeight="bold" mb={3} textAlign="center">
            📊 Platform Activity
          </MKTypography>
          <Grid container spacing={3}>
            {usageMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <DefaultCounterCard
                  color={metric.color}
                  icon={<Icon>{metric.icon}</Icon>}
                  count={loading ? 0 : metric.count}
                  suffix={metric.suffix}
                  title={metric.title}
                  description={metric.description}
                />
              </Grid>
            ))}
          </Grid>
        </MKBox>

        {/* Efficiency Metrics */}
        <Grid container spacing={3} justifyContent="center">
          {efficiencyMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DefaultCounterCard
                color={metric.color}
                icon={<Icon>{metric.icon}</Icon>}
                count={metric.count}
                suffix={metric.suffix}
                title={metric.title}
                description={metric.description}
              />
            </Grid>
          ))}
        </Grid>

        {/* Trust Signal - Psychological: Additional credibility */}
        <Box textAlign="center" mt={5}>
          <MKTypography variant="body2" color="text" fontStyle="italic">
            ✓ Trusted by 50+ clinics across Canada  •  ✓ 98% customer satisfaction  •  ✓ 24/7 support
          </MKTypography>
        </Box>
      </Container>
    </MKBox>
  );
}

export default Counters;