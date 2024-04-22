import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client'
import { CgFontSpacing } from "react-icons/cg";
const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }


    var query: string = `
    query { 
    Page(page: 1, perPage: 10)    
    {
        media(type:ANIME, sort:POPULARITY_DESC, isAdult:false) {
            title {
                english
            }
            description(asHtml: false)
            popularity
            coverImage {
                large
                medium
                color
            }
        }
    }
    }
    `;

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query
            })
        };


    const key = JSON.stringify({ query: query.replace(/\s+/g, ''), variable: {} });

    // Check if the key with the value query already exists in the database
    const cacheData = await prismadb.cacheData.findUnique({
        where: { key: key }
    });

    if (!cacheData) {
        console.log("fetching data");
        fetch(url, options).then((response) => response.json()).then((data) => {
            prismadb.cacheData.create({
                data: {
                    key: key,
                    value: JSON.stringify(data.data.Page.media),
                    expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
                }
            }).catch((error) => {
                console.log("error", error);
            });
            return res.status(200).json(data.data.Page.media);
        })
    } else {
        console.log("using cache");
        return res.status(200).json(JSON.parse(cacheData.value));
    }
}
