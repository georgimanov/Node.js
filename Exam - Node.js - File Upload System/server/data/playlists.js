var Playlist = require('mongoose').model('Playlist'),
    constants = require('../common/constants');

var cache = {
    expires: undefined,
    data: undefined
};

module.exports = {
    create: function(playlist, user, callback) {
        if (constants.categories.indexOf(playlist.category) < 0){
                callback('Invalid category!');
            return;
        }

        playlist.public = !!playlist.public;
        playlist.creator = user.username;
        playlist.date = new Date();

        Playlist.create(playlist, callback);
    },
    active: function(page, pageSize, callback) {
        page = page || 1;
        pageSize = pageSize || 10;

        if (page == 1 && cache.expires && cache.expires < new Date()) {
            callback(null, cache.data);
            return;
        }

        Playlist
            .find({})
            .sort('-rating')
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .exec(function(err, foundPlaylists) {
                if (err) {
                    callback(err);
                    return;
                }

                Playlist.count().exec(function(err, numberOfPlaylists) {
                    var data = {
                        playlists: foundPlaylists,
                        currentPage: page,
                        pageSize: pageSize,
                        total: numberOfPlaylists
                    };

                    callback(err, data);

                    cache.data = data;
                    cache.expires = new Date() + 10;
                });
            })
    }
};