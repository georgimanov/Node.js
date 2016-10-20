var encryption = require('../utilities/encryption');
var users = require('../data/users');
var User = require('mongoose').model('User');

var CONTROLLER_NAME = 'users';

module.exports = {
    getRegister: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/register')
    },
    postRegister: function(req, res, next) {
        var newUserData = req.body;

        if (newUserData.password != newUserData.confirmPassword) {
            req.session.error = 'Passwords do not match!';
            res.redirect('/register');
        }
        else {
            newUserData.salt = encryption.generateSalt();
            newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, newUserData.password);
            users.create(newUserData, function(err, user) {
                if (err) {
                    console.log('Failed to register new user: ' + err);
                    var data = {
                        errorMessage: err
                    };
                    res.render(CONTROLLER_NAME + '/register', data);
                }

                req.logIn(user, function(err) {
                    if (err) {
                        var data = {
                            errorMessage: err
                        };
                        res.render(CONTROLLER_NAME + '/register', data);
                    }
                    else {
                        res.redirect('/');
                    }
                })
            });
        }
    },
    getLogin: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/login');
    },
    getProfile: function(req, res) {
        var user = req.user;
            res.render(CONTROLLER_NAME + '/profile', user);
    },
    getEdit: function(req, res){
        res.render(CONTROLLER_NAME + '/edit');
    },
    postEdit: function(req, res){
        var updatedUserData = req.body;

        var salt;
        var hashedPwd;
        salt = encryption.generateSalt();
        hashedPwd = encryption.generateHashedPassword(salt, req.body.password);

        updatedUserData.salt = salt;
        updatedUserData.hashPass = hashedPwd;

        User.findOne( { _id: req.user._id }).exec(function(err, user){
            if(err){
                var data = {
                    errorMessage: err
                };
                res.render(CONTROLLER_NAME + '/profile', data);
            }

            user.salt = updatedUserData.salt;
            user.hashPass = updatedUserData.hashPass;
            user.firstName = updatedUserData.firstName;
            user.lastName = updatedUserData.lastName;
            user.email = updatedUserData.email;
            user.facebook = updatedUserData.facebook;
            user.youTube = updatedUserData.youTube;
            user.image = updatedUserData.image;
            //user.playlist = [{
            //    id: '',
            //    rating: 0
            //}];

            user.save();

            res.render(CONTROLLER_NAME + '/profile');
        })
    }
};