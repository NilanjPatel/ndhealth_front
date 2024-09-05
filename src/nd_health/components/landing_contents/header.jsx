// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          <Link to="/">Home</Link>
        </Typography>
        <Typography variant="h6">
          <Link to="/about">About</Link>
        </Typography>
        <Typography variant="h6">
          <Link to="/features">Features</Link>
        </Typography>
        <Typography variant="h6">
          <Link to="/contact">Contact</Link>
        </Typography>
        <Typography variant="h6">
          <Link to="/demo">Demo</Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
