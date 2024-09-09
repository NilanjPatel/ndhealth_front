import API_BASE_PATH from '../../../apiConfig';


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

    Button, Typography, CardActionArea, Avatar,

} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {redirect, useNavigate} from 'react-router-dom';
import HelmetComponent from '../SEO/HelmetComponent';
import Layout from '../Layout';
import {useParams, useLocation} from 'react-router-dom';
import NotificationDialog from "../resources/Notification";
import {redirectHomeM} from "../resources/utils";
import MKTypography from "../../../components/MKTypography";
import MKBox from "../../../components/MKBox";
import MKButton from "../../../components/MKButton";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxWidth: '100%',
    },
}));


const LinkedEformToPatient = () => {
    const {clinicSlug} = useParams();

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [formList, setFormList] = useState([]);
    const navigate = useNavigate();
    const classes = useStyles();
    // const [patientNumber, setPatientNumber] = useState('');
    const [patientNumbers, setPatientNumbers] = useState({});
    const location = useLocation();
    const clinicInfo = location.state && location.state.clinicInfo;
    const demo = location.state && location.state.demo;

    // NotificationDialog
    const [openModal, setOpenModal] = useState(false);
    const [isError, setIsError] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        // fetch list of demographics using access token and clinic slug

        const fetchDemographics = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/linked/eforms/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clinicSlug: clinicSlug,
                        demo: demo,
                    }),

                });

                const data = await response.json();


                setFormList(data.data);
                setIsDataLoaded(true);
            } catch (error) {
                console.log(error);
            }
        };

        fetchDemographics();


    }, []);

    const print_row = (row) => {
    };

    const handlePatientNumberChange = (rowId, value) => {
        setPatientNumbers(prevState => {
            const updatedState = {...prevState, [rowId]: value};
            return updatedState;
        });
    };

    const clearPatientNumber = (rowId) => {
        setPatientNumbers(prevState => {
            const updatedState = {...prevState};
            delete updatedState[rowId];
            return updatedState;
        });
    };


    const handleSubmit = (clinic_eform) => {
        // attatch demo, form_id, clinic_slug, form title
        navigate(`/patient/${clinicSlug}/eform`, {
            state: {
                demo: demo,
                clinicInfo: clinicInfo,
                eformId: clinic_eform.id,
                title: clinic_eform.title
            }
        });

    };


    const handleSuccess = (message) => {
        setModalContent(message);
        setIsError(false);
        setOpenModal(true);
    };
    const handleFailure = (message) => {
        setModalContent(message);
        setIsError(true);
        setOpenModal(true);
    };


    return (
        <Layout clinicInfo={clinicInfo}>
            <div>
                <HelmetComponent/>
                {formList.length > 0 && (
                    <>

                        <CardHeader title="Eforms assigned to you."/>
                        <CardContent>
                            <TableContainer component={Paper} className={classes.tableContainer}
                                            style={{width: '100%',}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{fontWeight: 'bold'}}>Name </TableCell>
                                            <TableCell style={{fontWeight: 'bold'}}>Description</TableCell>
                                            {/* <TableCell style={{ fontWeight: 'bold' }}>Id</TableCell> */}
                                            <TableCell style={{fontWeight: 'bold'}}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formList.map((row) => (
                                            <TableRow key={row.clinic_eform.id}>
                                                <TableCell>{row.clinic_eform.form.title}</TableCell>
                                                <TableCell>{row.clinic_eform.form.description}</TableCell>
                                                <TableCell
                                                    style={{
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                    <MKButton
                                                        color="info"
                                                        variant="contained"
                                                        disabled={!1} // TODO value of 0
                                                        onClick={() => handleSubmit(row.clinic_eform)}
                                                    >
                                                        Fill
                                                    </MKButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                        <NotificationDialog
                            open={openModal}
                            onClose={setOpenModal}
                            content={modalContent}
                            isError={isError}

                        />
                    </>
                )}
                {
                    formList.length < 1 && (
                        <>
                            <Card>
                                <CardHeader title="No forms assigned to you."/>
                                <CardContent>
                                    <Typography>
                                        Please contact clinic staff.
                                    </Typography>
                                </CardContent>
                                <CardActionArea style={{margin: '10px'}}>
                                    {/*<Avatar>*/}
                                        <MKButton onClick={() => redirectHomeM(clinicSlug)} color="primary" variant={"contained"}>Back</MKButton>
                                    {/*</Avatar>*/}

                                </CardActionArea>
                            </Card>

                        </>
                    )
                }
            </div>
        </Layout>
    )

};
export default LinkedEformToPatient;