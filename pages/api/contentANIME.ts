import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { PrismaClient } from '@prisma/client';
import serveurAuth from "@/lib/serveurAuth";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { id } = req.query;


    var query: string = `
        query($id: Int) {  
            Media(id: $id, type:ANIME) {
                type
                status(version:2)
                id
                title {
                    english
                    native
                    romaji
                }
                description(asHtml: true)
                startDate{
                    year
                    month
                    day
                }
                endDate{
                    year
                    month
                    day
                }
                episodes
                countryOfOrigin
                source(version:3)
                trailer {
                    site
                    thumbnail
                }
                updatedAt
                popularity
                coverImage {
                    extraLarge
                    large
                    medium
                    color
                }
                bannerImage
                genres
                popularity
                averageScore
                favourites
                studios {
                    nodes {
                        name
                    }
                }
                isAdult
                nextAiringEpisode {
                    airingAt
                    timeUntilAiring
                    episode
                }
            }
        }
    `;

    var variables = {
        id: id
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    const key = JSON.stringify({ query: query.replace(/\s+/g, ''), variables: variables });

    // Check if the key with the value query already exists in the database
    const cacheData = await prismadb.cacheData.findUnique({
        where: { key: key }
    });

    if (cacheData) {
        console.log("using cache");
        return res.status(200).json(JSON.parse(cacheData.value));
    }

    console.log("fetching data");
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // Remove all HTML tags from the description of each media item
        data.data.Media.description = data.data.Media.description.replace(/<[^>]*>?/gm, '');
        // Replace &quot; with "
        data.data.Media.description = data.data.Media.description.replace(/&quot;/g, '"');

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return res.status(200).json(JSON.parse(cacheData.value));
        }

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(data.data.Media),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return res.status(200).json(data.data.Media);
    } catch (error) {
        console.error("error", error);
        return res.status(500).end();
    }
}

export default handler;