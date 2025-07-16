import { MapPin, Phone, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { useState }  from 'react'
import { toast } from 'react-toastify'
const BASE_URL = import.meta.env.VITE_API_URL

export const Contact = ()=>{
      const [formData, setFormData] = useState({
        name:"",
        email:"",
        message:"",
      });

const handleChange = (e)=>
{
  setFormData({...formData,[e.target.name]:e.target.value});
};

const handleSubmit = async (e)=>
   {
    e.preventDefault();
    try{
        const res = await fetch(`${BASE_URL}/api/contactadmin/message`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(formData)
        });
        if (res.status == 200){   
          toast.success("Message sent Successfully!.");
          setFormData({name:"",email:"",message:""});
        }
        else if (res.status==500){
          toast.error("Error : "+ res.json());
        }
    }
    catch(err)
    {
     console.log(err);
     toast.error("Something went wrong..")
    }
   };


    return(
        
         <section id="contact" className="py-15 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Ready to start your entrepreneurial journey? We're here to help.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-600"><MapPin /></span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-600">#800, Sector A, Avalahalli Tech Park near BMSIT</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-600"><Phone /></span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+91 123 456 7684</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary-600"><Mail /></span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">nagesha2r@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                      <Twitter />
                    </button>
                    <button className="w-10 h-10 bg-blue-800 hover:bg-blue-900 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                      <Linkedin />
                    </button>
                    <button className="w-10 h-10 bg-gray-900 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors duration-200">
                      <Github />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6" onSubmit={handleSubmit} >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"> Name</label>
                    <input type="text" onChange={handleChange} name="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" placeholder="Siya" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" onChange={handleChange} name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" placeholder="startup@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea name="message" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none" placeholder="Tell us about your startup idea or question..."></textarea>
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
        
    
    );
}