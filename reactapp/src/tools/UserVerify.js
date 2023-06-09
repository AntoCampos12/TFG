import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";


function UserVerify()
{
    const { pk } = useParams();
    const [verificacion, setV] = useState("");
    const [redirect, setRedirect] = useState(false);

    if(verificacion !== undefined && verificacion === ""){
        axios(
            {
                method: "get",
                url: "/partidas/" + pk + "/verify"
            }
        ).then((response) => {setV(response.data.v)})
    }

    if(verificacion === "false" && redirect === false){
        setRedirect(true);
    }

    return(
        <>
            {redirect && <Navigate to="/error" replace={true}/>}
        </>
    )
}

export default UserVerify;