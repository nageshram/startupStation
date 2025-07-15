import Document from '../models/document.js';

export  const getDocumentsForUser = async (req, res) => {
  const docs = await Document.find({ userId: req.user.id }).populate('userId' ,{select:'name username'}).populate('startupId', 'name founderId').populate({
    path:'startupId',
    populate:{
      path:'founderId',
      select:'name'
    }
  });
  res.json(docs);
};

export const getDocumentsForStartup = async (req, res) => {
  const docs = await Document.find({ startupId: req.params.startupId }).populate('userId' ,{select:'name username photo'}).populate('startupId', 'name founderId').populate({
    path:'startupId',
    populate:{
      path:'founderId',
      select:'name'
    }
  });
  res.json(docs);
};