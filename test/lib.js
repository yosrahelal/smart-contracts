const assert = require('assert');

function assertEq(a, b) {
  if(a.eq) {
    assert(a.eq(b), 'expected: ' + a.toString() + ' == ' + b.toString());
  } else if(b.eq) {
    assert(b.eq(a), 'expected: ' + a.toString() + ' == ' + b.toString());
  } else {
    assert.equal(a, b);
  }
}

module.exports = {
  async assertReverts(promise) {
    try {
      await promise;
    } catch(e) {
      if(e.message.search('revert') < 0) assert.fail('Expected revert, but instead failed with : ' + e.message);
      return;
    }
    assert.fail('Expected revert not received');
  },

  assertLog(tx, eventName, args) {
    const event = tx.logs.find(e => e.event === eventName);
    if(!event) return assert.fail("Event '" + eventName + "' was not raised");

    for(let arg of Object.keys(args)) {
      if(typeof event.args[arg] === 'undefined') {
        assert.fail("Missing event argument '" + arg + "'");
      } else {
        assertEq(event.args[arg], args[arg]);
      }
    }
  },

  assertEq,
}