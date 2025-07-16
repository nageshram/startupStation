import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { TrashIcon } from 'lucide-react';
import { toast } from 'react-toastify'
import { useUser } from '../pages/UserContext.tsx';

const PAGE_SIZE = 4;

const AllStartups = () => {
  const [startups, setStartups] = useState([]);
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (user?.designation !== 'Admin') return;

    authFetch('/api/startup')
      .then(res => res.json())
      .then(data => {
        setStartups(data);
        setFilteredStartups(data);
      })
      .catch(err => console.error('Error loading startups', err));
  }, [user]);

  const handleDelete = async (startupId) => {
    const confirmed = window.confirm('Are you sure you want to delete this startup?');
    if (!confirmed) return;

    try {
      const res = await authFetch(`/api/startup/${startupId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStartups(prev => prev.filter(s => s._id !== startupId));
        setFilteredStartups(prev => prev.filter(s => s._id !== startupId));
      }
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === '') setFilteredStartups(startups);
    else setFilteredStartups(startups.filter(s => s.status === status));
    setCurrentPage(1);
  };

  const paginatedStartups = filteredStartups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(filteredStartups.length / PAGE_SIZE);

  if (user?.designation !== 'Admin') return <div className="p-4 text-red-600">Access Denied</div>;

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pink-600">All Startups</h2>
        <select
          className="border text-sm rounded px-2 py-1 text-gray-600 border-gray-400"
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedStartups.map(startup => (
          <div key={startup._id} className="p-4 bg-white rounded shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">{startup.name}</h3>
              <TrashIcon
                className="h-5 w-5 text-red-600 hover:text-red-800 cursor-pointer"
                onClick={() => handleDelete(startup._id)}
              />
            </div>
            <p className="text-sm text-gray-500 mb-1">{startup.desc}</p>
            <p className="text-xs text-gray-600 mb-1">Status: <span className="font-semibold">{startup.status}</span></p>
            <p className="text-xs text-gray-600">Founder: {startup.founderId?.name}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded border ${currentPage === i + 1 ? 'bg-pink-600 text-white' : 'bg-white text-gray-700 border-gray-400'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllStartups;
