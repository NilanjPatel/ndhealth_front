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
    <MKBox component="section" pb={3}>
      <MKBox variant="gradient" bgColor="dark">
        <Container sx={{ pb: { xs: 12, lg: 22 }, pt: 12 }}>
          <Grid
            container
            item
            flexDirection="column"
            alignItems="center"
            xs={12}
            md={8}
            sx={{ mx: "auto", textAlign: "center" }}
          >
            <MKTypography variant="h3" color="white" mb={2}>
              See our pricing
            </MKTypography>
            <MKTypography variant="body2" color="white">
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
                  price={{ currency: "$", value: tabType === "annual" ? 0 : 0, type: "mo" }}
                  specifications={[
                    { label: "Health card validation", includes: true },
                    { label: "Online Appointment", includes: false },
                    { label: "Conformation and reminder Emails", includes: false },
                    { label: "Secure emails", includes: false },
                    { label: "Complete documentation", includes: false },
                  ]}
                  action={{
                    type: "internal",
                    route: "/",
                    color: "dark",
                    label: "join",
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <DefaultPricingCard
                  color="dark"
                  badge={{ color: "info", label: "premium" }}
                  price={{ currency: "$", value: tabType === "annual" ? 159 : 59, type: "mo per doctor" }}
                  specifications={[
                    { label: "10 team members", includes: true },
                    { label: "40GB Cloud storage", includes: true },
                    { label: "Integration help", includes: true },
                    { label: "Sketch Files", includes: true },
                    { label: "API Access", includes: false },
                    { label: "Complete documentation", includes: false },
                  ]}
                  action={{
                    type: "internal",
                    route: "/",
                    color: "info",
                    label: "try premium",
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <DefaultPricingCard
                  badge={{ color: "light", label: "enterprise" }}
                  price={{ currency: "$", value: tabType === "annual" ? 99 : 399, type: "mo" }}
                  specifications={[
                    { label: "Unlimited team members", includes: true },
                    { label: "100GB Cloud storage", includes: true },
                    { label: "Integration help", includes: true },
                    { label: "Sketch Files", includes: true },
                    { label: "API Access", includes: true },
                    { label: "Complete documentation", includes: true },
                  ]}
                  action={{
                    type: "internal",
                    route: "/",
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
