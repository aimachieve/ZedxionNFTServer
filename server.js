require("dotenv").config();

const express = require("express");
const ejs = require("ejs")
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser')
const cors = require('cors')

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to MongoDB 🔥`));

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw()) 
app.use(cors())
app.use(express.json())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

require("./config/steam")(app);

app.use("/auth", require("./routes/api/auth.routes"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/game", require("./routes/api/game"));


app.use(express.static('client/build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT} 🚀`));
