import { Link } from "react-router-dom"

const Sidebar = ( {user} ) =>
{
    if(!user) return null;

    return(
        <>
        <section className="min-h-screen p-5 my-2 gap-1 md:ml-1 shadow-lg bg-gray-800  rounded-lg">
        <div className="h-full max-sm:w-full rounded-lg  items-center">
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
             <li className="py-2"><Link  to="/dashboard/requests" className="text-gray-50 text-lg  hover:text-pink-700">Requests </Link>   </li>

            {user.designation === 'Founder' && (

                <>
                 <li className="py-2"><Link  to="/dashboard/founder-tasks" className="text-gray-50 text-lg  hover:text-pink-700">Tasks</Link>   </li>
                <li className="py-2"><Link  to="/dashboard/manage-startup" className="text-gray-50 text-lg  hover:text-pink-700">My Startup</Link>   </li>
                
                </>
            )}

            {user.designation === 'Founder' && user?.startupId && (

                <>
                 <li className="py-2"><Link  to="/dashboard/founder-analytics" className="text-gray-50 text-lg  hover:text-pink-700">Analytics</Link>   </li>
                
                </>
            )}


            {user.designation === 'Dev' && user?.dev?.teamId && (
                <>
                 <li className="py-2"><Link  to="/dashboard/dev-tasks" className="text-gray-50 text-lg  hover:text-pink-700">Tasks</Link>   </li>
                </>
            )}


            {user.designation === 'Admin' && (
                <>
                 <li className="py-2"><Link  to="/dashboard/all-startups" className="text-gray-50 text-lg  hover:text-pink-700">Startups</Link>   </li>
                <li className="py-2"><Link  to="/dashboard/all-users" className="text-gray-50 text-lg  hover:text-pink-700">Users</Link>   </li>
                </>
            )}


            { user.designation === 'Investor ' && ( 
                <>
                    <li className="py-2"><Link  to="/dashboard/investor-analytics" className="text-gray-50 text-lg  hover:text-pink-700">Analytics</Link>   </li>
                </>
            )}
                         <li className="py-2"><Link  to="/dashboard/documents" className="text-gray-50 text-lg  hover:text-pink-700">Documents</Link>   </li>


            </ul>
        </div>
    </div>
        </section>
        </>
    );
};

export default Sidebar