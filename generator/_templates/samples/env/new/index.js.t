---
to: ../samples/<%= dest %>/env/index.js
force: true
---
// "IMPORTANT: THIS FILE IS GENERATED, CHANGES SHOULD BE MADE WITHIN '@ninja/generator'"

export default function () {
  let ninjaEnv;
  try {
    ninjaEnv = require('@ninja/env');
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      // try local env module
      ninjaEnv = require('./ninja-env');
      return ninjaEnv;
    }

    throw err;
  }

  return ninjaEnv;
}
