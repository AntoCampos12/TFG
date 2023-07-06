import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import '../style/Inicio.css'
import { Navigate, useParams } from 'react-router-dom';

class RecuperarPwd extends Component {
  constructor(props) {
    super(props)
    this.state = {password: '', password2: '', error: '', show: true, redirect: false}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    const {password, password2} = this.state
  
    formField.append('password',password)
    formField.append('password2',password2)

    axios(
      {
        method: 'post',
        url: '/authentication/rpwd/' + window.location.href.replace("http://127.0.0.1:8000/authentication/rpwd/",""),
        data: formField
      }).then((response) => {this.setState({error: response.data.errors, show: true, redirect: response.data.errors === '1'})})
  }

  render() {
    return (
      <>
        {this.state.redirect && <Navigate to="/error" replace={true}/>}
        <Container style={{ maxWidth: 6000 }}>
        <Row>
        <Col md="3"></Col>
        <Col md="6" className='w'>
          <Row className='h-100 justify-content-center align-items-center'>
              <Col md="11">
                <h1 className='text-center mt-3'>ACTUALIZAR CONTRASEÑA {this.state.username}</h1>
                {this.state.error != ''?this.AlertErrors(this.state.error):<span></span>}
                <Form action="/authentication/" onSubmit={this.handleSubmit}>
                  <Form.Group as={Row} className = "mb-3 mt-4" controlId='formPlaintextUsername'>
                    <Form.Label column sm="2">
                      Contraseña:
                    </Form.Label>
                    <Col>
                      <Form.Control type='password' value={this.state.password} onChange={this.handleChange} name="password"></Form.Control>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className = "mb-1" controlId='formPlaintextEmail'>
                    <Form.Label column sm="2">
                      Repetir contraseña:
                    </Form.Label>
                    <Col>
                      <Form.Control type='password' name="password2" value={this.state.password2} onChange={this.handleChange}></Form.Control>
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

export default RecuperarPwd;