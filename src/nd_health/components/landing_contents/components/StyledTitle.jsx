import React from 'react';
import { Typography } from '@mui/material';

const StyledTitle = ({ children,center, ...props }) => {
  return (
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        backgroundImage: 'linear-gradient(135deg, #007bff, #CF1512)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
        fontWeight: 'bold',
        textAlign: center ? 'center' : 'left', // Check if center prop is true

      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default StyledTitle;
