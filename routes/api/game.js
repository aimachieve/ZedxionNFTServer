const express = require('express')
const router = express.Router()
const Game = require("../../models/game.model");
const User = require("../../models/user.model");
const RandomOrg = require('random-org');

var Pusher = require('pusher')
var pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  // port: 443,
  useTLS: true
})
console.log("pusher=>", pusher)

// Get Flips
router.get("/flips", async (req, res) => {
  console.log("flips was invoked")

  console.log("pusher=>", pusher)
  console.log("env=>", process.env.SECRET)
  const games = await Game.find({})
    .sort({ updatedAt: -1 })
    .populate(
      'creator',
      ['name', 'avatar']
    )
    .populate(
      'joiner',
      ['name', 'avatar']
    )
    .populate(
      'winner',
      ['name', 'avatar']
    )
    .populate(
      'loser',
      ['name', 'avatar']
    )

  res.json({
    flips: games,
  })
})
// Get players
router.get("/players", async (req, res) => {
  const players = await User.find({ betted: { $gt: 0 } })
  const playersCount = await User.find({ betted: { $gt: 0 } }).countDocuments()

  const flips = await Game.find({})
  let totalActiveAmount = 0
  if (flips.length > 0) {
    for (var i = 0; i < flips.length; i++) {
      if (flips[i].betStatus === "created")
        totalActiveAmount += flips[i].betAmount
      if (flips[i].betStatus === "joined")
        totalActiveAmount += flips[i].betAmount * 2

    }
  }

  res.json({
    count: playersCount,
    players: players,
    totalActiveAmount: totalActiveAmount
  })
})
// Create a new flip
router.post("/create", async (req, res) => {
  // Get random data and get hash value
  var random = new RandomOrg({ apiKey: '17c7891f-f3f3-4b69-a91d-18b544ab2b27' });
  var hashvalue = ""
  await random.generateSignedStrings({
    // n: 1,
    n: 1,
    length: 32,
    characters: 'abcdef1234567890',
    replacement: false
  }).then(function (result) {
    hashvalue = result.random.data[0]
  });
  // Set flip data
  let count = await Game.countDocuments({})
  await new Game({
    betId: count + 1,
    betStatus: "created",
    betAmount: req.body.betAmount,
    creator: req.body.creator,
    initialSide: req.body.initialSide,
    hashValue: hashvalue
  }).save();
  // Update users
  let user = await User.findOne({ _id: req.body.creator })
  await User.updateOne({
    _id: req.body.creator
  }, {
    balance: user.balance - req.body.betAmount,
    betted: user.betted + req.body.betAmount
  })
  // Return values
  let updatedUser = await User.findOne({ _id: req.body.creator })
  const games = await Game.find({})
    .sort({ updatedAt: -1 })
    .populate(
      'creator',
      ['name', 'avatar']
    )
    .populate(
      'joiner',
      ['name', 'avatar']
    )
    .populate(
      'winner',
      ['name', 'avatar']
    )
    .populate(
      'loser',
      ['name', 'avatar']
    )

  res.json({
    flips: games,
    user: updatedUser
  })

  const statistics = await pusherStatistics()
  const coinStats = await pusherCoinStats()

  pusher.trigger('games', 'update', {
    flips: games,
    statistics: statistics,
    coinStats: coinStats,
  }).catch(err => {
    console.log("error=>", err)
  });
})
// Join flip
router.post("/join", async (req, res) => {
  // Get random data and get secret
  var random = new RandomOrg({ apiKey: '17c7891f-f3f3-4b69-a91d-18b544ab2b27' });
  var secret = ""
  await random.generateSignedStrings({
    // n: 1,
    n: 1,
    length: 12,
    characters: 'abcdef1234567890',
    replacement: false
  }).then(function (result) {
    secret = result.random.data[0]
  });

  await Game.updateOne({
    betId: req.body.betId
  }, {
    joiner: req.body.joiner,
    betStatus: "joined",
    secret: secret
  })

  const games = await Game.find({})
    .sort({ updatedAt: -1 })
    .populate(
      'creator',
      ['name', 'avatar']
    )
    .populate(
      'joiner',
      ['name', 'avatar']
    )
    .populate(
      'winner',
      ['name', 'avatar']
    )
    .populate(
      'loser',
      ['name', 'avatar']
    )

  // Update users
  let user = await User.findOne({ _id: req.body.joiner })
  await User.updateOne({
    _id: req.body.joiner
  }, {
    balance: user.balance - req.body.betAmount,
    betted: user.betted + req.body.betAmount
  })

  // Return values
  let updatedUser = await User.findOne({ _id: req.body.joiner })

  res.json({
    flips: games,
    user: updatedUser
  })

  const statistics = await pusherStatistics()
  const coinStats = await pusherCoinStats()

  pusher.trigger('games', 'update', {
    flips: games,
    statistics: statistics,
    coinStats: coinStats,
  }).catch(err => {
    console.log("error=>", err)
  });;
})
// Finish flip
router.post("/finish", async (req, res) => {
  // Update games
  await Game.updateOne({
    _id: req.body.gameId
  }, {
    winner: req.body.winner,
    loser: req.body.loser,
    betStatus: "finished",
    winnerSide: req.body.winnerSide
  })
  const games = await Game.find({})
    .sort({ updatedAt: -1 })
    .populate(
      'creator',
      ['name', 'avatar']
    )
    .populate(
      'joiner',
      ['name', 'avatar']
    )
    .populate(
      'winner',
      ['name', 'avatar']
    )
    .populate(
      'loser',
      ['name', 'avatar']
    )

  // Update User
  let winner = await User.findOne({ _id: req.body.winner })
  await User.updateOne({
    _id: req.body.winner
  }, {
    balance: winner.balance + req.body.amount * 2 * (1 - 0.065)
  })

  //  Updated User
  let currentUser = await User.findOne({ _id: req.body.currentUser })
  // console.log("currentuser=>", currentUser)
  // currentUser.balance = winner.balance + req.body.amount * 2 * (1 - 0.065)
  console.log("=================================")
  console.log(currentUser.balance)
  res.json({
    flips: games,
    user: currentUser
  })

  const statistics = await pusherStatistics()
  const coinStats = await pusherCoinStats()
  console.log("pusher=>", pusher)

  pusher.trigger('games', 'update', {
    flips: games,
    statistics: statistics,
    coinStats: coinStats,
  }).catch(err => {
    console.log("error=>", err)
  });;
})
// Get statistics data
router.get("/statistics", async (req, res) => {
  // Total value of active games
  const all = await Game.find({})
  let total = 0
  for (var i = 0; i < all.length; i++) {
    if (all[i].betStatus === "created") {
      total += all[i].betAmount
    } else if (all[i].betStatus === "joined") {
      total += all[i].betAmount * 2
    }
  }

  // Get Joinable games
  const joinable = await Game.find({ betStatus: "created" }).countDocuments()

  // Get bestcoin
  const headsWinnerCount = await Game.find({ winnerSide: 'heads' }).countDocuments()
  const tailsWinnerCount = await Game.find({ winnerSide: 'tails' }).countDocuments()
  const coinStatus = headsWinnerCount > tailsWinnerCount ? 'Heads' :
    headsWinnerCount === tailsWinnerCount ? '---' : 'Tails'

  res.json({
    totalActiveValue: total,
    joinableGames: joinable,
    bestCoin: coinStatus,
  })
})
// Get user statistics data
router.post("/userStatistics", async (req, res) => {
  // Get my status
  let count = 0

  const createdFlip = await Game.find({ betStatus: "created" })
  if (createdFlip.length > 0)
    for (let i = 0; i < createdFlip.length; i++) {
      if (createdFlip[i].creator == req.body.user)
        count++
    }
  const joinedFlip = await Game.find({ betStatus: "joined" })
  if (joinedFlip.length > 0)
    for (let i = 0; i < joinedFlip.length; i++) {
      if (joinedFlip[i].joiner == req.body.user)
        count++
    }

  const status = count > 0 ? "ACTIVE" : "NOT IN"

  // Get Won Flips
  const wonFlips = await Game.find({ winner: req.body.user }).countDocuments()

  res.json({
    myStatus: status,
    wonFlips: wonFlips
  })
})
// Get coinstats data
router.get("/coinStats", async (req, res) => {
  // Get my status
  const totalCount = await Game.find({ betStatus: "finished" }).countDocuments()
  // Heads win count
  const headsCount = await Game.find({ winnerSide: 'heads' }).countDocuments()
  // Tails win count
  const tailsCount = await Game.find({ winnerSide: 'tails' }).countDocuments()

  // data
  const headsRate = totalCount === 0 ? 50 : (headsCount / totalCount) * 100
  const tailsRate = totalCount === 0 ? 50 : (tailsCount / totalCount) * 100
  const bestCoin = headsRate > tailsRate ? 'heads' :
    headsRate === tailsRate ? 'same' : 'tails'

  res.json({
    headsRate: headsRate,
    tailsRate: tailsRate,
    bestCoin: bestCoin
  })
})

// Get statistics function
const pusherStatistics = async () => {
  const all = await Game.find({})
  let total = 0
  for (var i = 0; i < all.length; i++) {
    if (all[i].betStatus === "created") {
      total += all[i].betAmount
    } else if (all[i].betStatus === "joined") {
      total += all[i].betAmount * 2
    }
  }

  // Get Joinable games
  const joinable = await Game.find({ betStatus: "created" }).countDocuments()

  // Get bestcoin
  const headsWinnerCount = await Game.find({ winnerSide: 'heads' }).countDocuments()
  const tailsWinnerCount = await Game.find({ winnerSide: 'tails' }).countDocuments()
  const coinStatus = headsWinnerCount > tailsWinnerCount ? 'Heads' :
    headsWinnerCount === tailsWinnerCount ? '---' : 'Tails'

  const statistics = {
    totalActiveValue: total,
    joinableGames: joinable,
    bestCoin: coinStatus,
  }
  return statistics
}
// Get coin stats function 
const pusherCoinStats = async () => {
  // Get my status
  const totalCount = await Game.find({ betStatus: "finished" }).countDocuments()
  // Heads win count
  const headsCount = await Game.find({ winnerSide: 'heads' }).countDocuments()
  // Tails win count
  const tailsCount = await Game.find({ winnerSide: 'tails' }).countDocuments()

  // data
  const headsRate = totalCount === 0 ? 50 : (headsCount / totalCount) * 100
  const tailsRate = totalCount === 0 ? 50 : (tailsCount / totalCount) * 100
  const bestCoin = headsRate > tailsRate ? 'heads' :
    headsRate === tailsRate ? 'same' : 'tails'

  return ({
    headsRate: headsRate,
    tailsRate: tailsRate,
    bestCoin: bestCoin
  })
}
module.exports = router
