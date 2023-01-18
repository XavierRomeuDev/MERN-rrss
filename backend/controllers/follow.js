const Follow = require("../models/Follow");
const User = require("../models/User");
const mongoosePaginate = require("mongoose-pagination");
const followerService = require("../services/followService");

const followUser = (req, res) => {
  const params = req.body;

  const identity = req.user;

  let userToFollow = new Follow({
    user: identity.id,
    followed: params.followed,
  });

  userToFollow.save((err, followStored) => {
    if (err || !followStored) {
      return res.status(500).send({
        status: "Error",
        message: "Error to follow user",
      });
    }

    return res.status(200).send({
      status: "Success",
      message: "User followed",
      identity: req.user,
      follow: followStored,
    });
  });
};

const unfollowUser = (req, res) => {
  const userId = req.user.id;

  const followedId = req.params.id;

  Follow.find({
    user: userId,
    followed: followedId,
  }).remove((err, followDeleted) => {
    if (err || !followDeleted) {
      return res.status(200).send({
        status: "Error",
        message: "No coincidence",
      });
    }

    return res.status(200).send({
      status: "Success",
      message: "User unfollowed",
    });
  });
};

const followedUsers = (req, res) => {
  let userId = req.user.id;

  if (req.params.id) {
    userId = req.params.id;
  }

  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }

  const itemsPerPage = 5;

  Follow.find({ user: userId })
    .populate("user followed", "-password -role -__v -email")
    .paginate(page, itemsPerPage, async (err, follows, total) => {
      let followUserIds = await followerService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "Success",
        message: "List of followed users",
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_followers: followUserIds.followers,
      });
    });
};

const followingUsers = (req, res) => {
  let userId = req.user.id;

  if (req.params.id) {
    userId = req.params.id;
  }

  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }

  const itemsPerPage = 5;

  Follow.find({ followed: userId })
    .populate("user", "-password -role -__v -email")
    .paginate(page, itemsPerPage, async (err, follows, total) => {
      let followUserIds = await followerService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "Success",
        message: "List of users who follows me",
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_followers: followUserIds.followers,
      });
    });

  return res.status(200).send({
    status: "Success",
    message: "List of following users",
  });
};

module.exports = {
  followUser,
  unfollowUser,
  followedUsers,
  followingUsers,
};
