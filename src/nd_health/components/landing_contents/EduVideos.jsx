import React from "react";
import Slider from "react-slick";
import { Typography, Card, CardContent, Grid } from "@mui/material";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const youtubeVideos = [
  {
    url: "https://www.youtube.com/embed/N00wcFxDuRw?vq=hd1080&controls=0",
    title: "see how easy it is to book an appointment with ND Health",
  },

  // Add more YouTube video URLs and titles as needed
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const EduVideos = () => {
  return (
    <div style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ textAlign: "center", fontWeight: "bold" }}
      ></Typography>

      <Slider
        {...sliderSettings}
        style={{ paddingTop: "2rem", display: "flex", justifyContent: "center" }}
      >
        {youtubeVideos.map((video, index) => (
          <div key={index}>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  marginBottom: 2,
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent style={{ flexGrow: 1 }}>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      title={`YouTube Video ${index}`}
                      width="100%"
                      height="100%"
                      src={`${video.url.replace("watch?v=", "embed/")}?showinfo=0`}
                      frameBorder="0"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    ></iframe>
                  </div>
                </CardContent>
                <CardContent>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {video.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EduVideos;
