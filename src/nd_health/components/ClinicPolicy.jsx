// src/components/clinicPolicy.js
import API_BASE_PATH from '../apiConfig';


import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { Grid, Card, Typography } from '@mui/material';
import Layout from './Layout';
import './css/Marquee.css';

const ClinicPolicy = () => {
  const { clinicSlug } = useParams();
  const [clinicInfo, setClinicInfo] = useState(null);
  const [termsInfo, settermsInfo] = useState(null);


    


  useEffect(() => {
    const fetchClinicPolicy = async () => {
        if (!termsInfo) {
            try {
                const response = await fetch(`${API_BASE_PATH}/terms/${clinicSlug}/Appointment Booking/`);

                const data = await response.json();
                settermsInfo(data.message.text);
            } catch (error) {
                console.error('Error fetching clinic information:', error);
            }
        }
    };
    const fetchClinicInfo = async () => {
        try {
          const response = await fetch(`${API_BASE_PATH}/clinic/${clinicSlug}/`);
          // const response = await fetch(`http://192.168.88.164:8000/api/clinic/${clinicSlug}/`);
  
          const data = await response.json();
          setClinicInfo(data.clinic);
          
        } catch (error) {
          console.error('Error fetching clinic information:', error);
        }
      };

    fetchClinicInfo();

    fetchClinicPolicy();
  }, [clinicSlug]);


  return (

    <Layout  clinicInfo={clinicInfo}>
      <div>
        {clinicInfo ? (
          <>
            <h2>Policy of {clinicInfo.name}</h2>

            <Card>
              {/* <CardHeader title="Verify Your Identity" /> */}
              <Grid container spacing={2} padding={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                  <div dangerouslySetInnerHTML={{ __html: termsInfo }} />
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </>


        ) : (
          <p>Loading...</p>
        )}

        

      </div>

    </Layout>


  );
};

export default ClinicPolicy;