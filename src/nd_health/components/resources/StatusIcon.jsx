import React from 'react';
import { green, red, yellow } from '@mui/material/colors';

const StatusIcon = ({
                      status,
                      data,
                      fontSize = '12px',
                      title = '',
                      rosterStatus
                    }) => {
  const baseStyle = {
    fontSize,
    paddingLeft: '6px',
    fontWeight: 'bolder',
  };

  let color = red[900];
  let content = `${title}${data}`;

  if (status === 'yes') {
    if (data === '51') {
      color = rosterStatus !== false ? green[900] : red[900];
    } else {
      color = green[900];
    }
  } else if (status === 'not valid') {
    content = `${title}( No HC )`;
  }

  return <span style={{ ...baseStyle, color }}>{content}</span>;
};

export { StatusIcon };
