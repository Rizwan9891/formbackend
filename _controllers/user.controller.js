const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectId;
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";
const user = require('../_models/user.model');
const cloudinary = require('../_helpers/cloudinary.helper');

exports.signup = (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
        console.log(fields)
        if (fields.name && fields.email && fields.phone) {
            let email = fields.email.trim().toLowerCase();
            let newUser = {
                name: fields.name,
                email: email,
                phone: fields.phone,
                addressLine1: fields.addressLine1 || "",
                addressLine2: fields.addressLine2 || "",
                city: fields.city || "",
                state: fields.state || "",
                country: fields.country || "",
                pinCode: fields.pinCode || ""
            };
            if (files.file) {
                cloudinary.upload(files).then((uploadedFile) => {
                    newUser.file = uploadedFile;
                    saveUser(newUser, res);
                }).catch((err) => {
                    res.status(500).json({ err: true, msg: "File upload failed." });
                });
            } else {
                saveUser(newUser, res);
            }
        } else {
            res.status(400).json({ err: true, msg: "Please provide all required fields: name, email, phone." });
        }
    });
};
const saveUser = (userData, res) => {
    const newUser = new user(userData);
    newUser.save().then((createdUser) => {
        res.status(200).json({ err: false, msg: "User successfully created.", createdUser });
    }).catch((err) => {
        res.status(500).json({ err: true, msg: "User creation failed.", error: err });
    });
};
exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ err: true, msg: "Please enter both email and password." });
    }
    user.findOne({ email: email }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ err: true, msg: "User not found." });
        } else {
            if (password == "12345") {
                const token = jwt.sign({ id: foundUser._id, email: foundUser.email }, SECRET_KEY);
                res.status(200).json({ err: false, msg: "Login successful.", token: token, });
            } else {
                res.status(400).json({ err: true, msg: "Incorrect password." });
            }
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: "Error finding user.", error: err });
    });
};
exports.getById = (req, res) => {
    user.findOne({ _id: new ObjectId(req.params.userId) }).then((userFound) => {
        if (userFound) {
            res.status(200).json({ err: false, msg: "User find successfully.", user: userFound });
        } else {
            res.status(500).json({ err: true, msg: "User not found." });
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: "Invalid userId." });
    });
}
exports.getAll = (req, res) => {
    user.find({}).sort({ createdAt: -1 }).then((userFound) => {
        if (userFound) {
            res.status(200).json({ err: false, msg: "User find successfully.", user: userFound });
        } else {
            res.status(500).json({ err: true, msg: "User not found." });
        }
    }).catch((err) => {
        res.status(500).json({ err: true, msg: "Invalid userId." });
    });
}

