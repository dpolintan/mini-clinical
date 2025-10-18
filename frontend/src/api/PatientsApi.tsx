import { gql } from '@apollo/client';


export const GET_ALL_PATIENTS = gql`
    query GetAllPatients {
        patients {
            id
            first_name
            last_name
            dob
            email
            phone
            address
        }
    }
`;

export const GET_PATIENT_BY_ID = gql`
    query GetPatientById($id: Int!) {
        patient(id: $id) {
            id
            first_name
            last_name
            dob
            email
            phone
            address
            appointments {
                id
                appointment_date
                appointment_type
            }
        }
    }
`;