// src/pages/presentation/sections/FAQ.js
import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Icon from "@mui/material/Icon";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function FAQ() {
  const [expanded, setExpanded] = useState("panel0");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // FAQ data - Psychological: Address objections proactively
  const faqs = [
    {
      question: "How long does it take to set up ND Health?",
      answer:
        "Most clinics are up and running in under 5 minutes. Simply sign up, install our browser extension, and configure your preferences. Our setup wizard guides you through each step, and our support team is available 24/7 if you need any help.",
    },
    {
      question: "Is my patient data secure?",
      answer:
        "Absolutely. We use bank-level 256-bit SSL encryption for all data transmission and storage. We're fully HIPAA, PHIPA, and PIPEDA compliant. Our servers are located in Canadian data centers, and we undergo regular third-party security audits. Your patient data never leaves Canada.",
    },
    {
      question: "Do I need to commit to a long-term contract?",
      answer:
        "No contracts required. We offer month-to-month billing, and you can cancel anytime with no penalties. We also have a free forever plan so you can try our basic features before upgrading. We believe in earning your business every month.",
    },
    {
      question: "Will this work with my existing EMR system?",
      answer:
        "Yes! ND Health integrates seamlessly with most major EMR systems including OSCAR, Accuro, Telus PS Suite, and more. Our browser extension works alongside your EMR without requiring any changes to your current workflow. If you have a specific EMR, contact us to confirm compatibility.",
    },
    {
      question: "What if I need help or have technical issues?",
      answer:
        "We provide 24/7 support via phone, email, and live chat. Our average response time is under 2 minutes during business hours. We also offer free onboarding sessions, video tutorials, and comprehensive documentation. Most issues are resolved in a single interaction.",
    },
    {
      question: "How much does it cost?",
      answer:
        "We have a free forever plan for health card validation. Our Premium plan is $59/month per doctor (or $49/month if paid annually). This includes all features: online booking, secure messaging, billing optimization, and more. Enterprise plans with custom features are available for larger clinics. No hidden fees, ever.",
    },
    {
      question: "Can I try it before committing?",
      answer:
        "Yes! Start with our free plan to try health card validation. When you're ready, you can upgrade to Premium and cancel anytime. We also offer free demo sessions where we'll walk you through the platform and answer all your questions.",
    },
    {
      question: "Will my staff need training?",
      answer:
        "ND Health is designed to be intuitive. Most users are productive within the first day. We provide free training sessions, video tutorials, and written guides. Our interface follows familiar patterns, so if your staff can use a web browser, they can use ND Health.",
    },
    {
      question: "What happens to my data if I cancel?",
      answer:
        "You retain full ownership of your data. Before canceling, you can export all your information in standard formats (CSV, PDF). After cancellation, we keep your data for 90 days in case you want to return, then it's permanently deleted per your request. You're always in control.",
    },
    {
      question: "How do you handle system updates and maintenance?",
      answer:
        "Updates are automatic and seamless – you'll always have the latest features without any downtime. Scheduled maintenance happens during off-peak hours (typically 2-4 AM EST) and rarely lasts more than 30 minutes. We notify users in advance of any planned maintenance.",
    },
  ];

  return (
    <MKBox component="section" py={8} sx={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        {/* Section Header */}
        <MKBox textAlign="center" mb={6}>
          <MKTypography variant="h2" color="dark" fontWeight="bold" mb={2}>
            Frequently Asked Questions
          </MKTypography>
          <MKTypography
            variant="body1"
            color="text"
            sx={{ maxWidth: "700px", mx: "auto", fontSize: "1.1rem" }}
          >
            Got questions? We've got answers. Can't find what you're looking for?{" "}
            <MKTypography
              component="a"
              href="/contact"
              variant="body1"
              color="info"
              fontWeight="bold"
            >
              Contact us
            </MKTypography>
          </MKTypography>
        </MKBox>

        {/* FAQ Accordions */}
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={10}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  mb: 2,
                  boxShadow: 2,
                  "&:before": {
                    display: "none",
                  },
                  borderRadius: "8px !important",
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<Icon>expand_more</Icon>}
                  sx={{
                    backgroundColor:
                      expanded === `panel${index}` ? "info.main" : "white",
                    color: expanded === `panel${index}` ? "white" : "text.primary",
                    "&:hover": {
                      backgroundColor:
                        expanded === `panel${index}` ? "info.dark" : "grey.100",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <MKTypography
                    variant="h6"
                    fontWeight="bold"
                    color={expanded === `panel${index}` ? "white" : "dark"}
                  >
                    {faq.question}
                  </MKTypography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "white", p: 3 }}>
                  <MKTypography variant="body1" color="text">
                    {faq.answer}
                  </MKTypography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>

        {/* Still have questions CTA */}
        <MKBox textAlign="center" mt={6}>
          <MKBox
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              p: 4,
              boxShadow: 2,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <Icon sx={{ fontSize: "3rem", color: "info.main", mb: 2 }}>
              contact_support
            </Icon>
            <MKTypography variant="h5" color="dark" fontWeight="bold" mb={1}>
              Still Have Questions?
            </MKTypography>
            <MKTypography variant="body1" color="text" mb={2}>
              Our team is here to help. Chat with us, schedule a demo, or give us a call.
            </MKTypography>
            <MKBox display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <MKTypography
                component="a"
                href="/contact"
                variant="body2"
                color="info"
                fontWeight="bold"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Icon fontSize="small">chat</Icon>
                Live Chat
              </MKTypography>
              <MKTypography
                component="a"
                href="mailto:support@ndhealth.ca"
                variant="body2"
                color="info"
                fontWeight="bold"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Icon fontSize="small">email</Icon>
                Email Support
              </MKTypography>
              <MKTypography
                component="a"
                href="tel:+1234567890"
                variant="body2"
                color="info"
                fontWeight="bold"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Icon fontSize="small">phone</Icon>
                Call Us
              </MKTypography>
            </MKBox>
          </MKBox>
        </MKBox>
      </Container>
    </MKBox>
  );
}

export default FAQ;