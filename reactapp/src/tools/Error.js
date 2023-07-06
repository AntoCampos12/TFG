import Button from "react-bootstrap/Button";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import { Navigate } from "react-router-dom";

function Error(){

    const [redirect, setRedirect] = useState(false);

    return(
        <>
            {redirect && <Navigate to="/" replace={true}/>}
            <Container>
                <Alert variant="danger" className="text-center mt-5">No has autorizado para acceder a este sitio 😡😡</Alert>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4" className="text-center mt-5"><Button onClick={() => setRedirect(true)}>Menú Principal</Button></Col>
                </Row>
            </Container>
        </>
    )
}

export default Error;