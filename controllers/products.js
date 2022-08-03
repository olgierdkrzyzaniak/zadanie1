const data = require('../data.json');
const fs = require('fs');

const getProducts = ((req, res) => {
    res.json(data.products)
})

const getProduct = ((req, res) => {
    const id = Number(req.params.productID)
    const product = data.products.find(product => product.id === id)

        if (!product) {
        return res.status(404).send('Product not found')
    }
    res.json(product)
})

const createProduct = ((req, res)=>{
  const newProduct = {
    id: data.products.length ? data.products[data.products.length - 1].id + 1 : 1,
    name: req.body.name,
    price: req.body.price,
    amount: req.body.amount
  } 
  data.products.push(newProduct);
  fs.writeFileSync("data.json", JSON.stringify(data));
  res.status(200).json(newProduct)
})

const updateProduct = ((req, res) => {
    const id = Number(req.params.productID)
    const product = data.products.find(product => product.id === id);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    const index = data.products.findIndex(product => product.id === id)
    const updatedProduct = {
        id: data.products[index].id,
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount
    }

    data.products[index] = updatedProduct
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json('Product updated');
})

const deleteProduct = ((req, res) => {
    const id = Number(req.params.productID)
    const product = data.products.find(product => product.id === id);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    
    const index = data.products.findIndex(product => product.id === id)
    data.products.splice(index,1)
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json(`Product ID=${req.params.productID} deleted`)
})

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}