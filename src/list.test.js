const testUtils = require('../tests/utils')
const Model = require('./model').Model
const List = require('./list').List
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES

describe('list', () => {
  describe('List', () => {
    it('is a class', () => {
      testUtils.testClass(List, Model)
    })

    describe('.propTypes', () => {
      // it('returns null for any prop name', () => {
      //   expect(List.propTypes.whatever).toBeNull()
      //   expect(List.propTypes['who cares']).toBeNull()
      // })
      it('is an empty array', () => {
        expect(List.propTypes).toStrictEqual([])
      })
    })

    describe('.transforms', () => {
      describe('.set', () => {
        it('sets item in the state', () => {
          const newState = List.transforms.set([1, 2, 3, 4], 2, 5)
          expect(newState[2]).toBe(5)
        })

        it('replaces item in the state correctly', () => {
          const state = [23, 3]
          const newState = List.transforms.set(state, 0, 42)

          expect(newState).not.toBe(state)
          expect(newState[0]).toBe(42)
          expect(newState[1]).toBe(3)
          expect(state[0]).toBe(23)
          expect(state[1]).toBe(3)
        })

        it("doesn't change state if set item is same", () => {
          const state = [42, 3]
          const newState = List.transforms.set(state, 0, 42)
          expect(newState).toBe(state)
        })
      })

      describe('.remove', () => {
        it('removes items correctly', () => {
          const state = [23, 42]
          const newState = List.transforms.remove(state, 0)

          expect(newState[1]).toBeUndefined()
          expect(state[0]).toBe(23)
        })

        it("doesn't change state if item does not exists", () => {
          const state = [23, 42]
          const newState = List.transforms.remove(state, 2)
          expect(newState).toBe(state)
        })
      })

      describe('.add', () => {
        it('adds item at the end of the list', () => {
          const state = [1, 2]
          const newState = List.transforms.add(state, 3)
          expect(newState).not.toBe(state)
          expect(newState[2]).toBe(3)
        })
      })
    })

    describe('constructor', () => {
      it('initializes state with passed object', () => {
        const data = [1, 'c']
        const l = new List(data)
        expect(l.getState() === data)
      })
    })

    describe('#getState', () => {
      it('returns the model state', () => {
        const l = new List()
        expect(l.getState()).toBe(l.state)
      })
    })

    describe('#invokeTransform', () => {
      it('invokes transform', () => {
        const l = new List()
        l.invokeTransform('set', 5, 42)
        expect(l.state[5]).toBe(42)
      })

      it('returns NO_UPDATES if nothing changes', () => {
        const l = new List([1, 2])
        const update_type = l.invokeTransform('set', 1, 2)
        expect(update_type).toBe(STATE_UPDATE_TYPES.NO_UPDATES)
      })
    })
  })
})
