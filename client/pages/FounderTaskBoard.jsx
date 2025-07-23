import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch.js';
import { Trash2Icon, PencilIcon } from 'lucide-react';
import { useUser } from './UserContext.jsx';

const FounderTaskBoard = ( ) => {
  const [tasks, setTasks] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    deadline: '',
    assignedTo: '',
  });

  const { user } = useUser();

  const fetchTasks = async () => {
    const res = await authFetch(`/api/tasks/startup/${user.startupId._id}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if(user.designation!== 'Founder') {
    return <div className="p-4 text-red-600">Access Denied</div>;
  }
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    await authFetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setFormData({
      name: task?.name,
      description: task?.description,
      priority: task?.priority,
      deadline: task?.deadline?.slice(0, 10),
      assignedTo: task?.assignedTo,
    });
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editTask ? 'PUT' : 'POST';
    const url = editTask
      ? `/api/tasks/${editTask?._id}`
      : `/api/tasks`;

    await authFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, startupId: user?.startupId?._id }),
    });

    setFormVisible(false);
    setEditTask(null);
    fetchTasks();
  };

  const groupTasks = (status) => tasks.filter(t => t.status === status);

  const statuses = [
    { title: 'To Do', key: 'pending', bg: 'bg-blue-100', text: 'text-gray-800' },
    { title: 'In Process', key: 'in-progress', bg: 'bg-yellow-100', text: 'text-gray-800' },
    { title: 'Completed', key: 'completed', bg: 'bg-green-100', text: 'text-green-800' },
  ];
  if(user?.designation != 'Founder') return;

  return (
    <div className="p-4 text-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold max-sm:text-sm">Task Management</h2>
        <button onClick={() => setFormVisible(true)} className="bg-purple-700 max-sm:text-sm text-white px-4 py-2 rounded shadow hover:bg-purple-800">
          {editTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>

      {formVisible && (
        <div className="bg-white shadow-lg p-4 rounded border border-gray-400 mb-6">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input className="border border-gray-400 rounded p-2 w-full" placeholder="Task Name" value={formData?.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <textarea className="border border-gray-400 rounded p-2 w-full" placeholder="Description" value={formData?.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
            <div className="grid grid-cols-2 gap-2">
              <select className="border border-gray-400 rounded p-2" value={formData?.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input type="date" className="border border-gray-400 rounded p-2" value={formData?.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
            </div>

            <select
                        className="border border-gray-400 rounded p-2 w-full"
                        value={formData?.assignedTo} onChange={e => setFormData({ ...formData, assignedTo: e?.target?.value })}
                      >
                        <option value="">Select Role</option>
                        {user?.startupId?.teamId?.roles.map((role, idx) => (
                           <> { (role?.assignedTo !==null ) && (
                                 <option key={role?._id} value={role?.assignedTo?._id}>
                                      {role?.roleName}
                                </option>
                                )}
                            </>
                        ))}
                      </select>

            
            
            
            
            
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
              {editTask ? 'Update' : 'Create'} Task
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {statuses.map(({ title, key, bg, text }) => (
          <div key={key} className="rounded-lg shadow-md p-3 border border-gray-300">
            <h3 className={`text-md font-semibold mb-2 ${text}`}>{title}</h3>
            {groupTasks(key).map(task => (
              <div key={task?._id} className={`${bg} ${text} rounded p-3 mb-2 shadow-md relative`}>
                <h4 className="font-semibold text-base">{task?.name}</h4>
                <p className="text-sm">{task?.description}</p>
                <p className="text-xs italic">Priority: {task?.priority}</p>
                <p className="text-xs">Deadline: {new Date(task?.deadline).toLocaleDateString()}</p>
                <div className="p-2 top-2 right-2 flex gap-2">
                  <PencilIcon className="w-4 h-4 cursor-pointer text-blue-600" onClick={() => handleEdit(task)} />
                  <Trash2Icon className="w-4 h-4 cursor-pointer text-red-600" onClick={() => handleDelete(task?._id)} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FounderTaskBoard;
