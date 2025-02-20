import { useState } from "react";
import MKButton from "../../../../components/MKButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { title: "Notification", description: "This is the description for feature 1." },
    { title: "Communication", description: "This is the description for feature 2." },
    { title: "Kiosk", description: "This is the description for feature 3." },
    { title: "Saving", description: "This is the description for feature 3." },
  ];

  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={12} spacing={1} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={12} sx={{ mx: "auto" }}>
            <MKBox className="flex space-x-4 bg-gray-200 p-2 rounded-t">
              {features.map((feature, index) => (
                <MKButton
                  key={index}
                  className={`px-4 py-2 rounded ${activeFeature === index ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                  onClick={() => setActiveFeature(index)}
                  variant={"contained"}
                  color={"info"}
                  sx={{ mr: "1rem" }}
                >
                  {feature.title}
                </MKButton>
              ))}
            </MKBox>

            <Grid className="bg-white p-4 rounded-b shadow-md" sx={{pt:'2rem'}}>
              <HorizontalTeamCard
                image="https://bit.ly/3HCDiqM"
                name={features[activeFeature].title}
                position={{ color: "info", label: "UI Designer" }}
                description={features[activeFeature].description}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  )
    ;
}


export default Features;