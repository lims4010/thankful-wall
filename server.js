import fetch from 'node-fetch';
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
app.use(express.static('pages/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'pages', 'build', 'index.html'));
});
app.set('trust proxy', true);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));

// ping self to avoid heroku idling
setInterval(() => {
  try {
    const url = "https://thankful-wall.herokuapp.com"
    fetch(url).then((r) => console.log(`Self ping`));
  } catch (err) {
    console.error(err);
  }
}, 300000);

// // TESTING
// const express = require('express');
// const app = express();
// const config = require('./config/default.js');
// const port = 5000;

// app.get('/', (req, res) => {
//   res.send(config.mongoURI)
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
