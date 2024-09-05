// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
// import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";

// Images
import logoCT from "assets/images/logo-ct-dark.png";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "ND Health",
    image: logoCT,
    route: "/",
  },
  socials: [
    {
      icon: <FacebookIcon />,
      link: "https://www.facebook.com/profile.php?id=61555491107393",
    },
    {
      icon: <InstagramIcon />,
      link: "https://www.instagram.com/nd.health.ca/",
    },
  ],
  menus: [
    {
      name: "company",
      items: [
        { name: "about us", href: "https://www.nd-health.ca/presentation" },
        // { name: "freebies", href: "https://www.nd-health.ca/templates/free" },
        // { name: "premium tools", href: "https://www.nd-health.ca/templates/premium" },
        { name: "blog", href: "https://www.nd-health.ca/blog" },
      ],
    },
    {
      name: "services",
      items: [
        { name: "Appointment Booking", href: "https://iradesign.io/" },
        { name: "Secure communication", href: "https://www.creative-tim.com/bits" },
        { name: "Admin tasks", href: "https://www.creative-tim.com/affiliates/new" },
      ],
    },
    {
      name: "help & support",
      items: [
        { name: "contact us", href: "https://www.creative-tim.com/contact-us" },
        // { name: "knowledge center", href: "https://www.creative-tim.com/knowledge-center" },
        // { name: "custom development", href: "https://services.creative-tim.com/" },
        // { name: "sponsorships", href: "https://www.creative-tim.com/sponsorships" },
      ],
    },
    {
      name: "legal",
      items: [
        { name: "terms & conditions", href: "https://www.nd-health.ca/terms" },
        { name: "privacy policy", href: "https://www.nd-health.ca/privacy" },
        // { name: "licenses (EULA)", href: "https://www.creative-tim.com/license" },
      ],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      All rights reserved. Copyright &copy; {date} ND Health
      <MKTypography
        component="a"
        href="https://www.nd-health.ca"
        target="_blank"
        rel="noreferrer"
        variant="button"
        fontWeight="regular"
      ></MKTypography>
    </MKTypography>
  ),
};
