// src/components/About.js
import React from 'react';
import {
    Button,
    Grid,
    Typography,
    TextField,
    AppBar,
    Toolbar,
    Divider,
    Container,
    CssBaseline,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

import image_1 from "../../images/image_5.png";
import StyledTitle from './components/StyledTitle';

const About = () => {
    return (
        <div>

            <Grid container spacing={2} sx={{
                paddingTop: {xs: '4rem', sm: '1rem'}, // Apply padding only for xs and sm screen sizes
            }}>        {/* Left side - Text */}
                <Grid item xs={12} md={6} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <StyledTitle>About Us</StyledTitle>
                    <Typography paragraph style={{
                        fontWeight: 'bold',
                        //  color: 'transparent',
                        background: '-webkit-linear-gradient(left, #0000, #1975D1)',
                        WebkitBackgroundClip: 'text',
                        transition: 'transform 0.3s ease',
                        textShadow: '1px 1px 1px rgba(0,0,0,0.2)',
                        ':hover': {
                            transform: 'translateY(-2px)',
                            textShadow: 'none',
                        }
                    }}>
                        ND Health is dedicated to providing cost-effective solutions for healthcare professionals aiming
                        to reduce expenses and enhance efficiency in their practices. By offering services such as
                        health card validation, online appointment scheduling, and a secure messaging system, ND Health
                        leverages technology to revolutionize your practice. Discover how this innovative approach can
                        optimize workflows, drive cost savings, and maintain seamless continuity of care.
                    </Typography>
                    {/* Add more text as needed */}
                </Grid>

                {/* Right side - Image */}
                <Grid item xs={12} md={6}>
                    <img src={image_1} alt="ND Health, book online family and walkin appointment"
                         style={{width: '100%', height: 'auto'}}/>
                </Grid>
            </Grid>
        </div>
    );
};

export default About;
