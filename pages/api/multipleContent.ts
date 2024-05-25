import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismadb';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    const { userId, contentIds } = req.query;

    if (req.method === 'GET') {
        try {
            const ids = (contentIds as string).split(',');
            const results = await Promise.all(
                ids.map(async (contentId) => {
                    const favorite = await prisma.favorite.findFirst({
                        where: {
                            userId: userId as string,
                            contentId: contentId as string,
                        },
                        select: { contentId: true, lastContentWatch: true, lastContent: true },
                    });

                    return favorite || { contentId, lastContentWatch: 0, lastContent: 0 };
                })
            );

            res.status(200).json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
