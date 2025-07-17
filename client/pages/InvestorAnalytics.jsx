// Frontend: InvestorAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useUser } from './UserContext.jsx'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const InvestorAnalytics = () => {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const { user } = useUser();

  if(user.designation !== 'Investor') return(<><p className="text-pink-600 font-medium">Unauthorised accces</p></>);

  useEffect(() => {
    authFetch('/api/analytics/investor-startups')
      .then(res => res.json())
      .then(data => {
        setStartups(data);
        if (data.length > 0) {
          setSelectedStartup(data[0]._id);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedStartup) {
      authFetch(`/api/analytics/startup/${selectedStartup}`)
        .then(res => res.json())
        .then(setAnalytics);
    }
  }, [selectedStartup]);

  if (!analytics) return <p className="text-center">Loading analytics...</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-pink-700">Startup Analytics</h2>

      <div className="flex gap-4 flex-wrap">
        {startups.map(s => (
          <button
            key={s._id}
            onClick={() => setSelectedStartup(s._id)}
            className={`px-4 py-2 rounded ${s._id === selectedStartup ? 'bg-pink-700 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">Task Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.taskStats}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">Team Composition</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.roleStats}
                dataKey="count"
                nameKey="roleName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {analytics.roleStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InvestorAnalytics;
