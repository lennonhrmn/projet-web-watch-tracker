import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import aniListFunctions from "@/lib/aniListFunctions";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return res.status(405).end();
    
    const { type, page } = req.query;
    const currentDate = new Date(); // Obtient la date actuelle
    currentDate.setMonth(currentDate.getMonth() - 1); // Soustrait un mois à la date actuelle
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Ajoute un zéro au début si nécessaire
    const day = currentDate.getDate().toString().padStart(2, '0'); // Ajoute un zéro au début si nécessaire
    const formattedDate = `${year}${month}${day}`; // Formatte la date en "yyyymmdd"

    const newContent = await aniListFunctions.getNewContent(type as string, formattedDate as string, page as string);

    return res.status(200).json(newContent);
}

export default handler;
