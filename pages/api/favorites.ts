import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serveurAuth from "@/lib/serveurAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {

        let { category } = req.query;

        if (Array.isArray(category)) category = category[0];

        console.log(typeof category, category);

        const { currentUser } = await serveurAuth(req);

        const favoriteIds = currentUser?.favoriteIds ?? [];

        const allCacheData = Array.from(await prismadb.cacheData.findMany());

        const favoriteContent = allCacheData
            .filter(cacheData => !cacheData.key.includes("sort:POPULARITY") && !cacheData.key.includes("sort:TRENDING"))
            .filter(cacheData => category !== undefined && cacheData.key.includes(category.toUpperCase()))
            .map(cacheData => JSON.parse(cacheData.value))
            //.forEach(media => console.log("media", media, media.id))
            .filter(media => favoriteIds.includes(media.id.toString()))
        return res.status(200).json(favoriteContent);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}
