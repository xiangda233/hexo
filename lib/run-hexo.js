'use strict';

const hexoEntry = require('hexo-cli');

function parseArguments(argv) {
  const args = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (!value.startsWith('--')) {
      args._.push(value);
      continue;
    }

    const option = value.slice(2);
    const next = argv[index + 1];

    if (next && !next.startsWith('--')) {
      args[option] = next;
      index += 1;
    } else {
      args[option] = true;
    }
  }

  return args;
}

function runHexo(argv) {
  return hexoEntry(process.cwd(), parseArguments(argv));
}

module.exports = runHexo;
