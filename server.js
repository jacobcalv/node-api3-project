const express = require('express');
const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')
const server = express();
const moment = require('moment')

server.use(logger);
server.use(express.json());
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const date = moment().format('MM/D/YYYY hh:mm:ss')
  console.log(`A ${req.method} Request has been initiated at ${date} on localhost:4000${req.url}`);
  next();
}

module.exports = server;
