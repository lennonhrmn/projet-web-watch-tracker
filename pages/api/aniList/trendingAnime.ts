import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return res.status(405).end();

    const { type = 'ANIME', page = '1' } = req.query;
    const trendingAnime = await aniListFunctions.getTrending(type as string, page as string);

    return res.status(200).json(trendingAnime);
}

export default handler;
