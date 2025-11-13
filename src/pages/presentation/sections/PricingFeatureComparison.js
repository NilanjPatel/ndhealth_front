// Feature Comparison Table Component
import { motion } from "framer-motion";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Icon from "@mui/material/Icon";
import Chip from "@mui/material/Chip";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function PricingFeatureComparison() {
  const featureCategories = [
    {
      category: "Patient Management",
      features: [
        {
          name: "Health Card Validation",
          starter: true,
          premium: true,
          enterprise: true,
          tooltip: "Instant OHIP verification",
        },
        {
          name: "Patient Capacity",
          starter: "50/month",
          premium: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Patient Portal",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Medical History Tracking",
          starter: "Basic",
          premium: "Advanced",
          enterprise: "Advanced + AI",
        },
      ],
    },
    {
      category: "Appointments & Scheduling",
      features: [
        {
          name: "Online Booking",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Automated Reminders (SMS/Email)",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Waitlist Management",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Multi-Location Scheduling",
          starter: false,
          premium: false,
          enterprise: true,
        },
      ],
    },
    {
      category: "Billing & Revenue",
      features: [
        {
          name: "Billing Code Suggestions",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Automated Claims Submission",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Revenue Analytics",
          starter: false,
          premium: "Basic",
          enterprise: "Advanced",
        },
        {
          name: "Custom Billing Rules",
          starter: false,
          premium: false,
          enterprise: true,
        },
      ],
    },
    {
      category: "Communication",
      features: [
        {
          name: "Secure Patient Messaging",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Email Support",
          starter: true,
          premium: true,
          enterprise: true,
        },
        {
          name: "Priority Support (24/7)",
          starter: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Dedicated Account Manager",
          starter: false,
          premium: false,
          enterprise: true,
        },
      ],
    },
    {
      category: "Integrations & Customization",
      features: [
        {
          name: "EMR Integration",
          starter: "Limited",
          premium: "Full",
          enterprise: "Full + Custom",
        },
        {
          name: "Custom Domain",
          starter: false,
          premium: false,
          enterprise: true,
        },
        {
          name: "White-label Options",
          starter: false,
          premium: false,
          enterprise: true,
        },
        {
          name: "API Access",
          starter: false,
          premium: "Basic",
          enterprise: "Full",
        },
      ],
    },
    {
      category: "Security & Compliance",
      features: [
        {
          name: "HIPAA Compliant",
          starter: true,
          premium: true,
          enterprise: true,
        },
        {
          name: "SSL Encryption",
          starter: true,
          premium: true,
          enterprise: true,
        },
        {
          name: "Data Backup",
          starter: "Daily",
          premium: "Hourly",
          enterprise: "Real-time",
        },
        {
          name: "Uptime SLA",
          starter: "99%",
          premium: "99.5%",
          enterprise: "99.9%",
        },
      ],
    },
  ];

  const renderFeatureValue = (value) => {
    if (value === true) {
      return (
        <Icon sx={{ color: "success.main", fontSize: "1.5rem" }}>
          check_circle
        </Icon>
      );
    } else if (value === false) {
      return (
        <Icon sx={{ color: "text.disabled", fontSize: "1.5rem" }}>
          cancel
        </Icon>
      );
    } else {
      return (
        <MKTypography variant="body2" color="dark" fontWeight="medium">
          {value}
        </MKTypography>
      );
    }
  };

  return (
    <MKBox component="section" py={12} sx={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox textAlign="center" mb={6}>
            <MKTypography
              variant="h2"
              color="dark"
              fontWeight="bold"
              mb={2}
              sx={{ fontSize: "2.5rem" }}
            >
              Compare Plans Feature-by-Feature
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
              See exactly what's included in each plan to make the best choice for your practice
            </MKTypography>
          </MKBox>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#667eea" }}>
                  <TableCell sx={{ width: "40%", py: 3 }}>
                    <MKTypography variant="h6" color="white" fontWeight="bold">
                      Features
                    </MKTypography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 3 }}>
                    <MKTypography variant="h6" color="white" fontWeight="bold">
                      Starter
                    </MKTypography>
                    <Chip
                      label="FREE"
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: "white",
                        color: "#667eea",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 3, position: "relative" }}>
                    <MKBox
                      sx={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        px: 2,
                        py: 0.5,
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                      }}
                    >
                      <MKTypography variant="caption" color="white" fontWeight="bold">
                        POPULAR
                      </MKTypography>
                    </MKBox>
                    <MKTypography variant="h6" color="white" fontWeight="bold" sx={{ mt: 1 }}>
                      Premium
                    </MKTypography>
                    <Chip
                      label="$49-59/mo"
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: "white",
                        color: "#667eea",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 3 }}>
                    <MKTypography variant="h6" color="white" fontWeight="bold">
                      Enterprise
                    </MKTypography>
                    <Chip
                      label="CUSTOM"
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: "white",
                        color: "#667eea",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {featureCategories.map((category, catIndex) => (
                  <>
                    {/* Category Header */}
                    <TableRow key={`cat-${catIndex}`}>
                      <TableCell
                        colSpan={4}
                        sx={{
                          backgroundColor: "#f8f9fa",
                          py: 2,
                        }}
                      >
                        <MKTypography variant="h6" color="dark" fontWeight="bold">
                          {category.category}
                        </MKTypography>
                      </TableCell>
                    </TableRow>

                    {/* Features */}
                    {category.features.map((feature, featureIndex) => (
                      <TableRow
                        key={`${catIndex}-${featureIndex}`}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <MKTypography variant="body2" color="text">
                            {feature.name}
                          </MKTypography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          {renderFeatureValue(feature.starter)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            py: 2,
                            backgroundColor: "rgba(102, 126, 234, 0.05)",
                          }}
                        >
                          {renderFeatureValue(feature.premium)}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          {renderFeatureValue(feature.enterprise)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}

                {/* CTA Row */}
                <TableRow>
                  <TableCell sx={{ py: 3 }}>
                    <MKTypography variant="body2" color="text" fontWeight="bold">
                      Get Started Now
                    </MKTypography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 3 }}>
                    <MKButton
                      variant="outlined"
                      color="dark"
                      size="small"
                      href="/join"
                    >
                      Start Free
                    </MKButton>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ py: 3, backgroundColor: "rgba(102, 126, 234, 0.05)" }}
                  >
                    <MKButton
                      variant="gradient"
                      color="success"
                      size="small"
                      href="/join"
                    >
                      Try Premium
                    </MKButton>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 3 }}>
                    <MKButton
                      variant="gradient"
                      color="info"
                      size="small"
                      href="/demo"
                    >
                      Contact Sales
                    </MKButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>

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
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            }}
          >
            <MKTypography variant="h4" color="dark" fontWeight="bold" mb={2}>
              Still Not Sure Which Plan is Right for You?
            </MKTypography>
            <MKTypography variant="body1" color="text" mb={3} sx={{ fontSize: "1.1rem" }}>
              Schedule a free consultation with our team to find the perfect fit for your practice
            </MKTypography>
            <MKButton
              variant="gradient"
              color="info"
              size="large"
              href="/demo"
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: "bold",
              }}
            >
              Schedule Free Consultation
            </MKButton>
          </MKBox>
        </motion.div>
      </Container>
    </MKBox>
  );
}

export default PricingFeatureComparison;
