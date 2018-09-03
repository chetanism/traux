'use strict';

const STATE_UPDATE_TYPES = {
  NO_UPDATES: Symbol('NO_UPDATES'),
  MERGE_UPDATES: Symbol('MERGE_UPDATES'),
  REPLACE_STATE: Symbol('REPLACE_STATE')
};

module.exports = {
  STATE_UPDATE_TYPES
};