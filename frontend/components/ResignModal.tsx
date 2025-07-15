import { useState } from 'react';
import { authFetch } from '../utils/authFetch.js'; // Ensure this path is correct
import { toast } from 'react-toastify'

const ResignModal = ({ isOpen, onClose, startupId }) => {
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResignSubmit = async () => {
    if (!desc.trim()) return toast.info("Please enter reason for resignation");
    setLoading(true);

    try {
      const response = await authFetch('http://localhost:5000/api/requests/resign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, desc }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Resignation request sent successfully');
        onClose();
        setDesc('');
      } else {
        toast.error(data.message || 'Failed to send resignation request');
      }
    } catch (err) {
      toast.error('Error submitting resignation request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 m-5 bg-gray-300 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-pink-700">Submit Resignation Request</h2>
        <textarea
          rows={4}
          className="w-full border border-gray-400 p-2 rounded text-gray-600"
          placeholder="Why do you want to resign?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleResignSubmit}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResignModal;
