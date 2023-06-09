import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import '../Inicio.css'

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {username: '', password: '', error: '',show: true, redirect: false, redirect2: false}

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

   poblar(){
        console.log("poblando")
        axios(
            {
                method:'get',
                url: "/poblar"
            }
        ).then((response) =>{
            console.log("poblado")
        })
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault()
        let formField = new FormData()

        const {username, password} = this.state

        formField.append('username', username)
        formField.append('password',password)

        axios(
            {
              method: 'post',
              url: '/authentication/login',
              data: formField
            }).then((response) => {response.data.errors != undefined?this.setState({error: response.data.errors, show: true}):this.setState({redirect: true})})
    }

    render() 
    {
        return (
            <>
                {this.state.redirect && <Navigate to="/" replace={true}/>}
                {this.state.redirect2 && <Navigate to="/authentication/" replace={true}/>}
                <Container style={{ maxWidth: 6000 }}>
                <Row>
                    <Col></Col>
                    <Col className='w'>
                        <Row className='h-100 justify-content-center align-items-center'>
                            <Col md="11">
                                <h1 className='text-center mb-5' id='abril'>SIM SOCCER</h1>
                                <h2 className='text-center mt-5 mb-4'>INICIAR SESIÓN</h2>
                                {this.state.error != ''?this.AlertErrors(this.state.error):<span></span>}
                                <Form action="/authentication/login/" onSubmit={this.handleSubmit}>
                                <Form.Group as={Row} controlId='formPlaintextUsername'>
                                    <Form.Label column className='mb-3' sm="2">
                                    Usuario
                                    </Form.Label>
                                    <Col>
                                    <Form.Control type='text' value={this.state.username} onChange={this.handleChange} name="username"></Form.Control>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className = "mb-3" controlId='formPlaintextPassword'>
                                    <Form.Label column sm="2">
                                    Contraseña
                                    </Form.Label>
                                    <Col>
                                    <Form.Control type='password' name="password" value={this.state.password} onChange={this.handleChange}></Form.Control>
                                    </Col>
                                </Form.Group>
                                    <div className='text-center' type="button" style={{ color: "blue"}} onClick={() => {this.setState({redirect2:true})}}>¿No tienes cuenta? Regístrate, es gratis</div>
                                    <div className='text-center mt-4'>
                                        <Button variant="primary" type="submit">
                                            Confirmar
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </Container>
            </>
        )
    }
}

export default LoginForm