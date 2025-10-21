import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {GET_PATIENT_BY_ID } from '../api/PatientsApi';
import { useQuery } from '@apollo/client/react';
import { Box } from '@mui/system';
import { 
    Table, 
    TableContainer, 
    Typography, 
    TableHead, 
    TableRow, 
    TableBody, 
    TableCell,
    CircularProgress,
    Alert,
    Paper,
    Chip,
    Button
} from '@mui/material';

const Appointments: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    interface Appointment {
        id: string;
        appointmentDate: string;
        appointmentType: string;
    }

    interface Patient {
        id: string;
        firstName: string;
        lastName: string;
        dob: string;
        email: string;
        phone: string;
        address: string;
        appointments: Appointment[];
    }

    React.useEffect(() => {
        if (!id || !/^\d+$/.test(id)) {
            navigate('/');
        }
    }, [id, navigate]);

    const { data, loading, error } = useQuery<{ patient: Patient }>(GET_PATIENT_BY_ID, {
        variables: { id: id ? parseInt(id) : undefined },
        skip: !id || !/^\d+$/.test(id),
    });

    React.useEffect(() => {
        if (error) {
            navigate('/');
        }
    }, [error, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Alert severity="error">
                    Error loading patient details: {error.message}
                </Alert>
            </Box>
        );
    }

    if (!data?.patient) {
        return (
            <Box p={2}>
                <Alert severity="info">
                    Patient not found.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper 
                elevation={1} 
                sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: '#775df5',
                    color: '#ffffff',
                    borderRadius: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            sx={{ 
                                color: '#ffffff', 
                                borderColor: '#cccccc',
                                '&:hover': {
                                    borderColor: '#ffffff',
                                    backgroundColor: '#dddddd'
                                }
                            }}
                        >
                            ← Back to Patients
                        </Button>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Patient Details
                        </Typography>
                    </Box>
                    <Chip 
                        label={`${data?.patient?.appointments?.length || 0} Appointments`}
                        sx={{ 
                            backgroundColor: '#ffffff',
                            color: '#775df5',
                            fontWeight: 'bold'
                        }}
                    />
                </Box>
                
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                    View patient information and their appointment history.
                </Typography>
            </Paper>

            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333333' }}>
                        Patient Information
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        <Typography><strong>ID:</strong> {data.patient.id}</Typography>
                        <Typography><strong>Email:</strong> {data.patient.email}</Typography>
                        <Typography><strong>Name:</strong> {data.patient.firstName} {data.patient.lastName}</Typography>
                        <Typography><strong>Phone:</strong> {data.patient.phone}</Typography>
                        <Typography><strong>Date of Birth:</strong> {data.patient.dob}</Typography>
                        <Typography><strong>Address:</strong> {data.patient.address}</Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333333' }}>
                        Appointment History
                    </Typography>
                    <Typography variant="body2" color="#757575">
                        Total: {data?.patient?.appointments?.length || 0} appointments
                    </Typography>
                </Box>
            
                {data.patient.appointments?.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.patient?.appointments?.map((appointment) => (
                                    <TableRow key={appointment.id} hover>
                                        <TableCell>{appointment.id}</TableCell>
                                        <TableCell>{appointment.appointmentDate}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={appointment.appointmentType}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: '#9688f9',
                                                    color: '#ffffff',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ p: 3 }}>
                        <Alert severity="info">
                            No appointments found for this patient.
                        </Alert>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default Appointments;