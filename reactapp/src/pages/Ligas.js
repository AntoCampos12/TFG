import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import { Navigate } from 'react-router-dom';
import "../Inicio.css"


class Ligas extends Component {

    constructor(props){
        super(props)
        this.state = {user: '', redirect: false, l: ''}

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
                url: '/getLigas'
            }).then((response) => {
            if(response.data.ligas != this.state.l){
                this.setState({l: response.data.ligas})
            }
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
                { this.state.l == '' && this.getLigas() }
                <Container>
                    <Row>
                        <Col md="4"></Col>
                        <Col md="4">
                            <Card className='mt-5'>
                                <Card.Body>
                                    <Card.Title>Bienvenido {this.state.user}</Card.Title>
                                    <Card.Text>
                                        Aquí se mostrarán tus ligas:
                                        {
                                           this.state.l == undefined || this.state.l == ''?<span></span>:
                                           this.state.l.map(
                                            liga => (
                                                <Button variant="outline-primary" className="mt-3" as = { Link } to = { `/${liga.pk}/update` }>
                                                    Liga: {liga.liga}, Nombre de tu Equipo: {liga.equipo}
                                                </Button>
                                            )
                                           )
                                        }
                                    </Card.Text>
                                    <Row className='text-center'>
                                        <Col>
                                            <Button variant="primary" className='mb-3' as={ Link } to="/add">Añadir liga</Button>
                                        </Col>
                                        <Col>
                                            <Button variant='primary' className='mb-3' as={ Link } to="/join">Unirse a una liga</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='text-center'>
                                            <Button variant='danger'  className="mt-4" onClick={() => {this.cerrarSesión()}}>Cerrar Sesión</Button>
                                        </Col>
                                        <Col className='text-center'>
                                            <Button variant='secondary' className="mt-4" as={ Link } to="/authentication/update">Ajustes</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="4">
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Ligas;