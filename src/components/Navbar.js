import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  return (
    <Navbar  dark expand="md" style={{position:'fixed', width:'100%', backgroundColor:'#312f30', zIndex:'1000', margin:'0'}}>
      <NavbarBrand tag={Link} to="/">
        <img
          src="/logo-gym.png" // Ganti dengan path yang sesuai ke gambar logo Anda
          alt="Gym Logo"
          style={{ 
            width: '90px', 
            height: 'auto', 
          }} // Sesuaikan ukuran logo sesuai kebutuhan
        />
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        {/* <NavItem>
          <NavLink tag={Link} to="/registration">
            Daftar
          </NavLink>
        </NavItem> */}
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
