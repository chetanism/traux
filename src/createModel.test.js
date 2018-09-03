const testUtils = require('../tests/utils')
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES

const Model = require('./model').Model
const createModel = require('./createModel').createModel

const addressPropTypes = {
  city: 'alpha',
  state: 'beta'
}
const Address = createModel({ propTypes: addressPropTypes })
const User = createModel({
  propTypes: {
    name: 'IronMan',
    address: Address
  }
})

describe('createModel', () => {
  it('creates a ModelClass that extends Model', () => {
    const Klass = createModel({})
    testUtils.testClass(Klass, Model)
  })

  it('creates named Model', () => {
    const Klass = createModel('Klass', {})
    expect(Klass.name).toBe('Klass')
  })

  it('sets propTypes on the ModelClass', () => {
    expect(Address.propTypes).toBe(addressPropTypes)
  })

  it('creates setter transforms', () => {
    expect(User.transforms.setName).toBeInstanceOf(Function)
    expect(User.transforms.setAddress).not.toBeDefined()

    const state = {
      name: 'IronMan',
      age: 22
    }

    const nextState = User.transforms.setName(state, 'SuperMan')
    expect(nextState).toStrictEqual({
      name: 'SuperMan',
      age: 22
    })

    expect(nextState).not.toBe(state)
  })

  describe('created ModelClass', () => {
    it('initializes state with value propTypes', () => {
      const user = new User()
      expect(user.state).toStrictEqual({
        name: 'IronMan'
      })
      expect(user.children.address).toBeInstanceOf(Address)
    })

    it('accepts prop values in constructor', () => {
      const user = new User({
        name: 'SuperMan',
        address: {
          city: 'gamma'
        }
      })

      expect(user.state).toStrictEqual({
        name: 'SuperMan'
      })

      expect(user.children.address.state).toStrictEqual({
        city: 'gamma',
        state: 'beta'
      })
    })

    describe('#invokeTransform', () => {
      it('invokes the named transform', () => {
        const user = new User()

        const prevState = user.state
        expect(prevState.name).toEqual('IronMan')

        const updateType = user.invokeTransform('setName', 'SuperMan')

        const nextState = user.state
        expect(nextState).not.toBe(prevState)
        expect(nextState.name).toEqual('SuperMan')
        expect(updateType).toBe(STATE_UPDATE_TYPES.MERGE_UPDATES)
      })

      it('return NO_UPDATES if nothing is changed', () => {
        const user = new User()

        const prevState = user.state
        expect(prevState.name).toEqual('IronMan')

        const updateType = user.invokeTransform('setName', 'IronMan')

        const nextState = user.state
        expect(nextState).toBe(prevState)
        expect(updateType).toBe(STATE_UPDATE_TYPES.NO_UPDATES)
      })
    })

    describe('#getState', () => {
      it('returns current state', () => {
        const user = new User()
        expect(user.getState()).toBe(user.state)
      })
    })

    describe('#getFullState', () => {
      it("gets model's full state", () => {
        const user = new User()
        expect(user.getFullState()).toStrictEqual({
          name: 'IronMan',
          address: {
            city: 'alpha',
            state: 'beta'
          }
        })
      })
    })
  })
})
