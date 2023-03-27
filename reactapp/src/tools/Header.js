import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Navigate, Link } from 'react-router-dom';


function Header() {

  const { pk } = useParams();

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand  as = { Link } to = { `/partidas/${pk}` }>TFG</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as = { Link } to = { `/partidas/${pk}/liga` }>Liga</Nav.Link>
            <Nav.Link as = { Link } to = { `/partidas/${pk}/equipo` }>Equipo</Nav.Link>
            <Nav.Link as = { Link } to = { `/partidas/${pk}/plantilla` }>Plantilla</Nav.Link>
            <Nav.Link as = { Link } to = { `/partidas/${pk}/fichajes` }>Fichajes</Nav.Link>
            <Nav.Link as = { Link } to = {'/'}>Ir al Menú</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
)}

export default Header;