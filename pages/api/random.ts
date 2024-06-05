import { NextApiRequest, NextApiResponse } from 'next'
import prisamdb from '@/lib/prismadb';
import serveurAuth from '@/lib/serveurAuth';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {

        const { category } = req.query;

        let whereClause = {};

        // Vérifie si la catégorie est définie et n'est pas un tableau
        if (typeof category === 'string') {
            whereClause = { category: category };
        }

        const photoCount = await prisamdb.photoALaUne.count({
            where: whereClause
        });

        const randomIndex = Math.floor(Math.random() * photoCount);

        const randomPhotoALaUne = await prisamdb.photoALaUne.findMany({
            where: whereClause,
            take: 1,
            skip: randomIndex
        });

        return res.status(200).json(randomPhotoALaUne[0]);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}

export default handler;