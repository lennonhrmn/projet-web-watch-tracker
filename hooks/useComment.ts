import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useComment = () => {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const socket = io();
        socket.on('newComment', (comment: Comment) => {
            setComments(prevComments => [...prevComments, comment]);
        });

        // Récupérer les commentaires existants depuis votre API ou toute autre source de données

        return () => {
            socket.disconnect();
        };
    }, []);

    const addComment = (comment: Comment) => {
        // Envoyer le commentaire au backend
        fetch('/api/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        })
            .then(response => response.json())
            .then(newComment => {
                // Le nouveau commentaire sera émis par le serveur via le socket
            })
            .catch(error => {
                console.error('Error adding comment:', error);
            });
    };

    return { comments, addComment };
};

export default useComment;
