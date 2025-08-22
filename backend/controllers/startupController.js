import Startup from '../models/startup.js';
import Team from '../models/team.js';
import DevProfile from '../models/devprofile.js'
import Task from '../models/tasks.js'
import Request from '../models/request.js'


export const createStartup = async (req, res) => {
  try {
    const { name,desc, teamRoles, photo } = req.body;
    const founderId = req.user.id;
    const teamList = teamRoles.split(',').filter(s => s !== '');

    // Create initial team with roles (not assigned yet)
    const team = await Team.create({
      roles: teamList.map(role => ({ roleName: role, assignedTo: null }))
    });

    const startup = await Startup.create({
      name,
      founderId,
      photo,
      desc,
      teamId: team._id,
      openedRoles: teamList,
      status: 'active'
    });
    
    const upDateTeam = await Team.findByIdAndUpdate(team._id,{  startupId : startup._id});
   if (!upDateTeam) console.log("unable to update the team while creating startup.");
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
     return res.status(200).json(startup);
    
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

export const updateStartupPatch = async (req, res) => {
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
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    const team = await Team.findById(startup.teamId);
    if (team) {
      for (const role of team.roles) {
        if (role.assignedTo) {
          await DevProfile.findOneAndUpdate(
            { user: role.assignedTo },
            { $unset: { teamId: "" } }
          );
        }
      }
    }

    await Task.deleteMany({ startupId: req.params.id });
    await Request.deleteMany({ startupId: req.params.id });
    await Team.findByIdAndDelete(startup.teamId);
    await Startup.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Startup deleted successfully' });
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

// Remove an investor from startup
export const removeInvestor = async (req, res) => {
  try {
    const { startupId, investorId } = req.body;
    const startup = await Startup.findByIdAndUpdate(
      startupId,
      { $pull: { investors: investorId } },
      { new: true }
    );
    res.status(200).json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a role from startup team
export const removeRole = async (req, res) => {     
  try {
    const { startupId, roleId } = req.body;
    const startup = await Startup.findById(startupId);
    const team = await Team.findById(startup.teamId);
   
    const role = team.roles.find(role => role._id.toString() === roleId.toString());
    if (!role) {
      return res.status(404).json({ message: 'Role not found in team' });
    }

    // update devprofile teamId to un assign the role
    if (team.roles.some(role => role._id.toString() === roleId.toString() && role.assignedTo !== null)) {
      
      await DevProfile.findByIdAndUpdate(role._id, { $unset: { teamId: null } }).catch(err => {
        console.error('Error unassigning role from DevProfile:', err);
      });

    }
    // Remove role from team
    team.roles = team.roles.filter(role => role._id.toString() !== roleId.toString());
    await team.save();
    // Remove role from openedRoles
    const updateRoleList = await Startup.updateOne(
      { _id: startupId},{ $pull:{openedRoles:role.rolename}});
    
    //startup.openedRoles = startup.openedRoles.filter(role => role !== role.roleName);
    await startup.save();

    res.status(200).json({ message: 'Role removed from team and openedRoles.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Unassign a role from a user
export const unAssignRole = async (req, res) => { 
  try {
    const { startupId, roleId } = req.body;
    const startup = await Startup.findById(startupId);
    const team = await Team.findById(startup.teamId);

    const role = team.roles.find(role => role._id.toString() === roleId.toString());
    if (!role) {
      return res.status(404).json({ message: 'Role not found in team' });
    }

    // Unassign the role from the user
    if (role.assignedTo && role.assignedTo) {
      await DevProfile.findByIdAndUpdate(role.assignedTo, { $unset: { teamId: null } });
      role.assignedTo = null;
      await team.save();
  // add the role back to openedRoles
      startup.openedRoles.push(role.roleName);    
      await startup.save();
      
      res.status(200).json({ message: 'Role unassigned successfully.' });
    } else {
      res.status(400).json({ message: 'Role is not assigned to this user.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

