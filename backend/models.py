from sqlalchemy import Column, Integer, String, Date, ForeignKey, create_engine
from sqlalchemy.orm import relationship, DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()

class Base(DeclarativeBase):
    pass

class Patient(Base):
    __tablename__ = 'patients'
    id = Column(Integer, primary_key=True, autoincrement=False)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    dob = Column(Date) 
    email = Column(String, index=True)
    phone = Column(String, index=True)
    address = Column(String, index=True)
    appointments = relationship("Appointment", back_populates="patient")

class Appointment(Base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True, autoincrement=False)
    patient_id = Column(Integer, ForeignKey('patients.id'), index=True)
    appointment_date = Column(Date, index=True)  
    appointment_type = Column(String)
    patient = relationship("Patient", back_populates="appointments")

database_url = os.getenv("DATABASE_URL", "sqlite:///./patients.db")
engine = create_engine(database_url, echo=True)
Base.metadata.create_all(engine)