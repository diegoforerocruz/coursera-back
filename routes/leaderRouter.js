const express = require("express");
const bodyParser = require("body-parser");
const Leaders = require("../models/leaders");

var authenticate = require("../authenticate");

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .get((req, res, next) => {
    Leaders.find({})
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    authenticate.verifyUser,
    (req, res, next) => authenticate.verifyAdmin(req, res, next),
    (req, res, next) => {
      Leaders.create(req.body)
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(
    authenticate.verifyUser,
    (req, res, next) => authenticate.verifyAdmin(req, res, next),
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /leaders");
    }
  )
  .delete(
    authenticate.verifyUser,
    (req, res, next) => authenticate.verifyAdmin(req, res, next),
    (req, res, next) => {
      Leaders.remove({}).then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      });
    }
  );

//Handling leaders/:leaderId requests
leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    authenticate.verifyUser,
    (req, res, next) => authenticate.verifyAdmin(req, res, next),
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        "POST operation not supported on /leaders/" + req.params.leaderId
      );
    }
  )
  .put(
    authenticate.verifyUser,
    (req, res, next) => authenticate.verifyAdmin(req, res, next),
    (req, res, next) => {
      Leaders.findByIdAndUpdate(
        req.params.leaderId,
        { $set: req.body },
        { new: true }
      )
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    authenticate.verifyUser,
    (req, res, next) => authenticate.verifyAdmin(req, res, next),
    (req, res, next) => {
      Leaders.findByIdAndRemove(req.params.leaderId)
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

module.exports = leaderRouter;
