import React, { useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from 'reactstrap';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';

const CekTrainer = () => {
  const [phone, setPhone] = useState('');
  const [trainerData, setTrainerData] = useState(null);
  const [modal, setModal] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [qrValue, setQrValue] = useState('');

  const toggleModal = () => setModal(!modal);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      setRegistrationError('Please enter a phone number.');
      setIsSuccess(false);
      toggleModal();
      return;
    }

    try {
      const response = await axios.get('https://thekingsgym.id/api/trainer/check_phone.php', {
        params: { phone }
      });

      if (response.data.success && response.data.trainer) {
        setTrainerData(response.data.trainer);
        setQrValue(`${response.data.trainer.ptID}-${response.data.trainer.phone}`);
        setIsSuccess(true);
      } else {
        setRegistrationError('Personal Trainer belum terdaftar.');
        setIsSuccess(false);
      }

      toggleModal(); // Show modal with the result
    } catch (error) {
      setRegistrationError('Error checking trainer. Please try again later.');
      setIsSuccess(false);
      toggleModal(); // Show error modal
    }
  };

  const downloadModalContent = () => {
    const modalBody = document.getElementById('modalBody');
    html2canvas(modalBody).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, `${trainerData?.name || 'Unknown'}-${trainerData?.ptID || 'Unknown'}.jpg`);
      });
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '120px', paddingBottom: '50px' }}>
      <div style={{ width: '100%', maxWidth: '1000px', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
      <h3>Check Personal Trainer</h3>
      <hr />

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter trainer phone number"
            required
          />
        </FormGroup>
        <Button type="submit" color="primary">Check Trainer</Button>
      </Form>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ textAlign: 'center' }}>
          {isSuccess ? 'Trainer Details' : 'Error'}
        </ModalHeader>
        <ModalBody id="modalBody" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <Card style={{ border: '1px solid #ddd', padding: '20px' }}>
            <CardBody style={{ padding: '0px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <img
                  src="/logo-gym-ico.png"
                  alt="The King's Gym Logo"
                  style={{ width: '70px' }}
                />
              </div>

              {isSuccess ? (
                <>
                  <small>Personal trainer The King's Gym</small>
                  <CardTitle tag="h3" style={{ paddingBottom: '20px' }}>
                    {trainerData?.name}
                  </CardTitle>
                  <div style={{ marginBottom: '20px' }}>
                    <QRCodeCanvas value={qrValue} size={150} />
                  </div>

                  <CardText style={{ fontSize: '12px', color: '#666' }}>
                    Scan QR Code setiap kali Personal Trainer Check-In/ Check-Out di The King's Gym. Pastikan memberi tahu admin sebelum berlatih.
                  </CardText>
                </>
              ) : (
                <>
                  <CardTitle tag="h5">{registrationError}</CardTitle>
                </>
              )}
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
          {isSuccess && (
            <Button style={{ backgroundColor: '#dfb455', color: 'black', border: '0px' }} onClick={downloadModalContent}>
              Download QR
            </Button>
          )}
        </ModalFooter>
      </Modal>

      </div>
    </div>
  );
};

export default CekTrainer;
