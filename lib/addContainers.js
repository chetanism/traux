'use strict';

function addContainers(ModelClass) {
  let ModelClassList = null;
  let ModelClassCollection = null;

  Reflect.defineProperty(ModelClass, 'List', {
    get: () => {
      const createList = require('./createList').createList;
      ModelClassList = ModelClassList || createList(ModelClass);
      return ModelClassList;
    }
  });

  Reflect.defineProperty(ModelClass, 'Collection', {
    get: () => {
      const createCollection = require('./createCollection').createCollection;
      ModelClassCollection = ModelClassCollection || createCollection(ModelClass);
      return ModelClassCollection;
    }
  });
}

module.exports = {
  addContainers
};