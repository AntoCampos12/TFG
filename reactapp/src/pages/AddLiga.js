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


class AddLiga extends Component {

    constructor(props) {
        super(props)
        this.state = {nombreEquipo: '', nombreLiga: '', isPublic: false, password: '', user : '', error: '', redirect: false}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        
        axios(
            {
                method: 'post',
                url: '/'
            }).then((response) => {
                response.data.user == undefined?this.setState({ redirect: true }):this.setState( { redirect: false });this.setState({ user: response.data.user })
                }
            )
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

    handleChangeCheck(event) 
    {
        const checkbox = document.getElementById("checkbox")
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

        const {nombreEquipo, nombreLiga, isPublic, password} = this.state

        formField.append('nombreEquipo', nombreEquipo)
        formField.append('nombreLiga', nombreLiga)
        formField.append('isPublic', isPublic==true?'True':'False')
        formField.append('password', isPublic==true?'noProcede':password)

        axios(
            {
              method: 'post',
              url: '/add',
              data: formField
            }).then((response) => {response.data.errors != undefined?this.setState({error: response.data.errors, show: true}):this.setState({redirect: true})})
    }

    render() 
    {
        console.log(this.state.isPublic)
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
                                    <Card.Title>Añade una liga nueva: {this.state.user}</Card.Title>
                                    <Form action="/add/" onSubmit={this.handleSubmit}>
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
                                        <Form.Group as = { Row } controlId= "formCheckboxLiga">
                                            <Form.Check type='checkbox' label="¿Pública?" name='isPublic' id="checkbox" value={ this.state.isPublic } onChange = { this.handleChangeCheck }/>
                                        </Form.Group>
                                        { this.state.isPublic?<span></span>:
                                            <Form.Group as= { Row } controlId = "formPlaintextPassword">
                                                <Form.Label column className='mb-3' sm="2">
                                                    Contraseña:
                                                </Form.Label>
                                                <Form.Control type='text' value={ this.state.password } name = "password" onChange={ this.handleChange }></Form.Control>
                                            </Form.Group>
                                        }
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

export default AddLiga;