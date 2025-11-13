// Enhanced Professional Pricing Component
// layouts/sections/page-sections/pricing/components/PricingOne/index.js

import { useState } from "react";
import { motion } from "framer-motion";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function PricingOne() {
  const [billingCycle, setBillingCycle] = useState("annual"); // Default to annual to show savings

  const handleBillingToggle = () => {
    setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly");
  };

  // Pricing data with comprehensive features
  const pricingPlans = [
    {
      name: "Starter",
      subtitle: "Perfect for solo practitioners",
      badge: null,
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Get started with essential features for free",
      features: [
        { text: "Health Card Validation", included: true, highlight: true },
        { text: "Basic Patient Management", included: true },
        { text: "Up to 50 patients/month", included: true },
        { text: "Email Support", included: true },
        { text: "Keyboard Shortcuts", included: false },
        { text: "Online Appointments", included: false },
        { text: "Automated Reminders", included: false },
        { text: "Secure Messaging", included: false },
      ],
      cta: {
        text: "Start Free",
        color: "dark",
        variant: "outlined",
      },
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      popular: false,
    },
    {
      name: "Premium",
      subtitle: "Most popular for growing clinics",
      badge: { text: "MOST POPULAR", color: "success" },
      monthlyPrice: 59,
      annualPrice: 49,
      description: "Everything you need to run a modern clinic",
      features: [
        { text: "Everything in Starter, plus:", included: true, highlight: true },
        { text: "Unlimited Patients", included: true },
        { text: "Online Appointment Booking", included: true, highlight: true },
        { text: "Automated SMS & Email Reminders", included: true, highlight: true },
        { text: "Secure Patient Messaging", included: true },
        { text: "Advanced Keyboard Shortcuts", included: true },
        { text: "Billing Code Suggestions", included: true, highlight: true },
        { text: "Priority Support (24/7)", included: true },
        { text: "Free Training & Onboarding", included: true },
        { text: "Mobile App Access", included: true },
      ],
      cta: {
        text: "Start 30-Day Trial",
        color: "success",
        variant: "gradient",
      },
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      popular: true,
      savings: "Save $120/year",
    },
    {
      name: "Enterprise",
      subtitle: "For large clinics & hospitals",
      badge: null,
      monthlyPrice: null,
      annualPrice: null,
      description: "Custom solutions for your organization",
      features: [
        { text: "Everything in Premium, plus:", included: true, highlight: true },
        { text: "Custom Integrations", included: true },
        { text: "Dedicated Server", included: true },
        { text: "Custom Domain", included: true },
        { text: "White-label Options", included: true },
        { text: "Advanced Analytics", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Custom Training Programs", included: true },
        { text: "99.9% Uptime SLA", included: true },
        { text: "HIPAA Compliance Certification", included: true },
      ],
      cta: {
        text: "Contact Sales",
        color: "info",
        variant: "gradient",
      },
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      popular: false,
    },
  ];

  // Calculate savings percentage
  const calculateSavings = (monthly, annual) => {
    if (!monthly || !annual) return 0;
    const monthlyCost = monthly * 12;
    const annualCost = annual * 12;
    return Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
  };

  return (
    <MKBox component="section" py={12} sx={{ position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <MKBox
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
          zIndex: 0,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox textAlign="center" mb={6}>
            {/* Pre-headline */}
            <MKTypography
              variant="overline"
              color="success"
              fontWeight="bold"
              sx={{ fontSize: "1rem", letterSpacing: "2px" }}
            >
              PRICING PLANS
            </MKTypography>

            {/* Main headline */}
            <MKTypography
              variant="h2"
              color="dark"
              fontWeight="bold"
              mb={2}
              sx={{
                fontSize: "3rem",
                mt: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Simple, Transparent Pricing
            </MKTypography>

            {/* Subheadline */}
            <MKTypography
              variant="body1"
              color="text"
              sx={{
                maxWidth: "700px",
                mx: "auto",
                fontSize: "1.2rem",
                lineHeight: "1.8",
                mb: 4,
              }}
            >
              Choose the perfect plan for your practice. Start free, upgrade anytime, cancel anytime.
            </MKTypography>

            {/* Billing Toggle with Savings Badge */}
            <MKBox
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                p: 2,
                borderRadius: "50px",
                backgroundColor: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                maxWidth: "400px",
                mx: "auto",
              }}
            >
              <MKTypography
                variant="body1"
                fontWeight={billingCycle === "monthly" ? "bold" : "regular"}
                color={billingCycle === "monthly" ? "dark" : "text"}
              >
                Monthly
              </MKTypography>

              <Switch
                checked={billingCycle === "annual"}
                onChange={handleBillingToggle}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#38ef7d",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#38ef7d",
                  },
                }}
              />

              <MKTypography
                variant="body1"
                fontWeight={billingCycle === "annual" ? "bold" : "regular"}
                color={billingCycle === "annual" ? "dark" : "text"}
              >
                Annual
              </MKTypography>

              {billingCycle === "annual" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Chip
                    label="Save 17%"
                    size="small"
                    sx={{
                      background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    }}
                  />
                </motion.div>
              )}
            </MKBox>

            {/* Trust indicators */}
            <MKBox sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3, flexWrap: "wrap" }}>
              <MKTypography variant="caption" color="text" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Icon sx={{ color: "success.main" }}>check_circle</Icon>
                30-day money-back guarantee
              </MKTypography>
              <MKTypography variant="caption" color="text" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Icon sx={{ color: "success.main" }}>check_circle</Icon>
                No credit card required
              </MKTypography>
              <MKTypography variant="caption" color="text" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Icon sx={{ color: "success.main" }}>check_circle</Icon>
                Cancel anytime
              </MKTypography>
            </MKBox>
          </MKBox>
        </motion.div>

        {/* Pricing Cards */}
        <Grid container spacing={4} alignItems="stretch">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ height: "100%" }}
              >
                <MKBox
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: 4,
                    borderRadius: "20px",
                    background: plan.popular
                      ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                      : "white",
                    color: plan.popular ? "white" : "dark",
                    boxShadow: plan.popular
                      ? "0 20px 60px rgba(17, 153, 142, 0.3)"
                      : "0 10px 40px rgba(0,0,0,0.08)",
                    border: plan.popular ? "none" : "2px solid #f0f0f0",
                    transform: plan.popular ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: plan.popular ? "scale(1.07)" : "scale(1.03)",
                      boxShadow: plan.popular
                        ? "0 25px 70px rgba(17, 153, 142, 0.4)"
                        : "0 15px 50px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Popular Badge */}
                  {plan.badge && (
                    <MKBox
                      sx={{
                        position: "absolute",
                        top: -15,
                        left: "50%",
                        transform: "translateX(-50%)",
                        px: 3,
                        py: 1,
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                        boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
                      }}
                    >
                      <MKTypography variant="caption" color="white" fontWeight="bold">
                        {plan.badge.text}
                      </MKTypography>
                    </MKBox>
                  )}

                  {/* Plan Name */}
                  <MKTypography
                    variant="h4"
                    fontWeight="bold"
                    mb={1}
                    color={plan.popular ? "white" : "dark"}
                    sx={{ mt: plan.badge ? 2 : 0 }}
                  >
                    {plan.name}
                  </MKTypography>

                  {/* Subtitle */}
                  <MKTypography
                    variant="body2"
                    mb={3}
                    color={plan.popular ? "white" : "text"}
                    opacity={plan.popular ? 0.9 : 0.8}
                  >
                    {plan.subtitle}
                  </MKTypography>

                  {/* Price */}
                  <MKBox sx={{ mb: 3 }}>
                    {plan.monthlyPrice !== null ? (
                      <>
                        <MKBox sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                          <MKTypography
                            variant="h1"
                            fontWeight="bold"
                            color={plan.popular ? "white" : "dark"}
                            sx={{ fontSize: "3.5rem", lineHeight: 1 }}
                          >
                            ${billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                          </MKTypography>
                          <MKTypography
                            variant="body1"
                            color={plan.popular ? "white" : "text"}
                            opacity={0.8}
                          >
                            /mo per doctor
                          </MKTypography>
                        </MKBox>

                        {billingCycle === "annual" && plan.annualPrice !== 0 && (
                          <MKTypography
                            variant="caption"
                            color={plan.popular ? "white" : "success"}
                            fontWeight="bold"
                            sx={{ display: "block", mt: 1 }}
                          >
                            💰 Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                          </MKTypography>
                        )}

                        {billingCycle === "annual" && plan.annualPrice !== 0 && (
                          <MKTypography
                            variant="caption"
                            color={plan.popular ? "white" : "text"}
                            opacity={0.7}
                            sx={{ display: "block" }}
                          >
                            Billed annually as ${plan.annualPrice * 12}
                          </MKTypography>
                        )}
                      </>
                    ) : (
                      <MKTypography
                        variant="h4"
                        fontWeight="bold"
                        color={plan.popular ? "white" : "dark"}
                      >
                        Custom Pricing
                      </MKTypography>
                    )}
                  </MKBox>

                  {/* Description */}
                  <MKTypography
                    variant="body2"
                    color={plan.popular ? "white" : "text"}
                    mb={3}
                    opacity={plan.popular ? 0.9 : 0.8}
                  >
                    {plan.description}
                  </MKTypography>

                  {/* CTA Button */}
                  <MKButton
                    variant={plan.popular ? "contained" : plan.cta.variant}
                    color={plan.popular ? "white" : plan.cta.color}
                    size="large"
                    fullWidth
                    href="/join"
                    sx={{
                      mb: 3,
                      py: 1.5,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      ...(plan.popular && {
                        color: "#11998e",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.9)",
                        },
                      }),
                    }}
                  >
                    {plan.cta.text}
                  </MKButton>

                  {/* Features List */}
                  <MKBox component="ul" sx={{ pl: 0, listStyle: "none", flex: 1 }}>
                    {plan.features.map((feature, idx) => (
                      <MKBox
                        component="li"
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Icon
                          sx={{
                            color: feature.included
                              ? plan.popular
                                ? "white"
                                : "success.main"
                              : plan.popular
                              ? "rgba(255,255,255,0.3)"
                              : "text.secondary",
                            mr: 1.5,
                            fontSize: "1.2rem",
                            mt: 0.2,
                          }}
                        >
                          {feature.included ? "check_circle" : "cancel"}
                        </Icon>
                        <MKTypography
                          variant="body2"
                          color={plan.popular ? "white" : feature.included ? "dark" : "text"}
                          fontWeight={feature.highlight ? "bold" : "regular"}
                          opacity={feature.included ? 1 : 0.5}
                          sx={{
                            textDecoration: feature.included ? "none" : "line-through",
                          }}
                        >
                          {feature.text}
                        </MKTypography>
                      </MKBox>
                    ))}
                  </MKBox>
                </MKBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Trust Section */}
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
              background: "white",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <MKTypography variant="h4" color="dark" fontWeight="bold" mb={3}>
              All Plans Include
            </MKTypography>

            <Grid container spacing={3} justifyContent="center">
              {[
                { icon: "security", text: "HIPAA Compliant", color: "info" },
                { icon: "cloud_done", text: "99.9% Uptime SLA", color: "success" },
                { icon: "support_agent", text: "24/7 Support", color: "warning" },
                { icon: "verified_user", text: "SSL Encryption", color: "primary" },
                { icon: "update", text: "Free Updates", color: "info" },
                { icon: "school", text: "Free Training", color: "success" },
              ].map((item, index) => (
                <Grid item xs={6} md={2} key={index}>
                  <MKBox sx={{ textAlign: "center" }}>
                    <Icon
                      sx={{
                        fontSize: "2.5rem",
                        color: `${item.color}.main`,
                        mb: 1,
                      }}
                    >
                      {item.icon}
                    </Icon>
                    <MKTypography variant="caption" color="text" display="block" fontWeight="medium">
                      {item.text}
                    </MKTypography>
                  </MKBox>
                </Grid>
              ))}
            </Grid>
          </MKBox>
        </motion.div>

        {/* ROI Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <MKBox
            sx={{
              mt: 6,
              p: 6,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textAlign: "center",
            }}
          >
            <MKTypography variant="h3" color="white" fontWeight="bold" mb={2}>
              See Your ROI in Action
            </MKTypography>
            <MKTypography variant="body1" color="white" opacity={0.9} mb={4} sx={{ fontSize: "1.1rem" }}>
              Our average customer saves 10+ hours per month and increases revenue by 25%
            </MKTypography>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={6} md={3}>
                <MKTypography variant="h2" color="white" fontWeight="bold">
                  10+
                </MKTypography>
                <MKTypography variant="body2" color="white" opacity={0.9}>
                  Hours Saved Monthly
                </MKTypography>
              </Grid>
              <Grid item xs={6} md={3}>
                <MKTypography variant="h2" color="white" fontWeight="bold">
                  25%
                </MKTypography>
                <MKTypography variant="body2" color="white" opacity={0.9}>
                  Revenue Increase
                </MKTypography>
              </Grid>
              <Grid item xs={6} md={3}>
                <MKTypography variant="h2" color="white" fontWeight="bold">
                  40%
                </MKTypography>
                <MKTypography variant="body2" color="white" opacity={0.9}>
                  Fewer No-Shows
                </MKTypography>
              </Grid>
              <Grid item xs={6} md={3}>
                <MKTypography variant="h2" color="white" fontWeight="bold">
                  95%
                </MKTypography>
                <MKTypography variant="body2" color="white" opacity={0.9}>
                  Billing Accuracy
                </MKTypography>
              </Grid>
            </Grid>

            <MKButton
              variant="contained"
              color="white"
              size="large"
              href="/demo"
              sx={{
                mt: 4,
                px: 5,
                py: 1.5,
                color: "#667eea",
                fontWeight: "bold",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              Calculate Your Savings
            </MKButton>
          </MKBox>
        </motion.div>
      </Container>
    </MKBox>
  );
}

export default PricingOne;
