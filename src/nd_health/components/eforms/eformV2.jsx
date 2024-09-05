import React, { useState, useEffect } from 'react';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import formData1 from './test.json';
import { useParams, useLocation } from 'react-router-dom';

import API_BASE_PATH from '../../apiConfig';

import Layout from '../Layout';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Radio, RadioGroup } from '@mui/material';

import { InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
const renderInput = (item, handleInputChange) => {
    switch (item.type) {
        case 'yesno':
            return (
                <FormGroup style={{ minWidth: '100%' }}
                >
                    <FormControlLabel
                        control={<Checkbox onChange={(event) => handleInputChange(event, item.type, item.question)} />}
                        label="Yes"

                    />
                    <FormControlLabel
                        control={<Checkbox onChange={(event) => handleInputChange(event, item.type, item.question)} />}
                        label="No"
                    />
                </FormGroup>
            );

        case 'text':
            return <TextField
                style={{ minWidth: '100%' }}
                label={item.question}
                onChange={(event) => handleInputChange(event, item.type, item.question)}
            />;
        case 'checkbox':
            return (
                <FormControl component="fieldset"                 >
                    <FormLabel component="legend">{item.question}</FormLabel>
                    <FormGroup>
                        {item.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                control={<Checkbox onChange={(event) => handleInputChange(event, item.type, item.question)} />}
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            );
        case 'radio':
            return (

                //     <FormControl
                //     component="fieldset"
                // // style={{ minWidth: '100%' }}
                // >
                //     <FormLabel component="legend">{item.question}</FormLabel>
                //     <FormGroup>
                //         {item.options.map((option, index) => (
                //             <FormControlLabel
                //                 key={index}
                //                 control={<Checkbox onChange={(event) => handleInputChange(event, item.type, item.question)} />}
                //                 label={option}
                //             />
                //         ))}
                //     </FormGroup>
                // </FormControl>


                <FormControl component="fieldset">
                    <FormLabel component="legend">{item.question}</FormLabel>
                    <RadioGroup
                        aria-label={item.question}
                        name={item.question}
                        // value={formValues[item.question] || ''}
                        onChange={(event) => handleInputChange(event, item.type, item.question)}
                    >
                        {item.options.map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                </FormControl>
            );
        case 'select':
            return (

                <>
                    <FormControl>
                        <InputLabel id={item.question} >{item.question}</InputLabel>
                        <Select labelId={item.question} id={item.question} label={item.question}
                            onChange={(event) => handleInputChange(event, item.type, item.question)}
                            style={{ minWidth: '20rem' }}>
                            {item.options.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>

                    {/* <Select
                        name={item.question}
                        required={item.required}
                        onChange={(event) => handleInputChange(event, item.type, item.question)}
                        style={{ minWidth: '100%' }}
                    >
                        {item.options.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select> */}


                </>

            );
        case 'date':
            return (
                <LocalizationProvider dateAdapter={AdapterDayjs}
                >
                    <DatePicker
                        style={{ minWidth: '100%' }}
                        label={item.question}
                        onChange={(event) => handleInputChange(event, item.type, item.question)}
                    />
                </LocalizationProvider>
            );
        case 'time':
            return (
                <LocalizationProvider dateAdapter={AdapterDayjs}
                >
                    <TimePicker
                        style={{ minWidth: '100%' }}
                        label={item.question}
                        onChange={(event) => handleInputChange(event, item.type, item.question)}
                    />
                </LocalizationProvider>
            );
        default:
            return null;
    }
};

const renderSectionItems = (items, handleInputChange, parentName) => {
    return (
        <Grid container spacing={2}>
            {items.map((item, idx) => (

                <>
                    <Grid item xs={12} sm={12} md={12} lg={8} key={idx} >
                        <Typography>{item.question}</Typography>
                        {item.type !== 'text' || item.type !== 'date' || item.type !== 'time' && item.question && (
                            <Typography variant="subtitle1">{item.question}</Typography>
                        )}
                        {item.subheading && <Typography variant="body2">{item.subheading}</Typography>}
                        {item.image && (
                            <img src={item.image} alt="Question Image" style={{ maxWidth: '100%', height: 'auto' }} />
                        )}

                        {renderInput(item, handleInputChange, `${parentName}-${item.question}`)}
                        {item.items && renderSectionItems(item.items, handleInputChange, `${parentName}-${item.question}`)}
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={8}>
                        <Divider style={{ margin: '5px 0', backgroundColor: 'black' }} />
                    </Grid>
                </>

            ))}
        </Grid>
    );
};


const DynamicForm = () => {
    const [formData, setFormData] = useState(null);
    const [formValues, setFormValues] = useState({});
    const location = useLocation();
    const { clinicSlug } = useParams();
    const clinicInfo = location.state && location.state.clinicInfo;
    const demo = location.state && location.state.demo;
    const eformId = location.state && location.state.eformId;
    const [openApp, setOpenApp] = useState(false);
    const [buttonRedirect, setButtonRedirect] = useState('');
    const [appointmentBookContent, setAppointmentBookContent] = useState('');

    useEffect(() => {
        // fetch list of demographics using access token and clinic slug
        const fetchEform = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/eform/fill/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clinicid: clinicInfo.id,
                        demo: demo,
                        eformId: eformId
                    }),

                });

                const data = await response.json();

                if (data.status === "success") {
                    setFormData(data.form);
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchEform();


    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_PATH}/eform/submit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clinicid: clinicInfo.id,
                    demo: demo,
                    form: formValues,
                    eformId: eformId,
                    title: formData.title,
                }),

            });

            const data = await response.json();

            if (data.status == 'success') {
                setOpenApp(true);
                setButtonRedirect('Home');
                setAppointmentBookContent("Form Successfully submited.");
            } else {
                setOpenApp(true);
                setButtonRedirect('Try Again');
                setAppointmentBookContent("Something Went Wrong.");
            }
        } catch (error) {
            setAppointmentBookContent("Something went wrong.");
            setButtonRedirect('Try Again');
            setOpenApp(true);
        }
    };

    const redirectHome = () => {
        setOpenApp(false);
        window.location.href = `/clinic/${clinicSlug}/`;
    };

    const handleCloseApp = () => {
        setOpenApp(false);
        redirectHome();
    };


    const getEform = () => {
        // send post request to server to get the form
        // attatch eformID, clinicinfo as clinic slug or clinic id

    };

    const handleInputChange0 = (event, type) => {
        if (type !== "date" && type !== "time") {
            const { name, value, type1, checked } = event.target;
            const newValue = type1 === 'checkbox' ? checked : value;



        }
        else if (type === "date") {
            const date = new Date(event.$d);
            // Extract components of the date
            const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();
            const year = date.getFullYear();
            // Concatenate components to get the desired format
            const formattedDate = `${weekday} ${month} ${day} ${year}`;

        }
        else if (type === "time") {
            const date = new Date(event.$d);
            const time = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }

    };


    const handleInputChange = (event, type, name) => {

        if (type !== "date" && type !== "time") {

            if (type === 'checkbox') {
                // Clone the current array of selected options
                const { name, value, type, checked } = event.target;
                const selectedOptions = [...(formValues[name] || [])];

                if (checked) {
                    // Add the selected option to the array if checked
                    selectedOptions.push(value);
                } else {
                    // Remove the selected option from the array if unchecked
                    const index = selectedOptions.indexOf(value);
                    if (index !== -1) {
                        selectedOptions.splice(index, 1);
                    }
                }

                // Update the formValues state with the new array of selected options
                // setFormValues({ ...formValues, [name]: selectedOptions });
                setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: selectedOptions }));

            }
            else if (type === 'select') {
                setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    [name]: event.target.value, // Update selected value for select input
                }));
            }

            else {
                const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
                setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: newValue }));

            }

            //   const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
            // setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: newValue }));
            // 
        } else {
            let newValue;
            if (type === "date") {
                const date = new Date(event.$d);
                const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const day = date.getDate();
                const year = date.getFullYear();
                newValue = `${weekday} ${month} ${day} ${year}`;
            } else if (type === "time") {
                const date = new Date(event.$d);
                const time = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
                newValue = time;
            }
            setFormValues((prevFormValues) => ({ ...prevFormValues, [name]: newValue }));
        }
    };


    return (
        <Layout clinicInfo={clinicInfo}>
            <>

                {formData ? (
                    <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingTop={-1}>

                        <form onSubmit={handleSubmit}>
                            <Grid item xs={12} sm={12} md={12} style={{ padding: '1rem' }}>
                                <Typography variant="h4">{formData.title}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} style={{ padding: '1rem' }}>

                                <Typography variant="body1">{formData.subheading}</Typography>
                            </Grid>

                            {formData.sections.map((section, index) => (
                                <div key={index}>
                                    <Grid item xs={12} sm={12} md={12} style={{ padding: '1rem' }}>
                                        <Typography variant="h5">{section.title}</Typography>
                                        <Typography variant="body2">{section.subheading}</Typography>
                                        {renderSectionItems(section.items, handleInputChange, `section-${index}`)}
                                    </Grid>
                                </div>
                            ))}
                            <Grid item xs={12} sm={6} md={4} style={{ padding: '1rem' }}>

                                <Button type="submit" variant="contained" color="primary">Submit</Button>
                            </Grid>
                        </form>
                    </Grid>

                ) : (
                    <Typography variant="body1">Loading...</Typography>

                )
                }
                {/* <form onSubmit={handleSubmit}>
                <h2>{formData.title}</h2>
                {formData.sections.map((section, index) => (
                    <div key={index}>
                        <h3>{section.title}</h3>
                        <h5>{section.subheading}</h5>
                        {section.items.map((item, idx) => (
                            <div key={idx}>
                                <label htmlFor={item.question}>{item.question}</label>
                                {renderInput(item, handleInputChange)}
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form> */}


            </>
            <Dialog open={openApp} onClose={handleCloseApp}>
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>{appointmentBookContent}</DialogContent>
                <DialogActions>
                    <Button onClick={redirectHome}>{buttonRedirect}</Button>
                </DialogActions>
                {/* <DialogActions>
                            <Button onClick={handleCloseApp}>Close</Button>
                        </DialogActions> */}
            </Dialog>
        </Layout>


    );
};



export default DynamicForm;
