import { NextApiRequest, NextApiResponse } from 'next';
import { without } from 'lodash';
import prismadb from '@/lib/prismadb';
import serveurAuth from '@/lib/serveurAuth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { currentUser } = await serveurAuth(req);
    const { contentId } = req.body;

    if (!currentUser || !currentUser.email) {
        return res.status(401).json({ error: 'Not signed in' });
    }

    if (req.method === 'POST') {

        // Check if the favorite already exists
        const existingFavorite = await prismadb.favorite.findFirst({
            where: {
                userId: currentUser.id,
                contentId: contentId,
            }
        });

        if (existingFavorite) {
            return res.status(400).json({ error: 'Favorite already exists' });
        }

        // Create new favorite
        await prismadb.favorite.create({
            data: {
                userId: currentUser.id,
                contentId: contentId,
                lastEpisode: 0,
            }
        });

        // Fetch the updated favorites list
        const updatedFavorites = await prismadb.favorite.findMany({
            where: { userId: currentUser.id }
        });
        return res.status(200).json({ favorites: updatedFavorites });
    }

    if (req.method === 'DELETE') {
        console.log("contentId and currentUser", contentId, currentUser)

        // Find the favorite to delete
        const favorite = await prismadb.favorite.findFirst({
            where: {
                userId: currentUser.id,
                contentId: contentId,
            }
        });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        // Delete the favorite
        await prismadb.favorite.delete({
            where: {
                id: favorite.id,
            }
        });

        // Fetch the updated favorites list
        const updatedFavorites = await prismadb.favorite.findMany({
            where: { userId: currentUser.id }
        });

        return res.status(200).json({ favorites: updatedFavorites });
    }

    return res.status(405).end();
}

export default handler;