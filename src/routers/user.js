const express = require('express');
const User = require("../models/user");
const auth = require('../middleware/auth');
const router = new express.Router();

router.post("/users", async (req, res) => {
    const user = new User(req.body);
  
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  });

  router.post("/users/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      // custom function declared in model
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (e) {
      res.status(400).send();
    }
  });

  router.post("/users/logout", auth, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);

      await req.user.save()
      res.send();

    } catch (e) {
      res.status(500).send(e);
    }
  });

  router.post('/users/logoutAll', auth, async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send()
    }
  })

  // Get a user profile
  router.get("/users/me", auth, async (req, res) => {
    res.send(req.user); 
  });
   
  // router.get("/users/:id", auth, async (req, res) => {
  //   const _id = req.params.id;
  
  //   try {
  //     const user = await User.findById(_id);
  //     if (!user) {
  //       res.status(404).send();
  //     }
  //     res.send(user);
  //   } catch (e) {
  //     res.status(500).send();
  //   }
  // });
  
  router.patch("/users/me", auth, async (req, res) => {
    const body = req.body;
  
    const updates = Object.keys(body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
  
    if (!isValidUpdate) {
      return res.status(400).send({ error: "Update not allowed!" });
    }
  
    try {

      // Find user and replace user data with update data, manually save so pre save middleware can apply to updates
      updates.forEach(update => req.user[update] = body[update]);
      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  
  router.delete("/users/me", auth, async (req, res) => {
  
    try {
      await req.user.remove;
      res.send(req.user);
  
    } catch (e) {
      res.status(500).send();
    }
  });

module.exports = router; 