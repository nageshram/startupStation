import  Request  from '../models/request.js';
import  Startup  from '../models/startup.js';
import Team  from '../models/team.js';
import  Document  from '../models/document.js';
import DevProfile from '../models/devprofile.js';
import { createNotification } from './notificationController.js';
import { sendNotification } from '../sockets/notificationSocket.js';




export const rejectRequest = async (req, res) => {
   
  const request = await Request.findById(req.params.id);
  if (!request || request.status === 'accepted' || request.status === 'completed') {  
    return res.status(400).json({ msg: 'Invalid request' });
  }
  request.status = 'rejected';  
  await request.save();
  const notification = await createNotification({
    user: request.sender,
    type: 'update',
    title: 'Request Rejected',
    message: `Your request has been rejected.`,
    data: { requestId: request._id }
  });
  sendNotification(request.sender, notification);
  res.status(200).json({ msg: 'Request rejected' });
}



export const getMyRequests = async (req, res) => {
  const sent = await Request.find({ sender: req.user.id }).populate('receiver').populate('startupId');
  const received = await Request.find({ receiver: req.user.id }).populate('sender').populate('startupId');
  res.json({ sent, received });
};

export const sendJobRequest = async (req, res) => {
  const { startupId, desc, targetRoleId } = req.body;


  
  const existingReq = await Request.findOne({ startupId, sender:req.user.id, type:'job'});
  if(existingReq)
  {
    return res.status(400).json({ msg: 'You have already sent a job request for this startup' }); 
  }
  

  const startup = await Startup.findById(startupId).populate({
    path: 'teamId',
    populate: { path: 'roles' }
  });
  if (!startup) return res.status(404).json({ msg: 'Startup not found' });

  const founderId = startup.founderId;
  let roleName = '';
  if (startup.teamId) {
    const roleObj = startup.teamId.roles.find(
      role => role._id.toString() === targetRoleId
    );
    roleName = roleObj ? roleObj.roleName : '';
  }
   //console.log(roleName);
  //console.log( " found one req :",existingReq)

  const request = await Request.create({
    sender: req.user.id,
    receiver: founderId,
    type: 'job',
    category: 'job',
    startupId,
    targetRoleId,
    rolename:roleName,
    desc
  });
  const notification = await createNotification({
    user: founderId,
    type: 'request',
    title: 'New Job Request',
    message: `${req.user.name} sent you a job request for ${roleName}.`,
    data: { requestId: request._id }
  });
  sendNotification(founderId, notification);
  res.status(201).json(request);
};

export const sendInvestRequest = async (req, res) => {
  const { startupId, desc } = req.body;

  const existingReq = await Request.findOne({ startupId, sender:req.user.id, type:'invest'});
  if(existingReq){
    res.status(400).json({ msg: 'You have already sent an invest request for this startup' });
    return;
  }     

  const startup = await Startup.findById(startupId);
  if (!startup) return res.status(404).json({ msg: 'Startup not found' });

  const founderId = startup.founderId;
  const request = await Request.create({
    sender: req.user.id,
    receiver: founderId,
    type: 'invest',
    category: 'invest',
    startupId,
    desc
  });
  
  const notification = await createNotification({
    user: startup.founderId,
    type: 'request',
    title: 'New Invest Request',
    message: `${req.user.name} sent you a invest request.`,
    data: { requestId: request._id }
  });
  sendNotification(startup.founderId, notification);

  res.status(201).json(request);
};

export const acceptRequest = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request || request.status === 'accepted' || request.status === 'completed')
  {
    //console.log(request.status);
    return res.status(400).json({ msg: 'Invalid request' });
  }
  request.status = 'accepted';
  await request.save();

  const proposalType = request.type === 'job' ? 'job-proposal' : 'invest-proposal';

  const proposal = await Request.create({
    sender: req.user.id,
    receiver: request.sender,
    type: proposalType,
    category: request.category,
    startupId: request.startupId,
    targetRoleId: request.targetRoleId,
    rolename:request.rolename,
    desc: `You are invited to ${request.category === 'job' ? ' confirm and join the team' : 'confirm and invest in the startup'}`
  });

  const notification = await createNotification({
    user: request.sender,
    type: 'update',
    title: `${request.category === 'job' ? ' confirm and join the team' : 'confirm and invest in the startup'} Request Accepted`,
    message: `Your request has been accepted.`,
    data: { requestId: request._id }
  });
  sendNotification(request.sender, notification);

  res.status(200).json({ msg: 'Request accepted and proposal sent', proposal });
};

export const founderRequest = async (req, res) => {
  
  const { receiverId, requestType, startupId, targetRoleId }= req.body;
  if (!requestType || requestType === 'null' || !receiverId) return res.status(400).json({ msg: 'Invalid request' });
  

  const proposalType = requestType === 'job' ? 'job-proposal' : 'invest-proposal';

const startup = await Startup.findById(startupId).populate({
    path: 'teamId',
    populate: { path: 'roles' }
  });
  if (!startup) return res.status(404).json({ msg: 'Startup not found' });

  const founderId = startup.founderId;
  // Find the role name safely
  let roleName = '';
  if (startup.teamId) {
    const roleObj = startup.teamId.roles.find(
      role => role._id.toString() === targetRoleId
    );
    roleName = roleObj ? roleObj.roleName : '';   
  }
   
  const existingReq = await Request.findOne({ startupId, sender:req.user.id, type:proposalType, receiver:receiverId, targetRoleId:targetRoleId});
  if(existingReq)
  {   
    //console.log(existingReq);
   return res.status(400).json({ msg: `You have already sent a ${requestType} request to this user` });
  }
  const proposal = await Request.create({
    sender: req.user.id,
    receiver: receiverId,
    type: proposalType,
    category: requestType,
    startupId: startupId,
    targetRoleId: targetRoleId,
    rolename:roleName,
    desc: `You are invited to ${requestType === 'job' ? 'join the team' : 'invest in the startup'}`
  });

  const notification = await createNotification({
    user: receiverId,
    type: 'update',
    title: `${requestType === 'job' ? '  join the team' : 'invest in the startup'} `,
    message: `Your are invited ${requestType === 'job' ? '  join the team' : 'invest in the startup'}`,
    data: { requestId: proposal._id }
  });
  sendNotification(receiverId, notification);

  res.status(200).json({ msg: ' Proposal sent', proposal });
};


export const confirmJobProposal = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request || request.status !== 'pending') return res.status(400).json({ msg: 'Invalid proposal' });

  if (request.type === 'job-proposal') {
    const startup = await Startup.findById(request.startupId).populate('teamId');
    if (!startup) return res.status(404).json({ msg: 'Startup not found' });
    //if(!) return res.status(404).json({ msg: 'Team not found' });
    const role = startup.teamId.roles.find(role => role._id.toString() === request.targetRoleId.toString());
    if (!role) return res.status(404).json({ msg: 'Role not found' });
    if (role.assignedTo) return res.status(400).json({ msg: 'Role already assigned' });

    const roleID = role._id;
   const team = await Team.findById(startup.teamId._id);

    const assignRole = team.roles.id(roleID);

    if (!assignRole) return res.status(404).json({ msg: 'Role not found in team' });
    assignRole.assignedTo = req.user.id;

    const updateRoleList = await Startup.updateOne(
      { _id: request.startupId},{ $pull:{openedRoles:request.rolename}});

    let profile = await DevProfile.findOne({ user: req.user.id });

    await team.save();
    if (profile) 
      {
          profile.teamId = startup.teamId;
          profile.status= "Hired";
          await profile.save();
      }
    
    // const startup = await Startup.findById(request.startupId);
    const notification = await createNotification({
    user: startup.founderId,
    type: 'update',
    title: 'job proposal accepted',
    message: `${req.user.name} has accepted your job proposal for ${role}. now he is part of your startup`,
    data: { requestId: request._id }
  });
  sendNotification(startup.founderId, notification);
  }
 

  request.status = 'completed';
  await request.save();

  const docType = request.type === 'job-proposal' ? 'NDA' : 'Equity';
  const doc = await Document.create({
    type: docType,
    userId: req.user._id,
    startupId: request.startupId,
    content: `${docType} Confidentiality Agreement between Founder and Developer:
This Non-Disclosure Agreement ("Agreement") is entered into between the Founder and the Developer in the context of engagement for the startup project. The Developer acknowledges that during the course of collaboration, they may have access to confidential information, including but not limited to product roadmaps, codebases, algorithms, designs, business strategies, and client data. The Developer agrees not to disclose, reproduce, or use this information for any purpose outside the scope of the assigned work. All intellectual property developed during the engagement shall remain the sole property of the startup unless otherwise stated in a separate written agreement. This obligation of confidentiality remains in effect both during and after the term of collaboration.`
  });

  await Startup.findByIdAndUpdate(request.startupId, {
    $push: { documentIds: doc._id }
  });

  res.json({ msg: `${docType} confirmed`, document: doc });
};


export const confirmInvestProposal = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(400).json({ msg: 'Invalid proposal' });

  if (request.type === 'invest-proposal') {
   try {
    const startupId = request.startupId;
    const investorId = req.user.id;
    const startup = await Startup.findByIdAndUpdate(
      startupId,
      { $addToSet: { investors: investorId } },
      { new: true }
    );

    const startup1 = await Startup.findById(request.startupId);
    const notification = await createNotification({
    user: startup1.founderId,
    type: 'update',
    title: 'Invest proposal accepted',
    message: `${req.user.name} has accepted your invest proposal for ${role}. now he is part of your startup`,
    data: { requestId: request._id }
  });
  sendNotification(startup1.founderId, notification);
    //res.status(200).json(startup);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  }

  request.status = 'completed';
  await request.save();

  const docType = request.type === 'job-proposal' ? 'NDA' : 'Equity';
  const doc = await Document.create({
    type: docType,
    userId: req.user._id,
    startupId: request.startupId,
    content: `${docType} : Confidentiality Agreement between Founder and Investor:
This Agreement is made between the Founder and the Investor to ensure the protection of sensitive business information disclosed during investment evaluation and collaboration. The Investor agrees not to share or use proprietary information—including but not limited to financial records, valuation metrics, business models, intellectual property, and client data—for any purpose other than evaluating the potential investment or assisting in business growth. Both parties agree that the disclosure of any confidential information must be limited to authorized personnel only and must be used solely in the context of this business relationship. This Agreement is binding and survives the termination of the investment discussions or formal engagement`
  });

  await Startup.findByIdAndUpdate(request.startupId, {
    $push: { documentIds: doc._id }
  });

  return res.json({ msg: `${docType} confirmed`, document: doc});
};


export const createResignReq = async (req, res) => {
  const { startupId, desc } = req.body;     
  /*const existingReq = await Request.findOne({ startupId, sender:req.user.id, type:'resignation' });
  if(existingReq)       
  {
    return res.status(400).json({ msg: 'You have already sent a resignation request for this startup' });
  }*/
  
  const startup = await Startup.findById(startupId).populate({
    path: 'teamId',
    populate: { path: 'roles' }
  });

  if (!startup) return res.status(404).json({ msg: 'Startup not found' });

  const founderId = startup.founderId;

  let roleName = '';
  let roleId = '';
  if (startup.teamId) {
    const roleObj = startup.teamId.roles.find(
      role => role.assignedTo.toString() === req.user.id.toString()
    );
    roleName = roleObj ? roleObj.roleName : '';
  

  const resign =  await Request.create({
    sender: req.user.id,
    receiver: startup.founderId,
    type: 'resignation',
    category: 'resign',
    startupId:startup._id,
    targetRoleId:roleObj._id,
    desc:desc
  });


const notification = await createNotification({
    user: startup.founderId,
    type: 'request',
    title: 'Resignation Request',
    message: `${req.user.name} sent resign request for ${roleName}.`,
    data: { requestId: resign._id }
  });
  sendNotification(founderId, notification);
  res.status(201).json(resign);
}
return res.status(400).json({msg:"Team not found"})

};

export const resignFromStartup = async (req, res) => {

  const reqId  = req.params.id;
  const re = await Request.findById(reqId);
  //console.log(re)
  
  if (!re) return res.status(404).json({ msg: 'Request not found' });
  const startupId = re.startupId;
  

  const startup = await Startup.findById(startupId).populate( {path :'teamId', populate:{ path:'roles', select:'_id roleName assignedTo'}});
  //console.log(startup);
  if (!startup) return res.status(404).json({ msg: 'startup not found' });
  
const role = startup.teamId.roles.find(role => role._id.toString() === re.targetRoleId.toString());
    if (!role) return res.status(404).json({ msg: 'Role not found' });
    if (!role.assignedTo) return res.status(400).json({ msg: 'Role already unassigned' });

    const roleID = role._id;
   const team = await Team.findById(startup.teamId._id);

    const assignRole = team.roles.id(roleID);

    if (!assignRole) return res.status(404).json({ msg: 'Role not found in team' });
    assignRole.assignedTo = null;

  
  let profile = await DevProfile.findOne({ user: re.sender });
    //await startup.save();
    if (profile) 
      {
          profile.status = null;
          profile.teamId=null;
          await profile.save();
      }

      re.status = 'accepted';

      await team.save();
      await re.save();

    const notification = await createNotification({
    user: re.sender,
    type: 'update',
    title: 'Resignation update',
    message: `Your resignation request was approved and executed successfully`
  });
  sendNotification(re.sender, notification);
  res.status(200).json({ msg: 'Resigned successfully and role unassigned' });
};


export const deleteRequest = async (req,res) =>
{
    if (!req.params.id) return res.status(400).json({ msg: 'Request ID is required' });

    const sender = req.user.id;
    const urequest = await Request.findOne({ _id: req.params.id });
    if (!urequest) return res.status(404).json({ msg: 'Request not found' });
    
    if (sender !== urequest.sender.toString()) {
      return res.status(403).json({ msg: 'You can only delete your own requests' });
    }

    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
  
    res.status(200).json({ msg: 'Request deleted successfully' });
  
};
