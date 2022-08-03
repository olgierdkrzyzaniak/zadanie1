const data = require('../data.json');
const fs = require('fs');

const getUsers = ((req, res) => {
    res.json(data.users)
})

const getUser = ((req, res) => {
    const id = Number(req.params.userID)
    const user = data.users.find(user => user.id === id)
        if (!user) {
        return res.status(404).send('User not found')
    }
    res.json(user)
})

const createUser = ((req, res)=>{
  const newUser = {
    id: data.users.length ? data.users[data.users.length - 1].id + 1 : 1,
    name: req.body.name,
    money: req.body.money,
  } 
  data.users.push(newUser);
  fs.writeFileSync("data.json", JSON.stringify(data));
  res.status(200).json(newUser)
})

const updateUser = ((req, res) => {
    const id = Number(req.params.userID)
    const user = data.users.find(user => user.id === id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    const index = data.users.findIndex(user => user.id === id)
    const updatedUser = {
        id: data.users[index].id,
        name: req.body.name,
        money: req.body.money
    }

    data.users[index] = updatedUser;
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json('User updated')
})

const deleteUser = ((req, res) => {
    const id = Number(req.params.userID)
    const user = data.users.find(user => user.id === id);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const index = data.users.findIndex(user => user.id === id)
    data.users.splice(index,1);
    fs.writeFileSync("data.json", JSON.stringify(data));
    res.status(200).json(`User ID=${req.params.userID} deleted`)
})

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}