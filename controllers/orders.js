const data = require('../data.json');
const fs = require('fs');

const getOrders = ((req, res) => {
  // zadanie dodatkowe
  const ordersList = data.orders.map((order) => {
    const userIndex = data.users.findIndex(user => user.id === order.userId);
    const productIndex = data.products.findIndex(product => product.id === order.productId);
    return {
      id: order.id,
      client: data.users[userIndex].name,
      product: data.products[productIndex].name
    }
  });
  res.json(ordersList);
})

const getOrder = ((req, res) => {
  const id = Number(req.params.orderID);
  const order = data.orders.find(order => order.id === id);
  if (!order) {
    return res.status(404).send('Order not found');
  }
  res.json(order);
});

const createOrder = ((req, res)=>{
  const product = data.products.find(prod => prod.id === Number(req.body.productId));
  const user = data.users.find(user => user.id === Number(req.body.userId));

  if(!product.amount) return res.status(400).send('Out of stock');
  if(user.money - product.price < 0) return res.status(400).send('User dont have enough money');

  user.money -= product.price;
  --product.amount;

  const newOrder = {
    id: data.orders.length ? data.orders[data.orders.length - 1].id + 1 : 1,
    userId: req.body.userId,
    productId: req.body.productId,
  }

  data.orders.push(newOrder);
  fs.writeFileSync("data.json", JSON.stringify(data));
  res.status(201).json(newOrder);
})

const deleteOrder = ((req, res) => {
  const id = Number(req.params.orderID);

  const order = data.orders.find(order => order.id === id);
  if (!order) {
    return res.status(404).send('Order not found');
  }
  
  const index = data.orders.findIndex(order => order.id === id);
  const product = data.products.find(prod => prod.id === Number(req.body.productId));
  const user = data.users.find(user => user.id === Number(req.body.userId));

  user.money += product.price;
  ++product.amount;

  data.orders.splice(index,1);
  fs.writeFileSync("data.json", JSON.stringify(data));
  res.status(200).json(`Order ID=${req.params.orderID} deleted`);
});

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder
}