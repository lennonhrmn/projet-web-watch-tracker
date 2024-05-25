import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serveurAuth from "@/lib/serveurAuth";
import aniListFunction from "@/lib/aniListFunctions";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {

        let { category } = req.query;
        const { currentUser } = await serveurAuth(req);

        if (!currentUser || !currentUser.id) {
            return res.status(401).json({ error: 'Not signed in' });
        }

        if (Array.isArray(category)) category = category[0];
        if (category === undefined || category === "") {
            return res.status(400).json({ error: 'Category is required' });
        }

        // Récupérer les favoris de l'utilisateur
        const favorites = await prismadb.favorite.findMany({
            where: {
                userId: currentUser.id,
            },
            include: {
                user: true, // inclure les informations de l'utilisateur si nécessaire
            },
        });

        if (!favorites.length) {
            return res.status(200).json([]);
        }

        // Récupérer les IDs de contenu favori
        const favoriteIds = favorites.map(favorite => favorite.contentId);

        const favoritesData = await aniListFunction.getFavorites(favoriteIds, category);

        if (!favoritesData) {
            return res.status(500).json({ error: 'Failed to retrieve favorites data' });
        }

        return res.status(200).json(favoritesData);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}

export default handler;