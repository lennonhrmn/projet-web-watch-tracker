import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const popularAnime = await aniListFunctions.getPopular("ANIME");

    return res.status(200).json(popularAnime);
}

export default handler;
