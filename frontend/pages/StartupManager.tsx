import React, { useState, useEffect, useRef } from 'react';
import { authFetch } from '../utils/authFetch';
import { useUser } from '../pages/UserContext.tsx';
import { toast } from 'react-toastify';

const StartupManager = () => {
  const [form, setForm] = useState({ name: '', desc: '', status: 'active', teamRoles: '', photo: 'default.jpg' });
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [team, setTeam] = useState([]);
  const [newRole, setNewRole] = useState('');
  const fileRef = useRef(null);
  const { user, refreshUser } = useUser();
  const quote = '"Every startup begins with a dream, let yours fly."';

  // Load startup data if editing
  useEffect(() => {
    if (user?.startupId) {
      const startup = user.startupId;
      setForm({
        name: startup.name || '',
        desc: startup.desc || '',
        status: startup.status || 'active',
        teamRoles: '',
        photo: startup.photo || 'default.jpg'
      });
      setTeam(startup.teamId?.roles || []);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!photoFile) return null;
    const formData = new FormData();
    formData.append('image', photoFile);
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

    const newFilename = await handleUpload();
    console.log(newFilename)
    const photoToUse = newFilename || form.photo || 'default.jpg';

    const payload = {
      name: form.name,
      desc: form.desc,
      status: form.status,
      photo: photoToUse,
    };

    // Include teamRoles only if creating for the first time
    if (!user?.startupId && form.teamRoles) {
      payload.teamRoles = form.teamRoles;
    }

    const method = user?.startupId ? 'PATCH' : 'POST';
    const url = user?.startupId
      ? `http://localhost:5000/api/startup/${user.startupId._id}`
      : 'http://localhost:5000/api/startup/create';

    const res = await authFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success(user?.startupId ? 'Startup updated!' : 'Startup created!');
      setForm({ ...form, photo: photoToUse });
      if (!user?.startupId) await refreshUser();  //window.location.reload();
    }
  };

  const handleAddRole = async () => {
    if (!newRole || !user?.startupId) return;
    const res = await authFetch('http://localhost:5000/api/startup/add-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId: user.startupId._id, roleName: newRole }),
    });
    if (res.ok) {
      const newData = await res.json();
      setTeam(prev => [...prev, newData.role]);
      setNewRole('');
      toast.success('Role added');
    }
  };

  const handleRemoveRole = async (roleId) => {
    const res = await authFetch('http://localhost:5000/api/startup/remove-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId: user?.startupId._id, roleId }),
    });
    if (res.ok) {
      setTeam(prev => prev.filter(role => role._id !== roleId));
      toast.success('Role removed successfully');
    }
  };

  const handleUnassignRole = async (roleId) => {
    const res = await authFetch('http://localhost:5000/api/startup/unassign-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId: user?.startupId._id, roleId }),
    });
    if (res.ok) {
      setTeam(prev => prev.map(role => role._id === roleId ? { ...role, assignedTo: null } : role));
      toast.success('Role unassigned successfully');
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this startup?")) return;
    const res = await authFetch(`http://localhost:5000/api/startup/${user?.startupId._id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      toast.success('Startup deleted successfully');
      //window.location.reload();
      await refreshUser();
    }
  };

  return (
    <div className="p-6 md:w-[75vw] mx-auto bg-white shadow rounded text-gray-600">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Startup Manager</h1>
      <blockquote className="italic text-center text-blue-600 mb-4">{quote}</blockquote>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="relative">
            <img
              src={preview || `http://localhost:5000/api/upload/startup_pics/${form.photo || 'default.jpg'}`}
              onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/api/upload/startup_pics/default.jpg'; }}
              alt="Startup"
              className="w-24 h-24 object-cover rounded-full border border-gray-400"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 text-xs bg-pink-600 text-white px-2 py-1 rounded"
              onClick={() => fileRef.current.click()}>
              Change
            </button>
            <input
              type="file"
              className="hidden"
              ref={fileRef}
              onChange={(e) => {
                setPhotoFile(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>

          <div className="flex-1 space-y-3">
            <input
              name="name"
              placeholder="Startup Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded"
              required
            />
            <textarea
              name="desc"
              placeholder="Short Description"
              value={form.desc}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded"
              required
            />
            {!user?.startupId && (
              <input
                name="teamRoles"
                placeholder="Enter role names separated by commas"
                value={form.teamRoles}
                onChange={handleChange}
                className="w-full border border-gray-400 p-2 rounded"
                required
              />
            )}
            <select
              name="status"
              value={form.status}
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

      {/* Roles Section */}
      {user?.startupId && (
        <>
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
            {team.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.map((role) => (
                  <div key={role._id} className="border border-gray-300 rounded p-3 flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 font-semibold">{role.roleName}</p>
                      <button onClick={() => handleRemoveRole(role._id)} className="text-sm text-red-500 p-1">Remove role</button>
                      {role.assignedTo ? (
                        <p className="text-sm text-gray-600">
                          Assigned to: <span className="font-medium text-blue-600">{role.assignedTo.name} ({role.assignedTo.designation})</span>
                          <button><span className="text-xs text-red-500 ml-2 cursor-pointer"
                            onClick={() => handleUnassignRole(role._id)}>Unassign</span></button>
                        </p>
                      ) : (
                        <p className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded inline-block mt-1">
                          Open for assignment
                        </p>
                      )}
                    </div>
                    {role.assignedTo?.photo && (
                      <img src={`http://localhost:5000/api/upload/profile_pics/${role.assignedTo.photo}`}
                        alt="Assigned User" className="w-10 h-10 rounded-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No roles defined yet.</p>
            )}
          </div>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
          >
            Delete Startup
          </button>
        </>
      )}
    </div>
  );
};

export default StartupManager;
