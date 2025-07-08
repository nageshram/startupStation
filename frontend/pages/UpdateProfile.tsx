import React, { useEffect, useState, useRef } from 'react';
import { authFetch } from '../utils/authFetch';

const UpdateProfile = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [devProfile, setDevProfile] = useState({});
  const [profilePic, setProfilePic] = useState('');
  const [previewPic, setPreviewPic] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Fetch user and dev profile details
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await authFetch('http://localhost:5000/api/users', { method: 'GET' });
        const userData = await res.json();
        setForm(userData);

        // Fetch profile pic from server if exists
        if (userData.photo) {
          const imgUrl = `http://localhost:5000/api/upload/profile_pics/${userData.photo}`;
          try {
            const imgRes = await fetch(imgUrl, { method: 'GET' });
            if (imgRes.ok) {
              setProfilePic(userData.photo);
            } else {
              setProfilePic('');
            }
          } catch {
            setProfilePic('');
          }
        } else {
          setProfilePic('');
        }

        if (userData.designation === 'Dev') {
          const devRes = await authFetch('http://localhost:5000/api/users/dev/profile', { method: 'GET' });
          if (devRes.ok) {
            const devData = await devRes.json();
            setDevProfile(devData);
          }
        }
      } catch {
        setError('Failed to load profile');
      }
    }
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle dev profile changes
  const handleDevChange = (e) => {
    setDevProfile({ ...devProfile, [e.target.name]: e.target.value });
  };

  // Handle profile picture change
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPic(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let photoFilename = form.photo; // fallback to existing photo

      // 1. If a new profilePic file is selected, upload it first
      if (profilePic && typeof profilePic !== 'string') {
        const imgForm = new FormData();
        imgForm.append('image', profilePic);
        imgForm.append('type', 'profile');
        const imgRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: imgForm,
        });
        if (!imgRes.ok) throw new Error('Image upload failed');
        const imgData = await imgRes.json();
        photoFilename = imgData.filename;
        console.log('Uploaded photo filename:', photoFilename);
      }

      // 2. Prepare user update data (only non-empty fields)
      const updateData = {};
      Object.entries(form).forEach(([key, value]) => {
        if (
          (key === 'username' || (typeof value === 'string' ? value.trim() !== '' : value))
        ) {
          updateData[key] = value;
        }
      });
      if (photoFilename) {
        updateData.photo = photoFilename;
        console.log('Setting photo in user update:', photoFilename);
      }
      if (password && password.trim() !== '') updateData.password = password;

      // 3. Update user (send JSON, not FormData)
      const res = await authFetch('http://localhost:5000/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      console.log('User update status:', res.status);
      if (!res.ok) throw new Error();

      // 4. If Dev, update DevProfile (only non-empty fields)
      if (form.designation === 'Dev') {
        const devProfileToSend = {};
        Object.entries(devProfile).forEach(([key, value]) => {
          if (typeof value === 'string' ? value.trim() !== '' : value) {
            devProfileToSend[key] = value;
          }
        });
        console.log('DevProfile to send:', devProfileToSend);
        if (Object.keys(devProfileToSend).length > 0) {
          const devRes = await authFetch('http://localhost:5000/api/users/dev/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(devProfileToSend),
          });
          console.log('DevProfile update status:', devRes.status);
          const devResData = await devRes.json().catch(() => ({}));
          console.log('DevProfile update response:', devResData);
        }
      }

      setEditing(false);
      setError('');
      alert('Profile updated!');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Update error:', err);
    }
  };

  if (!form.username) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="w-full bg-white rounded-lg shadow p-6 mt-6">
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded p-2 text-center">
          {error}
        </div>
      )}
      <div className='flex justify-center items-center mb-4'>
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={
              previewPic
                ? previewPic
                : profilePic && typeof profilePic === 'string'
                ? `http://localhost:5000/api/upload/profile_pics/${profilePic}`
                : 'default.jpg'
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          {editing && (
            <button
              className="absolute bottom-0 right-0 bg-pink-600 text-white rounded-full p-1"
              onClick={() => fileInputRef.current.click()}
              title="Change picture"
            >
              <span className="material-icons">edit</span>
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handlePicChange}
          />
        </div>
        <h2 className="mt-2 font-bold text-gray-700">{form.name}</h2>
        <p className="text-pink-700 font-semibold">@{form.username}</p>
        <p className="text-gray-600 capitalize">{form.designation}</p>
      </div>
       <div className="flex gap-2 mt-6">
        {!editing ? (
          <button
            type="button"
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        ) : null}
      </div>

     </div>
      
      <form className="mt-6 space-y-4 grid-cols-1 md:grid-cols-2" onSubmit={handleSave}>
         
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center mb-4 gap-4">
        <div className="flex flex-col justify-center gap-4 justify-center max-w-2xs">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border rounded p-2 mt-1"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border rounded p-2 mt-1"
            />
          </label>
          <label>
            Phone
            <input
              type="text"
              name="phno"
              value={form.phno || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border rounded p-2 mt-1"
            />
          </label>
          <label>
            Address
            <input
              type="text"
              name="address"
              value={form.address || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border rounded p-2 mt-1"
            />
          </label>
          <label>
            Aadhar
            <input
              type="text"
              name="aadhar"
              value={form.aadhar || ''}
              onChange={handleChange}
              disabled={!editing}
              className="w-full border rounded p-2 mt-1"
            />
          </label>
          {editing && (
            <label>
              New Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              />
            </label>
          )}
        </div>

        {/* DevProfile fields */}
        {form.designation === 'Dev' && (
          <div className="mt-4 space-y-2 max-w-10/12">
            <h3 className="font-semibold text-pink-700">Developer Profile</h3>
            <label>
              Skills (comma separated)
              <input
                type="text"
                name="skills"
                value={devProfile.skills || ''}
                onChange={e => handleDevChange({ target: { name: 'skills', value: e.target.value } })}
                disabled={!editing}
                className="w-full border rounded p-2 mt-1"
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </label>
            <label>
              Github
              <input
                type="text"
                name="github"
                value={devProfile.github || ''}
                onChange={handleDevChange}
                disabled={!editing}
                className="w-full border rounded p-2 mt-1"
              />
            </label>
            <label>
              Experience
              <input
                type="text"
                name="experience"
                value={devProfile.experience || ''}
                onChange={handleDevChange}
                disabled={!editing}
                className="w-full border rounded p-2 mt-1"
              />
            </label>
            <label>
              Portfolio Link
              <input
                type="text"
                name="portfolioLink"
                value={devProfile.portfolioLink || ''}
                onChange={handleDevChange}
                disabled={!editing}
                className="w-full border rounded p-2 mt-1"
              />
            </label>
            <label>
              Description
              <textarea
                name="desc"
                value={devProfile.desc || ''}
                onChange={handleDevChange}
                disabled={!editing}
                className="w-full border rounded p-2 mt-1"
              />
            </label>
          </div>
        )}

        {editing && (
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      </form>
    </div>
  );
};

export default UpdateProfile;