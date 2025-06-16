import Task from '../models/tasks.js';

 export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

  export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};
  export const  getTasksForUser = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.json(tasks);
};
  export const getTasksForStartup = async (req, res) => {
  const tasks = await Task.find({ startupId: req.params.startupId });
  res.json(tasks);
};
