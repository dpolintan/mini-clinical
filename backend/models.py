from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship, DeclarativeBase
from sqlalchemy import create_engine

class Base(DeclarativeBase):
    pass

class Patient(Base):
    __tablename__ = 'patients'
    id = Column(Integer, primary_key=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    dob = Column(String)
    email = Column(String, index=True)
    phone = Column(String, index=True)
    appointments = relationship("Appointment", back_populates="patient")

class Appointment(Base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), index=True)
    appointment_date = Column(String, index=True)
    appointment_type = Column(String)
    patient = relationship("Patient", back_populates="appointments")

engine = create_engine("sqlite:///patients.db", echo=True)
Base.metadata.create_all(engine)