import Startup from '../models/startup.js';
import Task from '../models/tasks.js';
import Team from '../models/team.js';

export const getInvestorStartups = async (req, res) => {
  try {
    const startups = await Startup.find({ investors: req.user.id }, 'name _id');
    res.json(startups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStartupAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = await Task.find({ startupId: id });
    const team = await Team.findOne({ startupId: id }).populate('roles.assignedTo');

    const taskStats = ['pending', 'in-progress', 'completed'].map(status => ({
      status,
      count: tasks.filter(t => t.status === status).length
    }));

    const roleMap = {};
    team?.roles.forEach(role => {
      if (role.roleName in roleMap) {
        roleMap[role.roleName]++;
      } else {
        roleMap[role.roleName] = 1;
      }
    });

    const roleStats = Object.entries(roleMap).map(([roleName, count]) => ({ roleName, count }));

    res.json({ taskStats, roleStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
