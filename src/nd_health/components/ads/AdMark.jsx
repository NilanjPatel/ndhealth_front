import React from 'react';
import { Typography, Card } from '@mui/material';

const AdMark = ({ cardHeight }) => {
  // Calculate the position of the Ad mark based on the card's height
  const calculateAdPosition = (cardHeight) => {
    return {
        position: 'absolute',
            // top: 'calc(0.5rem + 1%)', // Set a percentage value for consistent positioning
            // left: 'calc(0.5rem + 1%)', // Set a percentage value for consistent positioning
            background: 'white',
            color: 'secondary',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontWeight: 'bold',
            zIndex: 1,
            fontSize:'0.7rem',
            fontWeight:'100',
            margin:'0.1rem'
            // ...(cardHeight && {
            //     top: `calc(1% + ${cardHeight / 15}%)`, // Adjust the percentage based on card height
            //     left: 'calc(1% + 1%)', // Maintain a constant offset from the left
            // }),
    };
  };

  return (
      <Typography variant="subtitle2" sx={calculateAdPosition(cardHeight)}>
        Ads
      </Typography>
  );
};

export default AdMark;
