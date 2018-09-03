function testClass(Klass, BaseKlass = Object) {
  expect(new Klass).toBeInstanceOf(Klass)
  expect(() => Klass()).toThrow()
  expect(Klass.prototype).toBeInstanceOf(BaseKlass)
}

module.exports = {
  testClass
}
