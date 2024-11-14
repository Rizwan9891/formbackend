const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectId;
const user = require('../_models/user.model');
const cloudinary = require('../_helpers/cloudinary.helper');

exports.signup = (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (fields.name && fields.email && fields.phone && fields.password) {
            let email = fields.email.trim().toLowerCase();
            bcrypt.hash(fields.password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ err: true, msg: "Error hashing password." });
                }
                let newUser = {
                    name: fields.name,
                    email: email,
                    phone: fields.phone,
                    password: hashedPassword,
                    addressLine1: fields.addressLine1 || "",
                    addressLine2: fields.addressLine2 || "",
                    city: fields.city || "",
                    state: fields.state || "",
                    country: fields.country || "",
                    pinCode: fields.pinCode || ""
                };
                if (files.file) {
                    cloudinary.upload(files.file).then((uploadedFile) => {
                        newUser.file = uploadedFile;
                        saveUser(newUser, res);
                    }).catch((err) => {
                        res.status(500).json({ err: true, msg: "File upload failed." });
                    });
                } else {
                    saveUser(newUser, res);
                }
            });
        } else {
            res.status(400).json({ err: true, msg: "Please provide all required fields: name, email, phone, and password." });
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
    user.findOne({ email: email.toLowerCase() }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ err: true, msg: "User not found." });
        }
        bcrypt.compare(password, foundUser.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ err: true, msg: "Error comparing passwords." });
            }
            if (isMatch) {
                res.status(200).json({ err: false, msg: "Login successful.", user: foundUser });
            } else {
                res.status(400).json({ err: true, msg: "Incorrect password." });
            }
        });
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

