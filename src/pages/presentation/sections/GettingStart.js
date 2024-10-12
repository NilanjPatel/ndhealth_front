import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
// import RotatingCard from "examples/Cards/RotatingCard";
// import RotatingCardFront from "examples/Cards/RotatingCard/RotatingCardFront";
// import RotatingCardBack from "examples/Cards/RotatingCard/RotatingCardBack";
// import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
// import bgFront from "assets/images/rotating-card-bg-front.jpeg";
// import bgBack from "assets/images/rotating-card-bg-back.jpeg";
import FilledInfoCard from "../../../examples/Cards/InfoCards/FilledInfoCard";
import { FaChrome, FaFirefox } from "react-icons/fa";

function GettingStart() {
  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={12} spacing={1} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
            <FilledInfoCard
                variant="gradient"
                color="info"
                icon="precision_manufacturing"
                title="Getting Started"
                description="After signup, Explore plugins designed to streamline healthcare processes and enhance patient care."
                // action={{
                //   type: "external",
                //   route: "#gettingstarted",
                //   label: "Explore Demo Now",
                // }}
              />
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
            <Grid container spacing={3} sx={{ mt: { xs: 3, md: 0 } }}>
              <Grid item xs={12} md={6}>
                <FilledInfoCard
                  color="info"
                  icon={<FaChrome />}
                  title="Chrome Extension"
                  description="Install our Chrome extension for quick access to our features directly from your browser."
                  action={{
                    type: "external",
                    route: "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem?hl=en-US&utm_source=ext_sidebar",
                    label: "Install Now",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FilledInfoCard
                  color="info"
                  icon={<FaFirefox />}
                  title="Firefox Add-on"
                  description="Get our Firefox add-on to enhance your workflow with seamless integration."
                  action={{
                    type: "external",
                    route: "https://addons.mozilla.org/en-CA/firefox/addon/nd-care-by-nd-health/",
                    label: "Install Now",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default GettingStart;


// <Container>
        //   <Grid container item xs={12} spacing={1} alignItems="center" sx={{ mx: "auto" }}>
        //     <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
        //       <FilledInfoCard
        //         variant="gradient"
        //         color="info"
        //         icon="precision_manufacturing"
        //         title="Getting Started"
        //         description="After signup, Explore plugins designed to streamline healthcare processes and enhance patient care."
        //         // action={{
        //         //   type: "external",
        //         //   route: "#gettingstarted",
        //         //   label: "Explore Demo Now",
        //         // }}
        //       />
        //     </Grid>
        //   </Grid>
        //   <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
        //     <Grid container spacing={3} sx={{ mt: { xs: 3, md: 0 } }}>
        //
        //       <Grid item xs={12} lg={4}>
        //         <FilledInfoCard
        //           color="info"
        //           icon={<FaChrome />}
        //           title="Chrome Extension"
        //           description="Install our Chrome extension for quick access to our features directly from your browser."
        //           action={{
        //             type: "external",
        //             route: "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem?hl=en-US&utm_source=ext_sidebar",
        //             label: "Install Now",
        //           }}
        //         />
        //       </Grid>
        //       <Grid item xs={12} lg={4}>
        //         <FilledInfoCard
        //           color="info"
        //           icon={<FaFirefox />}
        //           title="Firefox Add-on"
        //           description="Get our Firefox add-on to enhance your workflow with seamless integration."
        //           action={{
        //             type: "external",
        //             route: "https://addons.mozilla.org/en-CA/firefox/addon/nd-care-by-nd-health/",
        //             label: "Install Now",
        //           }}
        //         />
        //       </Grid>
        //     </Grid>
        //
        //     {/*<Grid item xs={12} lg={4}>*/}
        //     {/*  <FilledInfoCard*/}
        //     {/*    variant="gradient"*/}
        //     {/*    color="info"*/}
        //     {/*    icon="flag"*/}
        //     {/*    title="Getting Started"*/}
        //     {/*    description="Learn how to maximize the benefits of our healthcare solutions with easy-to-follow guides."*/}
        //     {/*    action={{*/}
        //     {/*      type: "external",*/}
        //     {/*      route: "#gettingstarted",*/}
        //     {/*      label: "Explore Demo Now",*/}
        //     {/*    }}*/}
        //     {/*  />*/}
        //     {/*</Grid>*/}
        //
        //
        //     {/*<Grid item xs={12} lg={6}>*/}
        //     {/*  <FilledInfoCard*/}
        //     {/*    color="info"*/}
        //     {/*    icon="precision_manufacturing"*/}
        //     {/*    title="Enhanced Plugins"*/}
        //     {/*    description="Explore plugins designed to streamline healthcare processes and enhance patient care."*/}
        //     {/*    action={{*/}
        //     {/*      type: "external",*/}
        //     {/*      route: "#",*/}
        //     {/*      label: "Discover More",*/}
        //     {/*    }}*/}
        //     {/*  />*/}
        //     {/*</Grid>*/}
        //     {/*<Grid item xs={12} lg={6}>*/}
        //     {/*  <FilledInfoCard*/}
        //     {/*    color="info"*/}
        //     {/*    icon="update"*/}
        //     {/*    title="Free Update"*/}
        //     {/*    description="All the future updates will be free with premium membership"*/}
        //     {/*    action={{*/}
        //     {/*      type: "external",*/}
        //     {/*      route: "#",*/}
        //     {/*      label: "Explore updates",*/}
        //     {/*    }}*/}
        //     {/*  />*/}
        //     {/*</Grid>*/}
        //
        //
        //   </Grid>
        //   {/*<Grid container spacing={3}>*/}
        //   {/*  <Grid item xs={12} lg={4}></Grid>*/}
        //   {/*  <Grid item xs={12} lg={4}>*/}
        //   {/*    <FilledInfoCard*/}
        //   {/*      color="info"*/}
        //   {/*      icon={<FaChrome />}*/}
        //   {/*      title="Chrome Extension"*/}
        //   {/*      description="Install our Chrome extension for quick access to our features directly from your browser."*/}
        //   {/*      action={{*/}
        //   {/*        type: "external",*/}
        //   {/*        route: "https://chromewebstore.google.com/detail/nd-health/ppbjmfcjpgddhnhokiaobgklfllnplem?hl=en-US&utm_source=ext_sidebar",*/}
        //   {/*        label: "Install Now",*/}
        //   {/*      }}*/}
        //   {/*    />*/}
        //   {/*  </Grid>*/}
        //   {/*  <Grid item xs={12} lg={4}>*/}
        //   {/*    <FilledInfoCard*/}
        //   {/*      color="info"*/}
        //   {/*      icon={<FaFirefox />}*/}
        //   {/*      title="Firefox Add-on"*/}
        //   {/*      description="Get our Firefox add-on to enhance your workflow with seamless integration."*/}
        //   {/*      action={{*/}
        //   {/*        type: "external",*/}
        //   {/*        route: "https://addons.mozilla.org/en-CA/firefox/addon/nd-care-by-nd-health/",*/}
        //   {/*        label: "Install Now",*/}
        //   {/*      }}*/}
        //   {/*    />*/}
        //   {/*  </Grid>*/}
        //   {/*</Grid>*/}
        // </Container>


