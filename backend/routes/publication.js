const express = require("express");
const router = express.Router();
const multer = require("multer");
const PublicationController = require("../controllers/publication");
const check = require("../middlewares/auth");

//Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications");
  },

  filename: (req, file, cb) => {
    cb(null, "pub-" + Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage });

//GET
router.get("/detail/:id", check.auth, PublicationController.publicationDetail);
router.get(
  "/user/:id/:page?",
  check.auth,
  PublicationController.userPublications
);
router.get("/media/:file", PublicationController.media);
router.get("/feed/:page?", check.auth, PublicationController.feed);
//POST
router.post("/save", check.auth, PublicationController.savePublication);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  PublicationController.uploadPublicationImage
);
//PUT

//DELETE
router.delete(
  "/delete/:id",
  check.auth,
  PublicationController.deletePublication
);

module.exports = router;
