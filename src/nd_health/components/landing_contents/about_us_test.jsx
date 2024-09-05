// src/components/About.js
import React, {useState, useEffect} from 'react';
import {Grid} from '@mui/material';
import image_1 from "../../images/home/vecteezy_patients-characters-waiting-doctor-appointment_13717541.jpg";

const About = () => {
    const [aboutText, setAboutText] = useState('');

    const [storyText, setStoryText] = useState('');
    const aboutUs = "Streamline your clinic";
    const discoverStory = "Save time, earn more";
    // const aboutUs = "About Us";
    // const discoverStory = "Discover Our Story";
    const [hover, setHover] = useState(false);




    return (
        <div>
            <Grid sx={{height: '100vh'}}>
                {/* Full Container Image with Hover Effect */}
                <Grid item xs={12} sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    cursor: 'pointer',
                    '& img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease-out',

                    },
                    '&:hover img': {
                        transform: 'scale(1.05)',
                    },
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.74)',
                        opacity: 0,
                        transition: 'opacity 0.5s ease-out',
                        zIndex: 1,
                    },
                    '&:hover:before': {
                        opacity: 1,
                    },
                    '& .text-container': {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        textAlign: 'center',
                        opacity: 0,
                        transition: 'opacity 0.5s ease-out',
                        zIndex: 2,
                    },
                    '&:hover .text-container': {
                        opacity: 1,
                    }
                }}>
                    <img src={image_1} alt="ND Health, book online family and walkin appointment"
                         />
                    <div className="text-container">
                        <div style={{fontSize: '3rem', fontWeight: 'bold'}}>{aboutUs}</div>
                        <div style={{
                            fontSize: '1.5rem',
                            color: '#ffff9f',
                            fontStyle: 'italic',
                            fontWeight: 700
                        }}>{discoverStory}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default About;