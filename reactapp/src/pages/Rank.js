import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Header from '../tools/Header';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function abandonarLiga(pk){
    axios(
        {
            method: "get",
            url: "/partidas/" + pk + "/abandonar"
        }
    ).then(
        (response) => {
            console.log("hola");
        }
    )
}

function Rank(){
    const { pk } = useParams();
    const [rank, setRank] = useState([]);
    const [show, setShow] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if(rank != undefined && rank.length == 0){
        axios(
            {
                method: "get",
                url: "/partidas/" + pk + "/liga"
            }
        ).then((response) => {
            setRank(response.data.rank)
        })
    }



    return(
        <>
            { redirect && <Navigate to="/" replace={true}/>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>¿Estás seguro que deseas abandonar esta liga?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={() => {handleClose(); abandonarLiga(pk); setRedirect(true)}}>
                    Sí
                </Button>
                </Modal.Footer>
            </Modal>
            <Header/>
            <Container>
                <Row>
                    <Col></Col>
                    <Col>
                        <Card className='mt-4'>
                            <Card.Body>
                                <Card.Text>
                                    <Row className='text-center'>
                                        <Col><h3>RANKING DE LA LIGA</h3></Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Text>
                                    <Row className='text-center'>
                                        <Col>
                                        { rank != undefined?
                                        rank.map(
                                            equipo => (
                                                <><Row className='mt-3'><Button as = { Link } variant= "success" to = { equipo.id !== pk? `/partidas/contricante/${equipo.id}/${pk}`:`/partidas/plantilla/${pk}` }><b>{equipo.name}</b> {':' + equipo.puntuacion}</Button></Row></>
                                            )
                                            ):<span></span>
                                        }
                                        </Col>
                                    </Row>
                                    <Row className='mt-5'>
                                        <div className='text-center' type="button" onClick={() => {handleShow()}} style={{color: "blue"}}>¿Deseas abandonar la liga?</div>
                                    </Row>                    
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </>
    );
}

export default Rank;