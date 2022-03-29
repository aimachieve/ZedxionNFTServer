const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  steamId: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  banned: {
    status: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number
    }
  },
  role: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  betted: {
    type: Number,
    default: 0
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("user", userSchema);
