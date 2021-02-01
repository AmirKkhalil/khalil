var express = require('express');
var router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcrypt');
const { findOneAndDelete } = require('../models/User');


router.post('/signup', function(req, res, next) {

    User.find({ username: req.body.username })
        .then(result => {
            if (result.length < 1) {
                // hasher le mdps
                bcrypt.hash(req.body.password, 10, (error, hash) => {

                    if (error) {
                        res.status(404).json({
                            error: error.message
                        })
                    } else { // creer l user
                        const user = new User({
                            username: req.body.username,
                            password: hash
                        });

                        // sauvegarder dans la DB
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'successful user creation'
                                })
                                console.log(result)
                            })
                            .catch(error => {
                                res.status(500).json({
                                    ereur: error.message
                                })
                            });
                    }

                });
            } else {
                res.status(404).json({ message: 'utilistaeur deja créer' });
            }
        })
        .catch(error => {
            res.status(404).json({ error: error });
        });

});

router.get('/signin', function(req, res, next) {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                const mdps = req.body.password;
                const hash = user.password;
                bcrypt.compare(mdps, hash)
                    .then(result => {
                        if (result) {
                            res.status(200).json({
                                message: 'success signin'
                            });
                            console.log(user);
                        } else {
                            res.status(404).json({
                                message: 'wrong password'
                            });
                        }
                    });
            } else {
                res.status(404).json({
                    message: 'wrong user name'
                });
            }
        })
        .catch(error => {
            res.status(404).json({
                erreur: error
            });
        });
});

// update user : 
router.patch('/updatuser/:id', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // crrer un objet user
            const newuser = {
                username: req.body.username,
                password: hash
            };
            // requet de modification   !!!!
            User.findOneAndUpdate({ _id: req.params.id }, { $set: newuser })
                .then(result => {
                    if (result) {
                        res.status(200).json({
                            message: 'success updating user'
                        });
                        console.log(result);
                    } else {
                        res.status(404).json({
                            message: 'user not found'
                        })
                    }
                })
                .catch(error => {
                    res.status(404).json({
                        error: error
                    })
                });
        })
        .catch(error => {
            res.status(404).json({
                error: error
            });
        });
});

router.delete('/deletuser/:id', (req, res, next) => {
    // requet delet
    User.findOneAndDelete({ _id: req.params.id })
        .then(result => {
            if (result) {
                res.status(200).json({ message: 'user deleted success !' });
                console.log(result);
            } else {
                res.status(404).json({
                    message: 'user not found'
                })
            }
        })
        .catch(error => {
            res.status(404).json({
                error: error
            })
        });
});

module.exports = router;