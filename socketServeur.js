// server.js

const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const { rest } = require('lodash');

const prisma = new PrismaClient();

const server = http.createServer();

// ADD cors option to allow cross-origin requests

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

console.log('Server started');


io.on('connection', async socket => {
    console.log('User connected');
    let { contentId, type, user } = socket.handshake.query;
    socket.join(contentId);
    if (user) user = JSON.parse(user);
    let restoreComments = await prisma.comment.findMany(
        {
            where: {
                contentId: contentId || '',
            },
            include: {
                user: true,
            },
        },
    );
    // restoreComments = exclude(restoreComments, ['hashedPassword']);
    io.to(socket.id).emit("restoreComments", restoreComments);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('newComment', async newComment => {
        try {
            // Enregistrer le nouveau commentaire dans la base de données avec Prisma
            await prisma.comment.create({
                data: {
                    content: newComment.content,
                    userId: newComment.userId,
                    contentId: newComment.contentId,
                },
            });

            // Envoyer le nouveau commentaire à tous les clients connectés
            io.to(contentId).emit('newComment', { ...newComment, user });
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
