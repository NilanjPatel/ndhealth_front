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
import ClinicInfo from "nd_health/components/clinicInfo";
import FamilyAppointmentPage from "nd_health/components/FamilyAppointmentPage";
import WalkinAppointmentPage from "nd_health/components/WalkinAppointmentPage";
import ManageAppointment from "nd_health/components/ManageAppointment";
import EformOauth from "nd_health/components/clinic_to_patient/EformOauth";
import LinkedEformToPatient from "nd_health/components/clinic_to_patient/LinkedEformToPatient";
import DynamicForm from "nd_health/components/eforms/eformV2";
import RequestDemographic from "nd_health/components/RequestDemographic";
import UpdateProfileOauth from "nd_health/components/clinic_to_patient/UpdateProfileOauth";
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
        <Route path="/clinic/:clinicSlug/appointment" element={<ClinicInfo />} />
        <Route path="/family-appointment/:clinicSlug" element={<FamilyAppointmentPage />} />
        <Route path="/walkin-appointment/:clinicSlug" element={<WalkinAppointmentPage />} />
        <Route path="/clinic/:clinicSlug/manageappointment" element={<ManageAppointment />} />
        <Route path="/EformOauth/:clinicSlug/" element={<EformOauth />} />
        <Route path="/clinic-forms/:clinicSlug/" element={<LinkedEformToPatient />} />
        <Route path="/patient/:clinicSlug/eform" element={<DynamicForm />} />
        <Route path="/patient/:clinicSlug/requestpatientprofile" element={<RequestDemographic />} />
        <Route path="/clinic/:clinicSlug/UpdateProfileOauth" element={<UpdateProfileOauth />} />


        {/*<Route path="/clinic/:clinicSlug/policy" element={<ClinicPolicy />} />*/}
        {/*<Route path="/" element={<Home />} />*/}
        {/*<Route path="/:clinicSlug/terminal/:clinicUid/:clinic" element={<TerminalPage />} />*/}
        {/*<Route path="/clinic/:clinicSlug/home/" element={<ClinicDashboard />} />*/}
        {/*/!* patient related *!/*/}
        {/*<Route path="/demo" element={<DemoRequestForm />} />*/}
        {/*<Route path="/RecordOauth/:clinicSlug/" element={<RecordOauth />} />*/}
        {/*<Route path="/clinic/:clinicSlug/createEform" element={<DynamicFormBuilder />} />*/}
        {/*<Route path="/clinic/:clinicSlug/resetPassword" element={<PasswordReset />} />*/}
        {/*<Route path="OurPolicy" element={<DisplayPolicy />} />*/}
        {/*/!*<Route path='signup' element={<SignupForm/>}/>*!/*/}
        {/*<Route path="resetpassword/:uidb64/:token" element={<PasswordResetConfirm />} />*/}


      </Routes>
    </ThemeProvider>
  );
}
