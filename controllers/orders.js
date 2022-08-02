const data = require('../data.json');
const fs = require('fs');

const getOrders = ((req, res) => {
  // zadanie dodatkowe
  const ordersList = data.orders.map(function(order) {
    const userIndex = data.users.findIndex(user => user.id === order.userId)
    const productIndex = data.products.findIndex(product => product.id === order.productId)
    return {
      id: order.id,
      client: data.users[userIndex].name,
      product: data.products[productIndex].name
    }
  })
  res.json(ordersList)
})

const getOrder = ((req, res) => {
  const id = Number(req.params.orderID)
  const order = data.orders.find(order => order.id === id)
  if (!order) {
    return res.status(404).send('Order not found')
  }
  res.json(order)
})

const createOrder = ((req, res)=>{
  const userId = Number(req.body.userId)
  const userIndex = data.users.findIndex(user => user.id === userId)

  const productId = Number(req.body.productId)
  const productIndex = data.products.findIndex(product => product.id === productId)

  if(data.users[userIndex].money >= data.products[productIndex].price && data.products[productIndex].amount >= 1){
    
    const updatedUser = {
      id: data.users[userIndex].id,
      name: data.users[userIndex].name,
      money: (data.users[userIndex].money - data.products[productIndex].price)
    }

    data.users[userIndex] = updatedUser;

    const updatedProduct = {
      id: data.products[productIndex].id,
      name: data.products[productIndex].name,
      price: data.products[productIndex].price,
      amount: data.products[productIndex].amount-1,
    }

    data.products[productIndex] = updatedProduct

    const newOrder = {
      id: data.orders.length + 1,
      userId: req.body.userId,
      productId: req.body.productId,
    }

    data.orders.push(newOrder);
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.json(newOrder)
  } else {
    const amount = data.products[productIndex].amount ? '' : ' Product out of stock.'
    const money = data.users[userIndex].money < data.products[productIndex].price ? ' Insufficient funds in clients account.' : ''
    res.json(`A new order cannot be created.${amount}${money}`)
  }
})

const deleteOrder = ((req, res) => {
  const order = data.orders.find(order => order.id === id)
  if (!order) {
    return res.status(404).send('Order not found')
  }
  const id = Number(req.params.orderID)
  const index = data.orders.findIndex(order => order.id === id)
  
  const userId = data.orders[index].userId
  const userIndex = data.users.findIndex(user => user.id === userId)

  const productId = data.orders[index].productId
  const productIndex = data.products.findIndex(product => product.id === productId)

  const updatedUser = {
    id: data.users[userIndex].id,
    name: data.users[userIndex].name,
    money: (data.users[userIndex].money + data.products[productIndex].price)
  }

  data.users[userIndex] = updatedUser;

  const updatedProduct = {
    id: data.products[productIndex].id,
    name: data.products[productIndex].name,
    price: data.products[productIndex].price,
    amount: data.products[productIndex].amount+1,
  }

  data.products[productIndex] = updatedProduct

  data.orders.splice(index,1)
  fs.writeFileSync("data.json", JSON.stringify(data));
  res.status(200).json(`Order ID=${req.params.orderID} deleted`)
})

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder
}