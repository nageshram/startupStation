import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import {Mail, Phone , Home } from 'lucide-react'
const BASE_URL = import.meta.env.VITE_API_URL

const ProfileDetails = ({ user, setErrors, setActiveChatUser }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if ( user.designation === 'Admin' || !user) return;
    authFetch(`/api/suggestions/${user.designation}`)
      .then((res) => res.json())
      .then(setSuggestions)
      .catch(() => setErrors('Failed to load suggestions'));
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 text-sm md:text-base">
      <div className="flex flex-col items-center">
        <img
          src={`${BASE_URL}/api/upload/profile_pics/`  + user.photo || 'default.jpg'}
          alt="Profile"
          onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
          className="w-24 h-24 rounded-full object-cover border"
        />
        <h2 className="mt-2 font-bold text-gray-700">{user.name}</h2>
        <p className="text-pink-700 font-semibold">@{user.username}</p>
        <p className="text-gray-600 capitalize">{user.designation}</p>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600 flex justify-left items-center gap-1 text-md "> <Mail className="text-gray-800 w-4 h-4 flex justify-center" /> {user.email}</p>
        <p className="text-gray-600 flex justify-left gap-1 items-center text-md "><Phone className="text-gray-800 w-4 h-4" /> {user.phno}</p>
        <p className="text-gray-600 flex justify-left gap-1 text-md items-center"><Home className="text-gray-800 w-4 h-4" />{user.address}</p>
    
        {user.designation === 'Dev' && (
          <>
            <p className="text-gray-600"> {user.dev.desc}</p>
            <p className="text-gray-600">Skills : {user.dev.skills?.join(', ')}</p>
          </>
        )}
      </div>


{ user.designation !== 'Admin' && (
      <div className="mt-4 border-t border-gray-300  pt-2">
        <h3 className="text-pink-700 font-semibold mb-2">Suggestions</h3>
        
        <div className="space-y-2">
          {/* Founder: show devs and investors */}
          {user.designation === 'Founder' && (suggestions.devs?.length > 0 || suggestions.investors?.length > 0) ? (
            <>
              {suggestions.devs?.map((s, i) => (
                <div key={`dev-${i}`} className="p-2 border rounded hover:bg-gray-100 flex items-center gap-2">
                  <img src={s.photo ? '/api/upload/profile_pics/' + s.photo : 'default.jpg'} alt={s.name} className="w-8 h-8 rounded-full object-cover border" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{s.name}</p>
                    <p className="text-xs text-gray-500">@{s.username} <span className="ml-2">{s.skills?.join(', ')}</span></p>
                  </div>
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={() => setActiveChatUser(s)}
                  >
                    Message
                  </button>
                </div>
              ))}
              {suggestions.investors?.map((s, i) => (
                <div key={`inv-${i}`} className="p-2 border rounded hover:bg-gray-100 flex items-center gap-2">
                  <img src={s.photo ? `${BASE_URL}/api/upload/profile_pics/` + s.photo : 'default.jpg'} alt={s.name} className="w-8 h-8 rounded-full object-cover border" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{s.name}</p>
                    <p className="text-xs text-gray-500">@{s.username}</p>
                  </div>
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={() => setActiveChatUser(s)}
                  >
                    Message
                  </button>
                </div>
              ))}
            </>
          ) : null}

          {/* Dev or Investor: show startups */}
          {(user.designation === 'Dev' || user.designation === 'Investor') && suggestions.startups?.length > 0 ? (
            suggestions.startups.map((s, i) => (
              <div key={`startup-${i}`} className="p-2 border rounded hover:bg-gray-100 flex items-center gap-2">
                <img src={s.photo ? `${BASE_URL}/api/upload/startup_pics/` + s.photo : 'default.jpg'}
                onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/startup_pics/default.jpg`; }}
                alt={s.name} className="w-8 h-8 rounded-full object-cover border" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    Founder: @{s.founder?.username}
                  </p>
                </div>
                {s.founder?.username && (
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={() =>
                      setActiveChatUser({
                        username: s.founder.username,
                        name: s.founder.name,
                        photo: s.founder.photo,
                        designation: 'Founder',
                      })
                    }
                  >
                    Message
                  </button>
                )}
              </div>
            ))
          ) : null}

          {/* No suggestions */}
          {((user.designation === 'Founder' && (!suggestions.devs?.length && !suggestions.investors?.length)) ||
            ((user.designation === 'Dev' || user.designation === 'Investor') && !suggestions.startups?.length)) && (
            <p className="text-gray-400 italic text-sm">No suggestions available</p>
          )}
        </div>
         
      </div>
        )}
    </div>
  );
};

export default ProfileDetails;
