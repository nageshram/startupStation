import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from '../pages/UserContext.tsx'
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#ff6b81'];

const FounderAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user?.startupId?._id) {
      authFetch(`/api/analytics/startup/${user?.startupId?._id}`)
        .then(res => res.json())
        .then(setAnalytics)
        .catch(err => console.error('Failed to fetch analytics', err));
    }
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;
  if (user?.designation !== 'Founder') return <p>Unauthorised access</p>

  return (
    <div className="p-4 w-full bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-pink-700 mb-4">Startup Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="font-semibold text-gray-700 mb-2">Task Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.taskStats}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.taskStats.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Team Role Distribution */}
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="font-semibold text-gray-700 mb-2">Team Role Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.roleStats}>
              <XAxis dataKey="roleName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FounderAnalytics;
