import os
import strawberry
from typing import List
from models import Patient, Appointment, engine
import strawberry
from typing import List
from ingest import ingest_csv
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
session = Session()

def get_patient_raw() -> List[str]:
        file_path = os.path.join(os.path.dirname(__file__), "patients_and_appointments.txt")
        print(file_path)
        patients = ingest_csv(file_path)
        return patients

@strawberry.type
class AppointmentType:
    id: int
    patient_id: int
    appointment_date: str
    appointment_type: str

@strawberry.type
class PatientType:
    id: int
    first_name: str
    last_name: str
    dob: str
    email: str
    phone: str

    @strawberry.field
    def appointments(self) -> List[AppointmentType]:
        from models import Appointment  # avoid circular import
        return [
            AppointmentType(
                id=a.id,
                patient_id=a.patient_id,
                appointment_date=str(a.appointment_date),
                appointment_type=a.appointment_type
            )
            for a in session.query(Appointment).filter(Appointment.patient_id == self.id).all()
        ]
    
@strawberry.type
class Query: 
    @strawberry.field
    def patients(self) -> List[PatientType]:
        patients = session.query(Patient).all()
        return [PatientType(
            id=p.id,
            first_name=p.first_name,
            last_name=p.last_name,
            dob=str(p.dob),
            email=p.email,
            phone=p.phone
        ) for p in patients]
    
    @strawberry.field
    def patient(self, id: int) -> PatientType:
        p = session.query(Patient).filter(Patient.id == id).first()
        if p:
            return PatientType(
                id=p.id,
                first_name=p.first_name,
                last_name=p.last_name,
                dob=str(p.dob),
                email=p.email,
                phone=p.phone
            )
        return None

    @strawberry.field
    def appointments_by_patient(self, patientId: int) -> List[AppointmentType]:
        appointments = session.query(Appointment).filter(Appointment.patient_id == patientId).all()
        return [AppointmentType(
            id=a.id,
            patient_id=a.patient_id,
            appointment_date=str(a.appointment_date),
            appointment_type=a.appointment_type
        ) for a in appointments]
    
    @strawberry.field
    def appointments(self, patientId: int = None) -> List[AppointmentType]:
        if patientId is not None:
            appointments = session.query(Appointment).filter(Appointment.patient_id == patientId).all()
        else:
            appointments = session.query(Appointment).all()
        return [AppointmentType(
            id=a.id,
            patient_id=a.patient_id,
            appointment_date=str(a.appointment_date),
            appointment_type=a.appointment_type
        ) for a in appointments]


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def upload_csv(self) -> str:

        df = get_patient_raw()  
    
        for _, row in df.iterrows():
            # Find or create patient
            patient = session.query(Patient).filter_by(
                first_name=row.get('first_name', ''),
                last_name=row.get('last_name', ''),
                dob=row.get('dob', '') if row.get('dob', '') else None,
                email=row.get('email', ''),
                phone=row.get('phone', '')
            ).first()
            if not patient:
                patient = Patient(
                    first_name=row.get('first_name', ''),
                    last_name=row.get('last_name', ''),
                    dob=row.get('dob', '') if row.get('dob', '') else None,
                    email=row.get('email', ''),
                    phone=row.get('phone', '')
                )
                session.add(patient)
                session.flush() 

            if 'appointment_date' in row and row['appointment_date']:
                appointment = Appointment(
                    patient_id=patient.id,
                    appointment_date=row['appointment_date'],
                    appointment_type=row['appointment_type'] if 'appointment_type' in row else ''
                )
                session.add(appointment)

        session.commit()
        session.close()

        return "CSV uploaded and data stored successfully."

schema = strawberry.Schema(query=Query, mutation=Mutation)