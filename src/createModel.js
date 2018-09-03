const Model = require('./model').Model
const isModel = require('./model').isModel
const addContainers = require('./addContainers').addContainers
const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES

const setterName = key => `set${key.charAt(0).toUpperCase()}${key.slice(1)}`
const setter = prop => (state, value) =>
  value === state[prop] ? state : { ...state, [prop]: value }

function createModel(name, options) {
  if (name instanceof Object) {
    options = name
    name = 'Model'
  }

  const ModelClass = {
    [name]: class extends Model {
      constructor(props = {}) {
        super()
        this.state = buildInitialState(ModelClass.propTypes, props)
        this.children = buildChildModels(ModelClass.propTypes, props)
      }

      invokeTransform(transformName, ...args) {
        const transform = ModelClass.transforms[transformName]
        const newState = transform(this.state, ...args)
        if (newState !== this.state) {
          this.state = newState
          return STATE_UPDATE_TYPES.MERGE_UPDATES
        }
        return STATE_UPDATE_TYPES.NO_UPDATES
      }

      getState() {
        return this.state
      }

      getFullState() {
        const childStates = Reflect.ownKeys(this.children).reduce(
          (state, child) => {
            state[child] = this.children[child].getFullState()
            return state
          },
          {}
        )

        return {
          ...this.state,
          ...childStates
        }
      }
    }
  }[name]

  ModelClass.propTypes = options.propTypes || {}
  ModelClass.transforms = buildDefaultTransforms(options.propTypes)
  addContainers(ModelClass)

  return ModelClass
}

function buildInitialState(propTypes, values) {
  const props = Reflect.ownKeys(propTypes)
  return props
    .filter(prop => !isModel(propTypes[prop]))
    .reduce((state, prop) => {
      state[prop] = values[prop] === undefined ? propTypes[prop] : values[prop]
      return state
    }, {})
}

function buildChildModels(propTypes, values) {
  const props = Reflect.ownKeys(propTypes)
  return props
    .filter(prop => isModel(propTypes[prop]))
    .reduce((children, prop) => {
      const ChildModel = propTypes[prop]
      children[prop] = new ChildModel(values[prop])
      return children
    }, {})
}

function buildDefaultSetters(propTypes) {
  const props = Reflect.ownKeys(propTypes)
  return props
    .filter(prop => !isModel(propTypes[prop]))
    .reduce((setters, prop) => {
      setters[setterName(prop)] = setter(prop)
      return setters
    }, {})
}

function buildDefaultTransforms(propTypes = {}) {
  return buildDefaultSetters(propTypes)
}

module.exports = {
  createModel
}
