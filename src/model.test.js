const Model = require('./model').Model
const isModel = require('./model').isModel
const testUtils = require('../tests/utils')

describe('model', () => {
  describe('Model', () => {
    it('is a class', () => {
      testUtils.testClass(Model)
    })

    describe('#getState()', () => {
      it('throws', () => {
        const m = new Model()
        expect(() => m.getState()).toThrow()
      })
    })

    describe('#getFullState()', () => {
      it('calls getState', () => {
        const m = new Model()
        const spy = jest.spyOn(m, 'getState')
        try {
          m.getFullState()
        } catch {}
        expect(spy).toHaveBeenCalled()
      })
    })
  })

  describe('.isModel', () => {
    it('says Model is a Model', () => {
      expect(isModel(Model)).toBe(true)
    })

    it('says derived classes are Models', () => {
      class ModelA extends Model {}
      expect(isModel(ModelA)).toBe(true)

      class ModelB extends ModelA {}
      expect(isModel(ModelB)).toBe(true)
    })

    it('says non-derived classes are not Model', () => {
      class NotModel {}
      expect(isModel(NotModel)).toBe(false)
    })
  })
})
