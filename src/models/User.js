const db = require("db");
const cuid = require("cuid");
const { isEmail, isAlphanumeric } = require("validator");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const emailSchema = (opts = {}) => {
  const { required = false } = opts;
  return {
    type: String,
    required,
    validate: {
      validator: isEmail,
      message: (props) => `${props.value} is not a valid email`,
    },
  };
};

const usernameSchema = () => {
  return {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 16,
    validate: [
      {
        validator: isAlphanumeric,
        message: (props) => `${props.value} contains special characters`,
      },
      {
        validator: (username) => !username.match(/^admin$/i),
        message: () => `invalid username`,
      },
      {
        validator: function (username) {
          return isUnique(this, username);
        },
        message: () => `username is taken`,
      },
    ],
  };
};

async function isUnique(doc, username) {
  const existing = await get(username);
  return !existing || doc._id === existing._id;
}

const User = db.model("User", {
  _id: { type: String, default: cuid },
  username: usernameSchema(),
  email: emailSchema({ required: true }),
  password: { type: String, maxLength: 120, required: true },
});

const list = async (opts = {}) => {
  const { offset = 0, limit = 10 } = opts;
  return await User.find().sort({ _id: 1 }).skip(offset).limit(limit);
};

const get = async (username) => {
  return await User.findOne({ username });
};

const create = async (fields) => {
  const user = new User(fields);
  await hashPassword(user);
  return await user.save();
};

const edit = async (username, change) => {
  const user = await get(username);
  Object.keys(change).forEach((key) => {
    user[key] = change[key];
  });
  if (change.password) await hashPassword(user);
  return await user.save();
};

const remove = async (username) => {
  await User.deleteOne({ username });
};

const hashPassword = async (user) => {
  if (!user.password) throw user.invalidate("password", "password is required");
  if (user.password.length < 12)
    throw user.invalidate("password", "password must be atleast 12 characters");
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
};

module.exports = { create, get, list, edit, remove };
