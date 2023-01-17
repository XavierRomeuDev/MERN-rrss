const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");

//Upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/avatars")
    },

    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });

//GET
router.get("/test", check.auth, UserController.test);
router.get("/profile/:id", check.auth, UserController.getProfile);
router.get("/list/:page?", check.auth, UserController.getUserList);

//POST
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/upload", [check.auth, uploads.single("file0")], UserController.upload);

//PUT
router.put("/update", check.auth, UserController.update);

module.exports = router;