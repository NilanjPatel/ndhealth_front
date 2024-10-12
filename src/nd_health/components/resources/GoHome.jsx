// BreadcrumbsComponent.js
import React from 'react';
import {Grid, Icon} from '@mui/material'; // or '@material-ui/core' if using older versions
import Breadcrumbs from "../../../examples/Breadcrumbs";

const GoHome = ({clinicSlug}) => {
    return (
        <Grid item xs={12} md={12}>
            <Breadcrumbs
                routes={[
                    {label: "Go home", route: `/clinic/${clinicSlug}/`, icon: <Icon>home</Icon>},
                    // { label: "Book Appointment", icon: <Icon>appointment</Icon> },
                ]}
            />
        </Grid>
    );
};

export default GoHome;