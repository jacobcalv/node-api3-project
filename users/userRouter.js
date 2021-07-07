const express = require('express');
const db = require('./userDb')
const router = express.Router();
const postDb = require('../posts/postDb')

router.post('/', validateUser, async (req, res) => {
  const userInfo = req.body
  try{
    console.log(req.body.name)
    const createdUser = await db.insert(userInfo)
    res.status(200).json({message: "User has been created", createdUser})
  } catch (error) {
      console.log(error);
      res.status(500).json({
          error: "The User could not be created" 
      })
  }

});

router.post('/:id/posts', validatePost, (req, res) => {
  db.getUserPosts(req.params.id, req.body)
  .then(data => {
        res.status(202).json({message: "successful", data})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
          error: "The user information could not be modified.",
      })
    })

});

router.get('/', async (req, res) => {
  try{
    const users = await db.get(req.query); 
    res.status(200).json(users);
  }catch (error) {
    console.log(error);
    res.status(500).json({
        error: "The posts information could not be retrieved."
    })
}
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, async(req, res) => {
  try{
    const posts = await db.getUserPosts(req.params.id); 
    res.status(200).json(posts);
  }catch (error) {
    console.log(error);
    res.status(500).json({
        error: "The users posts information could not be retrieved."
    })
}
});

router.delete('/:id',  validateUserId, async (req, res) => {
  try{
    const deleteUser = await db.remove(req.params.id)
    res.status(200).json({message: "User has been deleted", deleteUser})
  } catch (error) {
      console.log(error);
      res.status(500).json({
          error: "The User could not be removed" 
      })
  }

});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  db.update(req.params.id, req.body)
  .then(data => {
        res.status(202).json({message: "successful", data})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
          error: "The user information could not be modified.",
      })
    })

});

//custom middleware


function validateUser(req, res, next) {
  if(!req.body){
    console.log(req.body)
    res.status(400).json({ message: "missing user data" })
  } else if (!req.body.name){
    res.status(400).json({ message: "missing required name field" })
  } else{
    next();
  }
}

function validatePost(req, res, next) {
  if(!req.body){
    console.log(req.body)
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text){
    res.status(400).json({ message: "missing required text field" })
  } else{
    next();
  }
}

function validateUserId(req, res, next) {
  const {id} = req.params;
  db.getById(id)
    .then(user => {
      if (user) {
        req.user = user
        console.log(req.user)
        next();
      } else {
        res.status(404).json({message: "user not found in the system hmmm"})
      }
    })
    .catch( err => {
      res.status(500).json({err})
    })
}

module.exports = router;
