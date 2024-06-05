import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import serveurAuth from "@/lib/serveurAuth";
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { id } = req.query;

    const getMangaContent = await aniListFunctions.getContentManga(id as string)

    return getMangaContent ? res.status(200).json(getMangaContent) : res.status(404).end();
}

export default handler;