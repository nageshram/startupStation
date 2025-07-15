import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { useUser } from '../pages/UserContext.tsx';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        let res;
        if (user.designation === 'Founder') {
          res = await authFetch(`http://localhost:5000/api/documents/startup/${user?.startupId?._id}`);
        } else {
          res = await authFetch('http://localhost:5000/api/documents/user');
        }
        const data = await res.json();
        setDocuments(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user]);

  if (loading) return <div className="text-center py-4">Loading documents...</div>;

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Documents</h1>

      {documents.length === 0 ? (
        <p className="text-gray-500 italic">No documents available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{doc.type}</h3>
              <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">{doc.content}</p>
              <div className="text-xs text-gray-500 border-t pt-2 mt-2">
                <p><span className="font-medium">Startup:</span> {doc.startupId?.name}</p>
                <p><span className="font-medium">Founder:</span> {doc.startupId?.founderId?.name}</p>
                <p><span className="font-medium">User:</span> {doc.userId?.name} (@{doc.userId?.username})</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
