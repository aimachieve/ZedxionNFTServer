const express = require('express')
const router = express.Router()
const User = require("../../models/user.model");

router.post("/deposit", async (req, res) => {
  let user = await User.findOne({ steamId: req.body.steamId })

  await User.findOneAndUpdate({ 
    steamId: req.body.steamId
  }, {
    $set: { balance: user.balance + req.body.deposited }
  })

  let updatedUser = await User.findOne({steamId: req.body.steamId})
  res.json({
    user: updatedUser
  })
}) 

router.post("/withdraw", async (req, res) => {
  let user = await User.findOne({ steamId: req.body.steamId })

  await User.findOneAndUpdate({ 
    steamId: req.body.steamId
  }, {
    $set: { balance: user.balance - req.body.withdrawal }
  })

  let updatedUser = await User.findOne({steamId: req.body.steamId})
  res.json({
    user: updatedUser
  })
})

router.post("/current", async (req, res) => {
  let user = await User.findOne({ _id: req.body.user })

  res.json({
    user: user
  })
})


module.exports = router
