import Header from '../tools/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import '../Comunio.css'
import axel from '../axel.jpg'

function hasKeySetTo(obj,value){
    return Object.values(obj).indexOf(value) > -1
}

function Comunio() {
  const { pk } = useParams();
  const [j, setJ] = useState([]);
  const [punt, setPunt] = useState(0);
  const [alineacion, setAlineacion] = useState({
    por: axel, li: axel, dfcd: axel, dfci: axel, ld: axel, mcd: axel, mi: axel, md: axel, dc: axel, ed: axel, ei: axel
  });
  const [des, setDes] = useState([])


  if(j.length == 0){
    axios(
      {
          method: "get",
          url: "/partidas/" + pk + "/j"
      }
  ).then((response) => {
      setJ(response.data.jugadores)
  })}

  if(punt == 0){
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
      let jugador = j[i]
      if(!hasKeySetTo(alineacion, jugador["foto"])){
        switch (jugador["posicion"]) {
          case "Goalkeeper":
            if (alineacion.por == axel) {
              console.log(jugador["foto"])
              setAlineacion(prevJ => ({...prevJ, por: jugador["foto"]}))
              console.log(alineacion)
            }
            break;
          case "Midfielder":
            if(alineacion.md == axel){
              setAlineacion(prevJ => ({...prevJ, md: jugador["foto"]}))
            }
            else if(alineacion.mi == axel){
              setAlineacion(prevJ => ({...prevJ, mi: jugador["foto"]}))
            }
            else if(alineacion.mcd == axel){
              setAlineacion(prevJ => ({...prevJ, mcd: jugador["foto"]}))
            }

            break;
          case "Defender":
            if(alineacion.dfcd == axel){
              setAlineacion(prevJ => ({...prevJ, dfcd: jugador["foto"]}))
            }
            else if(alineacion.dfci == axel){
              setAlineacion(prevJ => ({...prevJ, dfci: jugador["foto"]}))
            }
            else if(alineacion.ld == axel){
              setAlineacion(prevJ => ({...prevJ, ld: jugador["foto"]}))
            }
            else if(alineacion.li == axel){
              setAlineacion(prevJ => ({...prevJ, li: jugador["foto"]}))
            }

            break;
          case "Attacker":
            if(alineacion.dc == axel){
              setAlineacion(prevJ => ({...prevJ, dc: jugador["foto"]}))
            }
            else if(alineacion.ei == axel){
              setAlineacion(prevJ => ({...prevJ, ei: jugador["foto"]}))
            }
            else if(alineacion.ed == axel){
              setAlineacion(prevJ => ({...prevJ, ed: jugador["foto"]}))
            }

            break;
          default:
            break;
        }
      }
    }
  }

  return( 
    <>
      <Header/>
      <Container>
      <Row>
        <Col md="2">
          <Card className='mt-4'>
            <Card.Body>
              <Card.Text>
                Puntuación: {punt}
              </Card.Text>
            </Card.Body>
            <Card.Body>
              <Card.Text>
                {des.map(
                  jugador => (
                    <><span>{jugador}</span><br/></>
                  )
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col id='col' md="8" className="mt-5">
          <img
              src= {alineacion.por}
              id="por"
              alt="React Bootstrap logo"
            />
          <img
            src= {alineacion.li}
            id="li"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.dfci}
            id="dfci"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.dfcd}
            id="dfcd"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.ld}
            id="ld"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.mcd}
            id="mcd"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.mi}
            id="mi"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.md}
            id="md"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.ei}
            id="ei"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.ed}
            id="ed"
            alt="React Bootstrap logo"
          />
          <img
            src= {alineacion.dc}
            id="dc"
            alt="React Bootstrap logo"
          />
        </Col>
        <Col md="1">
        </Col>
      </Row>
      </Container>
    </> 
)}

export default Comunio;