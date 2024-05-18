const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectId;
const user = require('../_models/user.model');
const cloudinary = require('../_helpers/cloudinary.helper');

exports.signup = (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (fields.firstName != undefined && fields.firstName != '' && fields.firstName != null) {
            if (fields.lastName != undefined && fields.lastName != '' && fields.lastName != null) {
                if (fields.email != undefined && fields.email != '' && fields.email != null) {
                    if (fields.dob != undefined && fields.dob != '' && fields.dob != null) {
                        let email = fields.email.trim();
                        email = email.toLowerCase();
                        let date = new Date();
                        let dob = new Date(fields.dob);
                        const age = date.getFullYear() - dob.getFullYear()
                        if (age >= 18) {
                            if (files.document != undefined) {
                                // let name = fields.names.split(',')
                                // let count = 0;
                                cloudinary.upload(files).then((docs) => {
                                    // docs.forEach((doc) => {
                                    //     console.log(doc)
                                    //     doc.name = name[count]
                                    //     count++
                                    // })
                                    if (fields.rStreet1 != undefined && fields.rStreet1 != '' && fields.rStreet1 != null) {
                                        if (fields.rStreet2 != undefined && fields.rStreet2 != '' && fields.rStreet2 != null) {
                                            if (fields.isChecked == true || fields.isChecked == "true") {
                                                let ins = new user({
                                                    firstName: fields.firstName,
                                                    lastName: fields.lastName,
                                                    email: email,
                                                    dob: fields.dob,
                                                    documents: docs,
                                                    residentialAddress: {
                                                        street1: fields.rStreet1,
                                                        street2: fields.rStreet2,
                                                    },
                                                    permanentAddress: {
                                                        street1: fields.rStreet1,
                                                        street2: fields.rStreet2,
                                                    },
                                                });
                                                ins.save().then((created) => {
                                                    if (created) {
                                                        res.status(200).json({ err: false, msg: "Form successfully submitted.", created: created });
                                                    } else {
                                                        res.status(500).json({ err: true, msg: "User not created successfully." });
                                                    }
                                                }).catch((err) => {
                                                    res.status(500).json({ err: true, msg: "User not created successfully." });
                                                });
                                            } else {
                                                if (fields.pStreet1 != undefined && fields.pStreet1 != '' && fields.pStreet1 != null) {
                                                    if (fields.pStreet2 != undefined && fields.pStreet2 != '' && fields.pStreet2 != null) {
                                                        let ins = new user({
                                                            firstName: fields.firstName,
                                                            lastName: fields.lastName,
                                                            email: email,
                                                            dob: fields.dob,
                                                            documents: docs,
                                                            residentialAddress: {
                                                                street1: fields.rStreet1,
                                                                street2: fields.rStreet2,
                                                            },
                                                            permanentAddress: {
                                                                street1: fields.pStreet1,
                                                                street2: fields.pStreet2,
                                                            },
                                                        });
                                                        ins.save().then((created) => {
                                                            if (created) {
                                                                res.status(200).json({ err: false, msg: "Form successfully submitted.", created: created });
                                                            } else {
                                                                res.status(500).json({ err: true, msg: "User not created successfully." });
                                                            }
                                                        }).catch((err) => {
                                                            res.status(500).json({ err: true, msg: "User not created successfully." });
                                                        });
                                                    } else {
                                                        res.status(500).json({ err: true, msg: "Please enter street2 address." });
                                                    }
                                                } else {
                                                    res.status(500).json({ err: true, msg: "Please enter street1 address." });
                                                }
                                            }
                                        } else {
                                            res.status(500).json({ err: true, msg: "Please enter street2 address." });
                                        }
                                    } else {
                                        res.status(500).json({ err: true, msg: "Please enter street1 address." });
                                    }
                                }).catch((err) => {
                                    res.status(500).json({ err: true, msg: "Document not uploaded." });
                                })
                            } else {
                                res.status(500).json({ err: true, msg: 'Both documents are mandatory.' });
                            }
                        } else {
                            res.status(500).json({ err: true, msg: 'You must be 18 years old or above' });
                        }
                    } else {
                        res.status(500).json({ err: true, msg: "Please enter your dob." });
                    }
                } else {
                    res.status(500).json({ err: true, msg: "Please enter your email." });
                }
            } else {
                res.status(500).json({ err: true, msg: "Please enter your last name." });
            }
        } else {
            res.status(500).json({ err: true, msg: "Please enter your first name." });
        }
    });
}
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
exports.uploadImage = (req, res) => {
    if (req.body.firstName != undefined && req.body.firstName != '' && req.body.firstName != null) {
        if (req.body.lastName != undefined && req.body.lastName != '' && req.body.lastName != null) {
            if (req.body.email != undefined && req.body.email != '' && req.body.email != null) {
                if (req.body.dob != undefined && req.body.dob != '' && req.body.dob != null) {
                    let email = req.body.email.trim();
                    email = email.toLowerCase();
                    let date = new Date();
                    let dob = new Date(req.body.dob);
                    const age = date.getFullYear() - dob.getFullYear()
                    if (age >= 18) {
                        if (req.files != undefined) {
                            let docs = []
                            let name = req.body.names.split(',')
                            let count = 0;
                            req.files.forEach((file) => {
                                let type = "image"
                                let fileType = file.mimetype.substring(0, file.mimetype.indexOf('/'));
                                if (fileType != "image") {
                                    type = "pdf"
                                }
                                let document = {
                                    name: name[count],
                                    type: type,
                                    url: file.path
                                }
                                docs.push(document);
                                count++
                            })
                            if (req.body.rStreet1 != undefined && req.body.rStreet1 != '' && req.body.rStreet1 != null) {
                                if (req.body.rStreet2 != undefined && req.body.rStreet2 != '' && req.body.rStreet2 != null) {
                                    if (req.body.isChecked == true || req.body.isChecked == "true") {
                                        let ins = new user({
                                            firstName: req.body.firstName,
                                            lastName: req.body.lastName,
                                            email: email,
                                            dob: req.body.dob,
                                            documents: docs,
                                            residentialAddress: {
                                                street1: req.body.rStreet1,
                                                street2: req.body.rStreet2,
                                            },
                                            permanentAddress: {
                                                street1: req.body.rStreet1,
                                                street2: req.body.rStreet2,
                                            },
                                        });
                                        ins.save().then((created) => {
                                            if (created) {
                                                res.status(200).json({ err: false, msg: "Form successfully submitted.", created: created });
                                            } else {
                                                res.status(500).json({ err: true, msg: "User not created successfully." });
                                            }
                                        }).catch((err) => {
                                            res.status(500).json({ err: true, msg: "User not created successfully." });
                                        });
                                    } else {
                                        if (req.body.pStreet1 != undefined && req.body.pStreet1 != '' && req.body.pStreet1 != null) {
                                            if (req.body.pStreet2 != undefined && req.body.pStreet2 != '' && req.body.pStreet2 != null) {
                                                let ins = new user({
                                                    firstName: req.body.firstName,
                                                    lastName: req.body.lastName,
                                                    email: email,
                                                    dob: req.body.dob,
                                                    documents: docs,
                                                    residentialAddress: {
                                                        street1: req.body.rStreet1,
                                                        street2: req.body.rStreet2,
                                                    },
                                                    permanentAddress: {
                                                        street1: req.body.pStreet1,
                                                        street2: req.body.pStreet2,
                                                    },
                                                });
                                                ins.save().then((created) => {
                                                    if (created) {
                                                        res.status(200).json({ err: false, msg: "Form successfully submitted.", created: created });
                                                    } else {
                                                        res.status(500).json({ err: true, msg: "User not created successfully." });
                                                    }
                                                }).catch((err) => {
                                                    res.status(500).json({ err: true, msg: "User not created successfully." });
                                                });
                                            } else {
                                                res.status(500).json({ err: true, msg: "Please enter street2 address." });
                                            }
                                        } else {
                                            res.status(500).json({ err: true, msg: "Please enter street1 address." });
                                        }
                                    }
                                } else {
                                    res.status(500).json({ err: true, msg: "Please enter street2 address." });
                                }
                            } else {
                                res.status(500).json({ err: true, msg: "Please enter street1 address." });
                            }
                        } else {
                            res.status(500).json({ err: true, msg: 'Both documents are mandatory.' });
                        }
                    } else {
                        res.status(500).json({ err: true, msg: 'You must be 18 years old or above' });
                    }
                } else {
                    res.status(500).json({ err: true, msg: "Please enter your dob." });
                }
            } else {
                res.status(500).json({ err: true, msg: "Please enter your email." });
            }
        } else {
            res.status(500).json({ err: true, msg: "Please enter your last name." });
        }
    } else {
        res.status(500).json({ err: true, msg: "Please enter your first name." });
    }
}

