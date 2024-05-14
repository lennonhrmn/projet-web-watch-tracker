const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Gérer les connexions et les recherches&:
io.on('connection', socket => {
    console.log('Nouvelle connexion');

    socket.on('search', async (query) => {
        const results = await searchAnime(query);
        socket.emit('searchResults', results);
    });

    socket.on('disconnect', () => {
        console.log('Connexion terminée');
    });
});
