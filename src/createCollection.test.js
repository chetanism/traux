const testUtils = require('../tests/utils')
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES
const Collection = require('./collection').Collection
const createCollection = require('./createCollection').createCollection

const createModel = require('./createModel').createModel

const addressPropTypes = {
  city: 'alpha',
  state: 'beta'
}
const Address = createModel({ propTypes: addressPropTypes })
const AddressCollection = createCollection(Address)

describe('createCollection', () => {
  describe('createCollection', () => {
    it('creates a class that extends Collection', () => {
      testUtils.testClass(AddressCollection, Collection)
    })

    it('can create named collections', () => {
      const NamedCollection = createCollection('AddColl', Address)
      expect(NamedCollection.name).toBe('AddColl')
    })

    describe('created ModelCollection', () => {
      describe('.propTypes', () => {
        // it('returns ModelClass for any prop name', () => {
        //   expect(AddressCollection.propTypes.whatever).toBe(Address)
        //   expect(AddressCollection.propTypes['who cares']).toBe(Address)
        // })
        it('is an empty object', () => {
          expect(AddressCollection.propTypes).toStrictEqual({})
        })
      })

      describe('.transforms', () => {
        describe('.set', () => {
          it('sets the child Model', () => {
            const children = AddressCollection.transforms.set({}, 'test', {
              city: 'Pune',
              state: 'MH'
            })
            expect(children.test).toBeInstanceOf(Address)
            expect(children.test.getState()).toStrictEqual({
              city: 'Pune',
              state: 'MH'
            })
          })
        })

        describe('.remove', () => {
          it('removes the specified child', () => {
            const children = AddressCollection.transforms.set({}, 'test', {
              city: 'Pune',
              state: 'MH'
            })
            AddressCollection.transforms.remove(children, 'test')
            expect(children.test).toBeUndefined()
          })
        })
      })

      describe('constructor', () => {
        it('initializes children with passed props', () => {
          const ac = new AddressCollection({
            shipping: { city: 'Pune', state: 'MH' },
            billing: { city: 'Lucknow', state: 'UP' }
          })

          expect(ac.children.shipping).toBeInstanceOf(Address)
          expect(ac.children.billing).toBeInstanceOf(Address)
          expect(ac.children.shipping.state).toStrictEqual({
            city: 'Pune',
            state: 'MH'
          })
          expect(ac.children.billing.state).toStrictEqual({
            city: 'Lucknow',
            state: 'UP'
          })
        })
      })

      describe('#getState', () => {
        it('gets state', () => {
          const ac = new AddressCollection({
            shipping: { city: 'Pune', state: 'MH' },
            billing: { city: 'Lucknow', state: 'UP' },
            dummy: {}
          })

          expect(ac.getState()).toStrictEqual({
            shipping: { city: 'Pune', state: 'MH' },
            billing: { city: 'Lucknow', state: 'UP' },
            dummy: { city: 'alpha', state: 'beta' }
          })
        })
      })

      describe('#invodeTransform', () => {
        it('invokes transform', () => {
          const ac = new AddressCollection({
            shipping: { city: 'Pune', state: 'MH' },
            billing: { city: 'Lucknow', state: 'UP' },
            dummy: {}
          })
          const update_type = ac.invokeTransform('remove', 'dummy')
          expect(ac.getState()).toStrictEqual({
            shipping: { city: 'Pune', state: 'MH' },
            billing: { city: 'Lucknow', state: 'UP' }
          })
          expect(update_type).toBe(STATE_UPDATE_TYPES.REPLACE_STATE)
        })
      })
    })
  })
})
