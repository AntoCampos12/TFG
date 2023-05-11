import { useParams } from 'react-router-dom';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


function Header() {

  const { pk } = useParams();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand  as = { Link } to = { `/partidas/${pk}` }>TFG</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id='basic-navbar-bar'>
          <Nav className="me-auto">
            <Nav.Link as = { Link } to = { `/partidas/${pk}/ranking` }>Liga</Nav.Link>
            <Nav.Link as = { Link } to = { `/partidas/${pk}/plantilla` }>Plantilla</Nav.Link>
            <Nav.Link as = { Link } to = { `/partidas/${pk}/fichajes` }>Fichajes</Nav.Link>
            <Nav.Link as = { Link } to = {`/partidas/${pk}/intercambios`}>Intercambios</Nav.Link>
            <Nav.Link as = { Link } to = {'/'}>Ir al Menú</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
)}

export default Header;