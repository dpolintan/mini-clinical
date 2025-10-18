CREATE TABLE patients (
        id INTEGER NOT NULL, 
        first_name VARCHAR, 
        last_name VARCHAR, 
        dob DATE, 
        email VARCHAR, 
        phone VARCHAR, 
        address VARCHAR, 
        PRIMARY KEY (id)
);
CREATE INDEX ix_patients_phone ON patients (phone);
CREATE INDEX ix_patients_email ON patients (email);
CREATE INDEX ix_patients_first_name ON patients (first_name);
CREATE INDEX ix_patients_last_name ON patients (last_name);
CREATE INDEX ix_patients_address ON patients (address);

CREATE TABLE appointments (
        id INTEGER NOT NULL, 
        patient_id INTEGER, 
        appointment_date DATE, 
        appointment_type VARCHAR, 
        PRIMARY KEY (id), 
        FOREIGN KEY(patient_id) REFERENCES patients (id)
);
CREATE INDEX ix_appointments_appointment_date ON appointments (appointment_date);
CREATE INDEX ix_appointments_patient_id ON appointments (patient_id);