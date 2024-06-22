const User = require("@models/User");
const autoCatch = require("@utils/autoCatch");

exports.createUser = autoCatch(async (req, res) => {
  const { username, email } = await User.create(req.body);
  return res.status(201).json({ username, email });
});
