//layouts/sections/page-sections/pricing/components/PricingOne/index
/*
=========================================================
* Material Kit 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 PRO React examples
import DefaultPricingCard from "examples/Cards/PricingCards/DefaultPricingCard";

function PricingOne() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabType, setTabType] = useState("monthly");

  const handleTabType = ({ currentTarget }, newValue) => {
    setActiveTab(newValue);
    setTabType(currentTarget.id);
  };

  return (
    <MKBox component="section" sx={{ pb: { xs: 1, lg: 3 } }}>
      <MKBox variant="gradient" bgColor="dark">
        <Container sx={{ pb: { xs: 17, lg: 22 }, pt: 12 }}>
          <Grid
            container
            item
            flexDirection="column"
            alignItems="center"
            xs={12}
            md={8}
            sx={{ mx: "auto", textAlign: "center" }}
          >
            <MKTypography variant="h3" color="white" mb={2} sx={({ breakpoints, typography: { size } }) => ({
              fontWeight: "bold",
              fontSize: size["4xl"],
              [breakpoints.down("xl")]: {
                fontSize: size["3xl"],
              },
              [breakpoints.down("lg")]: { fontSize: size["2xl"] },
              [breakpoints.down("md")]: { fontSize: size["xl"] },
              [breakpoints.down("sm")]: { fontSize: size["0.81rem"] },
              [breakpoints.down("xs")]: { fontSize: size["0.81rem"] },
            })}
            >
              See our pricing
            </MKTypography>
            <MKTypography variant="body2" color="white" sx={({ breakpoints, typography: { size } }) => ({
              // fontWeight: "500",
              // fontSize: size["3xl"],
              [breakpoints.down("md")]: { fontSize: size["0.1rem"] },
              [breakpoints.down("xs")]: { fontSize: size["0.1rem"] },
              [breakpoints.down("sm")]: { fontSize: size["0.1rem"] },
              [breakpoints.down("lg")]: { fontSize: size["1rem"] },
            })}>
              We offer customization options as well.
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <MKBox mt={-16}>
        <Container>
          <Grid container sx={{ mb: 6 }}>
            <Grid item xs={7} md={6} lg={4} sx={{ mx: "auto", textAlign: "center" }}>
              <AppBar position="static">
                <Tabs value={activeTab} onChange={handleTabType}>
                  <Tab
                    id="monthly"
                    label={
                      <MKBox py={0.5} px={2} color="inherit">
                        Monthly
                      </MKBox>
                    }
                  />
                  <Tab
                    id="annual"
                    label={
                      <MKBox py={0.5} px={2} color="inherit">
                        Annual
                      </MKBox>
                    }
                  />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
          <MKBox position="relative" zIndex={10} px={{ xs: 1, sm: 0 }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} lg={4}>
                <DefaultPricingCard
                  badge={{ color: "light", label: "starter" }}
                  price={{ currency: "$", value: tabType === "annual" ? 0 : 0, type: "/mo" }}
                  specifications={[
                    { label: "Health card validation", includes: true },
                    { label: "Keyboard Shortcuts", includes: false },
                    { label: "Online Appointment", includes: false },
                    { label: "Conformation and reminder Emails", includes: false },
                    { label: "Secure emails", includes: false },
                    // { label: "Complete documentation", includes: false },
                  ]}
                  action={{
                    type: "internal",
                    route: "/join",
                    color: "dark",
                    label: "Join",
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <DefaultPricingCard
                  color="dark"
                  badge={{ color: "info", label: "premium" }}
                  price={{
                    currency: "$",
                    value: tabType === "annual" ? 49 : 59,
                    type: "mo per doctor",
                  }}
                  specifications={[
                    { label: "Health card validation", includes: true },
                    { label: "Keyboard Shortcuts", includes: true },
                    { label: "Online Appointment", includes: true },
                    { label: "Conformation and reminder Emails", includes: true },
                    { label: "Secure emails", includes: true },
                    // { label: "Complete documentation", includes: true },
                  ]}
                  action={{
                    type: "internal",
                    route: "/join",
                    color: "info",
                    label: "try premium",
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <DefaultPricingCard
                  badge={{ color: "light", label: "enterprise" }}
                  price={{ currency: "", value: tabType === "annual" ? "" : "", type: "Contact us for price" }}
                  specifications={[
                    { label: "All the premium features", includes: true },
                    // {label: "Keyboard Shortcuts", includes: true},
                    // {label: "Online Appointment", includes: true},
                    // {label: "Conformation and reminder Emails", includes: true},
                    // {label: "Secure emails", includes: true},
                    // {label: "Complete documentation", includes: true},
                    { label: "Customization options", includes: true },
                    { label: "Dedicated Server", includes: true },
                    { label: "Domain of your choice*", includes: true },
                  ]}
                  action={{
                    type: "internal",
                    route: "/join",
                    color: "dark",
                    label: "join",
                  }}
                />
              </Grid>
            </Grid>
          </MKBox>
        </Container>
      </MKBox>
    </MKBox>
  );
}

export default PricingOne;
