'use strict';

const Model = require('./model').Model;
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES;
const addContainers = require('./addContainers').addContainers;

class List extends Model {
  constructor(props = []) {
    super();
    this.children = {};
    // TODO: check props is always an []
    this.state = props;
  }

  getState() {
    return this.state;
  }

  invokeTransform(transformName, ...args) {
    const newState = List.transforms[transformName](this.state, ...args);
    if (newState === this.state) {
      return STATE_UPDATE_TYPES.NO_UPDATES;
    }
    this.state = newState;
    return STATE_UPDATE_TYPES.REPLACE_STATE;
  }
}

List.propTypes = [];

List.transforms = {
  set(state, idx, item) {
    if (item === state[idx]) return state;

    const newState = [...state];
    newState[idx] = item;
    return newState;
  },

  add(state, item) {
    return [...state, item];
  },

  remove(state, idx) {
    if (state.length <= idx) return state;
    return [...state.slice(0, idx), ...state.slice(idx + 1)];
  }
};

addContainers(List);

module.exports = {
  List,
  default: List
};