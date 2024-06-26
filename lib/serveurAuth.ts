import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import prismadb from "@/lib/prismadb";


const serveurAuth = async (req: NextApiRequest) => {

    const session = await getSession({ req }) || req.body.session;

    if (!session?.user?.email) {
        return {};
    }

    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    if (!currentUser) {
        throw new Error("Not signed in");
    }

    return { currentUser };
}

export default serveurAuth;