const STATE_UPDATE_TYPES = require('./constants').STATE_UPDATE_TYPES

class Store {
  constructor(stateGetter, transformsProxy) {
    Reflect.defineProperty(this, 'state', {
      get: stateGetter
    })
    this.transforms = transformsProxy

    const handlers = []

    this.subscribe = handler => {
      handlers.push(handler)
    }

    this.unsubscribe = handler => {
      const idx = handlers.indexOf(handler)
      if (idx > -1) {
        handlers.splice(idx, 1)
      }
    }

    this.notify = () => {
      handlers.forEach(handler => handler(this.state))
    }
  }
}

function createStore(Model, initialState = {}) {
  const model = new Model(initialState)
  let currentState = model.getFullState()

  function applyStateChange(path, modelState, updateType) {
    currentState = updateState(currentState, path, modelState, updateType)
    store.notify()
  }

  const transformsProxy = proxyCreator(applyStateChange)(model, [])

  const store = new Store(() => currentState, transformsProxy)

  return store
}

function proxyCreator(applyStateChange) {
  return function createTransformsProxy(model, path) {
    return new Proxy(model, {
      get(_, key) {
        if (Reflect.has(model.constructor.transforms, key)) {
          return (...args) => {
            const updateType = model.invokeTransform(key, ...args)
            if (updateType !== STATE_UPDATE_TYPES.NO_UPDATES) {
              applyStateChange(path, model.getState(), updateType)
            }
          }
        }

        if (Reflect.has(model.children, key)) {
          return createTransformsProxy(model.children[key], [...path, key])
        }

        console.log(path, key)
        throw new Error(
          `Unknown transform or child model: ${[...path, key].join('.')}`
        )
      }
    })
  }
}

function updateState(state, path, modelState, updateType) {
  if (path.length === 0) {
    if (updateType === STATE_UPDATE_TYPES.REPLACE_STATE) {
      return modelState
    }

    return {
      ...state,
      ...modelState
    }
  }

  const child = path[0]
  const remainingPath = path.slice(1)
  const newState = Array.isArray(state) ? [...state] : { ...state }

  newState[child] = updateState(
    state[child],
    remainingPath,
    modelState,
    updateType
  )
  return newState
}

module.exports = {
  createStore
}
