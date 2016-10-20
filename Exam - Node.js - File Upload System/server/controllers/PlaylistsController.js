var playlists = require('../data/playlists'),
    constants = require('../common/constants');

var Playlist = require('mongoose').model('Playlist');


var CONTROLLER_NAME = 'playlists';

var cache = {
    expires: undefined,
    data: undefined
};

module.exports = {
    getCreate: function (req, res) {
        res.render(CONTROLLER_NAME + '/create', {
            categories: constants.categories
        });
    },
    postCreate: function(req, res) {
        var playlist = req.body;
        var user = req.user;
        playlists.create(playlist,{username: user.username,},function (err, playlist) {
                if (err) {
                    var data = {
                        categories: constants.categories,
                        errorMessage: err
                    };
                    res.render(CONTROLLER_NAME + '/create', data);
                }
                else {
                    res.redirect('/playlist/details/' + playlist._id);
                }
            })
    },
    getPublic: function(req, res) {

        if (cache.expires && cache.expires < new Date()) {
            res.render(CONTROLLER_NAME + '/public', {
                title: 'Events list',
                playlistsData: cache.data,
            });
            return;
        }

        Playlist.find({public: true}).sort('-rating').limit(8).exec(function (err, playlists) {
            if (err) {
                return next(err);
            }

            cache.data = playlists;
            cache.expires = new Date() + 10;

            res.render(CONTROLLER_NAME + '/public', {
                title: 'Events list',
                playlistsData: playlists,
            });
        });
    },
    getPlaylist: function(req, res){
        Playlist.findOne( { _id: req.params.id } ).exec(function(err, playlist){
            if(err){
                console.log("Playlist could not be found" + err);
                res.status(404).end();
                return;
            }

            res.render(CONTROLLER_NAME + '/details', {
                playlist: playlist
            });
        })
    },
    getComment: function(req, res){
        var playlistId = req.params.id;
        res.render(CONTROLLER_NAME + '/comment', {
            id: playlistId
        });
    },
    postComment: function(req, res){
        var playlistId = req.body.playlistId;
        Playlist.findOne( { _id: playlistId }).exec(function(err, playlist){
            if(err){
                var data = {
                    categories: constants.categories,
                    errorMessage: err
                };
                res.render(CONTROLLER_NAME + '/details', data);
            }

            var comment = {};
            comment = {
                content: req.body.content,
                username: req.user.username
            };

            playlist.comments.push(comment);
            playlist.save();

            res.render(CONTROLLER_NAME + '/details', {
                playlist: playlist
            });
        })
    },
    getComment: function(req, res){
        var playlistId = req.params.id;
        res.render(CONTROLLER_NAME + '/comment', {
            id: playlistId
        });
    },
    putDeleteVideo:function(req, res){
        var currentUser = req.user.username;
        var video = req.body.video;
        var playlistId = req.body.playlistId;

        Playlist.findOne( { _id: playlistId }).exec(function(err, playlist){
            if(err){
                var data = {
                    errorMessage: err
                };
                res.render(CONTROLLER_NAME + '/public', data);
            }

            if(playlist.creator == currentUser){
                for (var i=playlist.videos.length-1; i>=0; i--) {
                    if (playlist.videos[i] === video) {
                        playlist.videos.splice(i, 1);
                        // break;       //<-- Uncomment  if only the first term has to be removed
                    }
                }

                playlist.save();
                res.render(CONTROLLER_NAME + '/details', {
                    playlist: playlist
                });
            }
            res.render(CONTROLLER_NAME + '/details', {
                playlist: playlist
            });
        });
    },
    postRate: function(req, res){
        var playlistId = req.body.playlistId;
        var rating = req.body.rating;
        if(!rating){
            var data = {
                errorMessage: "Rating should be set [1-5]"
            };
            res.redirect('/', data);
        }
        Playlist.findOne( { _id: playlistId }).exec(function(err, playlist){
            if(err){
                var data = {
                    errorMessage: err
                };
                res.render(CONTROLLER_NAME + '/details', data);
            }

            var rate = {
                user: req.user.username,
                rate: rating
            };

            playlist.rates.push(rate);

            var sum = 0,
                len = playlist.rates.length,
                average = 0
                count = 0;
            for(var i = 0; i < len; i+=1){
                if(playlist.rates[i].rate != undefined){
                    sum += playlist.rates[i].rate;
                    count +=1;
                }
            }

            average = sum / count;
            playlist.rating = parseFloat(Math.round(average * 100) / 100).toFixed(2);
            playlist.save();

            res.render(CONTROLLER_NAME + '/details', {
                playlist: playlist
            });
        })
    }
};