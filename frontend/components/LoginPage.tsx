import { Link } from "react-router-dom";

export const LoginPage =()=>
{
    return(

        <>
        <p>HI from Login page</p>
        <Link to="/signup"  >SignUp</Link>
        </>
    );
}