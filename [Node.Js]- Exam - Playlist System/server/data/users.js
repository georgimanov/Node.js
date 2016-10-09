var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    update: function(updatedUserData, callback){
        User.update({_id: updatedUserData._id}, updatedUserData, callback);
    }
};

