'use strict';

const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES;
const Collection = require('./collection').Collection;
const isModel = require('./model').isModel;
const addContainers = require('./addContainers').addContainers;

function createCollection(name, ModelClass) {
  if (isModel(name)) {
    ModelClass = name;
    name = ModelClass.name + 'Collection';
  }

  const ModelCollection = {
    [name]: class extends Collection {
      constructor(props = {}) {
        super({});
        this.children = Reflect.ownKeys(props).reduce((children, prop) => {
          children[prop] = new ModelClass(props[prop]);
          return children;
        }, {});
      }

      getState() {
        return Reflect.ownKeys(this.children).reduce((state, child) => {
          state[child] = this.children[child].getFullState();
          return state;
        }, {});
      }

      invokeTransform(transformName, ...args) {
        this.children = ModelCollection.transforms[transformName](this.children, ...args);
        return STATE_UPDATE_TYPES.REPLACE_STATE;
      }
    }
  }[name];

  ModelCollection.propTypes = {};

  ModelCollection.transforms = {
    set(children, id, item) {
      children[id] = new ModelClass(item);
      return children;
    },

    remove(children, id) {
      delete children[id];
      return children;
    }
  };

  addContainers(ModelCollection);
  return ModelCollection;
}

module.exports = {
  createCollection,
  default: createCollection
};