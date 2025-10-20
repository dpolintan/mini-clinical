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
    Alert 
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
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Patient Details
            </Typography>
            <Box sx={{ mb: 3 }}>
                <Typography><strong>ID:</strong> {data.patient.id}</Typography>
                <Typography><strong>Name:</strong> {data.patient.firstName} {data.patient.lastName}</Typography>
                <Typography><strong>Date of Birth:</strong> {data.patient.dob}</Typography>
                <Typography><strong>Email:</strong> {data.patient.email}</Typography>
                <Typography><strong>Phone:</strong> {data.patient.phone}</Typography>
                <Typography><strong>Address:</strong> {data.patient.address}</Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>
                Appointments
            </Typography>
            
            {data.patient.appointments?.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.patient?.appointments?.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>{appointment.id}</TableCell>
                                    <TableCell>{appointment.appointmentDate}</TableCell>
                                    <TableCell>{appointment.appointmentType}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Alert severity="info">
                    No appointments found for this patient.
                </Alert>
            )}
        </Box>
    );
};

export default Appointments;