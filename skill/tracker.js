'use strict';
module.exports = function(skill){

  skill.onSessionStarted(function(request,reply){
    console.log('New session for ',request.user.userId)
  })

  skill.onSessionEnded(function(request,reply){
    console.log('End session for ',request.user.userId)
  })

  skill.onRequestStarted(function(request,reply) {
    if(request.type == 'IntentRequest') {
      let slots = Object.keys(request.intent.params).length > 0 ? JSON.stringify(request.intent.params) : '';
      let state = request.session.attributes.state || 'entry';
      console.log(`Got ${request.intent.name} ${slots} in state [${state}]`)
    }
    else {
      console.log('Got request ', request.type)
    }
  })

  skill.onIntentRequest(function(request,reply, trans) {
    console.log('On Intent Request')
  })

  skill.onAfterStateChanged(function(request,reply, trans) {
    console.log('On After state changed')
    console.log('Request: ' + request)
    console.log('Trans: ' + trans)
  })

  skill.onBeforeReplySent(function(request,reply, trans) {
    console.log('On before reply sent')
    console.log('Request: ' + request)
    console.log('Trans: ' + trans)
  })

  skill.onError(function(request,reply, err) {
    console.log('Error: ' + err)
    return Promise.reject(err);
  })

  skill.onStateMachineError(function(request,reply, err) {
    console.log('StateMachine Error: ' + (err.stack || err))
    return Promise.reject(err);
  })

}
