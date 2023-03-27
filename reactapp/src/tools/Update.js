import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

function Update(){
    const [equipo, setEquipo] = useState("");
    const [redirect, setRedirect] = useState("");
    const { pk } = useParams();
    const d = new Date();
    let day = d.getDay();

    if(equipo != undefined && equipo === ""){
        axios(
            {
                method: "get",
                url: "/partidas/" + pk + "/get"
            }
        ).then((response) => {response.data.equipo===""?setRedirect('hola'):setEquipo(response.data.equipo)})
    }else if(equipo === 1 && day !== 1){
        axios(
            {
                method: "get",
                url: "/" + pk + "/dia"
            }
        ).then(
            setRedirect('hola')
        )
    }else if(equipo === 0 && day === 1){
        axios(
            {
                method: "get",
                url: "/" + pk  + "/poblar"
            }
        ).then( (response) => {
           axios(
                {
                    method: "get",
                    url: "/" + pk + "/dia"
                }
           ).then(setRedirect(response.data.hola))}
        )
    }else if(redirect === ""){
        setRedirect('hola');
    }

    const url = "/partidas/" + pk;

    return (
        <>
            {redirect === 'hola' && <Navigate to={url} replace={true}/>}
            <Container>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                    <Card className="text-center mt-5">
                        <Card.Title>
                            <b>CARGANDO</b><br/>esto podría tardar varios minutos
                        </Card.Title>
                        <Row>
                            <Col md="4"></Col>
                            <Col md="4"><Spinner animation="border" /></Col>
                        </Row>
                    </Card>
                    </Col>
                    <Col md="4"></Col>
                </Row>
            </Container>
        </>
    );

}

export default Update;