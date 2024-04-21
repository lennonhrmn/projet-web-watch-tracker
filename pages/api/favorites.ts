import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serveurAuth from "@/lib/serverAuth";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serveurAuth(req);

        const favoriteContent = await prismadb.anime.findMany({
            where: {
                id: {
                    in: currentUser?.favoriteIds,
                }
            }
        });

        return res.status(200).json(favoriteContent);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}
