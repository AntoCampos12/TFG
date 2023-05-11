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
        this.state = {nombreEquipo: '', nombreLiga: '',password: '', error: '', nombreLiga2: '', nombreEquipo2: '',redirect: false}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);    
    }

    AlertErrors(errors) {
        if (this.state.show) {
        return (
            <Alert variant="danger" onClose={() => this.setState({show: false})} dismissible>
                {errors}
            </Alert>
        );
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault()
        let formField = new FormData()

        const {nombreEquipo, nombreLiga, password} = this.state

        formField.append('nombreEquipo', nombreEquipo)
        formField.append('nombreLiga', nombreLiga)
        formField.append('password', password)

        axios(
            {
              method: 'post',
              url: '/join',
              data: formField
            }).then((response) => {response.data.errors != undefined?this.setState({error: response.data.errors, show: true}):this.setState({redirect: true})})
    }

    handleSubmit2(event) {
        event.preventDefault()
        let formField = new FormData()

        formField.append('nombreEquipo', this.state.nombreEquipo2)
        formField.append('nombreLiga', this.state.nombreLiga2)
        formField.append('password', 'noProcede')

        axios(
            {
              method: 'post',
              url: '/join',
              data: formField
            }).then((response) => {response.data.errors != undefined?this.setState({error: response.data.errors, show: true}):this.setState({redirect: true})})
    }

    render() 
    {
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
                                    <Card.Title>Únete a una liga nueva: {this.state.user}</Card.Title>
                                    <Form action="/join/" onSubmit={this.handleSubmit}>
                                        <h3>Liga privada</h3>
                                        <Form.Group as={ Row } controlId = "formPlaintextLiga">
                                            <Form.Label column className='mb-3' sm="2">
                                                Nombre de Liga:
                                            </Form.Label>
                                            <Form.Control type='text' value={ this.state.nombreLiga } name = "nombreLiga" onChange={ this.handleChange } sm="7"></Form.Control>
                                        </Form.Group>
                                        <Form.Group as={ Row } controlId = "formPlaintextLiga">
                                            <Form.Label column className='mb-3' sm="2">
                                                Nombre de tu Equipo:
                                            </Form.Label>
                                            <Form.Control type='text' value={ this.state.nombreEquipo } name = "nombreEquipo" onChange={ this.handleChange }></Form.Control>
                                        </Form.Group>
                                        <Form.Group as= { Row } controlId = "formPlaintextPassword">
                                            <Form.Label column className='mb-3' sm="2">
                                                Contraseña:
                                            </Form.Label>
                                            <Form.Control type='text' value={ this.state.password } name = "password" onChange={ this.handleChange }></Form.Control>
                                        </Form.Group>
                                    <div>
                                        <Button variant='danger' onClick={() => {this.setState({ redirect: true })}}>Cancelar</Button>
                                        <Button type='submit'>Añadir</Button>
                                    </div>
                                    </Form>
                                    <Form action="/join/" onSubmit={this.handleSubmit2}>
                                        <h3>Liga pública</h3>
                                        <Form.Group as={ Row } controlId = "formPlaintextLiga">
                                            <Form.Label column className='mb-3' sm="2">
                                                Nombre de Liga:
                                            </Form.Label>
                                            <Form.Control type='text' value={ this.state.nombreLiga2 } name = "nombreLiga2" onChange={ this.handleChange } sm="7"></Form.Control>
                                        </Form.Group>
                                        <Form.Group as={ Row } controlId = "formPlaintextLiga">
                                            <Form.Label column className='mb-3' sm="2">
                                                Nombre de tu Equipo:
                                            </Form.Label>
                                            <Form.Control type='text' value={ this.state.nombreEquipo2 } name = "nombreEquipo2" onChange={ this.handleChange }></Form.Control>
                                        </Form.Group>
                                    <div>
                                        <Button variant='danger' onClick={() => {this.setState({ redirect: true })}}>Cancelar</Button>
                                        <Button type='submit'>Añadir</Button>
                                    </div>
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