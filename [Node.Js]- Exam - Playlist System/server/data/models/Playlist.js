var mongoose = require('mongoose');
var requiredMessage = '{PATH} is required';

module.exports.init = function() {
    var playlistSchema = mongoose.Schema({
        title: { type: String, required: requiredMessage },
        description: { type: String, required: requiredMessage },
        videos:[String],
        category: { type: String, required: requiredMessage },
        creator: { type: String, required: requiredMessage },
        date: { type: Date, default: Date.now },
        public: { type: Boolean, required: requiredMessage },
        visibleTo: [String],
        comments: [{
            username: String,
            date: { type: Date, default: Date.now },
            content: String
        }],
        rating: {type: Number, min: 1, max : 5},
        rates: [{
            user: String,
            rate: {type: Number, min:1, max: 5}
        }]
    });

    var Playlist = mongoose.model('Playlist', playlistSchema);

    Playlist.find({}).exec(function(err, collection) {
        if (err) {
            console.log('Cannot find users: ' + err);
            return;
        }

        if (collection.length === 0) {

            Playlist.create({
                title: "Some title",
                description: "Description",
                videos: ['http://google.com', 'http://youtube.com', 'http://telerikacademy.com'],
                category: 'Music',
                creator: 'gosho1',
                public: true,
                visibleTo: ['pesho1'],
                comments: [{
                    username: 'gosho1',
                    content: 'was here'
                },{
                    username: 'pesho1',
                    content: 'also was here'
                }],
                rating: 5,
                rates: [{
                    user: 'pesho1',
                    rate: 5
                },{
                    user: 'gosho1',
                    rate: 5
                }]

            });
            Playlist.create({
                title: "Some title new",
                description: "Description dos",
                videos: ['http://google.com', 'http://youtube.com', 'http://telerikacademy.com'],
                category: 'Music',
                creator: 'gosho1',
                public: true,
                visibleTo: ['pesho1'],
                comments: [{
                    username: 'gosho1',
                    content: '... was here'
                },{
                    username: 'pesho1',
                    content: '.. also was here'
                }],
                rating: 4,
                rates: [{
                    user: 'pesho1',
                    rate: 4
                },{
                    user: 'gosho1',
                    rate: 4
                }]

            });
            Playlist.create({
                title: "Some title private",
                description: "Description dos private",
                videos: ['http://google.com', 'http://youtube.com', 'http://telerikacademy.com'],
                category: 'Music',
                creator: 'gosho1',
                public: false,
                visibleTo: ['pesho1'],
                comments: [{
                    username: 'gosho1',
                    content: '... was here ....'
                },{
                    username: 'pesho1',
                    content: '.. also was here ...'
                }],
                rating: 4,
                rates: [{
                    user: 'pesho1',
                    rate: 4
                },{
                    user: 'gosho1',
                    rate: 4
                }]

            });
            console.log('Playlist(s) added to database...');
        }
    });
};



