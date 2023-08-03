const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;


        if (!name || !email || !mobile || !password) {
            return res.send({
                status: 'fail',
                message: "Please provide all required fields"
            });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send({
                status: 'fail',
                message: "User already exists"
            });
        }


        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const newUser = new User({
            name,
            email,
            mobileNumber: mobile,
            password: hashedPassword,
        });

        await newUser.save();


        const user = await User.findOne({ email });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_kEY, {
            expiresIn: '2h',
        });
        res.send({
            status: 'pass',
            message: "User registered successfully",
            name: user.name,
            token,
        });
    } catch (error) {
        res.send({
            status: 'fail',
            message: 'User not registered successfully'
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.send({
                status: 'fail',
                message: "Please provide email and password"
            });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.send({
                status: 'fail',
                message: "Invalid email or password"
            });
        }


        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.send({
                status: 'fail',
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign({ userId: user._id }, process.env.JWT_kEY, {
            expiresIn: 3000,
        });
        res.send({
            status: 'pass',
            message: "Login successful",
            name: user.name,
            token
        });
    } catch (error) {
        res.send({
            status: 'fail',
            message: "Failed to login"
        });
    }
};

module.exports = {
    register,
    login
}