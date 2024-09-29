const footerThreeCode = `// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import GitHubIcon from "@mui/icons-material/GitHub";

// Material Kit 2 PRO React examples
import CenteredFooter from "examples/Footers/CenteredFooter";

function FooterThress() {
  const company = { href: "#", name: "Creative Tim" };
  const links = [
    { href: "#", name: "Company" },
    { href: "#", name: "About Us" },
    { href: "#", name: "Team" },
    { href: "#", name: "Products" },
    { href: "#", name: "Blog" },
    { href: "https://www.creative-tim.com/license", name: "License" },
  ];
  const socials = [
    { icon: <FacebookIcon fontSize="small" />, link: "https://www.facebook.com/CreativeTim/" },
    {
      icon: <TwitterIcon fontSize="small" />,
      link: "https://twitter.com/creativetim",
    },
    {
      icon: <InstagramIcon fontSize="small" />,
      link: "https://www.instagram.com/creativetimofficial/",
    },
    {
      icon: <PinterestIcon fontSize="small" />,
      link: "https://ro.pinterest.com/thecreativetim/",
    },
    { icon: <GitHubIcon fontSize="small" />, link: "https://github.com/creativetimofficial" },
  ];

  return <CenteredFooter company={company} links={links} socials={socials} />;
}

export default FooterThress;`;

export default footerThreeCode;
