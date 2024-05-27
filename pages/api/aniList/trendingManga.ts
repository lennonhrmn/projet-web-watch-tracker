import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const trendingManga = await aniListFunctions.getTrending("MANGA");

    return res.status(200).json(trendingManga);
}

export default handler;
