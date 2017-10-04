'use strict';
const Voxa = require('voxa')
  , config = require('../config')
  , Model = require('../services/HammurabiGame')
  , responses = require('./responses')
  , variables = require('./variables')
;

const VoxaApp = new Voxa({
  Model,
  variables,
  views: responses
});


require('./plugins/tracker')(VoxaApp);
//require('./plugins/voicelabs')(VoxaApp,config.voiceinsights);
//require('voxa-opearlo')(VoxaApp,config.opearlo);
//require('voxa-ga')(VoxaApp,config.google_analytics);
require('./events')(VoxaApp);
require('./states')(VoxaApp);

// Create the handler that responds to the Alexa Request.
exports.skill = function (event, context, done) {
  if(config.alexa.verbose) {
    //console.log('Request Received');
    console.log(JSON.stringify(event,null,2));
    context = loggedContext(context, done);
  }
  const AlexaSkill = new Voxa.Alexa(VoxaApp)
  AlexaSkill.execute(event, context)
    .then(res => done(null,res))
    .catch(done)
};

exports.action = function (event, context, done) {
  if(config.alexa.verbose) {
    //console.log('Request Received');
    console.log(JSON.stringify(event,null,2));
    context = loggedContext(context, done);
  }
  const ApiAiAgent = new Voxa.ApiAi(VoxaApp)
  ApiAiAgent.execute(event, context)
    .then(res => done(null,res))
    .catch(done)
};

function loggedContext(context, done) {
  return {
    fail: function(e) {
      console.log("Operation failed:");
      console.log(JSON.stringify(e,null,2));
      done(e);
    },
    succeed: function(res) {
      console.log("Operation succeeded:");
      console.log(JSON.stringify(res,null,2));
      done(null,res);
    }
  }
}
