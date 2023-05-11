import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import Header from '../tools/Header';
import Button from 'react-bootstrap/Button';
import { CheckCircleFill, XCircle } from 'react-bootstrap-icons';

function handleSubmit(pk, pk2){
    let formField = new FormData()

    let checkboxes = document.querySelectorAll('input[id="check1"]:checked');
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    })

    let checkboxes2 = document.querySelectorAll('input[id="check2"]:checked');
    let values2 = [];
    checkboxes2.forEach((checkbox) => {
        values2.push(checkbox.value);
    })

    formField.append('ofrece',pk);
    formField.append('recibe',pk2);
    values.forEach(
        item => {formField.append('jofrece',item)}
    )
    values2.forEach(
        item => {formField.append('jrecibe',item)}
    )

   axios(
        {
          method: 'post',
          url: '/partidas/exchange/post',
          data: formField
        }).then((response) => {console.log(response.data.error)})
}

function borrarExchange(intercambio){
    axios(
        {
            method: 'get',
            url: '/partidas/borrar/exchange/' + intercambio
        }
    ).then((response) => {window.location.reload()})
}

function aceptarExchange(intercambio){
    axios(
        {
            method: 'get',
            url: '/partidas/aceptar/exchange/' + intercambio
        }
    ).then((response) => {window.location.reload()})
}

function Exchange() {

    const { pk } = useParams();
    const [propuestos, setPropuestos] = useState("");
    const [ofrecidos, setOfrecidos] = useState("");
    const [misj , setMisj] = useState("");
    const [susJ, setSusj] = useState("");
    const [eInt, setEint] = useState("");
    const [pk2, setPk2] = useState("");
    const [equipos, setEquipos] = useState("");

    if(propuestos === "" && ofrecidos === ""){
    axios(
        {
            method: 'get',
            url: '/partidas/' + pk + '/geti'
        }).then((response) => {
            setPropuestos(response.data.ofrecidos);setOfrecidos(response.data.recibidos)
    })}

    if(equipos === ""){
        axios(
            {
                method: 'get',
                url: '/partidas/' + pk + '/liga'
            }).then((response) => {
                setEquipos(response.data.rank);
        })
    }

    if(misj === ""){

        axios(
            {
                method: "get",
                url: "/partidas/" + pk + "/jugadores"
            }
        ).then((response) => {
            setMisj(response.data.jugadores);
        })
    }

    if(eInt !== "" && eInt !== undefined){
        axios(
            {
                method: "get",
                url: "/partidas/" + eInt + "/jugadores"
            }
        ).then((response) => {
            setSusj(response.data.jugadores);setEint("");
        })
    }

    return (
        <>
            <Header/>
            <Container>
                <Row className='mt-5'>
                    <Col sm="6">
                        <Card className='text-center'>
                            <Card.Title className='mt-2'>INTERCAMBIOS OFRECIDOS</Card.Title>
                            <Card.Text>
                                {
                                    ofrecidos !== undefined && ofrecidos !== ""?
                                    ofrecidos.map(
                                        intercambio => (
                                            <p>
                                                {
                                                intercambio.o.map(o => (
                                                    <span>{o}&nbsp;</span>
                                                ))}A CAMBIO DE: {intercambio.r.map(r =>(
                                                    <span>{r}&nbsp;</span>
                                                ))}
                                            </p>
                                        )
                                    )
                                    :<span></span>
                                }
                            </Card.Text>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card className='text-center'>
                            <Card.Title className='mt-2'>INTERCAMBIOS PROPUESTOS</Card.Title>
                            <Card.Text>
                            {
                                    propuestos !== undefined && propuestos !== ""?
                                    propuestos.map(
                                        intercambio => (
                                            <p>
                                                {
                                                intercambio.o.map(o => (
                                                    <span>{o}&nbsp;</span>
                                                ))} A CAMBIO DE: {intercambio.r.map(r =>(
                                                   <><span>{r}&nbsp;</span></>
                                                ))}
                                                <CheckCircleFill onClick={() => {aceptarExchange(intercambio.id)}}/><XCircle onClick={() => {borrarExchange(intercambio.id)}}/>
                                            </p>
                                        )
                                    )
                                    :<span></span>
                                }
                            </Card.Text>
                        </Card>    
                    </Col>
                </Row>
                <Form onSubmit={() => {handleSubmit(pk, pk2)}} className='mt-3'>
                    <Row>
                        <Col sm="4">
                            <Card>
                                <Card.Title className='mt-1 text-center'>TUS JUGADORES</Card.Title>
                                <Card.Body>
                                    {
                                        misj === undefined || misj === ""?<span></span>:
                                        misj.map(
                                            jug => (
                                                <Form.Check 
                                                    type="checkbox"
                                                    id="check1"
                                                    label={jug[0].nombre}
                                                    value={jug[0].id}
                                                /> 
                                            )
                                        )
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm="4">
                            <Card>
                                <Card.Title className='mt-1 text-center'>SUS JUGADORES</Card.Title>
                                <Card.Body>
                                {
                                    susJ === undefined || susJ === ""?<span></span>:
                                    susJ.map(
                                        jug => (
                                            <Form.Check 
                                                type="checkbox"
                                                id="check2"
                                                label={jug[0].nombre}
                                                value={jug[0].id}
                                            /> 
                                        )
                                    )
                                }   
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm="4">
                            <Card>
                                <Card.Title>&nbsp;&nbsp;ELIGE UN EQUIPO</Card.Title>
                            </Card>
                            <Card.Body>
                                <Form.Select onChange={(event) => {setEint(event.target.value);setPk2(event.target.value)}}>
                                    <option value={""}>Selecciona un equipo</option>
                                    {
                                        equipos === undefined || equipos === ""?<span></span>:
                                        equipos.map(
                                            equipo => (
                                                "" + equipo.id === "" + pk?<span></span>:<option value={equipo.id}>{equipo.name}</option>
                                            )
                                        )
                                    }
                                </Form.Select>
                            </Card.Body>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="1"></Col>
                        <Col md="6">
                            <Row className='mt-3'>
                                <Button variant="primary" type="submit">
                                    Enviar
                                </Button>
                            </Row>
                        </Col>
                        <Col md="5"></Col>
                    </Row>
                </Form>
            </Container>
        </>
    )
}

export default Exchange;