import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import RegistrationSuccess from "./components/RegistrationSuccess";
import "bootstrap/dist/css/bootstrap.min.css";

import CustomNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import PTRegistration from './pt_regis';
import CekTrainer from './cek_trainer';
import TrainerLog from './trainerlog';
import QrTrainerLog from './qrlogtrainer';

import ReactPixel from 'react-facebook-pixel';

function App() {
  useEffect(() => {
    // Ganti dengan Facebook Pixel ID Anda
    const pixelId = '385470161198149';

    // Inisialisasi Facebook Pixel
    ReactPixel.init(pixelId);

    // Mengirimkan pageview event saat halaman dimuat
    ReactPixel.pageView(); 

    // Jika ingin melacak custom event, Anda bisa menggunakan ReactPixel.track()
    // Misalnya: ReactPixel.track('Purchase', { value: 50, currency: 'USD' });
  }, []);
  return (
    <Router>
      <CustomNavbar style={{padding:'0', margin:'0'}} />
      <Routes >
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/success" element={<RegistrationSuccess />} />
        <Route path="/trainer" element={<PTRegistration />} />
        <Route path="/cektrainer" element={<CekTrainer />} />
        <Route path="/in" element={<TrainerLog />} />
        <Route path="/qrlog" element={<QrTrainerLog />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;