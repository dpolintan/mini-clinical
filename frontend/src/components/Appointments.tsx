import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {GET_PATIENT_BY_ID } from '../api/PatientsApi';
import { useQuery } from '@apollo/client/react';
import { Box } from '@mui/system';
import { Table, TableContainer, Typography, TableHead, TableRow, TableBody, TableCell } from '@mui/material';

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

    if (loading) return <div>Loading...</div>;

    return (
        <>
            {!error && (
                <div>
                    <Box sx={{ p: 2 }}>
                        <Typography>{data?.patient?.id}</Typography>
                        <Typography>{data?.patient?.firstName}</Typography>
                        <Typography>{data?.patient?.lastName}</Typography>
                        <Typography>{data?.patient?.dob}</Typography>
                        <Typography>{data?.patient?.email}</Typography>
                        <Typography>{data?.patient?.phone}</Typography>
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
                                    {data?.patient?.appointments?.map((appointment: any) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.id}</TableCell>
                                            <TableCell>{appointment.appointmentDate}</TableCell>
                                            <TableCell>{appointment.appointmentType}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>  
                    </Box>
                </div>
            )}
        </>
    );
};

export default Appointments;