import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Container, Row, Col, Alert } from 'reactstrap';

function TrainerLog() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format phone number
    let formattedPhone = phone;
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '+62' + formattedPhone.slice(1);
    }

    // Send request to check_phone.php to verify phone number
    try {
      const checkPhoneResponse = await fetch(`https://thekingsgym.id/api/trainer/check_phone.php?phone=${formattedPhone}`);
      const checkPhoneData = await checkPhoneResponse.json();

      // Cek apakah status success dan apakah phone valid
      if (checkPhoneData.success && checkPhoneData.trainer) {
        // Jika phone valid, lanjutkan ke cek_log.php
        const cekLogResponse = await fetch('https://thekingsgym.id/api/trainer/cek_log.php', {
          method: 'POST',
          body: JSON.stringify({ phone: formattedPhone }),
          headers: { 'Content-Type': 'application/json' },
        });
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
  };

  return (
    <Container  style={{ padding:'150px 20px 70px 20px'}}>
      <Row className="justify-content-center">
        <Col md="6">
          <h3 className="text-center mb-4">Trainer Log</h3>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="phone">Phone Number</Label>
              <Input
                type="text"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                required
                invalid={isError}
              />
            </FormGroup>
            <Button color="primary" block>Submit</Button>
          </Form>
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

export default TrainerLog;
