// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
// import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Kit 2 PRO React components
import MKTypography from "components/MKTypography";

// Images
// import logoCT from "nd_health/assets/images/nd-health-logo.png";
import logoCT from "nd_health/assets/images/logo.png";

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
        { name: "about us", href: "#" },
        // { name: "freebies", href: "https://www.nd-health.ca/templates/free" },
        // { name: "premium tools", href: "https://www.nd-health.ca/templates/premium" },
        { name: "blog", href: "#" },
      ],
    },
    {
      name: "services",
      items: [
        { name: "Appointment Booking", href: "#" },
        { name: "Secure communication", href: "#" },
        { name: "Admin tasks", href: "#" },
      ],
    },
    {
      name: "help & support",
      items: [
        { name: "contact us", href: "#" },
        // { name: "knowledge center", href: "#" },
        // { name: "custom development", href: "#" },
        // { name: "sponsorships", href: "#" },
      ],
    },
    {
      name: "legal",
      items: [
        { name: "terms & conditions", href: "#" },
        { name: "privacy policy", href: "/OurPolicy" },
        // { name: "licenses (EULA)", href: "#" },
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
