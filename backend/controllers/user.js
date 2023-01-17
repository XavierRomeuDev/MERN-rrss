const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const mongoosePaginate = require("mongoose-pagination");

const test = (req, res) => {
  return res.status(200).send({
    status: "Success",
    message: "works",
    user: req.user,
  });
};

//User register
const register = (req, res) => {
  let params = req.body;

  if (!params.name || !params.email || !params.nick || !params.password) {
    return res.status(400).json({
      status: "Error",
      message: "Missing data to complete the register",
    });
  }

  User.find({
    $or: [
      { email: params.email.toLowerCase() },
      { nick: params.nick.toLowerCase() },
    ],
  }).exec(async (err, users) => {
    if (err)
      return res
        .status(500)
        .json({ status: "Error", message: "Error executing query", err });

    if (users && users.length >= 1) {
      return res.status(200).send({
        status: "Success",
        message: "User already registered",
      });
    }

    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    let saveUser = new User(params);

    saveUser.save((err, userStored) => {
      if (err || !userStored) {
        return res
          .status(500)
          .send({ status: "Error", message: "Error to save user", err });
      }
    });

    return res.status(200).json({
      status: "Success",
      message: "User register complete",
    });
  });
};

const login = (req, res) => {
  let params = req.body;

  if (!params.email || !params.password) {
    return res.status(404).send({
      status: "Error",
      message: "Incomplete data to realize login",
    });
  }

  User.findOne({ email: params.email })
    //.select({"password": 0})
    .exec((err, user) => {
      if (err || !user)
        return res.status(404).send({
          status: "Error",
          message: "There's no user registered with this email",
        });

      const pwd = bcrypt.compareSync(params.password, user.password);

      if (!pwd) {
        return res.status(400).send({
          status: "Error",
          message: "Incorrect password",
        });
      }

      const token = jwt.createToken(user);

      return res.status(200).send({
        status: "Success",
        message: "Login action complete",
        user: {
          name: user.name,
          nick: user.nick,
        },
        token,
      });
    });
};

const getProfile = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .select({ password: 0, role: 0 })
    .exec((err, userProfile) => {
      if (err || !userProfile) {
        return res.status(404).send({
          status: "Error",
          message: "User doesn't exist or user not logged in",
        });
      }

      return res.status(200).send({
        status: "Success",
        user: userProfile,
      });
    });
};

const getUserList = (req, res) => {
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
    page = parseInt(page);
  }

  let itemsPerPage = 5;

  User.find()
    .sort("_id")
    .paginate(page, itemsPerPage, (err, users, total) => {
      if (err || !users) {
        return res.status(404).send({
          status: "Error",
          message: "Error there's no users",
          err,
        });
      }

      return res.status(200).send({
        status: "Success",
        page,
        users,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
      });
    });
};

const update = (req, res) => {
  let userIdentity = req.user;
  delete userIdentity.role;
  delete userIdentity.image;
  delete userIdentity.generation;
  delete userIdentity.expiration;

  let userToUpdate = req.body;

  User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() },
      { nick: userToUpdate.nick.toLowerCase() },
    ],
  }).exec(async (err, users) => {
    if (err)
      return res
        .status(500)
        .json({ status: "Error", message: "Error executing query", err });

    let userIsSet = false;
    users.forEach((user) => {
      if (user && user._id != userIdentity.id) {
        userIsSet = true;
      }
    });

    if (userIsSet) {
      return res.status(200).send({
        status: "Success",
        message: "User already registered",
      });
    }

    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    }

    try {
      let userUpdated = await User.findByIdAndUpdate(
        userIdentity.id,
        userToUpdate,
        { new: true }
      );

      if (!userUpdated) {
        return res.status(500).send({
          status: "Error",
          message: "Error, can't update user",
        });
      }

      return res.status(200).send({
        status: "Success",
        message: "User updated succesfully",
        user: userUpdated,
      });
    } catch (err) {
      return res.status(404).send({
        status: "Error",
        message: "Error, can't update user",
      });
    }
  });
};

const upload = (req, res) => {
  return res.status(200).send({
    status: "Success",
    message: "User profile pic uploaded succesfully",
    user: req.user,
    file: req.file,
  });
};

module.exports = {
  test,
  register,
  login,
  getProfile,
  getUserList,
  update,
  upload,
};
