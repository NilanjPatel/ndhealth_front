// Pricing FAQ Component
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Icon from "@mui/material/Icon";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function PricingFAQ() {
  const [expanded, setExpanded] = useState("panel0");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you'll be prorated for the remaining days in your billing cycle. When you downgrade, the change will take effect at the start of your next billing cycle, and you'll keep your current features until then.",
      icon: "swap_horiz",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and ACH bank transfers for annual plans. All payments are processed securely through our PCI-compliant payment processor. We do not store your payment information on our servers.",
      icon: "payment",
    },
    {
      question: "Is there a setup fee or long-term contract?",
      answer:
        "No! There are absolutely no setup fees, hidden charges, or long-term contracts. You can cancel anytime with no penalties. We believe in earning your business every month through excellent service, not by locking you into contracts.",
      icon: "cancel",
    },
    {
      question: "What happens if I exceed my patient limit on the Starter plan?",
      answer:
        "If you exceed 50 patients per month on the Starter plan, we'll notify you and give you the option to upgrade to Premium for unlimited patients. Your service will continue uninterrupted while you make your decision. We'll never cut off your access without warning.",
      icon: "people",
    },
    {
      question: "Do you offer discounts for multiple doctors or large clinics?",
      answer:
        "Yes! For clinics with 5+ doctors, we offer volume discounts up to 30% off. Our Enterprise plan includes custom pricing based on your specific needs. Contact our sales team for a personalized quote and to discuss your requirements.",
      icon: "local_offer",
    },
    {
      question: "Is training included?",
      answer:
        "All paid plans include free comprehensive training and onboarding. We'll provide one-on-one training sessions, video tutorials, and detailed documentation. Premium customers get priority training scheduling, and Enterprise customers get dedicated onboarding specialists.",
      icon: "school",
    },
    {
      question: "What's your refund policy?",
      answer:
        "We offer a 30-day money-back guarantee on all paid plans. If you're not completely satisfied within the first 30 days, we'll refund 100% of your payment, no questions asked. We want you to be confident in your investment.",
      icon: "money_back",
    },
    {
      question: "Can I try Premium features before committing?",
      answer:
        "Absolutely! All Premium features are included in your 30-day free trial. You can explore everything without entering a credit card. After the trial, you can choose to continue with Premium, downgrade to Starter (free), or cancel—no strings attached.",
      icon: "preview",
    },
    {
      question: "What kind of support is included?",
      answer:
        "Starter plan includes email support during business hours. Premium includes 24/7 priority support via email, phone, and live chat with typical response times under 1 hour. Enterprise includes a dedicated account manager, custom SLA, and direct access to our engineering team.",
      icon: "support_agent",
    },
    {
      question: "Are there any limits on features I can use?",
      answer:
        "Each plan has clearly defined features. Starter has a 50 patient/month limit and basic features. Premium has unlimited patients and full access to all standard features. Enterprise includes everything in Premium plus custom features, integrations, and white-labeling. No hidden limits or throttling.",
      icon: "done_all",
    },
    {
      question: "How does billing work for annual plans?",
      answer:
        "Annual plans are billed once per year in advance, giving you 2 months free compared to monthly billing (17% savings). If you cancel mid-year, we'll prorate your refund for unused months. You'll receive a receipt and invoice for tax purposes.",
      icon: "calendar_today",
    },
    {
      question: "Is my data safe and backed up?",
      answer:
        "Yes! All plans include HIPAA-compliant data encryption (SSL/TLS), daily automated backups (Premium: hourly, Enterprise: real-time), and secure data centers with 99.9% uptime. We maintain multiple redundant backups and can restore your data within 1 hour if needed.",
      icon: "security",
    },
  ];

  return (
    <MKBox component="section" py={12} sx={{ position: "relative" }}>
      <Container>
        {/* Header */}
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
              Frequently Asked Questions
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
              Everything you need to know about our pricing and plans
            </MKTypography>
          </MKBox>
        </motion.div>

        <Grid container spacing={4}>
          {/* Left Column - First 6 FAQs */}
          <Grid item xs={12} md={6}>
            {faqs.slice(0, 6).map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Accordion
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                  sx={{
                    mb: 2,
                    borderRadius: "10px !important",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    "&:before": {
                      display: "none",
                    },
                    "&.Mui-expanded": {
                      boxShadow: "0 8px 30px rgba(102, 126, 234, 0.15)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Icon sx={{ color: "#667eea" }}>
                        {expanded === `panel${index}` ? "remove" : "add"}
                      </Icon>
                    }
                    sx={{
                      py: 2,
                      px: 3,
                      minHeight: "70px",
                      "&.Mui-expanded": {
                        minHeight: "70px",
                      },
                    }}
                  >
                    <MKBox sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                      <Icon
                        sx={{
                          color: "#667eea",
                          fontSize: "1.5rem",
                        }}
                      >
                        {faq.icon}
                      </Icon>
                      <MKTypography variant="h6" color="dark" fontWeight="bold">
                        {faq.question}
                      </MKTypography>
                    </MKBox>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <MKTypography
                      variant="body2"
                      color="text"
                      sx={{
                        lineHeight: "1.8",
                        fontSize: "1rem",
                        pl: 5,
                      }}
                    >
                      {faq.answer}
                    </MKTypography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Grid>

          {/* Right Column - Last 6 FAQs */}
          <Grid item xs={12} md={6}>
            {faqs.slice(6, 12).map((faq, index) => (
              <motion.div
                key={index + 6}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Accordion
                  expanded={expanded === `panel${index + 6}`}
                  onChange={handleChange(`panel${index + 6}`)}
                  sx={{
                    mb: 2,
                    borderRadius: "10px !important",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    "&:before": {
                      display: "none",
                    },
                    "&.Mui-expanded": {
                      boxShadow: "0 8px 30px rgba(102, 126, 234, 0.15)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Icon sx={{ color: "#667eea" }}>
                        {expanded === `panel${index + 6}` ? "remove" : "add"}
                      </Icon>
                    }
                    sx={{
                      py: 2,
                      px: 3,
                      minHeight: "70px",
                      "&.Mui-expanded": {
                        minHeight: "70px",
                      },
                    }}
                  >
                    <MKBox sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                      <Icon
                        sx={{
                          color: "#667eea",
                          fontSize: "1.5rem",
                        }}
                      >
                        {faq.icon}
                      </Icon>
                      <MKTypography variant="h6" color="dark" fontWeight="bold">
                        {faq.question}
                      </MKTypography>
                    </MKBox>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <MKTypography
                      variant="body2"
                      color="text"
                      sx={{
                        lineHeight: "1.8",
                        fontSize: "1rem",
                        pl: 5,
                      }}
                    >
                      {faq.answer}
                    </MKTypography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Grid>
        </Grid>

        {/* Bottom CTA Section */}
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
            }}
          >
            <Icon
              sx={{
                fontSize: "3rem",
                color: "white",
                mb: 2,
              }}
            >
              help_outline
            </Icon>
            <MKTypography variant="h3" color="white" fontWeight="bold" mb={2}>
              Still Have Questions?
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              opacity={0.9}
              mb={4}
              sx={{ fontSize: "1.1rem", maxWidth: "600px", mx: "auto" }}
            >
              Our team is here to help! Schedule a call with us or send an email, and we'll get back to you within 1 hour.
            </MKTypography>
            <MKBox sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <MKButton
                variant="contained"
                color="white"
                size="large"
                href="/demo"
                sx={{
                  px: 5,
                  py: 1.5,
                  color: "#667eea",
                  fontWeight: "bold",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Schedule a Call
              </MKButton>
              <MKButton
                variant="outlined"
                color="white"
                size="large"
                href="mailto:support@ndhealth.ca"
                sx={{
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  borderWidth: "2px",
                  "&:hover": {
                    borderWidth: "2px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Email Us
              </MKButton>
            </MKBox>

            {/* Trust indicators */}
            <MKBox
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                mt: 4,
                flexWrap: "wrap",
              }}
            >
              <MKTypography variant="caption" color="white" opacity={0.9}>
                <Icon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "middle" }}>schedule</Icon>
                Response within 1 hour
              </MKTypography>
              <MKTypography variant="caption" color="white" opacity={0.9}>
                <Icon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "middle" }}>phone</Icon>
                Available 24/7
              </MKTypography>
              <MKTypography variant="caption" color="white" opacity={0.9}>
                <Icon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: "middle" }}>verified</Icon>
                Expert guidance
              </MKTypography>
            </MKBox>
          </MKBox>
        </motion.div>
      </Container>
    </MKBox>
  );
}

export default PricingFAQ;
