import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, Alert, Progress } from 'reactstrap';

function QRLogTrainer() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Format nomor telepon dari input QR code
  const formatPhoneNumber = (input) => {
    const phoneMatch = input.match(/KING-\d{3}-(\d+)/); // Cocokkan format "KING-xxx-<nomor>"
    if (phoneMatch) {
      return '+' + phoneMatch[1]; // Tambahkan "+" di depan nomor
    }
    return ''; // Jika tidak cocok, kembalikan string kosong
  };

  // Tangani perubahan input
  const handlePhoneChange = async (e) => {
    const inputPhone = e.target.value; // Data mentah dari QR scanner
    const formattedPhone = formatPhoneNumber(inputPhone); // Format data
    setPhone(formattedPhone); // Set ke state

    // Jika nomor dimulai dengan +62, proses nomor
    if (formattedPhone && formattedPhone.startsWith('+62')) {
      await processPhone(formattedPhone);
    }
  };

  // Fokuskan field input saat halaman dimuat
  useEffect(() => {
    document.getElementById('phone').focus();
  }, []);

  // Proses nomor telepon
  const processPhone = async (formattedPhone) => {
    setLoading(true);
    setProgress(25);

    try {
      const checkPhoneResponse = await fetch(`https://thekingsgym.id/api/trainer/check_phone.php?phone=${formattedPhone}`);
      setProgress(50);
      const checkPhoneData = await checkPhoneResponse.json();

      if (checkPhoneData.success && checkPhoneData.trainer) {
        const cekLogResponse = await fetch('https://thekingsgym.id/api/trainer/cek_log.php', {
          method: 'POST',
          body: JSON.stringify({ phone: formattedPhone }),
          headers: { 'Content-Type': 'application/json' },
        });
        setProgress(75);
        const cekLogData = await cekLogResponse.json();

        if (cekLogData.status === 'success') {
          setMessage('Log updated or new log added successfully!');
          setIsError(false);
        } else {
          setMessage('Error while updating log!');
          setIsError(true);
        }
      } else {
        setMessage('Phone number is not valid!');
        setIsError(true);
      }
    } catch (error) {
      setMessage('An error occurred, please try again.');
      setIsError(true);
    }

    setProgress(100);
    setLoading(false);

    // Kosongkan input dan fokus kembali
    setPhone(''); // Kosongkan field
    document.getElementById('phone').focus(); // Fokuskan kembali field input
  };

  // Hindari form submit dengan menekan Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Container style={{ padding: '150px 20px 70px 20px' }}>
      <Row className="justify-content-center">
        <Col md="6">
          <h3 className="text-center mb-4">QR Trainer Log</h3>
          <Form>
            <FormGroup>
              <Label for="phone">Phone Number</Label>
              <Input
                type="text"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={handleKeyPress}
                placeholder="Scan QR or enter phone number"
                required
                invalid={isError}
              />
            </FormGroup>
            <Button color="primary" block disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </Button>
          </Form>

          {loading && (
            <>
              <Progress value={progress} />
              <div className="mt-2">Processing... {progress}%</div>
            </>
          )}

          {message && (
            <Alert color={isError ? 'danger' : 'success'} className="mt-3">
              {message}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default QRLogTrainer;
