import axios from 'axios';
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import { Navigate } from 'react-router-dom';
import "../Inicio.css"


class JoinLiga extends Component {

    constructor(props) {
        super(props)
        this.state = {nombreEquipo: '', nombreLiga: '',password: '', error: '', isPublic: false, redirect: false, publicas: ''}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);

        if (this.state.publicas === undefined || this.state.publicas.length === 0) {
            axios(
                {
                    method: 'get',
                    url: '/publicas'
                }
            ).then((response) => this.setState({publicas:response.data.ligas}))   
        }
    }

    AlertErrors(errors) {
        if (this.state.show) {
        return (
            <Alert variant="danger" className="mt-5" onClose={() => this.setState({show: false})} dismissible>
                {errors}
            </Alert>
        );
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleChangeCheck(event) 
    {
        const checkbox = document.getElementById("checkbox");
        if (checkbox.checked) 
        {
            this.setState({ isPublic: true })
        }else
        {
            this.setState({ isPublic: false })
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        let formField = new FormData()

        const {nombreEquipo, nombreLiga, password} = this.state

        formField.append('nombreEquipo', nombreEquipo)
        formField.append('nombreLiga', nombreLiga)
        formField.append('password', this.state.isPublic?"noProcede":password)

        axios(
            {
              method: 'post',
              url: '/join',
              data: formField
            }).then((response) => {response.data.errors != undefined?this.setState({error: response.data.errors, show: true}):this.setState({redirect: true})})
    }

    render() 
    {
        console.log("LIGAS PUBLICAS: " + this.state.publicas)
            return(
            <>
                {this.state.redirect && <Navigate to="/" replace={true} />}
                <Container>
                    <Row>
                        <Col md="2"></Col>
                        <Col md="8">
                        {this.state.error != ''?this.AlertErrors(this.state.error):<span></span>}
                            <Card className='mt-3'>
                                <Card.Body>
                                    <Card.Title>Únete a una liga: {this.state.user}</Card.Title>
                                    <Form action="/join/" onSubmit={this.handleSubmit}>
                                        <h3>Liga {this.state.isPublic?<span>Pública</span>:<span>Privada</span>}</h3>
                                        <Form.Group as={ Row } controlId = "formPlaintextLiga">
                                            <Form.Label column className='mb-3' sm="3">
                                                Nombre de Liga:
                                            </Form.Label>
                                            <Col sm="9">
                                            <Form.Control type='text' value={ this.state.nombreLiga } name = "nombreLiga" onChange={ this.handleChange } sm="7"></Form.Control>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={ Row } controlId = "formPlaintextLiga">
                                            <Form.Label column className='mb-3' sm="3">
                                                Nombre de tu Equipo:
                                            </Form.Label>
                                            <Col sm="9">
                                            <Form.Control type='text' value={ this.state.nombreEquipo } name = "nombreEquipo" onChange={ this.handleChange }></Form.Control>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as = { Row } controlId= "formCheckboxLiga" className='ms-3'>
                                            <Form.Check type='checkbox' label="¿Pública?" name='isPublic' id="checkbox" value={ this.state.isPublic } onChange = { this.handleChangeCheck }/>
                                        </Form.Group>
                                        { this.state.isPublic?<span></span>:<Form.Group as= { Row } controlId = "formPlaintextPassword" className='mt-2'>
                                                <Form.Label column className='mb-3' sm="3">
                                                    Contraseña:
                                                </Form.Label>
                                                <Col sm="9">
                                                    <Form.Control type='text' value={ this.state.password } name = "password" onChange={ this.handleChange }></Form.Control>
                                                </Col>
                                            </Form.Group>
                                        }
                                        <Row className='mt-3'>
                                            <Col className='text-center'>
                                                <Button variant='danger' onClick={() => {this.setState({ redirect: true })}}>Cancelar</Button>
                                            </Col>
                                            <Col className='text-center'>
                                                <Button type='submit'>Unirse</Button>
                                            </Col>
                                        </Row>
                                        {
                                            !this.state.isPublic?<span></span>:
                                            <>
                                                <h5 className='mt-5'>Descubre ligas públicas: </h5>
                                                <Row className='mt-4'>
                                                    <Col md="1"></Col>
                                                    <Col md="10" id='scroll2'>
                                                        {this.state.publicas.map(
                                                            liga => (
                                                                <Alert>
                                                                        <Row>
                                                                            <Col md="9"><div className='mt-2'>Nombre: {liga.valores.name}, Puestos disponibles: {liga.numeros}/6</div></Col>
                                                                            <Col md="3" className='text-center'><Button className='text-right' onClick={() => this.setState({nombreLiga: liga.valores.name})}>Seleccionar</Button></Col>
                                                                        </Row>
                                                                </Alert>
                                                            )
                                                        )}
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="2">
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default JoinLiga;