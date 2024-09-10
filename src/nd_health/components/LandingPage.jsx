// src/components/LandingPage.js
import React from "react";
import { styled } from "@mui/system"; // Change here

import Header from "./landing_contents/header";

const useStyles = styled((theme) => ({
  appBar: {
    backgroundColor: theme.palette.primary.main,
  },
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  featurePaper: {
    padding: theme.spacing(2),
    height: "100%",
  },
  footer: {
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const LandingPage = ({ data }) => {
  const classes = useStyles();

  return (
    <>
      <Header />

      {/* <Route path="/" exact component={Home} /> */}
    </>
  );
};

export default LandingPage;
