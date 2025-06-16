import  Request  from '../models/request.js';
import  Startup  from '../models/startup.js';
import Team  from '../models/team.js';
import  Document  from '../models/document.js';
import DevProfile from '../models/devprofile.js';

export const getMyRequests = async (req, res) => {
  const sent = await Request.find({ sender: req.user.id }).populate('receiver');
  const received = await Request.find({ receiver: req.user.id }).populate('sender');
  res.json({ sent, received });
};

export const sendJobRequest = async (req, res) => {
  const { startupId, desc, targetRoleId } = req.body;
  const startup = await Startup.findById(startupId);
  if (!startup) return res.status(404).json({ msg: 'Startup not found' });

  const founderId = startup.founderId;
  const request = await Request.create({
    sender: req.user._id,
    receiver: founderId,
    type: 'job',
    category: 'job',
    startupId,
    targetRoleId,
    desc
  });
  res.status(201).json(request);
};

export const sendInvestRequest = async (req, res) => {
  const { startupId, desc } = req.body;
  const startup = await Startup.findById(startupId);
  if (!startup) return res.status(404).json({ msg: 'Startup not found' });

  const founderId = startup.founderId;
  const request = await Request.create({
    sender: req.user._id,
    receiver: founderId,
    type: 'invest',
    category: 'invest',
    startupId,
    desc
  });
  res.status(201).json(request);
};

export const acceptRequest = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request || request.status !== 'pending') return res.status(400).json({ msg: 'Invalid request' });

  request.status = 'accepted';
  await request.save();

  const proposalType = request.type === 'job' ? 'job-proposal' : 'invest-proposal';

  const proposal = await Request.create({
    sender: req.user._id,
    receiver: request.sender,
    type: proposalType,
    category: request.category,
    startupId: request.startupId,
    targetRoleId: request.targetRoleId,
    desc: `You are invited to ${request.category === 'job' ? 'join the team' : 'invest in the startup'}`
  });

  res.status(200).json({ msg: 'Request accepted and proposal sent', proposal });
};

export const confirmJobProposal = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request || request.status !== 'pending') return res.status(400).json({ msg: 'Invalid proposal' });

  if (request.type === 'job-proposal') {
    const team = await Team.findOne({ startupId: request.startupId });
    const role = team.roles.find(role => role._id.toString() === request.targetRoleId.toString());
    if (!role) return res.status(404).json({ msg: 'Role not found' });
    if (role.assignedTo) return res.status(400).json({ msg: 'Role already assigned' });

    role.assignedTo = req.user._id;
    let profile = await DevProfile.findOne({ user: userId });
    await team.save();
    if (profile) 
      {
          profile.status = "hired";
          await profile.save();
      }
  }
 

  request.status = 'completed';
  await request.save();

  const docType = request.type === 'job-proposal' ? 'NDA' : 'Equity';
  const doc = await Document.create({
    type: docType,
    userId: req.user._id,
    startupId: request.startupId,
    content: `${docType} agreement content...`
  });

  await Startup.findByIdAndUpdate(request.startupId, {
    $push: { documentIds: doc._id }
  });

  res.json({ msg: `${docType} confirmed`, document: doc });
};


export const confirmInvestProposal = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request || request.status !== 'pending') return res.status(400).json({ msg: 'Invalid proposal' });

  if (request.type === 'invest-proposal') {
   try {
    const startupId = request.startupId;
    const investorId = req.user._id;
    const startup = await Startup.findByIdAndUpdate(
      startupId,
      { $addToSet: { investors: investorId } },
      { new: true }
    );
    res.status(200).json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  }

  request.status = 'completed';
  await request.save();

  const docType = request.type === 'job-proposal' ? 'NDA' : 'Equity';
  const doc = await Document.create({
    type: docType,
    userId: req.user._id,
    startupId: request.startupId,
    content: `${docType} agreement content...`
  });

  await Startup.findByIdAndUpdate(request.startupId, {
    $push: { documentIds: doc._id }
  });

  res.json({ msg: `${docType} confirmed`, document: doc });
};

export const resignFromStartup = async (req, res) => {
  const { startupId, roleId } = req.params;
  const team = await Team.findOne({ startupId });
  if (!team) return res.status(404).json({ msg: 'Team not found' });

  const role = team.roles.find(r => r._id.toString() === roleId && r.assignedTo?.toString() === req.user._id.toString());
  if (!role) return res.status(403).json({ msg: 'Not authorized or already unassigned' });

  role.assignedTo = null;
  await team.save();
  let profile = await DevProfile.findOne({ user: userId });
    await team.save();
    if (profile) 
      {
          profile.status = null;
          await profile.save();
      }

  res.json({ msg: 'Resigned successfully and role unassigned' });
};
