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
// clinic dashboard
import ClinicDashboard from "nd_health/components/clinic/ClinicDashboard";
import { PasswordResetConfirm } from "nd_health/components/landing_contents/ResetPassword";
import PasswordReset from "nd_health/components/resources/ResetPassword";
import DemoRequestForm from "nd_health/components/landing_contents/DemoRequestForm";
import TerminalPage from "nd_health/components/TerminalPage";
import RecordOauth from "nd_health/components/clinic_to_patient/record";
import Error from "layouts/pages/error";

//policy
import DisplayPolicy from "nd_health/components/Policy/DisplayPolicy";
import ClinicPolicy from "nd_health/components/ClinicPolicy";

//eform
import DynamicFormBuilder from "nd_health/components/eforms/GenerateEform";


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
        <Route path="resetpassword/:uidb64/:token" element={<PasswordResetConfirm />} />
        <Route path="/clinic/:clinicSlug/resetPassword" element={<PasswordReset />} />
        <Route path="*" element={<Error />} />
        {/*//Clinic routs*/}
        <Route path="/clinic/:clinicSlug/" element={<ClinicLanding />} />
        <Route path="/clinic/:clinicSlug/appointment" element={<ClinicInfo />} />
        <Route path="/family-appointment/:clinicSlug" element={<FamilyAppointmentPage />} />
        <Route path="/walkin-appointment/:clinicSlug" element={<WalkinAppointmentPage />} />
        <Route path="/clinic/:clinicSlug/manageappointment" element={<ManageAppointment />} />
        <Route path="/EformOauth/:clinicSlug/" element={<EformOauth />} />
        <Route path="/RecordOauth/:clinicSlug/" element={<RecordOauth />} />
        <Route path="/clinic-forms/:clinicSlug/" element={<LinkedEformToPatient />} />
        <Route path="/patient/:clinicSlug/eform" element={<DynamicForm />} />
        <Route path="/patient/:clinicSlug/requestpatientprofile" element={<RequestDemographic />} />
        <Route path="/clinic/:clinicSlug/UpdateProfileOauth" element={<UpdateProfileOauth />} />
        <Route path="/demo" element={<DemoRequestForm />} />
        {/* clinic policy*/}
        <Route path="/clinic/:clinicSlug/policy" element={<ClinicPolicy />} />

        {/*clinic dashboard*/}
        <Route path="/clinic/:clinicSlug/home/" element={<ClinicDashboard />} />

        {/*  clinic terminal */}
        <Route path="/:clinicSlug/terminal/:clinicUid/:clinic" element={<TerminalPage />} />

        {/*  nd-health's policy*/}
        <Route path="OurPolicy" element={<DisplayPolicy />} />
        {/* eform */}
        <Route path="/clinic/:clinicSlug/createEform" element={<DynamicFormBuilder />} />


      </Routes>
    </ThemeProvider>
  );
}
