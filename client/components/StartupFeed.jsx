import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { MessageCircle, MessageSquare } from 'lucide-react'
import { toast } from 'react-toastify';
import { sanitizeInput } from '../utils/sanitizeInput';
const BASE_URL = import.meta.env.VITE_API_URL

const StartupFeed = ({ user, setErrors, setActiveChatUser, setDrawer }) => {
  const [feed, setFeed] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null); // null means no search, object means search active
  const [activeTab, setActiveTab] = useState(''); // 'startups' | 'devs' | 'Investors'
  const [selectedRoles, setSelectedRoles] = useState({});
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    authFetch('/api/startup/', { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
       })
      .then((res) => res.json())
      .then(setFeed)
      .catch(() => setErrors('Failed to load feed'));
  }, []);
  if(!user) return;

  // Handle search
  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const search = sanitizeInput(searchTerm);
        const res = await authFetch(`/api/search/${search}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        setResults(data);

        // Set first non-empty tab as active
        if (data?.startups && data?.startups.length > 0) setActiveTab('startups');
        else if (data?.devs && data?.devs.length > 0) setActiveTab('devs');
        else if (data?.Investors && data?.Investors.length > 0) setActiveTab('Investors');
        else if (data?.founders && data?.founders.length > 0) setActiveTab('founders');
        else setActiveTab('');
      } catch (err) {
        setErrors('Search failed');
      }
    }
  };

  // Founder proposal function
  const founderRequest = async ({ receiverId, requestType, startupId, targetRoleId }) => {
    try {
      const body = { receiverId, requestType, startupId,targetRoleId};
      console.log(body);
      const res = await authFetch('/api/requests/founder-req', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const fullResponse = await res.json();
      if (!res.ok) { toast.info(fullResponse.msg); return;}

      setRemarks({ ...remarks, [startupId]: '' }); // Clear remarks after sending
;      toast.success('Proposal sent successfully');
    } catch(err) {
      toast.error(err.message);
    }
  };


  const sendInvestRequest = async (startupId, desc) => {
    try {
      const description = sanitizeInput(desc);
      const res = await authFetch('/api/requests/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, description }),
      });
      const fullResponse = await res.json();
      if (!res.ok) { toast.info(fullResponse.msg || 'Failed to send investment request'); return;}
      setRemarks({ ...remarks, [startupId]: '' }); // Clear remarks after sending
      toast.success('Investment request sent!');
    } catch {
      toast.error('Failed to send investment proposal');
    }
  };

  const sendJobRequest = async (startupId, desc, targetRoleId) => {
    try {
      const description = sanitizeInput(desc);
      const body = { startupId, description, targetRoleId };
      const res = await authFetch('/api/requests/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const fullResponse = await res.json();
      if ( res.status == 400 ) { toast.error(fullResponse?.msg); console.log(fullResponse?.msg); return;}
      setRemarks({ ...remarks, [startupId]: '' }); // Clear remarks after sending
      toast.success('Job request sent!');
    } catch {
      toast.error('Failed to send job request');
    }
  };

  // Clear search
  const handleClear = () => {
    setResults(null);
    setActiveTab('');
    setSearchTerm('');
  };

  // --- UI ---
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            onKeyDown={handleSearch}
            className="w-full border  border-gray-300 rounded p-2 focus:outline-pink-500"
            placeholder="Search for devs, startups, Investors..."
          />
          {results && (
            <button
              onClick={handleClear}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tabs for search results */}
        {results && (
          <div className="flex gap-2 mt-2">
            {results?.startups?.length > 0 && (
              <button
                className={`px-3 py-1 rounded ${activeTab === 'startups' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('startups')}
              >
                Startups ({results?.startups.length})
              </button>
            )}
            {results?.devs?.length > 0 && (
              <button
                className={`px-3 py-1 rounded ${activeTab === 'devs' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('devs')}
              >
                Devs ({results?.devs.length})
              </button>
            )}
            {results?.investors?.length > 0 && (
              <button
                className={`px-3 py-1 rounded ${activeTab === 'investors' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('investors')}
              >
                Investors ({results?.investors.length})
              </button>
            )}

            {results.founders?.length > 0 && (
              <button
                className={`px-3 py-1 rounded ${activeTab === 'founders' ? 'bg-pink-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('founders')}
              >
                Founders ({results.founders.length})
              </button>
            )}

            { results.devs?.length === 0 && results.investors?.length === 0 && results.startups?.length === 0 && results.founders?.length === 0 && (
              <span className="text-gray-500">No results found</span> 
            )}

          </div>
        )}
      </div>

      {/* Search Results Rendering */}
      {results ? (
        <div>
          {/* --- Startups Tab --- */}
          {activeTab === 'startups' && (
            <div className="space-y-4">
  {results.startups.map((startup, idx) => (
    <div
      key={startup._id}
      className="bg-white rounded shadow p-4 flex flex-col gap-4 w-full"
    >
      {/* Image + Basic Info */}
      <div className="flex gap-4">
        <img
          src={startup.photo ? `${BASE_URL}/api/upload/startup_pics/${startup.photo}` : '/default.jpg'}
          className="w-20 h-20 rounded object-cover"
          onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/startup_pics/default.jpg`; }}
          alt="startup"
        />
        <div className="flex-1">
          <div className="font-bold text-lg">{startup.name}</div>
          <div className="text-xs text-gray-500">{startup.status}</div>
          <div className="text-sm text-gray-600">{startup.desc}</div>
          <div className="my-2">
            <span className="text-xs font-semibold text-gray-500">Open Roles: </span>
            <span className="text-xs text-pink-600">{startup.teamId?.roles?.map((role) => (
              
              <> { (role.assignedTo === null && role.assignedTo !== undefined ) && (
              <p key={role._id} value={role._id} className='inline'>
                {role.roleName},
              </p>
              )}
              </>

            ))}</span>
          </div>
          <div className="text-xs text-gray-500 italic">
            by <span className="text-pink-700 font-medium">@{startup.founderId.username}</span>
            <MessageSquare className='inline ml-1 text-gray-600 hover:text-gray-400 cursor-pointer'
              onClick={() => { setActiveChatUser({  
                username: startup.founderId.username,
                name: startup.founderId.name,
                photo: startup.founderId.photo,
                designation: startup.founderId.designation,
              }); setDrawer('messages')}    }        
            />

          </div>
        </div>
      </div>

      {/* Dev Controls */}
      {user.designation === 'Dev' && (
        <div className="flex flex-col gap-2">
          <select
            className="border rounded p-1 text-sm border-gray-300"
            value={selectedRoles[startup._id] || ''}
            onChange={e => setSelectedRoles({ ...selectedRoles, [startup._id]: e.target.value })}
          >
            <option value="" className='text-gray-300'>Select Role</option>
            {startup.teamId?.roles?.map((role) => (
              
              <> { (role.assignedTo === null && role.assignedTo !== undefined ) && (
              <option key={role._id} value={role._id}>
                {role.roleName}
              </option>
              )}
              </>

            ))}
          </select>
          <input
            type="text"
            className="border border-gray-300 rounded p-1 text-sm"
            placeholder="Remarks (required)"
            value={remarks[startup._id] || ''}
            onChange={e => setRemarks({ ...remarks, [startup._id]: e.target.value })}
          />
          <button
            onClick={() =>
              sendJobRequest(startup._id, remarks[startup._id], selectedRoles[startup._id])
            }
            className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
            disabled={!selectedRoles[startup._id] || !remarks[startup._id]}
          >
            Send Job Request
          </button>
        </div>
      )}

      {/* Investor Controls */}
      {user.designation === 'Investor' && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="border border-gray-300 rounded p-1 text-sm"
            placeholder="Enter your bid (required)"
            value={remarks[startup._id] || ''}
            onChange={e => setRemarks({ ...remarks, [startup._id]: e.target.value })}
          />
          <button
            onClick={() => sendInvestRequest(startup._id, remarks[startup._id])}
            className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
            disabled={!remarks[startup._id]}
          >
            Offer funding
          </button>
        </div>
      )}

      {/* Founder Message Option */}
      {user.designation === 'Founder' && startup.founderId?.username !== user.username && (
        <button
          onClick={() => {
            setActiveChatUser({
              username: startup.founderId.username,
              name: startup.founderId.name,
              photo: startup.founderId.photo,
              designation: startup.founderId.designation,
            }); setDrawer('messages');
          }
          }
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Message Founder
        </button>
      )}
    </div>
  ))}
</div>

          )}

{activeTab === 'founders' && (
  <div className="space-y-4">
    {results.founders.map((founder) => (
      <div key={founder._id} className="bg-white rounded shadow p-4 flex items-center gap-4">
        <img
          src={founder.photo ? `${BASE_URL}/api/upload/profile_pics/` + founder.photo : '/default.jpg'}
          onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
          className="w-14 h-14 rounded-full object-cover"
          alt=""
        />
        <div className="flex-1">
          <div className="font-semibold">{founder.name} <span className="text-xs text-gray-500">@{founder.username}</span></div>
        </div>
        <button
        onClick={() => { setActiveChatUser(founder); setDrawer('messages') }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Message
        </button>
      </div>
    ))}
  </div>
)}

          {/* --- Investors Tab --- */}
          {activeTab === 'investors' && (
             <div className="space-y-4">
              {results.investors.map((inv) => (
                <div key={inv._id} className="bg-white rounded shadow p-4 flex items-center flex-col gap-4">
                  <div className="flex flex-row justify-left items-start gap-2">
                    <div>
                  <img src={ inv.photo ? `${BASE_URL}/api/upload/profile_pics/` + inv.photo : '/default.jpg'} onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }} className="w-14 h-14 rounded-full object-cover" alt="" />
                      </div>
                  <div className="flex-1">
                    <div className="font-semibold">{inv.name}  <br /> <span className="text-xs text-gray-500">@{inv.username}</span></div>
                  </div>
                  </div>
                  
                  {/* Dev/Investor: Message */}
                  {(user.designation === 'Dev' || user.designation === 'Investor') && (
                    <button
                      onClick={() => { setActiveChatUser(inv);setDrawer('messages')}}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Message
                    </button>
                  )}
                  {/* Founder: Message & Send Invest Proposal */}
                  {user.designation === 'Founder' && (
                    <>
                    <div className="flex flex-row gap-1" >
                      <button
                        onClick={() => { setActiveChatUser(inv);setDrawer('messages')}}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Message
                      </button>
                      <button
                        onClick={() =>
                          founderRequest({
                            receiverId: inv._id,
                            requestType: 'invest',
                            startupId: user.startupId?._id
                          })
                        }
                        className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
                      >
                        Invite Investor
                      </button>
                      </div>
                    </>
                    
                  )}
                </div>
              ))}
            </div>
          )}

      

          {/* --- Devs Tab (already handled) --- */}
          {activeTab === 'devs' && (
            <div className="space-y-4">
              {results.devs.map((dev) => (
                <div key={dev._id} className="bg-white rounded shadow p-4 flex flex-col items-center gap-4">
                  <div className="flex flex-row gap-2">
                  <div>
                  <img src={ dev.photo ? `${BASE_URL}/api/upload/profile_pics/` +dev.photo : '/default.jpg'} onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }} className="w-14 h-14 rounded-full object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold flex justify justify-between"><span> {dev.name}</span>
                    
                    <button
                    onClick={() => { setActiveChatUser(dev);setDrawer('messages')     } }
                    className="   text-white rounded"
                  >
                    <MessageSquare className='text-gray-600 hover:text-gray-400' />
                  </button>
                    
                    </div>
                    <span className='text-sm text-gray-600'>@{dev.username}</span>
                    <div className="text-xs text-gray-600">Techie</div>
                    <div className="text-xs text-gray-500">Skills: {dev.skills?.join(', ')}</div>
                    <div className="text-xs text-gray-400">{dev.desc}</div>
                  </div>
                </div>
                  <div className="flex items-center gap-2">
                  
                  {user.designation === 'Founder' && user.startupId?.teamId?.roles?.length > 0 && (
                    <div className="flex flex-row  gap-2">
                      <select
                        className="border rounded p-1 text-sm border-gray-300"
                        value={selectedRoles[dev._id] || ''}
                        onChange={e =>
                          setSelectedRoles({ ...selectedRoles, [dev._id]: e.target.value })
                        }
                      >
                        <option value="">Select Role</option>
                        {user.startupId.teamId.roles.map((role) => (
                           <> { (role.assignedTo === null && role.assignedTo !== undefined ) && (
                                 <option key={role._id} value={role._id}>
                                      {role.roleName}
                                </option>
                                )}
                            </>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          founderRequest({
                            receiverId: dev._id,
                            requestType: 'job',
                            startupId: user.startupId._id,
                            targetRoleId: selectedRoles[dev._id],
                          })
                        }
                        className="px-3 py-1 md:text-[14px] bg-pink-600 text-white rounded hover:bg-pink-700"
                        disabled={!selectedRoles[dev._id]}
                      >
                      Offer job
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      ) : (
        // Default: Show startup feed
        <div className="grid md:grid-cols-1 gap-6">
          {[...feed]
            .reverse()
            .filter(
              startup =>
                !(
                  user.designation === 'Founder' &&
                  startup.founderId?.username === user.username
                )
            )
            .map((startup, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-0 flex flex-col border border-gray-200 max-w-md mx-auto"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  marginBottom: "2rem",
                  overflow: "hidden",
                }}
              >
                {/* Header: Founder Info */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <img
                    src={  `${BASE_URL}/api/upload/profile_pics/`+ startup.founderId?.photo || "/default.jpg"} onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
                    alt="Founder"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{startup.founderId?.name}</div>
                    <div className="text-xs text-gray-500">@{startup.founderId?.username}</div>
                  </div>
                  <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    {startup.status}
                  </span>
                </div>

                {/* Startup Image */}
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={startup.photo ? `${BASE_URL}/api/upload/startup_pics/` + startup.photo : '/default.jpg'}
                    onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
                    className="object-cover w-full h-full"
                    alt="startup"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col px-4 py-3">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{startup.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{startup.desc}</p>
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500">Open Roles: </span>
                    <span className="text-xs text-pink-600">{startup.teamId?.roles?.map((role) => (
              
              <> { (role.assignedTo === null && role.assignedTo !== undefined ) && (
              <p key={role._id} value={role._id} className='inline'>
                {role.roleName},
              </p>
              )}
              </>

            ))}</span>
                  </div>
   {  user.designation !== 'Investor' && user.designation !== 'Admin' && user.designation !== 'Founder' && (
                <select
                  className="border rounded p-1 mb-2 w-full text-sm border-gray-300"
                  value={selectedRoles[idx] || ''}
                  onChange={e =>
                    setSelectedRoles({ ...selectedRoles, [idx]: e.target.value })
                  }
                >
                  <option value=""   className='text-gray-300'>Select Role</option>
                  {startup.teamId?.roles?.map((role, idx) => (
                     <> { (role.assignedTo === null && role.assignedTo !== undefined ) && (
                              <option key={role._id} value={role._id}>
                                    {role.roleName}
                              </option>
                        )}
                    </>
                  ))}
                </select>
)}
                {/* Remarks/Bid input */}
                {user.designation !== 'Investor' && user.designation !== 'Admin' && user.designation !== 'Founder' && (
                  <input
                    type="text"
                    className="border border-gray-300 rounded p-1 mb-2 w-full text-sm"
                    placeholder="Add remarks for job (required)"
                    value={remarks[idx] || ''}
                    onChange={e => setRemarks({ ...remarks, [idx]: e.target.value })}
                  />
                )}
                {user.designation === 'Investor' && (
                  <input
                    type="text"
                    className="border border-gray-300 rounded p-1 mb-2 w-full text-sm"
                    placeholder="Enter your bid (required)"
                    value={remarks[idx] || ''}
                    onChange={e => setRemarks({ ...remarks, [idx]: e.target.value })}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    setActiveChatUser({
                      username: startup.founderId?.username,
                      name: startup.founderId?.name,
                      photo: startup.founderId?.photo,
                      designation: startup.founderId?.designation,
                    });
                    setDrawer('messages')
                  }
                  }
                  className="flex-1 mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm transition"
                >
                  Message Founder
                </button>
                {user.designation !== 'Admin' && user.designation !== 'Founder' && (
                  <button
                    className="flex-1 px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm transition"
                    onClick={() => {
                      if (user.designation === 'Investor') {
                        sendInvestRequest(startup._id, remarks[idx]);
                      } else {
                        sendJobRequest(startup._id, remarks[idx], selectedRoles[idx]);
                      }
                    }}
                    disabled={
                      (user.designation !== 'Investor' && (!selectedRoles[idx] || !remarks[idx])) ||
                      (user.designation === 'Investor' && !remarks[idx])
                    }
                  >
                    Send{user.designation === 'Investor' ? ' invest ' : ' job '}Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StartupFeed;
