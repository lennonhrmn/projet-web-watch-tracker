import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if all required fields are provided
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await prismadb.user.findUnique({
            where: { email }
        });

        // Validate email format
        if (
            email.length <= 4 ||
            !email.match(/@/g) ||
            !email.includes(".") ||
            email.indexOf("@") <= 0 ||
            email.lastIndexOf(".") <= email.indexOf("@") + 1 ||
            email.lastIndexOf(".") >= email.length - 1
        ) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password format
        if (
            password.length <= 7 ||
            !password.match(/[A-Z]/g) ||
            !password.match(/[a-z]/g) ||
            !password.match(/[0-9]/g) ||
            !password.match(/[^a-zA-Z0-9]/g)
        ) {
            return res.status(400).json({ error: 'Invalid password format' });
        }

        if (existingUser) {
            return res.status(422).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prismadb.user.create({
            data: {
                email,
                hashedPassword,
                firstName,
                lastName,
                image: "",
                emailVerified: new Date(),
            }
        });

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default handler;