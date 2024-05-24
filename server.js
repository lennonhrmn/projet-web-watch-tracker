const http = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
    const server = http.createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

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
        io.to(socket.id).emit("restoreComments", restoreComments);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('newComment', async newComment => {
            console.log('newComment:', newComment);
            try {
                await prisma.comment.create({
                    data: {
                        content: newComment.content,
                        userId: newComment.userId,
                        contentId: newComment.contentId,
                    },
                });
                console.log('Comment saved successfully');
                io.to(contentId).emit('newComment', { ...newComment, user });
            } catch (error) {
                console.error('Error saving comment:', error);
            }
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, err => {
        if (err) throw err;
    });
});
