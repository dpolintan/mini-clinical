import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_PATIENTS } from '../api/PatientsApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    phone: string;
};

type GetAllPatientsData = {
    patients: Patient[];
};

const Patients: React.FC = () => {

    const { loading, error, data } = useQuery<GetAllPatientsData>(GET_ALL_PATIENTS);
    if (data) console.log(data)
    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.patients.map((patient: any) => (
                            <TableRow key={patient.id} onClick={() => window.location.href = `/${patient.id}`} style={{ cursor: 'pointer' }}>
                                <TableCell>{patient.id}</TableCell>
                                <TableCell>{patient.firstName}</TableCell>
                                <TableCell>{patient.lastName}</TableCell>
                                <TableCell>{patient.dob}</TableCell>
                                <TableCell>{patient.email}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>   
        </div>
    );
};

export default Patients;