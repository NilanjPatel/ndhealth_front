// Enhanced Professional Footer Component
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";

// @mui material components
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Assets
import logoCT from "nd_health/assets/images/ND(1).png";

function CenteredFooter({ company, links, socials, light }) {
  const { href, name } = company;
  const year = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3000);
  };

  // Comprehensive footer links structure
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Demo", href: "/demo" },
        { name: "Chrome Extension", href: "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem" },
        { name: "Firefox Add-on", href: "https://addons.mozilla.org/en-CA/firefox/addon/nd-health/" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Press Kit", href: "#press" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Documentation", href: "#docs" },
        { name: "API Reference", href: "#api" },
        { name: "System Status", href: "#status" },
        { name: "Release Notes", href: "#releases" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/OurPolicy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "HIPAA Compliance", href: "#hipaa" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "Acceptable Use", href: "#acceptable-use" },
      ],
    },
  ];

  // Trust badges data
  const trustBadges = [
    { icon: "verified_user", text: "HIPAA Compliant" },
    { icon: "https", text: "SSL Secure" },
    { icon: "update", text: "Regular Updates" },
    { icon: "support_agent", text: "24/7 Support" },
  ];

  return (
    <MKBox
      component="footer"
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Main Footer Content */}
      <MKBox py={8}>
        <Grid container spacing={4} sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 3, lg: 6 } }}>
          {/* Left Column - Brand & Newsletter */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <MKBox sx={{ mb: 3 }}>
                <img
                  src={logoCT}
                  alt="ND Health"
                  style={{
                    height: "50px",
                    marginBottom: "16px",
                  }}
                />
                <MKTypography variant="body2" color="text" sx={{ mb: 2, lineHeight: 1.8 }}>
                  We innovate & integrate, you save.
                </MKTypography>
              </MKBox>

              {/* Newsletter Signup */}
              <MKBox sx={{ mb: 3 }}>
                <MKTypography variant="h6" color="dark" fontWeight="bold" mb={2}>
                  Stay Updated
                </MKTypography>
                <MKTypography variant="caption" color="text" display="block" mb={2}>
                  Get healthcare technology insights delivered to your inbox
                </MKTypography>

                {!subscribed ? (
                  <form onSubmit={handleSubscribe}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "white",
                          },
                        }}
                      />
                      <MKButton
                        type="submit"
                        variant="gradient"
                        color="info"
                        size="small"
                        sx={{ minWidth: "100px", borderRadius: "8px" }}
                      >
                        Subscribe
                      </MKButton>
                    </Stack>
                  </form>
                ) : (
                  <MKBox
                    sx={{
                      p: 2,
                      borderRadius: "8px",
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      border: "1px solid rgba(76, 175, 80, 0.3)",
                    }}
                  >
                    <MKTypography variant="body2" color="success" fontWeight="medium">
                      ✓ Thanks for subscribing!
                    </MKTypography>
                  </MKBox>
                )}
              </MKBox>

              {/* Social Media */}
              <MKBox>
                <MKTypography variant="h6" color="dark" fontWeight="bold" mb={2}>
                  Follow Us
                </MKTypography>
                <Stack direction="row" spacing={2}>
                  {[
                    { icon: <FacebookIcon />, link: "https://www.facebook.com/profile.php?id=61555491107393", color: "#1877f2" },
                    { icon: <InstagramIcon />, link: "https://www.instagram.com/nd.health.ca/", color: "#e4405f" },
                    { icon: <LinkedInIcon />, link: "#", color: "#0077b5" },
                    { icon: <TwitterIcon />, link: "#", color: "#1da1f2" },
                  ].map((social, index) => (
                    <MKBox
                      key={index}
                      component={Link}
                      href={social.link}
                      target="_blank"
                      sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: social.color,
                          borderColor: social.color,
                          transform: "translateY(-3px)",
                          boxShadow: `0 8px 20px ${social.color}40`,
                          "& svg": {
                            color: "white !important",
                          },
                        },
                        "& svg": {
                          color: social.color,
                          transition: "color 0.3s ease",
                        },
                      }}
                    >
                      {social.icon}
                    </MKBox>
                  ))}
                </Stack>
              </MKBox>
            </motion.div>
          </Grid>

          {/* Right Columns - Links */}
          {footerSections.map((section, sectionIndex) => (
            <Grid item xs={6} sm={6} lg={2} key={sectionIndex}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <MKTypography
                  variant="h6"
                  color="dark"
                  fontWeight="bold"
                  mb={2}
                  sx={{ fontSize: "1rem" }}
                >
                  {section.title}
                </MKTypography>
                <Stack spacing={1.5}>
                  {section.links.map((link, linkIndex) => (
                    <MKTypography
                      key={linkIndex}
                      component={Link}
                      href={link.href}
                      variant="body2"
                      color="text"
                      sx={{
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          color: "info.main",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      {link.name}
                    </MKTypography>
                  ))}
                </Stack>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </MKBox>

      {/* Divider */}
      <Divider />

      {/* Bottom Bar */}
      <MKBox py={4}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 3, lg: 6 } }}
        >
          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <MKBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                <MKTypography
                  component={Link}
                  href="mailto:support@ndhealth.ca"
                  variant="caption"
                  color="text"
                  sx={{ textDecoration: "none", "&:hover": { color: "info.main" } }}
                >
                  support@ndhealth.ca
                </MKTypography>
              </MKBox>
              <MKBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                <MKTypography variant="caption" color="text">
                  1-800-ND-HEALTH
                </MKTypography>
              </MKBox>
              <MKBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                <MKTypography variant="caption" color="text">
                  Toronto, ON, Canada
                </MKTypography>
              </MKBox>
            </Stack>
          </Grid>

          {/* Trust Badges */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              useFlexGap
            >
              {trustBadges.map((badge, index) => (
                <MKBox
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "20px",
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                  }}
                >
                  <Icon sx={{ fontSize: "1rem", color: "info.main" }}>{badge.icon}</Icon>
                  <MKTypography variant="caption" color="dark" fontWeight="medium">
                    {badge.text}
                  </MKTypography>
                </MKBox>
              ))}
            </Stack>
          </Grid>

          {/* Copyright */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "right" } }}>
            <MKTypography variant="caption" color="text">
              © {year}{" "}
              <MKTypography
                component={Link}
                href={href}
                variant="caption"
                color="dark"
                fontWeight="medium"
                sx={{ textDecoration: "none", "&:hover": { color: "info.main" } }}
              >
                {name}
              </MKTypography>
              . All rights reserved.
            </MKTypography>
          </Grid>
        </Grid>
      </MKBox>

      {/* Back to Top Button */}
      <MKBox
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 999,
          display: { xs: "none", md: "block" },
        }}
      >
        <MKButton
          variant="gradient"
          color="dark"
          circular
          iconOnly
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            width: "48px",
            height: "48px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
            },
          }}
        >
          <Icon>arrow_upward</Icon>
        </MKButton>
      </MKBox>
    </MKBox>
  );
}

// Setting default values for the props of CenteredFooter
CenteredFooter.defaultProps = {
  company: { href: "#", name: "ND Health" },
  links: [],
  socials: [],
  light: false,
};

// Typechecking props for the CenteredFooter
CenteredFooter.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  socials: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])),
  light: PropTypes.bool,
};

export default CenteredFooter;
