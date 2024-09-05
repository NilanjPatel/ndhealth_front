
import API_BASE_PATH from '../../../apiConfig';



import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    CardHeader,
    
    Button,
    
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        maxWidth: '100%',
    },
}));



const Notice = ({ clinicSlug, clinicId }) => {
    const [clinicNotices, setClinicNotices] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [isDataLoaded, setIsDataLoaded] = React.useState(false);

    const [clinicNoticeNames, setClinicNoticeNames] = useState([]);
    const [selectedName, setSelectedName] = useState('');


    useEffect(() => {
        // Fetch clinic notices

        const fetchClinicNotices = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/clinic-notices-list/`,

                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Token ${localStorage.getItem('accessToken')}`,
                        }

                    });
                const data = await response.json();
                setClinicNotices(data);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching clinic notices:', error);
            }
        };

        const fetchClinicNoticeNames = async () => {
            try {
                const response = await fetch(`${API_BASE_PATH}/clinic-notice-names/`,

                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Token ${localStorage.getItem('accessToken')}`,
                        }
                    });
                const data = await response.json();
                setClinicNoticeNames(data);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching clinic notices:', error);
            }
        };





        fetchClinicNotices();
        fetchClinicNoticeNames();
    }, []);

    const handleAddNotice = async (selectedName) => {

        // get id of notice name using selected name
        const notice_nameId = clinicNoticeNames.find((notice) => notice.name === selectedName).id;
        try {
            const response = await fetch(`${API_BASE_PATH}/clinic-notices/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    clinic_id: clinicId ,
                    notice: newNotice,
                    status: 1,
                    notice_name_id: notice_nameId,
                }),
            });
            const data = await response.json();
            setClinicNotices([...clinicNotices, data]);
            setNewNotice('');
        } catch (error) {
            console.error('Error adding clinic notice:', error);
        }
    };

    const handleUpdateNotice = async (selectedName) => {

        // get id of notice using selected name
        const noticeId = clinicNotices.find((notice) => notice.name.name === selectedName).id;

        //  get if of notice using notice name
        // const noticeId = clinicNoticeNames.find((notice) => notice.name === selectedName);


        try {
            const response = await fetch(`${API_BASE_PATH}/clinic-notices/${noticeId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ notice: newNotice }),
            });
            const updatedNotice = await response.json();
            setClinicNotices((prevNotices) =>
                prevNotices.map((notice) =>
                    notice.id === selectedName ? { ...notice, notice: updatedNotice.notice } : notice
                )
            );
            setNewNotice('');
        } catch (error) {
            console.error('Error updating clinic notice:', error);
        }
    };


    const handleDeleteNotice = async (id) => {
        try {
            await fetch(`${API_BASE_PATH}/clinic-notices/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${localStorage.getItem('accessToken')}`,
                },
            });
            setClinicNotices(clinicNotices.filter(notice => notice.id !== id));
        } catch (error) {
            console.error('Error deleting clinic notice:', error);
        }
    };

    const handlenoticeChange = (key, event) => {
        setSelectedName(event);
    }

    return (
        <div>
            {(() => {
                if (isDataLoaded) {
                    return [
                        <div>
                            <Grid container>
                                <Grid item xs={12} md={12}>
                                    <Card style={{ width: 'fit-content', minWidth: '50rem', margin: 4 }}>
                                        <CardHeader title="Clinic Notices" />
                                        <CardContent>
                                            <Grid container spacing={2} style={{ padding: '1rem' }}>
                                                <Typography variant="h6">Add or Update Notice:</Typography>
                                            </Grid>
                                            <Grid container spacing={2} style={{ padding: '1rem' }}>

                                                <FormControl>
                                                    <InputLabel id="name-label">Select Notice Name</InputLabel>
                                                    {/* <placeholder>Select time slot: </placeholder> */}
                                                    <Select labelId='name-label' id="name" label="Select Notice Name" value={selectedName}
                                                        onChange={(e) => handlenoticeChange('address', e.target.value)}
                                                        style={{ minWidth: '15rem' }}
                                                        
                                                        >
                                                        {clinicNoticeNames.map((name) => (
                                                            <MenuItem key={name.id} value={name.name}>
                                                                {name.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid container spacing={2} style={{ padding: '1rem' }}>
                                                <TextField
                                                    label="Enter Notice Text"
                                                    placeholder="Enter notice text"
                                                    value={newNotice}
                                                    onChange={(e) => setNewNotice(e.target.value)}
                                                    fullWidth
                                                    multiline
                                                    variant="outlined"
                                                />
                                            </Grid>

                                            <Button onClick={() => handleAddNotice(selectedName)}>Add Notice</Button>
                                            <Button
                                                onClick={() => handleUpdateNotice(selectedName)}
                                                disabled={!selectedName || !newNotice}
                                            >
                                                Update Notice
                                            </Button>
                                        </CardContent>

                                        <CardContent>
                                            <Typography variant="h6">Existing Notices:</Typography>
                                            <ul>
                                                {clinicNotices.map((notice) => (
                                                    <li key={notice.id}>
                                                        {notice.name.name} - {notice.notice}
                                                        <Button onClick={() => handleDeleteNotice(notice.id)}>Delete</Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>

                                    </Card>
                                </Grid>


                            </Grid>
                        </div>
                    ];
                } else {
                    return (
                        <div>
                            <Card>
                                <CardHeader title="No new demographic requests." />
                            </Card>
                        </div>
                    );
                }
            })()}


        </div >
    );

};

export default Notice;