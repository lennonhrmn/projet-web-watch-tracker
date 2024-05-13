import { NextApiRequest, NextApiResponse } from "next";
import serveurAuth from "@/lib/serveurAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serveurAuth(req);
        return res.status(200).json(currentUser);
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}