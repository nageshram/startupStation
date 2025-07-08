import Startup from '../models/startup.js';
import Team from '../models/team.js';

export const createStartup = async (req, res) => {
  try {
    const { name, founderId, photo, desc, teamRoles } = req.body;

    // Create initial team with roles (not assigned yet)
    const team = await Team.create({
      roles: teamRoles.map(role => ({ roleName: role, assignedTo: null }))
    });

    const startup = await Startup.create({
      name,
      founderId,
      photo,
      desc,
      teamId: team._id,
      openedRoles: teamRoles,
      status: 'active'
    });

    res.status(201).json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a startup by ID
export const getStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('founderId', '-password')
      .populate('investors', '-password')
      .populate('documentIds')
      .populate('taskGroup')
      .populate('requestGroup')
      .populate('teamId').populate('teamId.roles');

    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    res.status(200).json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllStartups = async (req, res) => {
  try {
    const startup = await Startup.find()
      .populate('founderId', '-password')
      .populate('investors', '-password')
      .populate('documentIds')
      .populate('taskGroup')
      .populate('requestGroup')
      .populate('teamId').populate('teamId.roles');

    if (!startup) return res.status(404).json({ message: 'no Startups found' });
    //console.log(startup);
    res.status(200).json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update startup basic details
export const updateStartup = async (req, res) => {
  try {
    const updated = await Startup.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a startup
export const deleteStartup = async (req, res) => {
  try {
    await Startup.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Startup deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add an investor to startup
export const addInvestor = async (req, res) => {
  try {
    const { startupId, investorId } = req.body;
    const startup = await Startup.findByIdAndUpdate(
      startupId,
      { $addToSet: { investors: investorId } },
      { new: true }
    );
    res.status(200).json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new role to startup team
export const addRole = async (req, res) => {
  try {
    const { startupId, roleName } = req.body;
    const startup = await Startup.findById(startupId);
    const team = await Team.findById(startup.teamId);

    team.roles.push({ roleName, assignedTo: null });
    await team.save();

    startup.openedRoles.push(roleName);
    await startup.save();

    res.status(200).json({ message: 'Role added to team and openedRoles.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
