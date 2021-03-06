'use strict';

var router = exports.router = require('express').Router(),
  voxaApp = require('../../skill'),
  config = require('../../config');

exports.mountPath = '/skill';
router.post('/', function (req, res, next) {
  voxaApp.skill(req.body, {
    fail: (err) => {
      res.status(500);
      res.json(err);
    },
    succeed: function succeed(msg) {
      //if(config.verbose) console.log('Skill yields',JSON.stringify(msg,null,2));
      res.json(msg);
    }
  },function(err,msg){
    if(err) {
      console.log(err);
      res.status(500);
      res.json(err);
    }
    else {
      res.json(msg);
    }
  });
});
