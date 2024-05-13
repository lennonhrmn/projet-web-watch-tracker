import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serveurAuth from '@/lib/serveurAuth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        await serveurAuth(req);

        const { category } = req.query;
        let data;

        // Filtre les données en fonction de la catégorie si elle est définie
        if (category) {
            if (category === 'anime') {
                data = await prismadb.anime.findMany();
            } else if (category === 'manga') {
                data = await prismadb.manga.findMany();
            } else if (category === 'series') {
                data = await prismadb.series.findMany();
            }
        } else {
            // Si aucune catégorie n'est spécifiée, récupère toutes les données
            data = await prismadb.anime.findMany();
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}
