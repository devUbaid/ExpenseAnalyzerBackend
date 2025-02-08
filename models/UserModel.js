const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true }, // Ensure uniqueness
	password: { type: String, required: true },
});

// JWT Token Generation
userSchema.methods.generateAuthToken = function () {
	if (!process.env.JWTPRIVATEKEY) {
		throw new Error("JWTPRIVATEKEY is not defined in .env file");
	}
	return jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
};

const User = mongoose.model("User", userSchema); // Ensure capital "U" in "User"

// Joi Validation Schema
const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity({
			min: 8,
			max: 30,
			lowerCase: 1,
			upperCase: 1,
			numeric: 1,
			symbol: 1,
			requirementCount: 2,
		}).required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
