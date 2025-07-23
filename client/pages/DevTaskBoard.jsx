import { useEffect, useState, useRef } from 'react';
import { authFetch } from '../utils/authFetch.js';
import { Trash2 } from 'lucide-react';
import ResignModal from '../components/ResignModal.jsx';
import { useUser } from './UserContext.jsx';

const DevTaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);
   const remarksRef = useRef();
  const [remarks,setRemarks] = useState({});
  const [remarksMap, setRemarksMap] = useState({});


  
  

  const getTasks = async () => {
      const startupId = user?.dev?.teamId?.startupId?._id;
      console.log("startup id :",startupId);
      console.log(user);
      if(!user) return;
      const taskRes = await authFetch(`/api/tasks/user/${startupId}`, { 
      method: 'GET',
       headers:{ 'Content-Type':'application/json'},
      });
      const taskData = await taskRes.json();
      setTasks(taskData);
      setLoading(false);
    }

useEffect(() => {
  if(user.designation!== 'Dev') {
    return <div className="p-4 text-red-600">Access Denied</div>;
  }
    if(user?.dev?.teamId?.startupId?._id)
    getTasks();
  console.log(user)
  }, []);

  const updateTask = async (id, updates) => {
    const res = await authFetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-gray-800';
    if (status === 'in-progress') return 'bg-blue-100 text-gray-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) return <div>Loading...</div>;

  const statusGroups = {
    pending: tasks.filter(t => t.status === 'pending'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="p-6 h-full mx-auto bg-gray-100 shadow rounded text-gray-600 overflow-y-auto">
      <h2 className="text-2xl font-semibold text-pink-700 mb-4 max-sm:text-sm">Your Task Board</h2>

      <button
        onClick={() => setShowResignModal(true)}
        className=" absolute top-22 z-49 right-10 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-700 shadow-md"
      >
        Resign Job
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(statusGroups).map(([status, groupTasks]) => (
          <div key={status} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-2 capitalize">{status.replace('-', ' ')}</h3>
            <div className="space-y-3">
              {groupTasks.map(task => (
                <div key={task._id} className={`rounded p-3 shadow ${getStatusColor(task.status)}`}>
                  <div className="font-semibold text-gray-700">{task.name}</div>
                  <div className="text-sm text-gray-600">{task.description}</div>
                  <div className="text-sm text-gray-500">Priority: {task.priority}</div>
                  <div className="text-sm text-gray-500">Deadline: {task.deadline?.slice(0,10)}</div>
                  <div className="flex gap-1">
                  <textarea
  className="w-full mt-2 p-1 text-sm border border-gray-300 rounded"
  placeholder="Add remarks..."
  value={remarksMap[task._id] ?? task.remarks ?? ''}
  onChange={(e) =>
    setRemarksMap((prev) => ({
      ...prev,
      [task._id]: e.target.value,
    }))
  }
/>
<span className=" bg-green-700 text-gray-50 text-semibold text-sm rounded-md"
  onClick={() => {
    const updatedRemarks = remarksMap[task._id] ?? task.remarks;
    updateTask(task._id, { ...task, remarks: updatedRemarks });
  }}
>
  Update
</span>
                    </div>
                  <select name='status' className="w-full mt-2 p-1 text-sm border border-gray-300 rounded"
                  onChange={(e) => updateTask(task._id, { ...task, status: e.target.value }) }
                  >
                    
                    <option disabled selected>update-status</option>
                    <option value="in-progress" >In-progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ResignModal
        isOpen={showResignModal}
        onClose={() => setShowResignModal(false)}
        startupId={user?.dev?.teamId?.startupId?._id}
      />
    </div>
  );
};

export default DevTaskBoard;
