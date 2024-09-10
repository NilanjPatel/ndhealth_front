import React from "react";
import { Grid, Typography, Divider, Container, CssBaseline, Paper } from "@mui/material";
import "./Footer.css";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "60px",
}));

const Footer = () => {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        paddingTop: "1rem",
        backgroundColor: "#ebedf5",
        zIndex: 1000,
      }}
    >
      {/* <Divider style={{ width: '2rem', margin: 'auto', marginBottom: '1rem' }} /> */}

      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{
          p: 2,
          // borderRadius: 2,
          bgcolor: "#1e88e5",
          display: "grid",
          gridTemplateColumns: { md: "1fr 1fr" },
          gap: 2,
        }}
      ></Grid>
      <Typography
        variant="body2"
        color="#fff"
        align="center"
        style={{ fontStyle: "bold", backgroundColor: "#1e88e5" }}
      >
        © {new Date().getFullYear()} nd health Technologies. All rights reserved.
      </Typography>

      <Helmet>
        <title>ND Health - Streamlining Healthcare Operations</title>
        <meta
          name="description"
          content="Discover how ND Health streamlines healthcare operations, saving time and improving patient care. Explore features such as efficient physician appointment management, seamless patient communication, and secure record sharing."
        />
        <meta
          name="keywords"
          content="family physician, family doctor, walk-in physician, book appointment, appointment management, patient communication, secure record sharing, healthcare services"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://nd-health.ca" />
        <meta name="robots" content="index, follow" />
      </Helmet>
    </footer>
  );
};

export default Footer;

// style={{ position: 'fixed', bottom: 0, width: '100%', padding: '-3rem', backgroundColor: '#fff' }}
