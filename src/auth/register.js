const { User } = require('../models');
const login = require('./login');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationMail } = require('../../middleware');
const crypto = require('crypto');
const generateCustomId = require('../service/generateCustomId');

module.exports = async (req, res) => {
  try {
    const { email, password, ...otherFields } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Some required fields are missing' });
    }

    const duplicate = await Users.findOne({ email }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate username' });
    }

    const user = new Users({
      ...otherFields,
      id: uuidv4(),
      email,
      password,
      emailToken: crypto.randomBytes(64).toString('hex'),
      idAvatar: generateCustomId(),
      idSocketIO: null,
    });

    const result = await user.save();
    sendVerificationMail(result);

    if (result) {
      await login(req, res);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
