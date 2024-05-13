import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).end();
    }

    try {
        const { email, firstName, lastName, newPassword, confirmationNewPassword } = req.body;

        if (newPassword !== confirmationNewPassword) {
            return res.status(422).json({ error: 'New password and confirmation new password do not match' });
        }

        const user = await prismadb.user.update({
            where: { email },
            data: {
                firstName,
                lastName,
            },
        });

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await prismadb.user.update({
                where: { email },
                data: { hashedPassword },
            });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}
