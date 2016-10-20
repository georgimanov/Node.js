var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

var requiredMessage = '{PATH} is required';
var defaultImage = "http://zizaza.com/cache/big_thumb/iconset/580551/580579/PNG/256/circle_web_icon/user_user_icon_user_png_flat_icon_web_icon_png_circle_icon.png";

module.exports.init = function() {
    var userSchema = mongoose.Schema({
        username:
        {
            type: String, required: requiredMessage, unique: true,
                validate: {
                    validator: function(v) {
                        return  /^[A-z0-9_.]{6,20}$/.test(v);
                    },
                    message: "Username should be [6,20] long and contain [digits, numbers, '_' and/or '.']"
                }
        },
        salt: String,
        hashPass: String,
        firstName: { type: String, required: requiredMessage},
        lastName: { type: String, required: requiredMessage},
        email: { type: String, required: requiredMessage},
        facebook: String,
        youTube: String,
        rating: Number,
        playlists: [{
            id: String,
            rating: Number
        }],
        image: { type: String, default: defaultImage }
    });

    userSchema.method({
        authenticate: function(password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            }
            else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function(err, collection) {
        if (err) {
            console.log('Cannot find users: ' + err);
            return;
        }

        if (collection.length === 0) {
            var salt;
            var hashedPwd;

            salt = encryption.generateSalt();
            hashedPwd = encryption.generateHashedPassword(salt, '123456');
            User.create({username: 'gosho1', firstName: 'Gosho', lastName: 'Goshov', email:'gosho@abv.bg' , salt: salt, hashPass: hashedPwd });
            User.create({username: 'pesho1', firstName: 'Pesho', lastName: 'Peshov', email:'pesho@abv.bg' , salt: salt, hashPass: hashedPwd });
            console.log('User { username: \'gosho1\', password : \'123456\'} added to database...');
            console.log('User { username: \'pesho1\', password : \'123456\'} added to database...');
        }
    });
};


