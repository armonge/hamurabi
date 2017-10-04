'use strict';
var Reply = require('voxa').Reply
  , _ = require('lodash')
;

module.exports = function(skill) {

  skill.onBeforeReplySent(function(request, reply) {
    var reprompts = reply.msg.reprompts;
    if (reprompts.length) {
      request.model._reprompts = reprompts;
      return;
    }
  });


  skill.onUnhandledState(function(request) {
    var reprompts = request.model._reprompts;
    if (reprompts) {
      return { message:  { ask: reprompts.join('\n') }, to: request.model._state };
    }

    return {reply: 'Errors.BadLaunch'};
  })

  skill.onStateMachineError(function onError(request, error) {
    return new Reply(request,{
      tell: "Oh no! You're empire was destroyed by a devastating " +
           _.sample(['fire','earthquake','hurricane','tornado','tsunami','meteor strike','alien invasion','mole men attack','sneeze. It was pretty incredible'])
          + ". Try again."
    });
  })

}
