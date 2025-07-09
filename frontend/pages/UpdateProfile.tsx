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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await authFetch('http://localhost:5000/api/users', { method: 'GET' });
        const userData = await res.json();
        setForm(userData);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDevChange = (e) => {
    setDevProfile({ ...devProfile, [e.target.name]: e.target.value });
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPic(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let photoFilename = form.photo;

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
      }

      const updateData = {};
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'username' || (typeof value === 'string' ? value.trim() !== '' : value)) {
          updateData[key] = value;
        }
      });
      if (photoFilename) updateData.photo = photoFilename;
      if (password.trim()) updateData.password = password;

      const res = await authFetch('http://localhost:5000/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error();

      if (form.designation === 'Dev') {
        const devProfileToSend = {};
        Object.entries(devProfile).forEach(([key, value]) => {
          if (typeof value === 'string' ? value.trim() !== '' : value) {
            devProfileToSend[key] = value;
          }
        });
        if (Object.keys(devProfileToSend).length > 0) {
          const devRes = await authFetch('http://localhost:5000/api/users/dev/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(devProfileToSend),
          });
        }
      }

      setEditing(false);
      setError('');
      alert('Profile updated!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (!form.username) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mt-4 md:mt-6 mx-auto max-w-6xl">
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded p-2 text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={
                previewPic
                  ? previewPic
                  : profilePic && typeof profilePic === 'string'
                  ? `http://localhost:5000/api/upload/profile_pics/${profilePic}`
                  : 'default.jpg'
              } onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/api/upload/profile_pics/default.jpg'; }}
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
          <h2 className="mt-2 font-bold text-gray-700 text-center">{form.name}</h2>
          <p className="text-pink-700 font-semibold">@{form.username}</p>
          <p className="text-gray-600 capitalize">{form.designation}</p>

          {!editing && (
            <button
              type="button"
              className="mt-3 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        <form className="flex-1 w-full **:border-gray-300 " onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <span className='font-semibold text-pink-700 my-5'>Profile Details</span>
            <br />
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

            {form.designation === 'Dev' && (
              <div className="space-y-3">
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
          </div>

          {editing && (
            <div className="flex gap-3 mt-6">
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
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
