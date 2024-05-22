import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serveurAuth from "@/lib/serveurAuth";
import aniListFunction from "@/lib/aniListFunctions";
import { get } from "lodash";

export default async (req: NextApiRequest, res: NextApiResponse) => {

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

        // Récupérer les IDs de contenu favori
        const favoriteIds = favorites.map(favorite => favorite.contentId);

        // // Récupérer tous les cacheData
        // const allCacheData = await prismadb.cacheData.findMany();

        // const favoriteContent = allCacheData
        //     .filter(cacheData => !cacheData.key.includes("sort:POPULARITY") && !cacheData.key.includes("sort:TRENDING"))
        //     .filter(cacheData => category !== undefined && cacheData.key.includes(category.toUpperCase()))
        //     .map(cacheData => JSON.parse(cacheData.value))
        //     .filter(media => favoriteIds.includes(media.id.toString()))
        // // Supprimer les doublons en utilisant un ensemble
        // const uniqueFavoriteContent = Array.from(new Set(favoriteContent.map(media => media.id)))
        //     .map(id => favoriteContent.find(media => media.id === id));
        return res.status(200).json(await aniListFunction.getFavorites(favoriteIds, category));
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}