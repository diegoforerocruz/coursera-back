const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = ["http://localhost:3000", "https://localhost:3443"];
var corsOptionsDelegate = (req, callback) => {
  console.log("it entered cors with options");
  var corsOptions;
  console.log(req.header("Origin"));
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    console.log("done");
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
