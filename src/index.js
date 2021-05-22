const express = require('express');
require('./db/mongoose');
const User = require('./models/user');

const app = express();
// process.env.PORT is the port heroku uses for deployment
const port = process.env.PORT || 5000;

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        res.send(user);
    }).catch((error) => {
        console.log(error)
    })
})

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
})