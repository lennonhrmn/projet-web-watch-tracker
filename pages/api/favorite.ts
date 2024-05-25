import next, { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serveurAuth from '@/lib/serveurAuth';
import aniListFunction from "@/lib/aniListFunctions";
import { last } from 'lodash';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { currentUser } = await serveurAuth(req);
    const { contentId, type } = req.body;

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

        let lastContent;
        if (type === "ANIME") {
            lastContent = await aniListFunction.getLastContentAnime(contentId);
            lastContent = lastContent.episodes ? lastContent.episodes : lastContent.nextAiringEpisode.episode - 1;
        } else {
            lastContent = await aniListFunction.getLastContentManga(contentId);
            lastContent = lastContent.chapters ? lastContent.chapters : 0;
        }

        // Create new favorite
        await prismadb.favorite.create({
            data: {
                userId: currentUser.id,
                contentId: contentId,
                lastContentWatch: 0,
                lastContent: lastContent
            }
        });

        // Fetch the updated favorites list
        const updatedFavorites = await prismadb.favorite.findMany({
            where: { userId: currentUser.id }
        });
        return res.status(200).json({ favorites: updatedFavorites });
    }

    if (req.method === 'DELETE') {

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