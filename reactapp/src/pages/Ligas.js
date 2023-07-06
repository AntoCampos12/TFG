import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import { Navigate } from 'react-router-dom';
import "../style/Inicio.css"


class Ligas extends Component {

    constructor(props){
        super(props)
        this.state = {user: '', redirect: false, l: '', global1: '', global2: '', global3: ''}

        this.handleChange = this.handleChange.bind(this);
    
        axios(
            {
                method: 'post',
                url: '/'
            }).then((response) => {response.data.user == undefined?this.setState({redirect: true}):
                                this.setState({redirect: false});this.setState({user:response.data.user})})
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    getLigas(){
        axios(
            {
                method: 'get',
                url: '/partidas/getLigas'
            }).then((response) => {
            if(response.data.ligas != this.state.l){
                this.setState({l: response.data.ligas})
            }
        })
    }

    iniciarLiga(pk) {
        let formField = new FormData()

        formField.append('liga', pk)

        axios(
            {
                method: 'post',
                url: '/partidas/iniciar',
                data: formField
            }).then((response) => {
                this.setState({l: ""})
            })
    }

    getGlobalRanking() {
        axios(
            {
                method: 'get',
                url: '/partidas/global'
            }).then((response) => {
                if(response.data.global1 != this.state.global1){
                    this.setState({global1: response.data.global1, global2: response.data.global2, global3: response.data.global3})
                }
            })
    }

    Botones(){
        let array = []
        for (let i = 0; i < this.state.l.length; i++) {
            const element = this.state.l[i];
            if(element.active){
                array.push(
                    <Button variant="outline-primary" className="mt-3" as = { Link } to = { `/${element.pk}/update` }>
                        Liga: {element.liga}, Nombre de tu Equipo: {element.equipo}
                    </Button>
                )
            }else if(element.eowner === element.owner && !element.publica){
                array.push(
                    <Row>
                        <Col md="9">
                            <Button variant="primary" className="mt-3" disabled>
                                La Liga {element.liga} todavía no ha comenzado
                            </Button>
                        </Col>
                        <Col md="2">
                            <Button variant='info' className='mt-3' onClick={() => this.iniciarLiga(element.pk)}>Iniciar</Button>
                        </Col>
                    </Row> 
                )
            }else{
                array.push(
                    <Button variant="primary" className="mt-3" disabled>
                        La Liga {element.liga} todavía no ha dado comienzo
                    </Button>
                )
            }
        }
        return array 
    }
        /*this.state.l.map(
            liga => (
                liga.active?
                <Button variant="outline-primary" className="mt-3" as = { Link } to = { `/${liga.pk}/update` }>
                    Liga: {liga.liga}, Nombre de tu Equipo: {liga.equipo}
                </Button>:
                <Button variant="primary" className="mt-3" disabled>
                    La Liga {liga.liga} todavía no ha dado comienzo
                </Button>
            )
        ) */

    poblar(){
        axios(
            {
                method: 'get',
                url: '/hola'
            })
    }

    cerrarSesión() {
        axios(
            {
                method: 'get',
                url: '/authentication/logout'
            }).then(() => {
                this.setState({redirect:true})
            })
    }

    render() {
        return(
            <>
                { this.state.redirect && <Navigate to="/authentication/login" replace={true} />}
                { this.state.l === '' && this.getLigas() }
                { this.state.global1 === '' && this.getGlobalRanking()}
                <Container>
                    <Row>
                        <Col md="5" className='w'>
                            <Row className='h-100 justify-content-center align-items-center'>
                                <Col md="11">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className='text-center'>RANKING GLOBAL</Card.Title>
                                            <span>Descubre los mejores jugadores de SimSoccer:</span>
                                            <Card.Text>
                                                <Alert variant='warning mt-3 text-center'><b>1.-</b> {this.state.global1.jugador}, {this.state.global1.puntuacion}</Alert>
                                                <Alert variant='light text-center'><b>2.-</b> {this.state.global2.jugador}, {this.state.global2.puntuacion}</Alert>
                                                <Alert variant='secondary text-center'><b>3.-</b> {this.state.global3.jugador}, {this.state.global3.puntuacion}</Alert>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <hr className="solid"></hr>
                                    <Row>
                                        <Col className='text-center'>
                                            <Button variant='danger'  className="mt-4" onClick={() => {this.cerrarSesión()}}>Cerrar Sesión</Button>
                                        </Col>
                                        <Col className='text-center'>
                                            <Button variant='secondary' className="mt-4" as={ Link } to="/authentication/update">Ajustes</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col md="2">
                        </Col>
                        <Col md="5" className='w'>
                            <Row className='h-100 justify-content-center align-items-center'>
                                <Col md="11">
                                        <Card>
                                        <Card.Body>
                                            <Card.Title>Bienvenido {this.state.user}</Card.Title>
                                            <span>Aquí se mostrarán tus ligas:</span>
                                            <Card.Text className='text-center'>
                                                {
                                                    this.state.l !== undefined && this.state.l !== '' && this.Botones()
                                                }
                                            </Card.Text>
                                            <Row className='text-center'>
                                                <Col>
                                                    <Button variant="primary" className="mt-2" as={ Link } to="/add">Añadir liga</Button>
                                                </Col>
                                                <Col>
                                                    <Button variant='primary' className='mt-2' as={ Link } to="/join">Unirse a una liga</Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row> 
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Ligas;