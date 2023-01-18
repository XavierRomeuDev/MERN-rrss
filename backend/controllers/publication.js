const Publication = require("../models/Publication");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followService");

const savePublication = (req, res) => {
  const params = req.body;

  if (!params.text) {
    return res.status(400).send({
      status: "Error",
      message: "Empty text field",
    });
  }

  let newPublication = new Publication(params);
  newPublication.user = req.user.id;

  newPublication.save((err, publicationStored) => {
    if (err || !publicationStored) {
      return res.status(400).send({
        status: "Error",
        message: "Cannot save the publication",
      });
    }

    return res.status(200).send({
      status: "Success",
      message: "Publication saved",
      publicationStored,
    });
  });
};

const publicationDetail = (req, res) => {
  const publicationId = req.params.id;

  Publication.findById(publicationId, (err, publicationData) => {
    if (err || !publicationData) {
      return res.status(400).send({
        status: "Error",
        message: "Cannot find the specified publication",
      });
    }

    return res.status(200).send({
      status: "Success",
      message: "Publication data",
      publication: publicationData,
    });
  });
};

const deletePublication = (req, res) => {
  const publicationId = req.params.id;

  if (!publicationId) {
    return res.status(500).send({
      status: "Error",
      message: "Didn't receive any publication to delete",
    });
  }

  Publication.find({ user: req.user.id, _id: publicationId }).remove((err) => {
    if (err) {
      return res.status(500).send({
        status: "Error",
        message: "Cannot delete the publication",
      });
    }

    return res.status(200).send({
      status: "Success",
      message: "Publication deleted",
      publicationId,
    });
  });
};

const userPublications = (req, res) => {
  const userId = req.params.id;

  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }

  const itemsPerPage = 5;

  Publication.find({ user: userId })
    .sort("-created_at")
    .populate("user", "-password -__v -role -createdAt -email")
    .paginate(page, itemsPerPage, (err, publications, total) => {
      if (err || !publications || publications.length <= 0) {
        return res.status(404).send({
          status: "Error",
          message: "Cannot find any publication of this user",
        });
      }

      return res.status(200).send({
        status: "Success",
        message: "User publications",
        total,
        page,
        pages: Math.ceil(total / itemsPerPage),
        publications,
      });
    });
};

const uploadPublicationImage = (req, res) => {
  const publicationId = req.params.id;

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

  Publication.findOneAndUpdate(
    { user: req.user.id, _id: publicationId },
    { file: req.file.filename },
    { new: true },
    (err, publicationUpdated) => {
      if (err || !publicationUpdated) {
        return res.status(500).send({
          status: "Error",
          message: "Can't update publication image",
        });
      }

      return res.status(200).send({
        status: "Success",
        message: "Publication image uploaded succesfully",
        publication: publicationUpdated,
      });
    }
  );
};

const media = (req, res) => {
  let file = req.params.file;

  const filePath = "./uploads/publications/" + file;
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

const feed = async (req, res) => {
  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }

  let itemsPerPage = 5;

  try {
    const myFollows = await followService.followUserIds(req.user.id);

    const publications = Publication.find({
      //user: myFollows.following
      user: { $in: myFollows.following },
    })
      .populate("user", "-password -role -__v -created_at -email")
      .sort("-created_at")
      .paginate(page, itemsPerPage, (err, publications, total) => {
        if (err || !publications || publications.length <= 0) {
          return res.status(500).send({
            status: "Error",
            message: "Error retrieving the feed",
          });
        }

        return res.status(200).send({
          status: "Success",
          message: "Publication feed",
          following: myFollows.following,
          publications,
          total,
          page,
          pages: Math.ceil(total / itemsPerPage),
        });
      });
  } catch (err) {
    return res.status(500).send({
      status: "Error",
      message: "Cannot list publications on feed",
    });
  }
};

module.exports = {
  savePublication,
  publicationDetail,
  deletePublication,
  userPublications,
  uploadPublicationImage,
  media,
  feed,
};
