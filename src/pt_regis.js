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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

// Validasi dengan Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .matches(/^08\d{8,}$/, 'Phone number must start with 08 and have at least 10 digits')
    .required('Phone number is required')
    .test('starts-with-08', 'Phone number must start with 08', (value) => {
      return value ? value.startsWith('08') : false;
    }),
});

const generatePTID = () => {
  const randomNum = Math.floor(100 + Math.random() * 900); // Nomor acak 3 digit
  return `KING-${randomNum}`;
};

const PTRegistration = () => {
  const [ptID] = useState(generatePTID());
  const [qrValue, setQrValue] = useState('');
  const [modal, setModal] = useState(false);
  const [existingTrainer, setExistingTrainer] = useState(null); // Menyimpan data trainer yang sudah terdaftar
  const [registrationError, setRegistrationError] = useState(''); // Untuk pesan error
  const [isSuccess, setIsSuccess] = useState(true); // Untuk status sukses/gagal

  const toggleModal = () => setModal(!modal);

  // Hook Formik untuk menangani form
  const formik = useFormik({
    initialValues: { name: '', phone: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let { name, phone } = values;

      // Pastikan nomor telepon dimulai dengan +62 jika dimulai dengan 08
      if (phone.startsWith('08')) {
        phone = '+62' + phone.slice(1); // Ganti 0 pertama dengan +62
      }

      const data = { id: ptID, name, phone };

      try {
        const response = await axios.post('https://thekingsgym.id/api/trainer/pt_register.php', data);

        if (response.data.success) {
          if (response.data.message === `Personal Trainer sudah terdaftar dengan nama ${name}`) {
            // Jika nomor telepon sudah terdaftar
            setExistingTrainer(response.data.trainer); // Menyimpan data trainer yang sudah ada
            setIsSuccess(false); // Menandakan gagal karena sudah terdaftar
          } else {
            // Jika registrasi berhasil
            setQrValue(`${ptID}-${phone}`);
            setIsSuccess(true); // Menandakan sukses
          }
        } else {
          setRegistrationError(response.data.message || 'Registration failed, please try again.');
          setIsSuccess(false); // Menandakan gagal
        }

        toggleModal(); // Tampilkan modal dengan informasi hasil
      } catch (error) {
        setRegistrationError('Error during registration. Please try again later.');
        setIsSuccess(false);
        toggleModal(); // Tampilkan modal dengan pesan error
      }
    },
  });

  const downloadModalContent = () => {
    const modalBody = document.getElementById('modalBody');
    html2canvas(modalBody).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, `${formik.values.name}-${ptID}.jpg`);
      });
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '120px', paddingBottom: '50px' }}>
      <div style={{ width: '100%', maxWidth: '1000px', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
      <h3>Personal Trainer Registration</h3>
      <hr />

      <Form onSubmit={formik.handleSubmit}>
        <FormGroup>
          <Label>ID</Label>
          <Input type="text" value={ptID} disabled />
        </FormGroup>
        <FormGroup>
          <Label>Trainer Name</Label>
          <Input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={formik.touched.name && !!formik.errors.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </FormGroup>
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="text"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={formik.touched.phone && !!formik.errors.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-danger">{formik.errors.phone}</div>
          )}
        </FormGroup>
        <Button type="submit" color="primary">
          Register
        </Button>
      </Form>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ textAlign: 'center' }}>
          {isSuccess ? 'Registration Success' : 'Registration Failed'}
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
                  <CardTitle tag="h3" style={{ paddingBottom:'20px'}}>{formik.values.name}</CardTitle>
                  {/* <CardText>Phone: {formik.values.phone}</CardText> */}

                  <div style={{ marginBottom: '20px' }}>
                    <QRCodeCanvas id="qrcode" value={qrValue} size={150} />
                  </div>

                  <CardText style={{ fontSize: '12px', color: '#666' }}>
                    Scan QR Code setiap kali Personal Trainer Check-In/ Check-Out di The King's Gym. Pastikan memberi tahu admin sebelum berlatih.
                  </CardText>
                </>
              ) : (
                <>
                  <CardTitle tag="h5">{registrationError}</CardTitle>
                  {existingTrainer && (
                    <>
                      <CardText>Name: {existingTrainer.name}</CardText>
                      <CardText>Phone: {existingTrainer.phone}</CardText>
                    </>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter style={{ display: 'flex'}}>
          <Button style={{backgroundColor:'#dfb455', color:'black', border:'0px'}} onClick={downloadModalContent}>
            Download QR
          </Button>
        </ModalFooter>
      </Modal>

      </div>
    </div>
  );
};

export default PTRegistration;
