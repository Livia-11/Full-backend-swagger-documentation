const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true
    },

    password: {
        type: String,
    },

    PositionId: {
        type: String
    }

});
const usermodel = new mongoose.model("signup", userSchema);

module.exports = usermodel;