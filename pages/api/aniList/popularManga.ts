import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return res.status(405).end();

    const { type = 'MANGA', page = '1' } = req.query;
    const popularManga = await aniListFunctions.getPopular(type as string, page as string);

    return res.status(200).json(popularManga);
}

export default handler;