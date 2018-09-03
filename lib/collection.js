'use strict';

const Model = require('./model').Model;
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES;
const addContainers = require('./addContainers').addContainers;

class Collection extends Model {
  constructor(props = {}) {
    super();
    this.children = {};
    this.state = props;
  }

  getState() {
    return this.state;
  }

  invokeTransform(transformName, ...args) {
    const newState = Collection.transforms[transformName](this.state, ...args);
    if (newState === this.state) {
      return STATE_UPDATE_TYPES.NO_UPDATES;
    }
    this.state = newState;
    return STATE_UPDATE_TYPES.REPLACE_STATE;
  }
}

Collection.propTypes = {};

Collection.transforms = {
  set(state, id, item) {
    return item === state[id] ? state : Object.assign({}, state, {
      [id]: item
    });
  },

  remove(state, id) {
    if (!Reflect.has(state, id)) return state;
    const newState = Object.assign({}, state);
    delete newState[id];
    return newState;
  }
};

addContainers(Collection);

module.exports = {
  Collection,
  default: Collection
};