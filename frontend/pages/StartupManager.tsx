import React, { useState, useEffect, useRef } from 'react';
import { authFetch } from '../utils/authFetch';
import { useUser } from '../pages/UserContext.tsx';

const StartupManager = () => {
  const [startup, setStartup] = useState(null);
  const [form, setForm] = useState({ name: '', desc: '', status: 'active', teamRoles:'' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [team, setTeam] = useState([]);
  const [newRole, setNewRole] = useState('');
  const fileRef = useRef(null);
  const [quote] = useState('"Every startup begins with a dream, let yours fly."');
  const { user } = useUser();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async () => {
    if (!photo) return null;
    const formData = new FormData();
    formData.append('image', photo);
    formData.append('type', 'startup');
    const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      return data.filename;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const photoFilename = await handleUpload();

    const cleanedForm = Object.fromEntries(Object.entries(form).filter(([_, value]) => value !== ''));
    const payload = {
      ...cleanedForm,
      photo: photoFilename?.filename || user?.startupId?.photo,
    };
    const method = user?.startupId ? 'PUT' : 'POST';
    const url = user?.startupId ? `http://localhost:5000/api/startup/${user?.startupId._id}` : 'http://localhost:5000/api/startup/create';
    const res = await authFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      alert('Startup saved!');
      window.location.reload();
      setStartup(data);

    }
  };

  const handleAddRole = async () => {
    if (!newRole || !user.startupId) return;
    const res = await authFetch('http://localhost:5000/api/startup/add-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId: startup._id, roleName: newRole }),
    });
    if (res.ok) {
      alert('Role added');
      setTeam([...team, { roleName: newRole, assignedTo: null }]);
      setNewRole('');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded text-gray-600 overflow-y-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Startup Manager</h1>
      <blockquote className="italic text-center text-blue-600 mb-4">{quote}</blockquote>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="relative">
            <img
              src={preview || `http://localhost:5000/api/upload/startup_pics/${user?.startupId?.photo}`}
              onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/api/upload/startup_pics/default.jpg'; }}
              alt="Startup"
              className="w-24 h-24 object-cover rounded-full border border-gray-400"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 text-xs bg-pink-600 text-white px-2 py-1 rounded"
              onClick={() => fileRef.current.click()}
            >
              Change
            </button>
            <input
              type="file"
              className="hidden"
              ref={fileRef}
              onChange={(e) => {
                setPhoto(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          <div className="flex-1 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Startup Name"
              value={form.name || user?.startupId?.name}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded" required
            />
            <textarea
              name="desc"
              placeholder="Short Description"
              value={form.desc || user?.startupId?.desc}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded" required
            />
            {!user?.startupId && (
              <input
                type="text"
                name="teamRoles"
                placeholder="Enter role names separated by commas"
                value={form.teamRoles || ''}
                onChange={handleChange}
                className="w-full border border-gray-400 p-2 rounded" required
              />
            )}
            <select
              name="status"
              value={form.status || user?.startupId?.status}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>

        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          {user?.startupId ? 'Update Startup' : 'Create Startup'}
        </button>
      </form>

      {user?.startupId && (
        <>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Team Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.map((role, idx) => (
                <div key={idx} className="p-2 border border-gray-400 rounded">
                  <div className="text-sm font-semibold">{role.roleName}</div>
                  <div className="text-xs text-gray-500">Assigned To: {role.assignedTo ? role.assignedTo : 'Not Assigned'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-700 mb-1">Add Role</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="border border-gray-400 p-2 rounded w-full"
                placeholder="Enter role name"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold text-pink-700 mb-4">Team Roles</h2>
            {user?.startupId.teamId?.roles?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user?.startupId.teamId.roles.map((role) => (
                  <div key={role._id} className="border border-gray-300 rounded p-3 flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 font-semibold">{role.roleName}</p>
                      <button onClick={() => {
                        authFetch('http://localhost:5000/api/startup/remove-role', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ startupId: user?.startupId._id, roleId: role._id }),
                        })
                          .then(res => res.json())
                          .then(data => {
                            if (data.success) {
                              setTeam(prev => prev.filter(r => r._id !== role._id));
                              alert('Role removed successfully');
                            }
                          });
                      }}>Remove role</button>
                      {role.assignedTo ? (
                        <p className="text-sm text-gray-600">
                          Assigned to: <span className="font-medium text-blue-600">{role.assignedTo.name} ({role.assignedTo.designation})</span>
                          <button>
                            <span className="text-xs text-red-500 ml-2 cursor-pointer" onClick={() => {
                              authFetch('http://localhost:5000/api/startup/unassign-role', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ startupId: user?.startupId._id, roleId: role._id }),
                              })
                                .then(res => res.json())
                                .then(data => {
                                  if (data.success) {
                                    setTeam( prev => prev.map( r => r._id === role._id ? { ...r, assignedTo: null } : r));
                                    alert('Role unassigned successfully');
                                  }
                                });
                            }}>Unassign</span>
                          </button>
                        </p>
                      ) : (
                        <p className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded inline-block mt-1">
                          Open for assignment
                        </p>
                      )}
                    </div>
                    {role.assignedTo?.photo && (
                      <img
                        src={`http://localhost:5000/api/upload/profile_pics/${role.assignedTo.photo}`}
                        alt="Assigned User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No roles defined yet.</p>
            )}
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded shadow-inner">
            <h2 className="text-lg font-semibold text-pink-700 mb-3">Investors</h2>
            {user?.startupId?.investors?.length > 0 ? (
              <ul className="list-disc list-inside">
                {user.startupId.investors.map((investor) => (
                  <li key={investor._id} className="text-sm text-gray-700">
                    {investor.name} - <span className="text-blue-600">{investor.designation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No investors added yet.</p>
            )}
          </div>
        </>
      )}


      {user?.startupId && (
  <button
    onClick={async () => {
      if (!confirm("Are you sure you want to delete this startup? This action cannot be undone.")) return;

      const res = await authFetch(`http://localhost:5000/api/startup/${user.startupId._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Startup deleted successfully');
        window.location.reload();
      }
    }}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
  >
    Delete Startup
  </button>
)}

    </div>
  );
};

export default StartupManager;
