import React from "react";
import Slider from "react-slick";
import { Typography, Card, CardContent, Avatar, Grid, Paper } from "@mui/material";
import StyledTitle from "./components/StyledTitle";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonialData = [
  {
    name: "Dr. Balchandra Dhawan",
    role: "Family Physician",
    clinic: "Maple Clinic",
    avatar:
      "https://static.wixstatic.com/media/9f27bf_4c6cb50b3a8941a5b837fa677bb5e5a1~mv2.jpg/v1/fill/w_210,h_160,al_c,lg_1,q_80,enc_auto/Bcdhawan.jpg",
    testimonial:
      "ND Health transformed our clinic. With 9 physicians, daily administrative tasks and patient calls were overwhelming. The platform streamlined our workflow, reducing workload and enhancing patient satisfaction. Highly recommend it to other clinics!",
    backgroundColor: "#white",
  },
  // {
  //   name: 'Jane Smith',
  //   role: 'CFO, Company XYZ',
  //   avatar: 'https://example.com/avatar2.jpg',
  //   testimonial: 'Sed at tortor vel dui auctor fringilla. Ut tincidunt, sapien id tincidunt interdum, nunc est suscipit risus, non volutpat tortor tellus ut enim.',
  // },
  // Add more testimonials as needed
];
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const Testimonials = () => (
  <div style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
    <StyledTitle center>Testimonials</StyledTitle>

    <Slider
      {...sliderSettings}
      style={{ paddingTop: "2rem", display: "flex", justifyContent: "center" }}
    >
      {testimonialData.map((testimonial, index) => (
        <div key={index}>
          <Grid
            item
            key={index}
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
            {/* <Paper elevation={3} sx={{ width: '50%', height: '100%', marginBottom: 2, borderRadius: '1rem', }}> */}

            <Card
              sx={{
                width: "100%",
                height: "100%",
                marginBottom: 2,
                borderRadius: "1rem",
                backgroundColor: testimonial.backgroundColor,
              }}
            >
              <CardContent>
                <Avatar
                  src={testimonial.avatar}
                  alt="ND Health, book online family and walkin appointment"
                  sx={{ width: 64, height: 64, margin: "auto" }}
                />
                <Typography
                  variant="h5"
                  color="text.primary"
                  sx={{ textAlign: "center", marginTop: 2 }}
                  style={{ fontWeight: "bold" }}
                >
                  {testimonial.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ textAlign: "center", marginTop: 1 }}
                >
                  <i>{testimonial.role}</i>,{" "}
                  <i style={{ fontWeight: "bold", color: "black" }}>{testimonial.clinic}</i>
                </Typography>
                <Typography
                  variant="body2"
                  color="#424242"
                  sx={{ marginTop: 2, fontSize: "1rem", textAlign: "center" }}
                >
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
            </Card>
            {/* </Paper> */}
          </Grid>
        </div>
      ))}
    </Slider>
  </div>
);

export default Testimonials;
