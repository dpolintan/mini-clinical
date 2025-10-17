import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FC } from 'react';
import Patients from './Patients';
import Appointments from './Appointments';

const Main: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Patients />} />
        <Route path="/:id" element={<Appointments/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Main;