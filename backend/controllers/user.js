const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const mongoosePaginate = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followService");
const Follow = require("../models/Follow");
const Publication = require("../models/Publication");

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
          id: user.id,
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
    .exec(async (err, userProfile) => {
      if (err || !userProfile) {
        return res.status(404).send({
          status: "Error",
          message: "User doesn't exist or user not logged in",
        });
      }

      const followInfo = await followService.followingUser(req.user.id, id);

      return res.status(200).send({
        status: "Success",
        user: userProfile,
        following: followInfo.following,
        follower: followInfo.follower,
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
    .paginate(page, itemsPerPage, async (err, users, total) => {
      if (err || !users) {
        return res.status(404).send({
          status: "Error",
          message: "Error there's no users",
          err,
        });
      }

      let followUserIds = await followService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "Success",
        page,
        users,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_followers: followUserIds.followers,
      });
    });
};

const updateUser = (req, res) => {
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
    } else {
      delete userToUpdate.password;
    }

    try {
      let userUpdated = await User.findByIdAndUpdate(
        {
          _id: userIdentity.id,
        },
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

const uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(404).send({
      status: "Error",
      message: "Request without file attached",
    });
  }

  let image = req.file.originalname;

  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif" &&
    extension != "webp"
  ) {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "Error",
      message: "Invalid file extension",
    });
  }

  User.findOneAndUpdate(
    { _id: req.user.id },
    { image: req.file.filename },
    { new: true },
    (err, avatarUpdated) => {
      if (err || !avatarUpdated) {
        return res.status(500).send({
          status: "Error",
          message: "Can't update avatar",
        });
      }

      return res.status(200).send({
        status: "Success",
        message: "User profile pic uploaded succesfully",
        user: avatarUpdated,
      });
    }
  );
};

const avatar = (req, res) => {
  let file = req.params.file;

  const filePath = "./uploads/avatars/" + file;
  fs.stat(filePath, (err, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "Error",
        message: "File not exists",
      });
    }

    return res.sendFile(path.resolve(filePath));
  });
};

const followerCount = async (req, res) => {
  let userId = req.user.id;

  if (req.params.id) {
    userId = req.params.id;
  }

  try {
    const following = await Follow.count({ user: userId });

    const followed = await Follow.count({ followed: userId });

    const publications = await Publication.count({ user: userId });

    return res.status(200).send({
      userId,
      following: following,
      followed: followed,
      publications: publications,
    });
  } catch (err) {
    return res.status(500).send({
      status: "Error",
      message: "Cannot retrieve the user information",
    });
  }
};

module.exports = {
  test,
  register,
  login,
  getProfile,
  getUserList,
  updateUser,
  uploadAvatar,
  avatar,
  followerCount,
};
