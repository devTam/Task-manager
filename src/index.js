const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
// process.env.PORT is the port heroku uses for deployment
const port = process.env.PORT || 5000;

app.use(express.json());

app.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.patch('/users/:id', async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  const updates = Object.keys(body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if(!isValidUpdate) {
    return res.status(400).send({ error: "Update not allowed!" });
  }

  try {
    const user = await User.findByIdAndUpdate(_id, body, { new: true, runValidators: true });

    if(!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e); 
  }
})

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  const body = req.body;

  const updates = Object.keys(body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

  if(!isValidUpdate) {
    return res.status(400).send({ error: "Update not allowed!" })
  }

  try {
    const task = await Task.findByIdAndUpdate(_id, body, { new: true, runValidators: true });
    
    if(!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
})

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
