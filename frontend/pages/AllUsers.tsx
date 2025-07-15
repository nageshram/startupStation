import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { Trash2 } from 'lucide-react';
import { useUser } from '../pages/UserContext.tsx';

const AllUsers = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [designationFilter, setDesignationFilter] = useState('');
  const { user } = useUser();

  const fetchUsers = async (page = 1, designation = '') => {
    const res = await authFetch(`http://localhost:5000/api/users/all?page=${page}&limit=6${designation ? `&designation=${designation}` : ''}`);
    const data = await res.json();
    setUsers(data.users);
    setPage(data.page);
    setTotalPages(data.pages);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;
    const res = await authFetch(`http://localhost:5000/api/users/${userId}`, { method: 'DELETE' });
    if (res.ok) {
      fetchUsers(page);
    }
  };

  const handleFilter = () => {
    fetchUsers(1, designationFilter);
  };

  return (
    <div className="p-4 w-full text-gray-700">
      <h1 className="text-xl font-bold text-pink-700 mb-4">All Users</h1>

      <div className="flex items-center gap-4 mb-4">
        <select
          className="border border-gray-400 p-2 rounded"
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
        >
          <option value="">All Designations</option>
          <option value="Dev">Dev</option>
          <option value="Founder">Founder</option>
          <option value="Investor">Investor</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="border border-gray-400 rounded shadow p-4 bg-white relative">
            <div className="absolute top-2 right-2 cursor-pointer text-red-600 hover:text-red-800">
              <Trash2 onClick={() => handleDelete(user._id)} />
            </div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phno}</p>
            <p><strong>Designation:</strong> {user.designation}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => fetchUsers(i + 1)}
            className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
