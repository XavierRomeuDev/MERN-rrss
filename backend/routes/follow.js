const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow");
const check = require("../middlewares/auth");

//GET
router.get("/followed/:id?/:page?", check.auth, FollowController.followedUsers);
router.get("/following/:id?/:page?", check.auth, FollowController.followingUsers);

//POST
router.post("/follow", check.auth, FollowController.followUser);

//DELETE
router.delete("/unfollow/:id", check.auth, FollowController.unfollowUser);


module.exports = router;