import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { type } = req.query;

    const finishedContent = await aniListFunctions.getFinishedContent(type as string);

    return res.status(200).json(finishedContent);
}

export default handler;
