const testUtils = require('../tests/utils')
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES
const List = require('./list').List
const createList = require('./createList').createList

const createModel = require('./createModel').createModel

const addressPropTypes = {
  city: 'alpha',
  state: 'beta'
}
const Address = createModel({ propTypes: addressPropTypes })
const AddressList = createList(Address)

describe('createList', () => {
  describe('createList', () => {
    it('creates a class that extends List', () => {
      testUtils.testClass(AddressList, List)
    })

    it('can create named lists', () => {
      const NamedList = createList('AddList', Address)
      expect(NamedList.name).toBe('AddList')
    })

    describe('created ModelList', () => {
      describe('.propTypes', () => {
        // it('returns ModelClass for any prop name', () => {
        //   expect(AddressList.propTypes[1]).toBe(Address)
        // })
        it('is an empty array', () => {
          expect(AddressList.propTypes).toStrictEqual([])
        })
      })

      describe('.transforms', () => {
        describe('.set', () => {
          it('sets the child Model', () => {
            const children = AddressList.transforms.set([], 1, {
              city: 'Pune',
              state: 'MH'
            })
            expect(children[1]).toBeInstanceOf(Address)
            expect(children[1].getState()).toStrictEqual({
              city: 'Pune',
              state: 'MH'
            })
          })
        })

        describe('.remove', () => {
          it('removes the specified child', () => {
            const children = AddressList.transforms.set([], 'test', {
              city: 'Pune',
              state: 'MH'
            })
            AddressList.transforms.remove(children, 0)
            expect(children[0]).toBeUndefined()
          })
        })

        describe('.add', () => {
          it('adds item at the end of the list', () => {
            const children = AddressList.transforms.set([], 0, {
              city: 'Pune',
              state: 'MH'
            })
            AddressList.transforms.add(children, {
              city: 'Lucknow',
              state: 'UP'
            })
            expect(children[1]).toBeInstanceOf(Address)
            expect(children[1].getState()).toStrictEqual({
              city: 'Lucknow',
              state: 'UP'
            })
          })
        })
      })

      describe('constructor', () => {
        it('initializes children with passed props', () => {
          const ac = new AddressList([
            { city: 'Pune', state: 'MH' },
            { city: 'Lucknow', state: 'UP' }
          ])

          expect(ac.children[0]).toBeInstanceOf(Address)
          expect(ac.children[1]).toBeInstanceOf(Address)
          expect(ac.children[0].state).toStrictEqual({
            city: 'Pune',
            state: 'MH'
          })
          expect(ac.children[1].state).toStrictEqual({
            city: 'Lucknow',
            state: 'UP'
          })
        })
      })

      describe('#getState', () => {
        it('gets state', () => {
          const ac = new AddressList([
            { city: 'Pune', state: 'MH' },
            { city: 'Lucknow', state: 'UP' },
            {}
          ])

          expect(ac.getState()).toStrictEqual([
            { city: 'Pune', state: 'MH' },
            { city: 'Lucknow', state: 'UP' },
            { city: 'alpha', state: 'beta' }
          ])
        })
      })

      describe('#invodeTransform', () => {
        it('invokes transform', () => {
          const ac = new AddressList([
            { city: 'Pune', state: 'MH' },
            { city: 'Lucknow', state: 'UP' },
            {}
          ])
          const update_type = ac.invokeTransform('remove', 1)
          expect(ac.getState()).toStrictEqual([
            { city: 'Pune', state: 'MH' },
            { city: 'alpha', state: 'beta' }
          ])
          expect(update_type).toBe(STATE_UPDATE_TYPES.REPLACE_STATE)
        })
      })
    })
  })
})
