import { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch.js';
import { Delete, DeleteIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../pages/UserContext.jsx';

const Requests = () => {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user, refreshUser} = useUser();
  const [filter, setFilter] = useState('all');
  


  useEffect(() => {
    authFetch('/api/requests', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        setSent(data.sent || []);
        setReceived(data.received || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      });
  }, []);

  const deleteReq = async (reqId) => {
    const response = await authFetch(`/api/requests/${reqId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data) {
      setSent(prev => prev.filter(request => request._id !== reqId));
      toast.success('Request deleted successfully');

    }
  };

  const acceptReq = async (reqId) => {
    const response = await authFetch(`/api/requests/${reqId}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data) {
      setReceived(prev => prev.map(request => request._id === reqId ? { ...request, status: 'accepted' } : request));
        await refreshUser();
        toast.success('Request accepted successfully');
    }
  };

 const acceptResignReq= async (reqId) => {
    const response = await authFetch(`/api/requests/accept/resign/${reqId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data) {
      setReceived(prev => prev.map(request => request._id === reqId ? { ...request, status: 'accepted' } : request));
      await refreshUser();
      toast.success('Request accepted successfully');
    }
  };


  const confirmJobProposal = async (reqId) => {
    const response = await authFetch(`/api/requests/${reqId}/confirm/job-proposal`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 400) {  
      const data = await response.json();
      toast.error(data.msg || 'Failed to confirm job proposal');
      return;
    }
    const data = await response.json();
    if (data) {
      setReceived(prev => prev.map(request => request._id === reqId ? { ...request, status: 'completed' } : request));
      await refreshUser();
      toast.success('Job proposal confirmed successfully');
    }
  };
  const rejectRequest = async ( id ) =>
    {
      const res = await authFetch(`/api/requests/reject/${id}`, { method: 'PUT'});
      if(!res.ok){ toast.error(res.msg); return;}
      else{
        setReceived(prev => prev.map(request => request._id === id ? { ...request, status: 'rejected' } : request));
        toast.success("Request rejected");
      }
    }

  const confirmInvestProposal = async (reqId) => {
    const response = await authFetch(`/api/requests/${reqId}/confirm/invest-proposal`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data) {
      setReceived(prev => prev.map(request => request._id === reqId ? { ...request, status: 'completed' } : request));
      await refreshUser();
      toast.success('Investment proposal confirmed successfully');

    }
  };

  const filteredReceived = filter === 'all' ? received : received.filter(r => r.status === filter);

  if (loading) return <div className="text-center p-8 text-gray-500">Loading requests...</div>;

  return (
    <div className="p-6 w-full mx-auto bg-white shadow rounded text-gray-600 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-pink-700 mb-4">Manage Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* My Requests */}
        <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
          <h2 className="text-xl text-gray-600 mb-2">My Requests</h2>
          {sent.length > 0 ? sent.map(request => (
            <div key={request._id} className="border border-gray-200 rounded p-3 mb-2 shadow-sm bg-gray-50">
              <p><span className='text-gray-800 p-1'>Sent to </span> @{request.receiver.username}</p>
              <p><span className='p-1 text-gray-800'>Startup </span> {request.startupId.name}</p>


              { request.type === 'resignation' && (
                <>
                <p><span className='p-1 text-gray-800'>Startup </span> {request.desc}</p>
                <p><span className='p-1 text-gray-800'>Startup </span> {request.type}</p>
                </>
              )}

              { (request.type === 'job' || request.type === 'job-proposal') && <p className='text-gray-600 p-1'>sent for the role {request.rolename}</p> }
              { (request.type === 'invest' || request.type === 'invest-proposal') && <p className='text-gray-600 p-1'>Remarks {request.desc}</p> }
               { (request.type === 'job' || request.type === 'job-proposal') && <p className='text-gray-600'>{request.desc}</p> }
              { request.status === 'pending' && <p className="bg-yellow-300 p-1 w-20 rounded-sm text-center text-gray-800 my-1">Pending</p> }
              { request.status === 'accepted' && <p className="bg-green-500 p-1 w-20 rounded-sm text-center text-gray-800 my-1">Accepted</p> }
              { request.status === 'completed' && <p className="bg-blue-500 p-1 w-25 rounded-sm text-center text-gray-50 my-1">Completed</p> }
              { request.status === 'rejected' && <p className="bg-red-500 p-1 w-25 rounded-sm text-center text-gray-50 my-1">Rejected</p> }
              
              { request.status !== 'completed' && request.status !== 'accepted' &&  (
                  <button
                className="cursor-pointer text-gray-500   p-1 hover:bg-red-600   mt-2"
                onClick={() => deleteReq(request._id)}
              >Delete</button>
              )}
              
            </div>
          )) : <p className="text-gray-500">No requests sent yet.</p>}
        </div>

        {/* Requests from Others */}
        <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl  text-gray-600">Requests from Others</h2>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border border-gray-200 text-sm px-2 py-1 rounded"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredReceived.length > 0 ? filteredReceived.map(request => (
            <div key={request._id} className="border rounded p-3 mb-2 shadow-sm border-gray-200 bg-gray-50">
              <p><span>From</span> {request.sender.name}</p>
              <p><span>Startup:</span> {request.startupId.name}</p>
               { (request.type === 'job' || request.type === 'job-proposal') && <p className='text-gray-600'>sent for {request.rolename}</p> }
               { request.status === 'pending' && <p className="bg-yellow-300 p-1 w-20 rounded-sm text-center text-gray-800 my-1">Pending</p> }
              { request.status === 'accepted' && <p className="bg-green-500 p-1 w-20 rounded-sm text-center text-gray-50 my-1">Accepted</p> }
              { request.status === 'completed' && <p className="bg-blue-500 p-1 w-25 rounded-sm text-center text-gray-50 my-1">Completed</p> }
             
              <p className="text-gray-600 p-2">{request.desc}</p>

              { request.type === 'resignation' && (
                <>
              
                <p><span className='p-1 text-gray-800'></span> {request.type}</p>
                </>
              )}

              {user?.designation === 'Founder' && request.status === 'pending' && (
                <>
                  {request.type === 'job' && (
                    <button onClick={() => acceptReq(request._id)} className="bg-green-500 text-white px-4 py-1 rounded mt-2 mr-2">
                      Accept Job Request
                    </button>
                  )}
                  {request.type === 'invest' && (
                    <button onClick={() => acceptReq(request._id)} className="bg-green-500 text-white px-4 py-1 rounded mt-2">
                      Accept Investment Request
                    </button>
                  )}

                  {request.type === 'resignation'  && (
                       <>
                    <p className='text-gray-600 p-1'>sent for {request.rolename}</p>

                    <button onClick={() => acceptResignReq(request._id)} className="bg-green-500 text-white px-4 py-1 rounded mt-2">
                      Accept Resign Request
                    </button> 
                    </>
    
              )}

                </>
              )}

              {user?.designation === 'Investor' && (request.status === 'accepted' || request.status === 'pending') && request.type === 'invest-proposal' && (
                <button onClick={() => confirmInvestProposal(request._id)} className="bg-blue-500 text-white px-4 py-1 rounded mt-2">
                  Confirm Investment Proposal
                </button>
              )}
             { user?.designation !== 'Founder' && user?.designation !='Investor'  ? (
                <>
                  {user?.designation === 'Dev'  && (request.status === 'accepted' || request.status === 'pending') && request.type === 'job-proposal' && (
                <button onClick={() => confirmJobProposal(request._id)} className="bg-blue-500 text-white px-4 py-1 rounded mt-2">
                  Confirm Job Proposal
                </button>
              )}


 
                </>
             ): (
              <>
                { user?.designation === 'Dev' && request.status !== 'completed' && (
                  <>
                  <p className="text-gray-700 "> Dear user you can't join other startups before resigning to the current startup. </p>
                </>
                )}
                </>

             )  }
              
              { (request.status !== 'completed' && request.status !== 'accepted' && request.status !== 'rejected') && (
                <>
                <button onClick={() => rejectRequest(request._id)} className="bg-red-800 text-white px-4 py-1 rounded mt-2">
                  Reject
                </button>
                </>
              )

              }
               { request.status === 'rejected' && <p className="p-1 rounded-sm  flextext-center text-gray-800 my-1"> You Rejected this request</p> }

            </div>
          )) : <p className="text-gray-500">No requests received yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Requests;
