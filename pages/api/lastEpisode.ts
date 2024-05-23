import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismadb';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({ req });

    const { userId, contentId } = req.query;

    if (req.method === 'GET') {
        try {
            const favorite = await prisma.favorite.findFirst({
                where: {
                    userId: userId as string,
                    contentId: contentId as string,
                },
                select: { lastEpisode: true },
            });

            if (!favorite) {
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