import { NextApiRequest, NextApiResponse } from 'next';
import { without } from 'lodash';
import prismadb from '@/lib/prismadb';
import serveurAuth from '@/lib/serverAuth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { currentUser } = await serveurAuth(req);
    const { contentId } = req.body;

    if (req.method === 'POST') {

        const user = await prismadb.user.update({
            where: {
                email: currentUser?.email || '',
            },
            data: {
                favoriteIds: {
                    push: contentId
                }
            }
        })
        return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {

        const updatedFavoriteIds = without(currentUser?.favoriteIds, contentId);

        const updatedUser = await prismadb.user.update({
            where: {
                email: currentUser?.email || '',
            },
            data: {
                favoriteIds: updatedFavoriteIds,
            }
        });

        return res.status(200).json(updatedUser);
    }

    return res.status(405).end();
}