import Header from '../tools/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import '../Comunio.css';
import axel from '../axel.jpg';

function hasKeySetTo(obj,value){
    return Object.values(obj).indexOf(value) > -1
}

function Comunio() {
  const { pk } = useParams();
  const [j, setJ] = useState("");
  const [punt, setPunt] = useState("");
  const [alineacion, setAlineacion] = useState({
    por: axel, li: axel, dfcd: axel, dfci: axel, ld: axel, mcd: axel, mi: axel, md: axel, dc: axel, ed: axel, ei: axel
  });
  const [des, setDes] = useState([]);
  const d = new Date();
  let day = d.getDay() - 2;


  if(j === ""){
    axios(
      {
          method: "get",
          url: "/partidas/" + pk + "/j"
      }
  ).then((response) => {
      setJ(response.data.jugadores)
  })}

  console.log(punt)
  if(punt === ""){
    axios(
      {
          method: "get",
          url: "/partidas/" + pk + "/jornada"
      }
  ).then((response) => {
      setPunt(response.data.puntuacion); setDes(response.data.desglose)
  })
  }

  if(j.length > 0){
    for (let i = 0; i < j.length; i++) {
      let jug = j[i]
      let jugador = jug[0]
      let posicion = jug[1]
      if(!hasKeySetTo(alineacion, jugador["foto"])){
        switch (posicion) {
          case "POR":
            console.log(jugador["foto"])
            setAlineacion(prevJ => ({...prevJ, por: jugador["foto"]}))

            break;
          case "MD":
            setAlineacion(prevJ => ({...prevJ, md: jugador["foto"]}))

            break;
          case "MI":
            setAlineacion(prevJ => ({...prevJ, mi: jugador["foto"]}))

            break;
          case "MCD":
            setAlineacion(prevJ => ({...prevJ, mcd: jugador["foto"]}))

            break;
          case "DFCD":
            setAlineacion(prevJ => ({...prevJ, dfcd: jugador["foto"]}))
            
            break;
          case "DFCI":
            setAlineacion(prevJ => ({...prevJ, dfci: jugador["foto"]}))

            break;
          case "LD":
            setAlineacion(prevJ => ({...prevJ, ld: jugador["foto"]}))
          
            break;
          case "LI":
            setAlineacion(prevJ => ({...prevJ, li: jugador["foto"]}))

            break;
          case "DC":
            setAlineacion(prevJ => ({...prevJ, dc: jugador["foto"]}))

            break;
          case "ED":
            setAlineacion(prevJ => ({...prevJ, ei: jugador["foto"]}))

            break;
          case "EI":
            setAlineacion(prevJ => ({...prevJ, ed: jugador["foto"]}))

            break;
          default:
            break;
        }
      }
    }
  }

  let objs = Object.values(alineacion)

  return( 
    <>
      <Header/>
      <Container>
      <Row>
        <Col lg="2">
          { day === 2?
          <>
            <Card className='mt-4'>
            <Card.Body>
              <Card.Text className='text-center'>
                Puntuación: {punt}
              </Card.Text>
            </Card.Body>
            <Card.Body>
              <Card.Text className='text-center'>
                {
                    des.map(
                      jugador => (
                        objs.includes(jugador.split("@")[1])?
                        <><span>{jugador.split("@")[0]}</span><br/></>:<span></span>
                      )
                    )
                }
              </Card.Text>
            </Card.Body>
          </Card>
          </>:<span></span>}
        </Col>
        <Col id='col2' lg="8" className="mt-5">
        <Row>
            <Col></Col>
            <Col className='text-center'><img src={alineacion.dc} id='jug_foto'/></Col>
            <Col></Col>
          </Row>
          <Row>
            <Col sm="1"></Col>
            <Col sm="10">
              <Row>
                <Col className='text-center'><img src={alineacion.ei} id='jug_foto'/></Col>
                <Col className='text-center'><img src={alineacion.ed} id='jug_foto'/></Col>
              </Row>
            </Col>
            <Col sm="1"></Col>
          </Row>
          <Row className='mt-5'>
            <Col sm="1"></Col>
            <Col sm="10">
              <Row>
                <Col className='text-center'><img src={alineacion.mi} id='jug_foto'/></Col>
                <Col className='text-center'><img src={alineacion.md} id='jug_foto'/></Col>
              </Row>
            </Col>
            <Col sm="1"></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col className='text-center'><img src={alineacion.mcd} id='jug_foto'/></Col>
            <Col></Col>
          </Row>
          <Row className='mt-5'>
            <Col sm="2"></Col>
            <Col sm="8">
              <Row>
                <Col className='text-center'><img src={alineacion.li} id='jug_foto'/></Col>
                <Col className='text-center'><img src={alineacion.dfci} id='jug_foto'/></Col>
                <Col className='text-center'><img src={alineacion.dfcd} id='jug_foto'/></Col>
                <Col className='text-center'><img src={alineacion.ld} id='jug_foto'/></Col>
              </Row>
            </Col>
            <Col sm="2"></Col>
          </Row>
          <Row className='mt-2'>
            <Col></Col>
            <Col className='text-center'><img src={alineacion.por} id='jug_foto'/></Col>
            <Col></Col>
          </Row>
        </Col>
        <Col lg="2">
        </Col>
      </Row>
      </Container>
    </> 
)}

export default Comunio;