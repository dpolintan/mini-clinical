import { gql } from '@apollo/client';


export const GET_ALL_PATIENTS = gql`
    query GetAllPatients {
        patients {
            id
            firstName
            lastName
            dob
            email
            phone
        }
    }
`;

export const GET_PATIENT_BY_ID = gql`
    query GetPatientById($id: Int!) {
        patient(id: $id) {
            id
            firstName
            lastName
            dob
            email
            phone
            appointments {
                id
                appointmentDate
                appointmentType
            }
        }
    }
`;