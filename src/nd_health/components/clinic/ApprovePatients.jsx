import API_BASE_PATH from '../../apiConfig';


import React, {useEffect, useState} from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {formatHin, formatPostalCode, isValidEmail, formatPhone} from '../resources/utils';
import {useNavigate} from 'react-router-dom';
import HelmetComponent from '../SEO/HelmetComponent';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxWidth: '100%',
    },
}));

const ApprovePatients = ({clinicSlug}) => {

    const [isDataLoaded, setIsDataLoaded] = React.useState(false);
    const [clinic, setClinic] = React.useState(null);
    const [demographicList, setDemographicList] = React.useState([]);
    const classes = useStyles();
    const theme = useTheme();
    const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = React.useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        // fetch list of demographics using access token and clinic slug

        if (!localStorage.getItem('accessToken')) {
            navigate('/');
        }
        const fetchDemographics = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/newdemographic/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify({
                        clinic_slug: clinicSlug,
                    }),
                });
                const data = await response.json();

                if (data.detail === 'Invalid token.') {
                    navigate('/');
                }
                if (data.length === 0) {
                    setDemographicList([]);
                } else {
                    setDemographicList(data);
                    setIsDataLoaded(true);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchDemographics();
    }, []);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setIsEditDialogOpen(true);
    };

    const handleApprove = (row) => {
        // Handle approve action here
        const accessToken = localStorage.getItem('accessToken');

        const fetchApprove = async () => {
            const response = await fetch(`${API_BASE_PATH}/demographic/approve/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${accessToken}`,
                },
                body: JSON.stringify({
                    hin: row.hin,

                }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert("Patient approved!");
                // window.location.reload();

                // remove this row from the list
                setDemographicList((prevList) =>
                    prevList.filter((prevRow) => prevRow.hin !== row.hin)
                );
            } else {
                alert("Error approving patient!");
            }

        };
        fetchApprove();
    };

    const handleDelete = (row) => {
        // Handle delete action here
        const accessToken = localStorage.getItem('accessToken');
        const removeProfile = async () => {
            const response = await fetch(`${API_BASE_PATH}/demographic/destory/${row.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${accessToken}`,
                },
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert("Patient Removed!");
                // window.location.reload();

                // remove this row from the list
                setDemographicList((prevList) =>
                    prevList.filter((prevRow) => prevRow.hin !== row.hin)
                );
            } else {
                alert("Error approving patient!");
            }

        };
        removeProfile();

    };

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false);
        setSelectedRow(null);
    };

    const handleSaveChanges = () => {
        // Handle save changes action here
        handleEditDialogClose();
    };
    const handleEmailChange = (value) => {
        setEmail(value);

        // Validate email format
        const isValid = isValidEmail(value);
        setIsEmailValid(isValid);
    };

    const handleInputChange = (field, value) => {
        // Apply any necessary formatting methods
        let formattedValue = value;
        if (field === 'phone' || field === 'alternativePhone') {
            formattedValue = formatHin(value);
        } else if (field === 'email') {
            formattedValue = value.toLowerCase();
            handleEmailChange(formattedValue);
        } else if (field === 'postal') {
            formattedValue = formatPostalCode(value);
        } else if (field === 'city') {
            formattedValue = value;
        } else if (field === 'version_code') {
            formattedValue = value.toUpperCase();
        }
        setSelectedRow((prevInfo) => ({
            ...prevInfo,
            [field]: formattedValue,
        }));
    };

    return (
        <div>
            {(() => {
                if (isDataLoaded) {
                    return [
                        <div>
                            <HelmetComponent/>
                            {/* <Grid item xs={12} md={12}> */}
                            <Card style={{width: '100%'}}>
                                <CardHeader title="Demographic Requests"/>
                                <CardContent sx={{overflowX: 'scroll'}}>
                                    <TableContainer component={Paper} className={classes.tableContainer}
                                                    style={{width: '100%',}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{fontWeight: 'bold'}}>Last Name, First
                                                        Name</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Sex</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>DOB</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>HIN</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Ver</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Phone</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Alternative
                                                        Phone</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Email</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Address</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>City</TableCell>
                                                    {/* <TableCell style={{fontWeight:'bold'}}>Postal</TableCell> */}
                                                    {/* <TableCell style={{fontWeight:'bold'}}>Province</TableCell> */}
                                                    <TableCell style={{fontWeight: 'bold'}}>Date</TableCell>
                                                    {/* <TableCell style={{fontWeight:'bold'}}>Agreed</TableCell> */}
                                                    {/* <TableCell style={{fontWeight:'bold'}}>Clinic Slug</TableCell> */}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {demographicList.map((row) => (
                                                    <TableRow key={row.hin}>
                                                        <TableCell>{row.lastName},{row.firstName}</TableCell>
                                                        <TableCell>{row.sex}</TableCell>
                                                        <TableCell>{row.dob}</TableCell>
                                                        <TableCell>{row.hin.replace(/-/g, '')}</TableCell>
                                                        <TableCell>{row.ver}</TableCell>
                                                        <TableCell>{formatPhone(row.phone)}</TableCell>
                                                        <TableCell>{formatPhone(row.alternativePhone)}</TableCell>
                                                        <TableCell>{row.email}</TableCell>
                                                        <TableCell>{row.address}</TableCell>
                                                        <TableCell>{row.city}</TableCell>
                                                        {/* <TableCell>{row.postal}</TableCell> */}
                                                        {/* <TableCell>{row.province}</TableCell> */}
                                                        <TableCell>{new Date(row.recordDate).toLocaleDateString('en-CA')}</TableCell>

                                                        <TableCell>
                                                            <div>
                                                                {/* <Button onClick={() => handleEdit(row)}>Edit</Button> */}
                                                                <Button
                                                                    onClick={() => handleApprove(row)}>Approve</Button>
                                                                <Button
                                                                    onClick={() => handleDelete(row)}>Delete</Button>
                                                            </div>
                                                        </TableCell>
                                                        {/* <TableCell>{row.agreed}</TableCell> */}
                                                        {/* <TableCell>{row.clinic_slug}</TableCell> */}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </CardContent>
                            </Card>
                            {/* </Grid> */}

                            <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose}>
                                <DialogTitle>Edit Demographic</DialogTitle>
                                <DialogContent>
                                    {selectedRow && (
                                        <>
                                            {Object.entries(selectedRow).map(([key, value]) => (
                                                <TextField
                                                    key={key}
                                                    fullWidth
                                                    margin="normal"
                                                    label={key}
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleInputChange(key, e.target.value)
                                                    }
                                                />
                                            ))}
                                        </>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    ];
                } else {
                    return (
                        <div>
                            <Card>
                                <CardHeader title="No new demographic requests."/>
                            </Card>
                        </div>
                    );
                }
            })()}
        </div>
    );

};

export default ApprovePatients;