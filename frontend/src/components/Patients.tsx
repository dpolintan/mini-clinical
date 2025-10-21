import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_PATIENTS } from '../api/PatientsApi';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    CircularProgress, 
    Alert,
    Box, 
    Typography,
    Paper,
    Chip,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
};

type GetAllPatientsData = {
    patients: Patient[];
};

const Patients: React.FC = () => {
    const navigate = useNavigate();
    const { loading, error, data } = useQuery<GetAllPatientsData>(GET_ALL_PATIENTS);

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
                    Error loading patients: {error.message}
                </Alert>
            </Box>
        );
    }

    if (!data?.patients?.length) {
        return (
            <Box p={2}>
                <Alert severity="info">
                    No patients found.
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
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Mini Clinical
                        </Typography>
                    </Box>
                    <Chip 
                        label={`${data?.patients?.length || 0} Patients`}
                        sx={{ 
                            backgroundColor: '#ffffff',
                            color: '#775df5',
                            fontWeight: 'bold'
                        }} 
                    />
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                    View and manage patient records. Click on any patient to see their appointments and details.
                </Typography>
            </Paper>

            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5'}}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Patient Records
                    </Typography>
                    <Typography variant="body2" color="#757575">
                        Total: {data?.patients?.length || 0} patients
                    </Typography>
                </Box>
                
                <TableContainer>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.patients?.map((patient) => (
                        <TableRow 
                            key={patient.id} 
                            onClick={() => navigate(`/${patient.id}`)} 
                            style={{ cursor: 'pointer' }}
                            hover
                        >
                            <TableCell>{patient.id}</TableCell>
                            <TableCell>{patient.firstName}</TableCell>
                            <TableCell>{patient.lastName}</TableCell>
                            <TableCell>{patient.dob}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell>{patient.phone}</TableCell>
                            <TableCell>{patient.address}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            </Paper>
        </Box>
    );
};

export default Patients;