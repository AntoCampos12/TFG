import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Header from '../tools/Header';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';


const dict_equipos = {'Girona': 0.5, 'Sevilla' : 0.80, 'Rayo Vallecano': 0.6, 'Real Sociedad': 0.85, 'Barcelona' : 1.00, 'Real Betis' : 0.80, 'Elche': 0.3, 'Villarreal':0.80, 'Valladolid': 0.4, 'Athletic Club':0.75, 'Cadiz': 0.4, 'Getafe': 0.4, 'Celta Vigo': 0.6, 'Espanyol': 0.5, 'FC Cartagena' : 0.2, 'Valencia': 0.4, 'Osasuna': 0.7, 'Atletico Madrid' : 0.85, 'Almeria': 0.4, 'Real Madrid': 1.00, 'Mallorca': 0.5}

function commafy( num, equipo ) {

    num = num * dict_equipos[equipo]
    num = parseInt(num)

    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}

function Fichajes() {

    const [jugadores, setJugadores] = useState([])
    const [presupuesto, setPresupuesto] = useState(0.00)
    const [page, setPage] = useState(1)
    const { pk } = useParams();

    async function handleSubmit(jugador, pk) {

        let formField = new FormData()
        formField.append("jugador",jugador.nombre)
        formField.append("equipoJugador",jugador.equipo)
        formField.append("equipo", pk)
        const response = await axios(
            {
                method: "post",
                url: "/partidas/fichar",
                data: formField
            }
        )

        const data = await response.data;
        setJugadores([]);
    }


    if(jugadores === undefined || jugadores.length === 0) {
            axios(
            {
                method: "get",
                url: "/partidas/" + pk + "/freeAgents"
            }
        ).then((response) => {
            let res = response.data.jugadores;
            console.log(res)
            setPresupuesto(res[0]);
            setJugadores(res);
        })
    }

    let items = [];
    for (let number = 1; number <= 3; number++) {
        items.push(
            <Pagination.Item key={number} active={number === page} onClick={() => {setPage(number)}}>
            {number}
            </Pagination.Item>,
        );
    }

    return(
        <>
        <Header/>
        <Container>
        <Row>
        <Col md="2"></Col>
        <Col md="8">
        <Card className='mt-4'>
            <Card.Body>
                <Card.Title className='text-center mb-3'>AGENTES LIBRES</Card.Title>
                <Card.Text>
                    <p className='text-center mb-3'>PRESUPUESTO: {commafy(presupuesto,"Barcelona")} €</p>
                    {
                        jugadores == undefined || jugadores.length == 0?<span></span>:
                        jugadores.slice(5*(page-1) + 1, 5*(page-1) + 6).map(
                            j => (
                                <Alert>
                                    <img src={j.foto} style={{ width: 50, height: 50, borderRadius: 50}}/> 
                                    &nbsp; {j.nombre}, {j.equipo} &nbsp; &nbsp; &nbsp; Rating: {j.rating.toFixed(2)} &nbsp; &nbsp; &nbsp; Precio: {commafy(j.rating * 5000000, j.equipo)}
                                    &nbsp; &nbsp; {presupuesto > j.rating * 5000000 * dict_equipos[j.equipo]?
                                    <Button onClick={() => {handleSubmit(j, pk)}}>Fichar</Button>:
                                    <span style={{color: "red"}}>Presupuesto insuficiente</span>}
                                </Alert>
                            )
                        )
                    }
                    <Row>
                        <Col></Col>
                        <Col className='d-flex justify-content-center'>
                            <Pagination>{ items }</Pagination>
                        </Col>
                        <Col></Col>
                    </Row>
                </Card.Text>
            </Card.Body>
        </Card>
        </Col>
        <Col md="2"></Col>
        </Row>
        </Container>
        </>
    )
}

export default Fichajes;