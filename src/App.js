/**
 =========================================================
 * Material Kit 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-kit-pro-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 PRO React themes
import theme from "assets/theme";
import Presentation from "layouts/pages/presentation";
import SignInBasic from "layouts/authentication/sign-in/basic/index";
import SignUpCover from "layouts/authentication/sign-up/cover/index";
// Material Kit 2 PRO React routes
import routes from "routes";
//clinic elements
import ClinicLanding from "nd_health/components/clinic/home/ClinicLanding";

export default function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {getRoutes(routes)}
        <Route path="/" element={<Presentation />} />
        <Route path="/login" element={<SignInBasic />} />
        <Route path="/join" element={<SignUpCover />} />
        <Route path="*" element={<Navigate to="/presentation" />} />
        {/*//Clinic routs*/}
        <Route path="/clinic/:clinicSlug/" element={<ClinicLanding />} />
      </Routes>
    </ThemeProvider>
  );
}
