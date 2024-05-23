import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { commentId } = req.body;

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