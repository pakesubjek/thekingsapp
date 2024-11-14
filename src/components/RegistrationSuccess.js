import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state || {};

  // const whatsappLink = `https://wa.me/6282140006525?text=Halo, saya sudah mendaftar dengan nama ${formData.fullName}. Bagaimana step selanjutnya?`;
  const whatsappLink = `https://www.instagram.com/thekingsgym.pdg/?igsh=b29obHEyYzdteXcz`;

  // Memeriksa apakah ada data yang diterima dari state
  useEffect(() => {
    if (!location.state || Object.keys(location.state).length === 0) {
      // Jika tidak ada data, redirect ke halaman utama
      navigate("/");
    }
  }, [location, navigate]);

  

  return (
    <Container 
      fluid className="d-flex justify-content-center align-items-center" 
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url('/back-1.jpg')`, // Path image di folder public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop:'80px',
        paddingBottom:'30px'
      }}
      >
      
       {/* Overlay */}
       <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000000',
          opacity: 0.4, // Set opacity ke 50%
          zIndex: 1, // Pastikan overlay berada di atas background
        }}
      ></div>

      <Row className="w-100" style={{zIndex:'100'}}>
        <Col md={{ size: 5, offset: 4 }} style={{ backgroundColor:'#F2F2F2', padding:'25px', borderRadius:'20px', opacity:'0.95' }}>
            <div className="text-center" style={{marginBottom:'20px'}}>
              <img src="/check-logo.png" alt="Check Logo" style={{width:'40px', margin:'10px'}}/>
              <h6 style={{color:'#8C8C8C'}}>Amazing King!</h6>
              <h5 className="mb-4" >Congratulations {formData.fullName}.</h5>
              {/* <p><b>{formData.fullName}</b></p> */}
              <small style={{ color: '#666'}}>Status anggota :</small><br/>
              <Button 
                color="danger" 
                className="mt-1" 
                disabled
                style={{
                  borderRadius:'50px',
                  padding:'2px 15px'
                }}
              >
                Pending
              </Button>
            </div>

            <Card className="text-center" style={{backgroundColor:'#bfe0dc', border:'none'}}>
            <CardBody style={{padding:'15px'}}>

                {/* <p><strong>Jenis Kelamin :</strong> {formData.gender}</p> */}
                {/* <p><strong>Alamat :</strong> {formData.address}</p> */}
                <p><strong>Nomor HP :</strong> {formData.phone}</p>
                <p><strong>Email :</strong> {formData.email}</p>
                <p><strong>Tipe Keanggotaan :</strong> {formData.membershipType}</p>
                <p><strong>Metode Pembayaran :</strong> {formData.paymentMethod}</p>
                {/* <p><strong>Tertarik Personal Trainer :</strong> {formData.interestedInTrainer}</p> */}
                {/* <p><strong>Kelas Grup Diminati :</strong> {formData.groupClasses}</p> */}
                {/* <p><strong>Dari Mana Tahu :</strong> {formData.howDidYouKnow}</p> */}
                {formData.howDidYouKnow === "Lainnya" && (
                  <p><strong>Sumber Lainnya :</strong> {formData.otherSource}</p>
                )}
              
            </CardBody>
          </Card>
              <div className="text-center" style={{backgroundColor:'#bfe0dc', border:'none', borderRadius:'10px', marginTop:'10px', padding:'10px'}}>
                <p><small>Untuk mengkatifkan status keanggotaan, lunasi pembayaran melalui tombol 'Chat Us' dibawah ini.</small></p>
              </div>
              <Button
                href={whatsappLink}
                // target="_blank"
                block
                className="mt-4"
                size="md"
                style={{
                  backgroundColor:'#2d9185',
                  color:'white',
                  border:'none',
                  borderRadius:'50px'
                }}
              >
                <FontAwesomeIcon icon={faInstagram} style={{paddingRight :'10px'}} />Chat Us
              </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationSuccess;
