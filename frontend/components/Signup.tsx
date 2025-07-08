import { Framer } from "lucide-react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useState, useRef } from 'react'

export const SignupPage =() =>
{
   const [error,setError]=useState("");
   const navigate = useNavigate();
   
   const [available, setAvailable ] = useState("");
   const [Emailavailable, setEmailAvailable] = useState("");
   const[usernameError, setUserNameError] = useState("");
   const [passwordError, setPasswordError] = useState("");
   const usernameRef = useRef(null);
   const errorusernameRef = useRef(null);
   const passwordRef = useRef(null);
   const emailRef = useRef(null);
   const errorEmailRef= useRef(null);
   const [formData, setFormData] = useState({
    name:"",
    username:"",
    email:"",
    password:"",
    phno:"",
    aadhar:"",
    designation:"",
    address:""
   })
      
    const handleSubmit = async (e)=> {
        e.preventDefault();
        

        if( available != "available" && Emailavailable!="available")
        {   
            alert("All fields are necessary");
            return;
        }
        if(emailRef.current.value=='' || usernameRef.current.value=='' )
        {
             alert("All fields are necessary");
            return;
        }

         const res = await fetch("http://localhost:5000/api/auth/signup",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(formData),
         });

         const resp= JSON.stringify(res)

         if(res.status==400)
         {
            
            setError("Signup failed!.");
         }
         else if(!res.ok)
         {
            setError("Something went wrong please try again later!..");
         }
        else{
             if (res.status == 200 || res.ok)
            {
                 navigate('/home');
                 console.log("Signup Successfull");
            }
        }
    }

    const handleEmailCheck = async(e) => {
        
       const email = emailRef.current.value.trim();
        
       const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/
       if(!regex.test(email))
       {
        setEmailAvailable("Enter a valid email")
        return
       }
        
        e.preventDefault();
         const res = await fetch("http://localhost:5000/api/users/check-email",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"email":email})
         });

         const resp= await res.json();
    
         if(res.status==200 && resp.available)
          {     
               errorEmailRef.current.classList.add('text-green-600')
                setEmailAvailable("available")
                emailRef.current.classList.add('border-green-600');
                errorEmailRef.current.classList.remove('text-red-600')
                emailRef.current.classList.remove('border-red-600')
                handleChange(e);
            }
            else{ 
                errorEmailRef.current.classList.add('text-red-600')
                setEmailAvailable("already exists");
                emailRef.current.classList.remove('border-green-600');
                emailRef.current.classList.add('border-red-600')
                errorEmailRef.current.classList.remove('text-green-600')
                
            }
         
         
        }


    const handleChange= (e)=> {
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const handleUsernameCheck = async(e) => {
        
       const username = usernameRef.current.value.trim();

        const pattern=/^[a-z0-9._]+$/;
     
        if(!pattern.test(username))
        {
             setUserNameError("Username must contain lowercase letters, numbers, dots (.) and underscore( _ )");
             return;
        }
        setUserNameError("");
        e.preventDefault();
         const res = await fetch("http://localhost:5000/api/users/check-username",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"username":username})
         });

         const resp= await res.json();
    
         if(res.status==200 && resp.available)
          {
                setAvailable("available")
                usernameRef.current.classList.add('border-green-600');
                errorusernameRef.current.classList.add('text-green-600');
                errorusernameRef.current.classList.remove('text-red-600')
                usernameRef.current.classList.remove('border-red-600')
                handleChange(e);
            }
            else{ 
                setAvailable("already exists");
                usernameRef.current.classList.remove('border-green-600');
                usernameRef.current.classList.add('border-red-600')
                errorusernameRef.current.classList.add('text-red-600')
                errorusernameRef.current.classList.remove('text-green-600')
                formData.username='';
            }
         
         
        }

     const handlePassword = (e)=>
     {
        const pass = passwordRef.current.value.trim();    
        const pattern=/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
        const title="Password Must contain at least one number and one uppercase and lowercase letter and at least 8 or more characters"
        
        if(!pattern.test(pass))
        { // usernameRef.current.classList.remove('border','outline-green-200');
            setPasswordError(title);
        }
        else{
            setPasswordError("");
            handleChange(e);
           // passwordRef.current.classList.add('border-1','outline','outline-green-400','border-green-400');
        }

    }
    

    return(

    <section  className="login  w-full h-full md:h-screen md:m-1 rounded-xl  font-sans  " >
           
                     
            <div className="flex py-20  md:p-10 justify-center flex-col items-center "  >
                    

                <p className="p-1  md:p-2 flex justify-around gap-1 text-pink-800  text-3xl  font-extrabold max-sm:bg-sky-100 max-sm:rounded-2xl max-sm:p-5"> <Framer />  Startup stn. </p>
                  <h3 className=" text-gray-700 p-2 md:p-2  text-[20px] md:text-2xl ">Signup to build your dream </h3>
                    {usernameError && <p className="absolute top-32 text-red-500 mb-1 pt-3 text-center items-center font-semibold"> {usernameError} </p> }
                    {passwordError && <p className="absolute top-36 text-red-500 mb-1 pt-3 text-center items-center font-semibold">{passwordError}</p>  }
                    
                    <div className="bg-white border mx-9 md:mx-5  text-sm md:text-md  text-gray-800 border-blue-300 py-5 shadow-gray-700 px-4 md:px-12 pb-8  mt-10 h-auto rounded-2xl ">
                  
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4  *:placeholder:max-sm:text-[12px]">
                        <label> Name
                            <input type="text" name="name" placeholder="name" onChange={handleChange} required className="p-1 md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded  focus:border-pink-500 focus:outline focus:outline-pink-500 " />
                        </label>

                        <label> Username  {  available && <p ref={errorusernameRef} className="ml-1 text-sm absolute inline-block">{ available }</p>}
                            <input type="text" ref={usernameRef} name="username"    placeholder="Enter unique username" onChange={handleUsernameCheck} required className="p-1 md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded invalid:border-1    focus:border-pink-500 focus:outline focus:outline-pink-500" />
                            {/*usernameError && <p className="text-red-500 text-sm ">{usernameError}</p> */ }
                        </label>

                        <label> Email {  Emailavailable && <p ref={errorEmailRef} className="ml-1 text-sm absolute inline-block">{Emailavailable}</p>}
                            <input type="email" name="email" ref={emailRef} placeholder="user@example.com" onChange={handleEmailCheck} required className="p-1  md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded invalid:border-1    focus:border-pink-500 focus:outline focus:outline-pink-500" />
                        </label>

                        <label> Phone
                            <input type="text" placeholder="123 456 78 90" name="phno" onChange={handleChange} required className=" p-1  md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded invalid:border-1    focus:border-pink-500 focus:outline focus:outline-pink-500" />
                        </label>

                        <label> Password
                            <input type="password" ref={passwordRef} name="password"  placeholder="Password"  onChange={handlePassword} required className="md:p-2 p-1 my-2 md:my-1 w-full border border-gray-500 rounded   focus:border-pink-500 focus:outline focus:outline-pink-500" />
                        </label>

                        <label> Address
                            <input type="text" name="address"placeholder="Sectore A Avalahalli" onChange={handleChange} required className=" p-1  md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded invalid:border-1    focus:border-pink-500 focus:outline focus:outline-pink-500" />
                        </label>

                        <label> Aadhar Number
                            <input type="text" name="aadhar" placeholder=" 1234 4568 896" onChange={handleChange} required className=" p-1 md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded invalid:border-1    focus:border-pink-500 focus:outline focus:outline-pink-500" />
                        </label>

                        <label> Designation
                            <select name="designation" onChange={handleChange} required className=" p-1 md:p-2 my-2 md:my-1 w-full border border-gray-500  outine-gray-500 rounded invalid:border-1    focus:border-pink-500 focus:outline focus:outline-pink-500">
                            <option value="">Select your role</option>
                            <option value="Dev">Developer/Others</option>
                            <option value="Founder">Founder</option>
                            <option value="Investor">Investor</option>
                            </select>
                        </label>

                        <div className="col-span-full">
                            <button type="submit" className="p-1  text-amber-50 font-bold bg-pink-600 hover:bg-pink-700   md:p-2 my-2 md:my-1 w-full border border-gray-500 rounded invalid:border-1  focus:border-pink-500 focus:outline focus:outline-pink-500">Sign Up</button>
                        </div>
                        </form>


                         <div className=" space-between justify-between text-gray-700 text-[14px] font-medium p-1" >
                                 
                            <p> Already Have account? <Link to="/login" className="text-blue-700"  >Login</Link>  </p> 
                        </div>
                  
                    </div>
            </div>
                    
        </section>
 






          
    )
}