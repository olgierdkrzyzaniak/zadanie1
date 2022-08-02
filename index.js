const express = require('express')
const app = express()
const data = require('./data.json')
const products_routes = require('./routes/products.js')
const users_routes = require('./routes/users.js')
const orders_routes = require('./routes/orders.js')

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})

app.get('/api', (req, res) => {
  res.json(data)
})

app.use(express.json())
app.use('/api/products', products_routes)
app.use('/api/users', users_routes)
app.use('/api/orders', orders_routes)