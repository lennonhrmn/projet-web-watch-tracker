// pages/api/favorite/updateEpisode.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismadb';
import { getSession } from 'next-auth/react';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({ req });

    const { userId, contentId, lastEpisode } = req.body;

    if (req.method === 'POST') {
        try {
            const favorite = await prisma.favorite.updateMany({
                where: { userId, contentId },
                data: { lastEpisode },
            });

            if (favorite.count === 0) {
                return res.status(404).json({ message: 'Favorite not found' });
            }

            res.status(200).json(favorite);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;