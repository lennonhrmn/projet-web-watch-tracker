// pages/api/favorite/updateEpisode.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismadb';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    const { userId, contentId, lastEpisode } = req.body;

    // console.log("user, content, lastepisode", userId, contentId, lastEpisode);

    if (req.method === 'POST') {
        try {
            const favorite = await prisma.favorite.updateMany({
                where: { userId, contentId },
                data: { lastEpisode },
            });

            if (favorite.count === 0) {
                return res.status(404).json({ message: 'Favorite not found' });
            }

            // console.log("fav post", favorite);

            res.status(200).json(favorite);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'GET') {
        console.log("user, content, lastEpisode", userId, contentId, lastEpisode);
        try {
            const favorite = await prisma.favorite.findFirst({
                where: {
                    userId: userId,
                    contentId: contentId,
                },
                select: { lastEpisode: true },
            });

            if (!favorite) {
                return res.status(404).json({ message: 'Favorite not found' });
            }

            console.log("fav get", favorite);

            res.status(200).json(favorite);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
