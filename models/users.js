const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    id: { type:Number},
    first_name: {type: String},
    last_name: {type: String},
    age: { type:Number},
    nationality: {type: String}
})

module.exports = mongoose.model('User', UserModel);

