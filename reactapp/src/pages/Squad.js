import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Header from "../tools/Header";
import Alert from "react-bootstrap/Alert";
import "../style/plantilla.css";

function header2(user_pk){
    return(
    <>
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand  as = { Link } to = { `/partidas/${user_pk}` }>Volver</Navbar.Brand>
        </Container>
      </Navbar>
    </>)
}

function convocar(user_pk, pk ,posicion){
    axios(
        {
            method: "get",
            url: "/partidas/" + user_pk + "/convocar/" + pk +"/" + posicion
        }
    ).then((response) => {
        window.location.reload();
    })
}

function vender(user_pk, pk){
    axios(
        {
            method: "get",
            url: "/partidas/" + user_pk + "/vender/" + pk 
        }
    ).then((response) => {
        window.location.reload();
    })
}

function Squad(){

    const { pk } = useParams();
    
    const { us } = useParams();

    const [squad, setSquad] = useState([]);
    
    if(squad.length === 0){
        axios(
          {
              method: "get",
              url: "/partidas/" + pk + "/jugadores"
          }
      ).then((response) => {
          console.log(response.data.jugadores);setSquad(response.data.jugadores)
      })}

    return(
        <>
            {us === undefined || us === pk?<Header/>:header2(us)}
            <Container>
                <Row className="mt-5">
                    <Col md="2"></Col>
                    <Col md="8">
                        <Card id="scroll">
                            <Card.Title className="text-center">
                                <h2 className="mt-2">{us === undefined || us === pk?<span>TUS JUGADORES</span>:<span></span>}</h2>
                            </Card.Title>
                            <Card.Body>
                                <h3>PORTEROS</h3>
                                {squad.map(
                                    j => (  
                                        j[0].posicion === "Goalkeeper"?
                                        <><Alert variant="secondary"><img src={j[0].foto}></img>&nbsp;&nbsp;&nbsp;&nbsp;{j[0].nombre}, {j[0].equipo}: {j[0].rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {
                                            j[1] === 'SUS' && (us === pk || us === undefined)?<><Button onClick={() => convocar(pk, j[0].id, 'POR')}>Convocar</Button>&nbsp;&nbsp;</>:<span></span>
                                        }
                                        {
                                            us === pk || us === undefined?<Button variant="danger" onClick={() => vender(pk, j[0].id)}>Vender</Button>:<span></span>
                                        }
                                        </Alert></>:<span></span>
                                    )
                                )}
                                <h3>DEFENSAS</h3>
                                {squad.map(
                                    j => (
                                        j[0].posicion === "Defender"?
                                        <><Alert variant="secondary"><img src={j[0].foto}></img>&nbsp;&nbsp;&nbsp;&nbsp;{j[0].nombre}, {j[0].equipo}: {j[0].rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {
                                            j[1] === 'SUS' && (us === pk || us === undefined)?<><p>Convocar como: </p>
                                            <Button onClick={() => convocar(pk, j[0].id, 'LI')}>LI</Button>&nbsp;
                                            <Button onClick={() => convocar(pk, j[0].id, 'DFCI')}>DFCI</Button>&nbsp;
                                            <Button onClick={() => convocar(pk, j[0].id, 'DFCD')}>DFCD</Button>&nbsp;
                                            <Button onClick={() => convocar(pk, j[0].id, 'LD')}>LD</Button>&nbsp;&nbsp;</>:<span></span>
                                        }
                                        {
                                            us === pk || us === undefined?<Button variant="danger" onClick={() => vender(pk, j[0].id)}>Vender</Button>:<span></span>
                                        }
                                        </Alert></>:<span></span>

                                    )
                                )}
                                <h3>CENTROCAMPISTAS</h3>
                                {squad.map(
                                    j => (
                                        j[0].posicion === "Midfielder"?
                                        <><Alert variant="secondary"><img src={j[0].foto}></img>&nbsp;&nbsp;&nbsp;&nbsp;{j[0].nombre}, {j[0].equipo}: {j[0].rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {
                                            j[1] === 'SUS' && (us === pk || us === undefined)?<><p>Convocar como: </p>
                                            <Button onClick={() => convocar(pk, j[0].id, 'MI')}>MI</Button>&nbsp;
                                            <Button onClick={() => convocar(pk, j[0].id, 'MCD')}>MCD</Button>&nbsp;
                                            <Button onClick={() => convocar(pk, j[0].id, 'MD')}>MD</Button>&nbsp;&nbsp;</>:<span></span>
                                        }
                                        {
                                            us === pk || us === undefined?<Button variant="danger" onClick={() => vender(pk, j[0].id)}>Vender</Button>:<span></span>
                                        }</Alert></>:<span></span>
                                    )
                                )}
                                <h3>DELANTEROS</h3>
                                {squad.map(
                                    j => (
                                        j[0].posicion === "Attacker"?
                                        <><Alert variant="secondary"><img src={j[0].foto}></img>&nbsp;&nbsp;&nbsp;&nbsp;{j[0].nombre}, {j[0].equipo}: {j[0].rating}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {
                                            j[1] === 'SUS' && (us === pk || us === undefined)?<><p>Convocar como: </p>
                                            <Button onClick={() => convocar(pk, j[0].id, 'EI')}>EI</Button>&nbsp;
                                            <Button onClick={() => convocar(pk, j[0].id, 'DC')}>DC</Button>&nbsp;
                                            <Button onClick={() => convocar(pk, j[0].id, 'ED')}>ED</Button>&nbsp;&nbsp;</>:<span></span>
                                        }
                                        {
                                            us === pk || us === undefined?<Button variant="danger" onClick={() => vender(pk, j[0].id)}>Vender</Button>:<span></span>
                                        }</Alert></>:<span></span>
                                    )
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="2"></Col>
                </Row>
            </Container>
        </>
    )
}

export default Squad;