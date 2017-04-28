'use strict';

const _ = require('../util/lodash');
const base = require('./base');
const parse = require('../util/parsing');
const commands = require('./commands.json');

module.exports = function(sha) {
  return base
    .run(commands.show, [sha])
    .then(results => {
      const segs = parse.toArray(results, 'diff --git'); // split on the diffs
      segs.splice(0, 1); // remove the first one
      return segs.map(_parseFile);
    })
    .catch(err => {
      console.log(err);
    });
};

function _parseFile(fileDiff) {
  const segs = parse.toArray(fileDiff);
  const file = parse.splitBetween(segs[0], 'a/', 'b/');

  const diffs = parse.toArray(fileDiff, '\n@@');
  diffs.splice(0, 1);

  return {
    file,
    numDiffs: diffs.length,
    diffs: diffs.map(diff => {
      const diffSegs = parse.toArray(diff, '@@');
      return {
        indexes: diffSegs[0].split(' '),
        summary: diffSegs[1],
      };
    }),
  };
}
