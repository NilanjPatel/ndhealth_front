import API_BASE_PATH from '../../../../apiConfig';



import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    CardHeader,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    FormControl,
    InputLabel,
    Select,
    MenuItem,

    Button,
    Backdrop,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    DialogActions,

} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { formatPostalCode } from './../../../resources/utils';
import { SEX_CHOICES, PROVINCE_CHOICES } from './../../../resources/variables';
import { StyledTableCell, StyledTableRow } from './../../../resources/uiComponents';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxWidth: '100%',
    },
}));

const ClinicLocations = () => {

    const [listOfCurrentLocations, setListOfCurrentLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postal, setPostal] = useState('');
    const [color, setColor] = useState('');
    const [selectedID, setSelectedID] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const [modalContent, setModalContent] = useState('');


    const classes = useStyles();

    useEffect(() => {
        getCurrentLocationList();


    }, []);

    const getCurrentLocationList = async () => {
        const response = await fetch(`${API_BASE_PATH}/location/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('accessToken')}`,
                }
            }
        );

        const data = await response.json();
        setListOfCurrentLocations(data);
    };


    const handelLocationSelect = async (row) => {
        setSelectedID(row.id);
        setName(row.name);
        setAddress(row.address);
        setCity(row.city);
        setProvince(row.province);
        setPostal(row.postal);
        setColor(row.color);
        setIsDialogOpen(true);
    };

    const handleLocationDelete = async (row) => {
    };

    const updateLocation = async () => {


        try {
            const response = await fetch(`${API_BASE_PATH}/update_location/${selectedID}/`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        name: name,
                        addrerss: address,
                        city: city,
                        province: province,
                        postal: postal,
                        color: color
                    }),

                }
            );
            const data = await response.json();

            getCurrentLocationList();
            setOpenModal(true);
            setModalContent('Location Updated Successfully');
            close_model();

        } catch (error) {
            console.error('Error fetching clinic notices:', error);
            setOpenModal(true);
            setModalContent('Error Updating Location Please try Again');
        }


    };

    const handleInputChange = (field, value) => {
        // Apply any necessary formatting methods
        let formattedValue = value;
        if (field === 'name') {
            setName(value);
        }
        else if (field === 'postal') {
            formattedValue = formatPostalCode(value);
            setPostal(formattedValue);
        }
        else if (field === 'city') {
            setCity(value);
        }
        else if (field === 'color') {
            setColor(value);
        }
        else if (field === 'address') {
            setAddress(value);
        }
        else if (field === 'province') {
            setProvince(value);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const close_model = () => {
        setIsDialogOpen(false);
    };

    return (
        <>
            <TableContainer component={Paper} className={classes.tableContainer} style={{ width: '100%', }}>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell style={{ fontWeight: 'bold' }}>Name </StyledTableCell>
                            <StyledTableCell style={{ fontWeight: 'bold' }}>Address</StyledTableCell>
                            <StyledTableCell style={{ fontWeight: 'bold' }}>City</StyledTableCell>
                            <StyledTableCell style={{ fontWeight: 'bold' }}>Province</StyledTableCell>
                            <StyledTableCell style={{ fontWeight: 'bold' }}>Postal</StyledTableCell>
                            <StyledTableCell style={{ fontWeight: 'bold' }}>Color</StyledTableCell>
                            <StyledTableCell style={{ fontWeight: 'bold' }}></StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {listOfCurrentLocations.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell>{row.name}</StyledTableCell>
                                <StyledTableCell>{row.address}</StyledTableCell>
                                <StyledTableCell>{row.city}</StyledTableCell>
                                <StyledTableCell>{row.province}</StyledTableCell>
                                <StyledTableCell>{row.postal}</StyledTableCell>
                                <StyledTableCell>{row.color}</StyledTableCell>
                                <StyledTableCell>
                                    <Button

                                        variant="outlined"
                                        onClick={() => handelLocationSelect(row)}

                                    >
                                        Update
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Dialog open={isDialogOpen} BackdropComponent={Backdrop} PaperProps={{ style: { boxShadow: `0 0 65px 10px ${color}` } }}>
                {name ? (
                    <>
                        <DialogTitle>Change location Details of {name}</DialogTitle>
                        <DialogContent >
                            {/* Display editable patient details */}
                            <Grid container spacing={2} paddingLeft={1} paddingRight={1} paddingTop={2}>
                                <Grid item xs={12} md={6} lg={6} >

                                    <TextField
                                        label="Name"
                                        value={name}
                                        inputMode="text"
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        Placeholder="Name"
                                        fullWidth
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6} >

                                    <TextField
                                        label="Address"
                                        value={address}
                                        inputMode="text"
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        Placeholder="Address "
                                        fullWidth
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6} >

                                    <TextField
                                        label="City"
                                        value={city}
                                        inputMode="text"
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        Placeholder="City"
                                        fullWidth
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6} >

                                    <FormControl fullWidth>
                                        <InputLabel id="province-label">Province</InputLabel>
                                        <Select
                                            labelId="province-label"
                                            id="province"
                                            label="Province"
                                            fullWidth
                                            value={province}
                                            onChange={(e) => handleInputChange('province', e.target.value)}
                                        >
                                            {PROVINCE_CHOICES.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} lg={6} >

                                    <TextField
                                        label="Postal"
                                        value={postal}
                                        inputMode="text"
                                        onChange={(e) => handleInputChange('postal', e.target.value)}
                                        Placeholder="Postal"
                                        fullWidth
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6} >

                                    <TextField
                                        label="Color"
                                        value={color}
                                        inputMode="text"
                                        onChange={(e) => handleInputChange('color', e.target.value)}
                                        Placeholder="Color"
                                        fullWidth
                                        type="text"
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>

                            <Button variant="contained"
                                onClick={close_model}
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    color: 'red',
                                    backgroundColor: 'white'
                                }}>
                                Close
                            </Button>
                            {/* TODO disable if no change have made */}
                            {/* {!update_info && ( */}
                            <Button
                                variant="contained"
                                onClick={updateLocation}
                                style={{ fontSize: '1rem', fontWeight: 'bold' }}
                            >
                                Update
                            </Button>
                            {/* )} */}
                        </DialogActions>
                    </>
                ) : (
                    // setOpenModal(true);
                    <>
                    </>
                )}
            </Dialog>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>{modalContent}</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};






export default ClinicLocations;