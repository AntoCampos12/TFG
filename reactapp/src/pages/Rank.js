import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Header from '../tools/Header';
import axios from 'axios';

function Rank(){
    const { pk } = useParams();
    const [rank, setRank] = useState([]);

    if(rank != undefined && rank.length == 0){
        axios(
            {
                method: "get",
                url: "/partidas/" + pk + "/liga"
            }
        ).then((response) => {
            console.log(response.data.rank);
            setRank(response.data.rank)
        })
    }



    return(
        <>
            <Header/>
            <Container>
                <Row>
                    <Col></Col>
                    <Col>
                        <Card className='mt-4'>
                            <Card.Body>
                                <Card.Text>
                                    <b>RANKING DE LA LIGA</b>
                                </Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Text>
                                    { rank != undefined?
                                        rank.map(
                                            equipo => (
                                                <><span>{equipo.name}</span><br/></>
                                            )
                                            ):<span></span>
                                    }
                                    
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </>
    );
}

export default Rank;