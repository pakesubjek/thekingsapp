import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="text-white py-4" style={{ backgroundColor:'#4e7986', zIndex:'200'}}>
      <Container>
        <Row>
          <Col md="6">
            <small><p className="mb-0">© {new Date().getFullYear()} The Kings Gym. All rights reserved.</p></small>
          </Col>
          {/* <Col md="6" className="text-md-right">
            <a href="https://www.facebook.com" className="text-white mx-2">Facebook</a>
            <a href="https://www.instagram.com" className="text-white mx-2">Instagram</a>
            <a href="https://www.twitter.com" className="text-white mx-2">Twitter</a>
          </Col> */}
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
