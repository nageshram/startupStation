import { Link, useNavigate } from "react-router-dom";
import { Framer } from "lucide-react"
import { useState } from "react";
import { toast } from 'react-toastify'
const BASE_URL = import.meta.env.VITE_API_URL
import { sanitizeInput } from "../utils/sanitizeInput";

export const LoginPage = ()=>
{
    const [formData, setFormData] = useState({ email:"", password:"" });
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const [submitting,setSubmitting] = useState(false);
    const handleChange= (e)=>
    {
       
        setFormData({...formData, [e.target.name]:sanitizeInput(e.target.value)})
    }

    const handleSubmit = async (e)=>
    {    try{
        setSubmitting(true);
         e.preventDefault();
         const res = await fetch(`${BASE_URL}/api/auth/login`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            credentials:'include',
            body:JSON.stringify(formData),
         });

         if(res.status==401)
         {
            setError("Invalid Credentials");
            setSubmitting(false);
         }
         else if(!res.ok)
         {
            toast.error("Something went wrong please try again later!..");
            setSubmitting(false);
         }
        else{
             if (res.status == 200 || res.ok)
            {
                 toast.success("Login Successfull!");
                 navigate('/home');
                 console.log("Login Successfull");
                 setSubmitting(false);
            }
        }
        }
        catch(err)
        {
            toast.error("Something went wrong try again later");
            setSubmitting(false);
        }

        
    }

    return(

        <section  className="login  w-screen  md:m-1 md:rounded-xl h-screen font-sans  " >
           
                     
            <div className="flex py-25 md:p-12 justify-center flex-col items-center "  >
                    

                     <p className="  p-1 md:p-2 flex justify-around gap-1 text-pink-800  text-3xl  font-extrabold"> <Framer />  <Link to="/" >Startup Stn.</Link> </p>
                  <h3 className=" text-gray-700 p-2 md:p-2  text-[20px] md:text-2xl ">Welcome to startup world</h3>
                    {error && <p className="text-red-400 mb-1 pt-3 text-center items-center font-semibold"> {error} </p> }
                    <div className="bg-white border  text-gray-800 border-blue-300 py-5 shadow-gray-700 px-4 md:px-12 pb-8  mt-10 h-auto rounded-2xl ">
                  
                        <form  onSubmit={handleSubmit} >
                                <label> Email <br /> 
                                    <input type="email" onChange={handleChange} name="email" className=" p-1  md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded invalid:border-2  invalid:border-orange-700 invalid:outline-orange-700 focus:border-pink-500 focus:outline focus:outline-pink-500" placeholder="user@example.com"/>
                                </label>
                                <br />
                                <label>Password <br />

                                    <input onChange={handleChange} className=" p-1 md:p-2 my-1 border border-gray-500 w-full rounded focus:border-pink-500 focus:outline focus:outline-pink-500" type="password" name="password" placeholder="password" required />
                                </label>
                                <br />
                                <button type="submit" className=" p-1 md:p-2 bg-pink-700 hover:bg-pink-900 text-white my-4 w-full rounded " disabled={submitting}> {submitting ? (<>Logging in...</>):(<>Sign In</>) } </button>
            
                        </form>
                        <div className="flex space-between justify-between text-gray-700 text-[14px] p-2" >
                              <Link to="/reset-password" className="text-blue-400 hover:text-gray-500"  >Forgot passsword?</Link>   
                              <Link to="/signup" className="text-blue-400 hover:text-gray-500"  > Signup</Link>   
                        </div>
                  
                    </div>
            </div>
                    
        </section>
       
    ); 
}