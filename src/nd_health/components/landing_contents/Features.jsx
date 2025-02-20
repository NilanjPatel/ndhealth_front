// src/components/FeaturesTimeline.js
import React from "react";
import { Typography, Paper, Box } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import bell from "../../images/icons/ringing-bell.png";
import call from "../../images/icons/phone-ringing.png";
import mail from "../../images/icons/email.png";
import file from "../../images/icons/files.png";
import alarm from "../../images/icons/ringing-bell.png";
import image_1 from "../../images/image_1.png"; // Example image

const featuresData = [
  {
    title: "Streamline Daily Tasks",
    description: "Our platform reduces daily tedious tasks for physicians and admin staff.",
    icon: bell,
    image: image_1,
  },
  {
    title: "Efficient Appointment Management",
    description:
      "Streamline appointment-related communications, saving valuable time and resources for your admin staff.",
    icon: call,
    image: image_1,
  },
  {
    title: "Seamless Patient Communication",
    description:
      "Connect effortlessly with patients using a user-friendly platform, enabling quick and efficient interactions with just one click.",
    icon: mail,
    image: image_1,
  },
  {
    title: "Secure Patient Record Sharing",
    description:
      "Ensure seamless and confidential exchange of patient records with a simple, secure, and single-click process.",
    icon: file,
    image: image_1,
  },
  {
    title: "Combat No Shows",
    description:
      "Utilize our notification system to significantly reduce no-shows, enhancing overall appointment attendance for your clinic.",
    icon: alarm,
    image: image_1,
  },
];

const FeaturesTimeline = () => {
  return (
    <Timeline position="alternate">
      {featuresData.map((feature, index) => (
        <TimelineItem
          key={index}
          sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
        >
          <TimelineOppositeContent
            sx={{ m: "auto 0", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <img
              src={feature.image}
              alt={feature.title}
              style={{ width: "100px", height: "100px", borderRadius: "8px" }}
            />
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <img
                src={feature.icon}
                alt={feature.title}
                style={{ width: "24px", height: "24px" }}
              />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2, width: "100%" }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box>
                <img
                  src={feature.image}
                  alt={feature.title}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              <Typography variant="h6" component="span">
                {feature.title}
              </Typography>
              <Typography>{feature.description}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default FeaturesTimeline;
