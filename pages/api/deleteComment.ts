import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import serveurAuth from "@/lib/serveurAuth";

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { currentUser } = await serveurAuth(req);

    const { commentId } = req.body;

    if (currentUser?.isAdmin === false) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        // Supprimez le commentaire de la base de données
        await prismadb.comment.delete({
            where: {
                id: commentId
            }
        });
        return res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while deleting the comment' });
    }
}

export default handler;