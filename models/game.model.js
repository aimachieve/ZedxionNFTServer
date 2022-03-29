const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
  betId: {
    type: Number,
  },
  betStatus: {
    type: String,
  },
  // started, inProgress, finished
  betAmount: {
    type: Number,
    default: 0
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'user',
  },
  joiner: {
    type: Schema.ObjectId,
    default: "000000000000000000000000",
    ref: 'user',
  },
  winner: {
    type: Schema.ObjectId,
    default: "000000000000000000000000",
    ref: 'user',
  },
  loser: {
    type: Schema.ObjectId,
    default: "000000000000000000000000",
    ref: 'user',
  },
  initialSide: {
    type: String,
  },
  winnerSide: {
    type: String,
    default: ""
  },
  hashValue: {
    type: String,
    default: ""
  },
  secret: {
    type: String,
    default: ""
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("game", gameSchema);
