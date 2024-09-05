
import * as React from 'react';
import PropTypes from 'prop-types';
import Api from './clinic_settings/Api';
import Specified from './clinic_settings/Specified';
// import ClinicSettingsComponent from './clinic_settings/ClinicSettingsComponent';
import AddAppointmentComponent from './clinic_settings/AppointmentTypeBookCode';
import Locations from './clinic_settings/Locations';
import ClinicDoctors from './clinic_settings/Doctors';
import AssignLocation from './clinic_settings/AssignLocation';
import EmailTemplateEditor from './clinic_settings/EmailTemplateEditor';
import { TabPanel, TabPanelProbs } from '../../resources/uiComponents';
import { Grid, Card, CardContent, Typography, CardHeader, Box, Tab, } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

// function TabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`vertical-tabpanel-${index}`}
//             aria-labelledby={`vertical-tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box sx={{ p: 3 }}>
//                     <Typography>{children}</Typography>
//                 </Box>
//             )}
//         </div>
//     );
// }

// TabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//     return {
//         id: `vertical-tab-${index}`,
//         'aria-controls': `vertical-tabpanel-${index}`,
//     };
// }
function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}


const ClinicSettings = ({ clinicSlug, clinicId }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <>
            <Grid container>


                <Box
                    sx={{
                        flexGrow: 1,
                        // maxWidth: { xs: 320, sm: 480, md: 420 },
                        bgcolor: 'background.paper',
                        mx: 'auto', // Center the content horizontally
                        display: 'flex',
                        flexDirection: 'column', // Optional: Align children in a column
                        alignItems: 'center',
                    }}

                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        aria-label="visible arrows tabs example"
                        sx={{
                            [`& .${tabsClasses.scrollButtons}`]: {
                                '&.Mui-disabled': { opacity: 0.3 },
                            },
                        }}
                        width="100%"
                    >
                        <Tab label="Auth" {...a11yProps(0)} />
                        <Tab label="Booking Settings" {...a11yProps(1)} />
                        <Tab label="Appointment Type" {...a11yProps(2)} />
                        <Tab label="Locations" {...a11yProps(3)} />
                        <Tab label="Doctors" {...a11yProps(4)} />
                        <Tab label="Assign Location" {...a11yProps(5)} />
                        <Tab label="Email" {...a11yProps(6)} />
                    </Tabs>
                </Box >
            </Grid>


            <Grid container spacing={3} padding={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <TabPanel value={value} index={0}>
                        <Api clinicSlug={clinicSlug} clinicId={clinicId} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Specified clinicSlug={clinicSlug} clinicId={clinicId} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <AddAppointmentComponent />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Locations />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <ClinicDoctors />
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                        <AssignLocation />
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                        <EmailTemplateEditor />
                    </TabPanel>

                </Grid>
            </Grid>




        </>



    );
};


export default ClinicSettings;