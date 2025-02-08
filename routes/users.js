const router = require("express").Router();
const { User, validate } = require("../models/UserModel");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => { // <-- ADDED /register
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser)
            return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10); // <-- Fallback if SALT is missing
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            firstName: req.body.firstName, // <-- Make sure these fields exist in UserModel
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword
        });

        await newUser.save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
