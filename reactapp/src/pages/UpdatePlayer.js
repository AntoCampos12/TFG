import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import '../Inicio.css'
import { Navigate } from 'react-router-dom';


class UserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {username: '', email: '', first_name: '', last_name: '', error: '', show: true, redirect: false}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    axios({
        method: 'get',
        url: '/authentication/user'
    }).then( (response) => {this.setState({username: response.data.usuario[0], first_name: response.data.usuario[1], email: response.data.usuario[2], last_name: response.data.usuario[3]})})
  }

  AlertErrors(errors)
  {
    console.log(this.state.show)
    if (this.state.show) {
      return (
        <Alert variant="danger" onClose={() => this.setState({show:false})} dismissible>
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

    const {username, email, first_name, last_name} = this.state
  
    formField.append('username',username)
    formField.append('email',email)
    formField.append('first_name',first_name)
    formField.append('last_name',last_name)

    axios(
      {
        method: 'post',
        url: '',
        data: formField
      }).then((response) => {response.data.errors != undefined?this.setState({error: response.data.errors, show: true}):this.setState({redirect: true})})
  }

  render() {
    return (
      <>
        { this.state.redirect && <Navigate to="/" replace={true} state={{ r: false }}/>}
        <Container style={{ maxWidth: 6000 }}>
        <Row>
        <Col md="3"></Col>
        <Col md="6" className='w'>
          <Row className='h-100 justify-content-center align-items-center'>
              <Col md="11">
                <h1 className='text-center mt-3'>ACTUALIZAR PERFIL</h1>
                {this.state.error != ''?this.AlertErrors(this.state.error):<span></span>}
                <Form action="/authentication/" onSubmit={this.handleSubmit}>
                  <Form.Group as={Row} className = "mb-3 mt-4" controlId='formPlaintextUsername'>
                    <Form.Label column sm="2">
                      Usuario:
                    </Form.Label>
                    <Col>
                      <Form.Control type='text' value={this.state.username} onChange={this.handleChange} name="username"></Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className = "mb-1" controlId='formPlaintextEmail'>
                    <Form.Label column sm="2">
                      Correo electrónico:
                    </Form.Label>
                    <Col>
                      <Form.Control type='email' name="email" value={this.state.email} onChange={this.handleChange}></Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className = "mb-3" controlId='formPlaintextName'>
                    <Form.Label column sm="2">
                      Nombre:
                    </Form.Label>
                    <Col>
                      <Form.Control type='text' name='first_name' value={this.state.first_name} onChange={this.handleChange}></Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className = "mb-3" controlId='formPlaintextLastName'>
                    <Form.Label column sm="2">
                      Apellidos:
                    </Form.Label>
                    <Col>
                      <Form.Control type='text' name="last_name" value={this.state.last_name} onChange={this.handleChange}></Form.Control>
                    </Col>
                  </Form.Group>
                  <div className='text-center'>
                    <Button variant="primary" type="submit">
                      Confirmar
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>  
        </Col>  
        <Col md="3">
        </Col>
        </Row>
        </Container></>
    );
  }
}

export default UserForm;