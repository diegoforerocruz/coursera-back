const express = require("express");
const bodyParser = require("body-parser");
const Favorites = require("../models/favorites");

const cors = require("./cors");

var authenticate = require("../authenticate");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
      .populate("author")
      .populate("dishes")
      .then(
        (favorites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log("entramos a la funcion");
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite != null) {
        Favorites.updateOne(
          { _id: favorite._id },
          { $addToSet: { dishes: { $each: req.body } } }
        ).then((favorite) => {
          Favorites.findOne({ user: req.user._id })
            .populate("user")
            .populate("dishes")
            .then((fav) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(fav);
            });
        });
      } else {
        Favorites.create({
          user: req.user._id,
          dishes: req.body,
        }).then((favorite) => {
          Favorites.findById(favorite._id)
            .populate("user")
            .populate("dishes")
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            });
        });
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ user: req.user._id })
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:favoriteId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log("entramos a la funcion");
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite != null) {
        Favorites.updateOne(
          { _id: favorite._id },
          { $addToSet: { dishes: req.params.favoriteId } }
        ).then((favorite) => {
          Favorites.findOne({ user: req.user._id })
            .populate("user")
            .populate("dishes")
            .then((fav) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(fav);
            });
        });
      } else {
        Favorites.create({
          user: req.user._id,
          dishes: [{ _id: req.params.favoriteId }],
        }).then((favorite) => {
          Favorites.findById(favorite._id)
            .populate("user")
            .populate("dishes")
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            });
        });
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })

      .then((favorite) => {
        Favorites.updateOne(
          { _id: favorite._id },
          {
            $pull: { dishes: req.params.favoriteId },
          }
        ).then((fav) => {
          Favorites.findOne({ user: req.user._id })
            .populate("dishes")
            .populate("user")
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            });
        });
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
