const http = require('http');
const express = require('express');
const app = express();
const UsersModel = require('./models/users');
const mongoose = require('mongoose');
const config = require('./config');
const CORS = require('cors');
var bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator');
mongoose.connect(config.db_url, { useNewUrlParser: true });

app.use(CORS());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', async (req, res)=>{
    let query = {};
    if(req.query.country){
        query = { 'nationality': new RegExp(`^${req.query.country}$`, 'i') };
    }
    let users = await UsersModel.find(query);
    return res.json(users);
})


app.post('/',[
check("first_name").isString(),
check("last_name").isString(),
check("nationality").isString(),
check("age").isNumeric(),
check("id").isNumeric(),
] ,async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = new UsersModel(req.body);
    await user.save();
    return res.json(user);
})



app.get('/init', async (req, res)=>{
   

    try {
        await UsersModel.collection.drop();
    } catch (error) {
        console.log("error droping collection: it may not exists");
    }
    
  let data = require('./seeders/users.js');
  let users = await UsersModel.insertMany(data);

  return res.json(users);

});


app.get('/countries', async (req, res)=>{
   
let users = await UsersModel.aggregate(
  [ { $group: {
        _id: "$nationality"
    }}
]
);
  return res.json(users);

});


app.listen(config.port, ()=>{
    console.log('listening to port ' + config.port);
});

