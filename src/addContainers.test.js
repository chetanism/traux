const createModel = require('./createModel').createModel
const testUtils = require('../tests/utils')
const Collection = require('./collection').Collection
const List = require('./list').List

describe('addContainers', () => {
  describe('addContainers', () => {
    it('defined the List and Collection properties on Model', () => {
      const Model = createModel({})

      const ModelCollection = Model.Collection
      testUtils.testClass(ModelCollection, Collection)

      const ModelList = Model.List
      testUtils.testClass(ModelList, List)
    })

    it("doesn't create a new container eac time", () => {
      const Model = createModel({})
      const ModelCollection = Model.Collection
      const ModelCollection2 = Model.Collection
      expect(ModelCollection).toBe(ModelCollection2)
    })

    describe('added containers', () => {
      it('has its own containers', () => {
        const Model = createModel({})
        const ModelCollection = Model.Collection
        const ModelCollectionList = ModelCollection.List
        const ModelCollectionList2 = Model.Collection.List

        expect(ModelCollectionList).toBe(ModelCollectionList2)
        testUtils.testClass(ModelCollectionList, List)
      })
    })
  })
})
