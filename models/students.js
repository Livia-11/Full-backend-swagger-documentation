const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
    Names: {
        type: String
    },
    Class: {
        type: String
    },
    Field: {
        type: String
    },
    PositionId: {
        type: String
    }
})
const studentModel = new mongoose.model("student", studentSchema);
module.exports = studentModel;