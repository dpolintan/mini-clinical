import os
import strawberry
import pandas as pd
from typing import List, Optional
from datetime import date
from models import Patient, Appointment, engine
from ingest import ingest_csv
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

Session = sessionmaker(bind=engine)

@contextmanager
def get_db_session():
    session = Session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def get_patient_raw() -> List[str]:
        file_path = os.path.join(os.path.dirname(__file__), "patients_and_appointments.txt")
        print(file_path)
        patients = ingest_csv(file_path)
        return patients

@strawberry.type
class AppointmentType:
    id: int
    patient_id: int
    appointment_date: date
    appointment_type: str

def create_appointment_type(appointment) -> AppointmentType:
    return AppointmentType(
        id=appointment.id,
        patient_id=appointment.patient_id,
        appointment_date=appointment.appointment_date,
        appointment_type=appointment.appointment_type
    )

def create_patient_type(patient) -> PatientType:
    return PatientType(
        id=patient.id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        dob=patient.dob,
        email=patient.email,
        phone=patient.phone,
        address=patient.address
    )

@strawberry.type
class PatientType:
    id: int
    first_name: str
    last_name: str
    dob: date
    email: str
    phone: str
    address: str

    @strawberry.field
    def appointments(self) -> List[AppointmentType]:
        with get_db_session() as session:
            appointments = session.query(Appointment).filter(Appointment.patient_id == self.id).all()
            return [create_appointment_type(a) for a in appointments]
    
@strawberry.type
class Query: 
    @strawberry.field
    def patients(self) -> List[PatientType]:
        with get_db_session() as session:
            patients = session.query(Patient).all()
            return [create_patient_type(p) for p in patients]
    
    @strawberry.field
    def patient(self, id: int) -> Optional[PatientType]:
        if id <= 0:
            return None
            
        with get_db_session() as session:
            p = session.query(Patient).filter(Patient.id == id).first()
            if p:
                return create_patient_type(p)
            return None

    @strawberry.field
    def appointments_by_patient(self, patientId: int) -> List[AppointmentType]:
        with get_db_session() as session:
            appointments = session.query(Appointment).filter(Appointment.patient_id == patientId).all()
            return [create_appointment_type(a) for a in appointments]
    
    @strawberry.field
    def appointments(self, patientId: int = None) -> List[AppointmentType]:
        with get_db_session() as session:
            if patientId is not None:
                appointments = session.query(Appointment).filter(Appointment.patient_id == patientId).all()
            else:
                appointments = session.query(Appointment).all()
            return [create_appointment_type(a) for a in appointments]


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def populate_db(self) -> str:
        df = get_patient_raw()  
        
        with get_db_session() as session:
            for _, row in df.iterrows():
                patient_id = int(row.get('patient_id', 0))
                
                patient = session.query(Patient).filter_by(id=patient_id).first()
                if not patient:
                    patient = Patient(
                        id=patient_id,
                        first_name=row.get('first_name', ''),
                        last_name=row.get('last_name', ''),
                        dob=row.get('dob') if pd.notna(row.get('dob')) else None,
                        email=row.get('email', ''),
                        phone=row.get('phone', ''),
                        address=row.get('address', '')
                    )
                    session.add(patient)
                    session.flush() 

                if 'appointment_date' in row and row['appointment_date'] and 'appointment_id' in row and row['appointment_id']:
                    appointment_id = int(row.get('appointment_id', 0))

                    existing_appointment = session.query(Appointment).filter_by(id=appointment_id).first()
                    if not existing_appointment:
                        appointment = Appointment(
                            id=appointment_id,
                            patient_id=patient_id,
                            appointment_date=row['appointment_date'],
                            appointment_type=row['appointment_type'] if 'appointment_type' in row else ''
                        )
                        session.add(appointment)
                        
        return "CSV uploaded and data stored successfully."
    
    @strawberry.mutation
    async def upload_file(self, file_path: str) -> str:
        print(f"Processing file: {file_path}")
        
        if not os.path.exists(file_path):
            error_msg = f"File not found: {file_path}"
            print(error_msg)
            return error_msg
        
        try:
            df = ingest_csv(file_path)
            print(f"Successfully loaded {len(df)} rows from file")
            
            with get_db_session() as session:
                for _, row in df.iterrows():
                    patient_id = int(row.get('patient_id', 0))
                    
                    patient = session.query(Patient).filter_by(id=patient_id).first()
                    if not patient:
                        patient = Patient(
                            id=patient_id,
                            first_name=row.get('first_name', ''),
                            last_name=row.get('last_name', ''),
                            dob=row.get('dob') if pd.notna(row.get('dob')) else None,
                            email=row.get('email', ''),
                            phone=row.get('phone', ''),
                            address=row.get('address', '')
                        )
                        session.add(patient)
                        session.flush() 

                    if 'appointment_date' in row and row['appointment_date'] and 'appointment_id' in row and row['appointment_id']:
                        appointment_id = int(row.get('appointment_id', 0))

                        existing_appointment = session.query(Appointment).filter_by(id=appointment_id).first()
                        if not existing_appointment:
                            appointment = Appointment(
                                id=appointment_id,
                                patient_id=patient_id,
                                appointment_date=row['appointment_date'],
                                appointment_type=row['appointment_type'] if 'appointment_type' in row else ''
                            )
                            session.add(appointment)
            
            success_msg = f"File {file_path} uploaded and data stored successfully."
            print(success_msg)
            return success_msg
            
        except Exception as e:
            error_msg = f"Error processing file {file_path}: {str(e)}"
            print(error_msg)
            return error_msg

schema = strawberry.Schema(query=Query, mutation=Mutation)