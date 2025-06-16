import Document from '../models/document.js';

export  const getDocumentsForUser = async (req, res) => {
  const docs = await Document.find({ userId: req.user.id });
  res.json(docs);
};

export const getDocumentsForStartup = async (req, res) => {
  const docs = await Document.find({ startupId: req.params.startupId });
  res.json(docs);
};