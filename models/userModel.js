const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
});

module.exports = new mongoose.model("User", userSchema);
