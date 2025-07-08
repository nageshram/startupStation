import { Link } from "react-router-dom"

const Sidebar = ( {user} ) =>
{
    //const [user, setUser] = useState(user);

    return(
        <>
        <section className="min-h-screen p-5 my-2 gap-1 shadow-lg bg-gray-800  rounded-lg">
        <div className="w-[15vw] h-full  rounded-lg  items-center">
        <div className="basicDetails flex justify-center flex-col my-2 pb-3 items-center gap-2 border-b-2 border-gray-400">
         
          <img
                src={  'http://localhost:5000/api/upload/profile_pics/'+ user.photo || "default.jpg"} onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/api/upload/profile_pics/default.jpg'; }}
                alt="Founder"
                className="w-20 h-20 rounded-full object-cover border"
                />

                <div className="userDetails gap-1">
                <h5 className="text-xl text-amber-50">Hello, {user.name}</h5> 
                <p className="text-pink-700 text-center">@{user.username}</p>

                </div> 
        
        </div>
        <div className="Links flex flex-col justify-center items-center">
            <ul className="list-none">
            <li className="py-2"><Link  to="/dashboard" className="text-gray-50 text-lg  hover:text-pink-700">Profile </Link>   </li>
            </ul>
        </div>
    </div>
        </section>
        </>
    );
};

export default Sidebar