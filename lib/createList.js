'use strict';

const List = require('./list').List;
const isModel = require('./model').isModel;
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES;
const addContainers = require('./addContainers').addContainers;

function createList(name, ModelClass) {
  if (isModel(name)) {
    ModelClass = name;
    name = ModelClass.name + 'List';
  }

  const ModelList = {
    [name]: class extends List {
      constructor(props = []) {
        super([]);
        this.children = props.map(prop => new ModelClass(prop));
      }

      getState() {
        return this.children.map(child => child.getFullState());
      }

      invokeTransform(transformName, ...args) {
        this.children = ModelList.transforms[transformName](this.children, ...args);
        return STATE_UPDATE_TYPES.REPLACE_STATE;
      }
    }
  }[name];

  // ModelList.propTypes = new Proxy({}, {
  //   get: () => ModelClass
  // })
  ModelList.propTypes = [];

  ModelList.transforms = {
    set(children, idx, item) {
      children[idx] = new ModelClass(item);
      return children;
    },

    add(children, item) {
      children.push(new ModelClass(item));
      return children;
    },

    remove(children, idx) {
      children.splice(idx, 1);
      return children;
    }
  };

  addContainers(ModelList);
  return ModelList;
}

module.exports = {
  createList,
  default: createList
};