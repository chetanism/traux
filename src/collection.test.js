const testUtils = require('../tests/utils')
const Model = require('./model').Model
const Collection = require('./collection').Collection
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES

describe('collection', () => {
  describe('Collection', () => {
    it('is a class', () => {
      testUtils.testClass(Collection, Model)
    })

    describe('.propTypes', () => {
      // it('returns null for any prop name', () => {
      //   expect(Collection.propTypes.whatever).toBeNull()
      //   expect(Collection.propTypes['who cares']).toBeNull()
      // })
      it('is an empty object', () => {
        expect(Collection.propTypes).toStrictEqual({})
      })
    })

    describe('.transforms', () => {
      describe('.set', () => {
        it('sets item in the state', () => {
          const newState = Collection.transforms.set({}, 'test', 5)
          expect(newState.test).toBe(5)
        })

        it('replaces item in the state correctly', () => {
          const state = { test: 23, item: 3 }
          const newState = Collection.transforms.set(state, 'test', 42)

          expect(newState).not.toBe(state)
          expect(newState.test).toBe(42)
          expect(newState.item).toBe(3)
          expect(state.test).toBe(23)
          expect(state.item).toBe(3)
        })

        it("doesn't change state if set item is same", () => {
          const state = { test: 42, item: 3 }
          const newState = Collection.transforms.set(state, 'test', 42)
          expect(newState).toBe(state)
        })
      })

      describe('.remove', () => {
        it('removes items correctly', () => {
          const state = { test: 23, item: 42 }
          const newState = Collection.transforms.remove(state, 'test')

          expect(newState.test).toBeUndefined()
          expect(state.test).toBe(23)
        })

        it("doesn't change state if item does not exists", () => {
          const state = { test: 23, item: 42 }
          const newState = Collection.transforms.remove(state, 'dummy')
          expect(newState).toBe(state)
        })
      })
    })

    describe('constructor', () => {
      it('initializes state with passed object', () => {
        const data = { a: 1, b: 'c' }
        const c = new Collection(data)
        expect(c.getState() === data)
      })
    })

    describe('#getState', () => {
      it('returns the model state', () => {
        const c = new Collection()
        expect(c.getState()).toBe(c.state)
      })
    })

    describe('#invokeTransform', () => {
      it('invokes transform', () => {
        const c = new Collection()
        c.invokeTransform('set', 'test', 42)
        expect(c.state.test).toBe(42)
      })

      it('return NO_UPDATES if nothing changes', () => {
        const c = new Collection({ test: 42 })
        const update_type = c.invokeTransform('set', 'test', 42)
        expect(update_type).toBe(STATE_UPDATE_TYPES.NO_UPDATES)
      })
    })
  })
})
