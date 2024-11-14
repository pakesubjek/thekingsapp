import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Button, FormGroup, Label, Input, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { Spinner } from 'reactstrap';


import "./ceklis.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const RegistrationForm = () => {
  const [showOtherField, setShowOtherField] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const [isGymRulesModalOpen, setIsGymRulesModalOpen] = useState(false); // Separate state for Gym Rules modal
  const [errorMessage, setErrorMessage] = useState(''); // State untuk menyimpan pesan error
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // State untuk loading
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // State untuk checkbox

  // Fungsi untuk menampilkan dan menyembunyikan modal Gym rules
  const toggleGymRulesModal = () => setIsGymRulesModalOpen(!isGymRulesModalOpen);

  const initialValues = {
    fullName: "",
    gender: "Laki-laki",
    address: "",
    phone: "",
    email: "",
    membershipType: "",
    paymentMethod: "",
    interestedInTrainer: "",
    groupClasses: "Gym",
    howDidYouKnow: "",
    otherSource: ""
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Nama lengkap diperlukan"),
    gender: Yup.string().required("Pilih jenis kelamin"),
    address: Yup.string().required("Alamat diperlukan"),
    phone: Yup.string()
      .matches(/^(08|\+62)\d{9,12}$/, "Nomor HP tidak valid")
      .required("Nomor HP diperlukan"),
    email: Yup.string().email("Email tidak valid").required("Email diperlukan"),
    membershipType: Yup.string().required("Pilih tipe keanggotaan"),
    paymentMethod: Yup.string().required("Pilih metode pembayaran"),
    interestedInTrainer: Yup.string().required("Pilih opsi personal trainer"),
    howDidYouKnow: Yup.string().required("Harap pilih opsi"),
  });

  const handleSubmit = (values) => {
    const phone = values.phone.startsWith("08")
      ? values.phone.replace("0", "+62")
      : values.phone;

    const formData = { ...values, phone };

    setLoading(true); // Set loading to true before the request

    axios.post("https://thekingsgym.id/api/FreeTrialRegister.php", formData)
      .then((response) => {
        setLoading(false); // Set loading to false after the response
        if (response.data.status === 'success') {
          navigate("/success", { state: formData });  // Navigasi dengan data
        
                  // // Send data to the second API
                  //   const secondApiData = {
                  //     client_secret: "8kUVAap3vuSXp606F64X", // Hardcoded client secret
                  //     nama_member: values.fullName, // Use fullName from form values
                  //     telp_member: phone // Use the formatted phone number
                  //   };

                  //   axios.post("https://servicethekingsgym.grimax.id/add_member_merchant", secondApiData)
                  //     .then((secondApiResponse) => {
                  //       if (secondApiResponse.data.status === 'success') {
                  //         // Redirect to success page with form data
                  //         navigate("/success", { state: formData });
                  //       } else {
                  //         // Handle error from the second API
                  //         setErrorMessage(secondApiResponse.data.message);
                  //         setIsModalOpen(true);
                  //       }
                  //     })
                  //     .catch((error) => {
                  //       // Handle error from the second API
                  //       setErrorMessage('Terjadi kesalahan saat menghubungi server kedua. Silakan coba lagi.');
                  //       setIsModalOpen(true);
                  //     });
        
        } else {
          // Jika ada error dari server
          setErrorMessage(response.data.message);
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        setLoading(false); // Set loading to false if there is an error
        // Tangani error dari axios
        setErrorMessage('Terjadi kesalahan saat menghubungi server. Silakan coba lagi.');
        setIsModalOpen(true);
      });
  };

  const boxStyle = {
    backgroundColor: 'rgba(223, 180, 85, 0.8)', // Warna #dfb455 dengan opacity 50%
    padding: '20px',
    borderRadius: '10px',
    // textAlign: 'center', // Rata tengah
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Bayangan untuk efek kedalaman
    marginBottom:'20px'
  };

  return (
    <div
      style={{
        backgroundImage: `url('/back-1.jpg')`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3%"
      }}
      
    >
      {/* Overlay */}
      <div
        style={{
          position:'absolute',
          height:'100vh',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // backgroundColor: '#000000',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)',
          opacity: 0.7, // Set opacity ke 50%
          zIndex: 1, // Pastikan overlay berada di atas background
        }}
      ></div>

      <div className="container" style={{ zIndex:'100', paddingTop:'80px'}}>
        <Row>
          <Col md="6">
            <div className=" rounded" style={{ color:'white'}}>
              <h2 style={{ color:'#e3b958'}} >The King's Gym</h2>
              <p><i>DO IT, REPEAT, FIT.</i></p>
              <hr style={{ border: '1px solid #e3b958', width: '100%' }} />
              <ul >
                <li> Akses ke semua fasilitas Gym Premium</li>
                <li> Shower room</li>
                <li> Sauna area</li>
                <li> Full AC, Sistem Gate</li>
                <li> Coffee Shop</li>
                <li> Loker room</li>
                <li> Parkiran luas, Gratis!</li>
              </ul>
              <p>Lantai 2 Budiman Swalayan Lubeg <a href="https://maps.app.goo.gl/eyBvbayFrmEkiX9m7" target="_blank" rel="noopener noreferrer" style={{ color: '#e3b958' }}>[Google Map]</a><br/>
                 (Jl. Aru, Lubuk Begalung, Kota Padang, Sumatera Barat - 25221)</p>
            </div>
            
            <div style={boxStyle}>
              <h6>Lengkapi formulir dan dapatkan berbagai diskon serta tawaran menarik dari The Kings Gym</h6>
            </div>
          </Col>
          
          <Col md="6" >
            <div className="p-5 bg-white rounded" >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <h5 >Informasi Pribadi</h5>
                    <hr style={{ border: '1px solid #2d9185', width: '100%' }} />
                    <FormGroup>
                      <Label for="fullName"><small>Nama Lengkap</small></Label>
                      <Field
                        name="fullName"
                        className="form-control"
                        placeholder="Nama Lengkap"
                      />
                      <ErrorMessage name="fullName" component="div" className="text-danger" />
                    </FormGroup>

                    <FormGroup>
                      <Label><small>Jenis Kelamin</small></Label>
                      <br />
                      <ButtonGroup>
                        <Button
                          style={{ backgroundColor: values.gender === "Laki-laki" ? "#2d9185" : "white", borderColor:'#2d9185', color: values.gender === "Laki-laki" ? "white" : "black" }}
                          onClick={() => setFieldValue("gender", "Laki-laki")}
                        >
                          Laki-laki
                        </Button>
                        
                      </ButtonGroup>
                      <ErrorMessage name="gender" component="div" className="text-danger" />
                    </FormGroup>

                    <FormGroup>
                      <Label><small>Alamat</small></Label>
                      <Field name="address" className="form-control" placeholder="Alamat" />
                      <ErrorMessage name="address" component="div" className="text-danger" />
                    </FormGroup>

                    <FormGroup>
                      <Label><small>Nomor HP/Whatsapp</small></Label>
                      <Field name="phone" className="form-control" placeholder="Nomor HP" />
                      <ErrorMessage name="phone" component="div" className="text-danger" />
                    </FormGroup>

                    <FormGroup>
                      <Label><small>Email</small></Label>
                      <Field name="email" className="form-control" placeholder="Email" />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </FormGroup>

                    <h5 style={{ marginTop:'40px'}}>Keanggotaan</h5>
                    <hr style={{ border: '1px solid #2d9185', width: '100%' }} />
                    <FormGroup>
                      <Label><small>Tipe Keanggotaan (Harga Early Bird)</small></Label>
                      <Field as="select" name="membershipType" className="form-control">
                        <option value="">- Pilih Tipe -</option>
                        <option value="Bulanan">Bulanan</option>
                        <option value="3 Bulan">3 Bulan</option>
                        <option value="6 Bulan">6 Bulan</option>
                        <option value="Tahunan">Tahunan</option>
                      </Field>
                      <ErrorMessage name="membershipType" component="div" className="text-danger" />
                    </FormGroup>

                    <FormGroup>
                      <Label><small>Metode Pembayaran</small></Label>
                      <Field as="select" name="paymentMethod" className="form-control">
                        <option value="">- Pilih Metode -</option>
                        <option value="Tunai">Tunai</option>
                        <option value="Transfer">Transfer</option>
                      </Field>
                      <ErrorMessage name="paymentMethod" component="div" className="text-danger" />
                    </FormGroup>

                    <h5 style={{ marginTop:'40px'}}>Informasi Tambahan</h5>
                    <hr style={{ border: '1px solid #2d9185', width: '100%' }} />
                    <FormGroup>
                      <Label><small>Tertarik dengan personal trainer?</small></Label>
                      <Field as="select" name="interestedInTrainer" className="form-control">
                        <option value="">- Pilih -</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                      </Field>
                      <ErrorMessage
                        name="interestedInTrainer"
                        component="div"
                        className="text-danger"
                      />
                    </FormGroup>

                    {/* <FormGroup>
                      <Label><small>Kelas grup yang diminati</small></Label>
                      <Field
                        name="groupClasses"
                        className="form-control"
                        placeholder="Fat loss, Muscle building, Fit rush, dll"
                      />
                    </FormGroup> */}

                    <FormGroup>
                      <Label><small>Dari mana Anda mengetahui tentang The Kings Gym?</small></Label>
                      <Field
                        as="select"
                        name="howDidYouKnow"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("howDidYouKnow", e.target.value);
                          setShowOtherField(e.target.value === "Lainnya");
                        }}
                      >
                        <option value="">- Pilih -</option>
                        <option value="Media Sosial">Media Sosial</option>
                        <option value="Teman/ Referensi">Teman/ Referansi</option>
                        <option value="Google">Google</option>
                        <option value="Iklan Online">Iklan Online</option>
                        <option value="Spanduk/ Brosur">Spanduk/ Brosur</option>
                        <option value="Lainnya">Lainnya</option>
                      </Field>
                      <ErrorMessage name="howDidYouKnow" component="div" className="text-danger" />
                    </FormGroup>

                    {showOtherField && (
                      <FormGroup>
                        <Label>Sebutkan Sumber Lain</Label>
                        <Field
                          name="otherSource"
                          className="form-control"
                          placeholder="Sumber lainnya"
                        />
                        <ErrorMessage
                          name="otherSource"
                          component="div"
                          className="text-danger"
                        />
                      </FormGroup>
                    )}

                    {/* Additional fields */}
                    <FormGroup check style={{ margin:'0', padding:'0'}}>
                      <Label check>
                        <input
                          type="checkbox"
                          checked={isCheckboxChecked}
                          onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                          required
                        />
                        {" "}Saya sudah membaca dan memahami{" "}
                        <span style={{ color: "#2d9185", cursor: "pointer" }} onClick={toggleGymRulesModal}>
                          Peraturan The King's Gym
                        </span>.
                      </Label>
                    </FormGroup>

                    <Button type="submit" className="mt-3" disabled={!isCheckboxChecked || loading}
                      style={{
                        backgroundColor:'#2d9185',
                        border:'none',
                        width:'100%',
                        padding:'7px',
                      }}
                    >
                      <strong>DAFTAR</strong>
                    </Button>

                    {/* Modal Aturan Gym */}
                    <Modal isOpen={isGymRulesModalOpen} toggle={toggleGymRulesModal}>
                      <ModalHeader fluid toggle={toggleGymRulesModal} style={{ backgroundColor:'#312f30', color:'white'}}> 
                        <img
                            src="/logo-gym-ico.png" // Ganti dengan path yang sesuai ke gambar logo Anda
                            alt="Gym Logo"
                            style={{ 
                              width: '20px', 
                              height: 'auto', 
                              marginRight:'10px'
                            }} // Sesuaikan ukuran logo sesuai kebutuhan
                          />
                          Peraturan The King's Gym
                      </ModalHeader>
                      <ModalBody>
                        <strong >Yang Boleh Dilakukan :</strong>
                        <hr style={{ marginTop:'5px'}}/>
                        <ul >
                          <li>Gunakan peralatan dengan benar dan bersihkan setelah digunakan.</li>
                          <li>Selalu pakai handuk dan kembalikan alat ke tempat semula.</li>
                          <li>Pakai pakaian olahraga yang sesuai dan sepatu tertutup.</li>
                          <li>Hormati anggota lain dengan menjaga ruang dan volume suara.</li>
                        </ul>
                        <strong>Yang Tidak Boleh Dilakukan :</strong>
                        <hr style={{ marginTop:'5px'}}/>
                        <ul>
                          <li>Menggunakan alat tanpa handuk atau meninggalkan alat tidak teratur.</li>
                          <li>Membuat keributan, mengganggu, atau makan di area gym.</li>
                          <li>Membuang sampah sembarangan.</li>
                        </ul>
                        <strong>Etika dan Kenyamanan :</strong>
                        <hr style={{ marginTop:'5px'}}/>
                        <ul>
                          <li>Bersikap sopan dan profesional tanpa mengganggu kenyamanan orang lain.</li>
                          <li>Semua bentuk interaksi harus menjaga norma dan etika yang baik di dalam gym.</li>
                          <li>Dilarang mempromosikan atau menunjukkan identitas LGBTQ di dalam gym.</li>
                          <li>Lingkungan gym harus aman, tanpa tindakan intimidasi atau pelecehan terhadap siapa pun.</li>
                        </ul>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          onClick={toggleGymRulesModal}
                          style={{
                            backgroundColor: '#2d9185',
                            border: 'none',
                            width: '100%',
                            padding: '7px',
                          }}
                        >
                          Tutup
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </Form>
                )}
              </Formik>
            </div>
          </Col>
        </Row>
      </div>

      {/* Modal untuk menampilkan pesan error */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader toggle={() => setIsModalOpen(false)}>Error</ModalHeader>
        <ModalBody>{errorMessage}</ModalBody>
      </Modal>

    </div>
  );
};

export default RegistrationForm;
