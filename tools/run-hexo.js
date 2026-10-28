'use strict';

// Exit explicitly after Hexo releases its event-loop handles.
const runHexo = require('../lib/run-hexo');

runHexo(process.argv.slice(2))
  .then(() => {
    if (process.argv[2] === 'server') return;
    const exitCode = process.exitCode || 0;
    setImmediate(() => process.exit(exitCode));
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
