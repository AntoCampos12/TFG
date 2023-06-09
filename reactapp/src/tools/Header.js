import { useParams } from 'react-router-dom';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import UserVerify from './UserVerify';


function Header() {

  const { pk } = useParams();

  const d = new Date();
  let day = d.getDay() - 2;

  return (
    <>
      <UserVerify/>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand  as = { Link } to = { `/partidas/${pk}` }>TFG</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id='basic-navbar-bar'>
          <Nav className="me-auto">
            {day > 2 && day < 5?
            <>
              <Nav.Link as = { Link } to = { `/partidas/${pk}/plantilla` }>Plantilla</Nav.Link>
              <Nav.Link as = { Link } to = { `/partidas/${pk}/fichajes` }>Fichajes</Nav.Link>
              <Nav.Link as = { Link } to = {`/partidas/${pk}/intercambios`}>Intercambios</Nav.Link>
            </>:<span></span>}
            <Nav.Link as = { Link } to = { `/partidas/${pk}/ranking` }>Liga</Nav.Link>
            <Nav.Link as = { Link } to = {'/'}>Ir al Menú</Nav.Link>
          </Nav>
          <Nav>
            {day === 2?<><Nav.Link id='menu-span'>Hoy es día de: POSTPARTIDO</Nav.Link></>:<span></span>}
            {day >= 5 || day < 2?<><Nav.Link id='menu-span'>Hoy es día de: PARTIDOS</Nav.Link></>:<span></span>}
            {day > 2 && day < 5?<><Nav.Link id='menu-span'>Hoy es día de: PLANIFICACIÓN</Nav.Link></>:<span></span>}
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
)}

export default Header;