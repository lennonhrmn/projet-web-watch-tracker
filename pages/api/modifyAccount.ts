import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

// const validateEmail = (email: string) => {
//     if (
//         email.length <= 4 ||
//         !email.match(/@/g) ||
//         !email.includes(".") ||
//         email.indexOf("@") <= 0 ||
//         email.lastIndexOf(".") <= email.indexOf("@") + 1 ||
//         email.lastIndexOf(".") >= email.length - 1
//     ) {
//         return false;
//     }
//     return true;
// };

const validatePassword = (password: string) => {
    if (password.length <= 7) {
        return false;
    } else if (!password.match(/[A-Z]/g)) {
        return false;
    } else if (!password.match(/[a-z]/g)) {
        return false;
    } else if (!password.match(/[0-9]/g)) {
        return false;
    } else if (!password.match(/[^a-zA-Z0-9]/g)) {
        return false;
    }
    return true;
};

const handler = async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).end();
    }

    try {
        const { email, firstName, lastName, newPassword, confirmationNewPassword } = req.body;

        // // Validate email
        // if (!validateEmail(newEmail)) {
        //     return res.status(422).json({ error: 'Invalid email format' });
        // }

        // Validate new password
        if (newPassword && !validatePassword(newPassword)) {
            return res.status(422).json({ error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character' });
        }

        if (newPassword !== confirmationNewPassword) {
            return res.status(422).json({ error: 'New password and confirmation new password do not match' });
        }

        // // Check if the user exists
        // let existingUser;
        // if (email !== newEmail) {
        //     existingUser = await prismadb.user.findUnique({
        //         where: { email: newEmail },
        //     });
        //     if (existingUser) {
        //         return res.status(404).json({ error: 'Email already used' });
        //     }
        // } else {
        //     existingUser = await prismadb.user.findUnique({
        //         where: { email },
        //     });
        //     if (!existingUser) {
        //         return res.status(404).json({ error: 'User not found' });
        //     }
        // }

        // Prepare updated user data
        const updatedUserData: any = {
            // email: newEmail,
            firstName,
            lastName,
        };

        // Update password if provided
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            updatedUserData.hashedPassword = hashedPassword;
        }

        // Update user information
        const user = await prismadb.user.update({
            where: { email: email },
            data: updatedUserData,
        });

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(400).end();
    }
}

export default handler;
