const createModel = require('../src/createModel').createModel
const Collection = require('../src/collection').Collection
const List = require('../src/list').List
const createStore = require('../src/store').createStore


const Address = createModel('Address', {
  propTypes: {
    street: '',
    city: '',
    state: ''
  }
})

const Cost = createModel('Cost', {
  propTypes: {
    currency: 'INR',
    price: 0.0
  }
})

const Item = createModel('Item', {
  propTypes: {
    id: '',
    name: '',
    prices: Cost.List
  }
})

const Cart = createModel('Cart', {
  propTypes: {
    items: Item.List
  }
})

const User = createModel('User', {
  propTypes: {
    email: '',
    name: '',
    preferences: Collection,
    cart: Cart,
    mobileNumbers: List,
    fun: Address.Collection.List,
    fun2: Address.List.Collection,
    fun3: List.Collection
  }
})

const Session = User.Collection

const store = createStore(Session)

console.log(store.state)


store.transforms.set(1, {})
store.transforms.set(2, {})
console.log(store.state)


store.transforms[1].setEmail('chetanism@yahoo.com')
console.log(store.state)

store.transforms[1].preferences.set('deliverToNeightbour', true)
console.log(store.state)

store.transforms[2].mobileNumbers.add('123456789')
console.log(store.state)

store.transforms[2].cart.items.add({})
console.log(store.state[2].cart)

store.transforms[2].cart.items[0].prices.add({currency: 'INR'})
store.transforms[2].cart.items[0].prices[0].setPrice(100.1)
store.transforms[2].cart.items[0].prices.set(1, {currency: 'USD', price: 1.35})
console.log(store.state[2].cart.items[0])



store.transforms[2].fun.add()
store.transforms[2].fun.add()
store.transforms[2].fun[1].set('shipping')
console.log(store.state[2].fun)


store.transforms[2].fun2.set('shipping')
store.transforms[2].fun2.set('billing')
store.transforms[2].fun2.shipping.add()
console.log(store.state[2].fun2)
