var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app) {
    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout', auth.logout);

    app.get('/profile/edit', auth.isAuthenticated, controllers.users.getEdit);
    app.get('/profile', auth.isAuthenticated,  controllers.users.getProfile);
    app.post('/profile/edit', auth.isAuthenticated, controllers.users.postEdit);

    app.get('/playlist/create', auth.isAuthenticated, controllers.playlists.getCreate);
    app.post('/playlist/create', auth.isAuthenticated, controllers.playlists.postCreate);
    app.get('/playlist/details/:id', auth.isAuthenticated, controllers.playlists.getPlaylist);
    app.get('/playlist/:id/addComment', auth.isAuthenticated, controllers.playlists.getComment);
    app.post('/comment', auth.isAuthenticated, controllers.playlists.postComment);
    app.post('/rate', auth.isAuthenticated, controllers.playlists.postRate);
    app.put('/videos', auth.isAuthenticated, controllers.playlists.putDeleteVideo);

    app.get('/', controllers.playlists.getPublic);

    app.get('*', function(req, res) {
        res.render('index');
    });
};