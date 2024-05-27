import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { type, genre } = req.query;

    const genreContent = await aniListFunctions.getGenreContent(type as string, genre as string);

    return res.status(200).json(genreContent);
}

export default handler;
