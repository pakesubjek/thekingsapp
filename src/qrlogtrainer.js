import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, Alert, Progress } from 'reactstrap';

function QRLogTrainer() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [pingTime, setPingTime] = useState(null);

  // Cek kualitas koneksi internet
  const checkConnection = () => {
    if (navigator.connection) {
      const connectionType = navigator.connection.effectiveType; // "4g", "3g", "2g", "slow-2g", etc.
      setConnectionStatus(`Connection Type: ${connectionType}`);
    } else {
      setConnectionStatus('Connection Type: Unknown');
    }
  };

  // Fungsi untuk mengukur kecepatan internet menggunakan ping
  const measurePing = async () => {
    const start = Date.now();
    try {
      const response = await fetch('https://thekingsgym.id/api/ping', { method: 'GET' });
      const end = Date.now();
      const time = end - start; // Mengukur waktu round trip ping (dalam milidetik)
      setPingTime(time);
    } catch (error) {
      setPingTime(null); // Jika ada error (misal tidak ada koneksi), set waktu ke null
    }
  };

  useEffect(() => {
    // Cek koneksi saat halaman dimuat
    checkConnection();
    measurePing();
  }, []);

  const formatPhoneNumber = (input) => {
    const phoneMatch = input.match(/\+62\d+/);
    return phoneMatch ? phoneMatch[0] : '';
  };

  const handlePhoneChange = async (e) => {
    const inputPhone = e.target.value;
    const formattedPhone = formatPhoneNumber(inputPhone);
    setPhone(formattedPhone);

    if (formattedPhone && formattedPhone.startsWith('+62')) {
      await processPhone(formattedPhone);
    }
  };

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
  };

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

          {connectionStatus && <div className="mt-3">Connection Status: {connectionStatus}</div>}

          {pingTime !== null && (
            <div className="mt-3">
              {pingTime < 100
                ? 'Good internet speed'
                : pingTime < 200
                ? 'Average internet speed'
                : 'Poor internet speed'} (Ping: {pingTime} ms)
            </div>
          )}

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
