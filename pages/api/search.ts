import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';
import { PrismaClient } from '@prisma/client';

const prisme = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Méthode non autorisée
  }

  const { query } = req.query; // Requête de recherche
  const key = JSON.stringify({ query: (query as string).toUpperCase() });

  const url = `https://graphql.anilist.co`;
  const searchQuery = `
        query ($search: String) {
            Page(perPage: 5) {
                media(search: $search) {
                    id
                    type
                    title {
                        english
                        native
                        romaji
                    }
                    coverImage {
                        extraLarge
                        large
                        medium
                        color
                    }
                }
            }
        }
    `;

  const variables = {
    search: query,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      variables: variables,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.errors) {
      console.error('AniList error:', data.errors);
      return res.status(500).json({ message: data.errors[0].message });
    }

    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    console.log(`Nombre de requêtes restantes : ${rateLimitRemaining}`);

    return res.status(200).json(data.data.Page.media);
  } catch (error) {
    console.error('error', error);
    return res.status(500).end();
  }
};
