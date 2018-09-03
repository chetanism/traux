'use strict';

class Model {
  getFullState() {
    return this.getState();
  }

  getState() {
    throw new Error('Implement in derived model');
  }
}

function isModel(Klass) {
  return Klass === Model || Klass instanceof Function && Klass.prototype instanceof Model;
}

Model.isModel = isModel;

module.exports = {
  Model,
  isModel,
  default: Model
};