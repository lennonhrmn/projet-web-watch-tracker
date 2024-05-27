import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return res.status(405).end();

    const { type, genre, page } = req.query;
    const tagContent = await aniListFunctions.getTagContent(type as string, genre as string, page as string);

    return res.status(200).json(tagContent);
}

export default handler;
