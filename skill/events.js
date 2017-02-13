'use strict';
var StateMachine = require('alexa-statemachine').stateMachine
  , Reply = require('alexa-stateMachine').Reply
  , config = require('../config')
  , _ = require('lodash')
  , verbose = config.verbose
  , VoiceInsights = require('voice-insights-sdk')
;

module.exports = function(skill) {

  skill.onBeforeReplySent(function(request, reply) {

    console.log('On Before Reply Sent')
    VoiceInsights.track(trans.reply ,request.intent.slots,trans.reply ? trans.reply.render().say.speech : null);

    if (reply) {
      var reprompt = reply.msg.reprompt;
      if (reprompt) {
        request.session.attributes.reprompt = reprompt;
        return;
      }
    }
    request.session.attributes.reprompt = null;
  })

  skill.onSessionStarted(function(request,reply){
    VoiceInsights.initialize(request.session,config.voiceinsights.token);
  })

  skill.onBadResponse(function(request) {
    var reprompt = request.session.attributes.reprompt;
    if (reprompt) { return { ask: reprompt }; }
    //TODO: Is this reply object still valid?
    return new Reply(_.at(responses, 'Errors.BadLaunch')[0]);
  })

  /*
  skill.onError(function onError(request, error) {
    console.log('Caught error here');
    return new Reply({
      tell: "Oh no! You're empire was destroyed by a devastating " +
           _.sample(['fire','earthquake','hurricane','tornado','tsunami','alien invasion','mole men attack'])
          + ". Try again."
    });
  })
  */

}
