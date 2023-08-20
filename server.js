const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())
// allow req.body.name to accept json`

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

// same password will be hashed to the same hash, salt + password to avoid that, to avoid hacking

app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    // default genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //or omit salt, (req.body.password, 10)
    // console.log(22, salt)
    // console.log(23, hashedPassword)
    const user = { name: req.body.name, password: hashedPassword }
    console.log(25, user)

    users.push(user)
    res.status(201).send()
    console.log(29, users)
  } catch (err) {
    res.status(500).send(err)
    console.log(err)
  }
})

app.post('/users/login', async (req, res) => {
  console.log(37, req.body.name)
  console.log(38, users)
  const user = users.find((user) => user.name === req.body.name)
  console.log(40, user)
  // console.log(41, user.name, req.body.name)
  // console.log(37, user, user.password)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    console.log(40, req.body.password, user.password)
    if (await bcrypt.compare(req.body.password, user.password)) {
      // get the salt of user.password, hash body.password, compare them
      res.send('Success')
    } else {
      res.send('Not allowed, password incorrect')
    }
  } catch (error) {
    res.status(500).send()
    console.log(49, error)
  }
})

app.listen(3000)
