'use strict';

var router = exports.router = require('express').Router(),
  voxaApp = require('../../skill'),
  config = require('../../config');

exports.mountPath = '/action';
router.post('/', function (req, res, next) {
  voxaApp.action(req.body, {
    fail: e => {
      res.status(500);
      res.json(e);
    },
    succeed: function succeed(msg) {
      if(config.verbose) console.log('Skill yields',JSON.stringify(msg,null,2));
      res.json(msg);
    }
  },function(err,msg){
    if(err) {
      res.status(500);
      res.json(e);
    }
    else {
      if(config.verbose) console.log('Skill yields',JSON.stringify(msg,null,2));
      res.json(msg);
    }
  });
});
