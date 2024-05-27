import prismadb from "@/lib/prismadb";

const aniListFunctions = {
    getFavorites,
    getLastContentAnime,
    getLastContentManga,
    getPopular,
    getTrending,
    getFinishedContent,
    getContentAnime,
    getContentManga,
    getGenreContent,
    getTagContent,
    getNewContent,
};

async function fetchWithCache(query: string = "", variables: any = {}): Promise<any> {
    const url = 'https://graphql.anilist.co',
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
        return JSON.parse(cacheData.value);
    } else {
        const data = await fetch(url, options).then(res => res.json()).catch(err => console.error(err));
        const getData = () => (query.includes('Page(') && query.includes('media(')) ? data.data.Page?.media : data.data.Media;

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(getData()),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return getData();
    }
}

const watchCardDataFormat = `
id
title {
    english
    romaji
}
description(asHtml: true)
popularity
coverImage {
    large
    medium
    color
}`

async function getFavorites(favoriteIds: string[], category: string): Promise<any> {
    const query: string = `
        query ($ids: [Int]) {
            Page(perPage: 50){
                media(id_in: $ids, type: ${category.toUpperCase()}) {
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
                    popularity
                }
            }
        }`;

    const variables = {
        ids: favoriteIds.map(id => parseInt(id))
    };

    return fetchWithCache(query, variables);
}

async function getLastContentAnime(contentId: string): Promise<any> {
    const query: string = `
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                episodes
                nextAiringEpisode {
                    episode
                }
            }
        }`;

    const variables = {
        id: parseInt(contentId)
    };

    return fetchWithCache(query, variables);
}

async function getLastContentManga(contentId: string): Promise<any> {
    const query: string = `
        query ($id: Int) {
            Media(id: $id, type: MANGA) {
                chapters
            }
        }`;

    const variables = {
        id: parseInt(contentId)
    };

    return fetchWithCache(query, variables);
}

async function getPopular(category: string, page: string, perPage: string = '20'): Promise<any> {
    const query: string = `
        query { 
            Page(page: ${page}, perPage: ${perPage}) {
                media(type:${category.toUpperCase()}, sort:POPULARITY_DESC, isAdult:false) {
                    ${watchCardDataFormat}
                }
            }
        }
    `;

    return fetchWithCache(query);
}

async function getTrending(category: string, page: string, perPage: string = '20'): Promise<any> {
    const query: string = `
        query { 
            Page(page: ${page}, perPage: ${perPage}) {
                media(type:${category.toUpperCase()}, sort:TRENDING_DESC, isAdult:false) {
                    ${watchCardDataFormat}
                }
            }
        }
    `;
    return fetchWithCache(query);
}

async function getFinishedContent(category: string, page: string, perPage: string = '20'): Promise<any> {
    const query: string = `
        query { 
            Page(page: ${page}, perPage: ${perPage}) {
                media(type:${category.toUpperCase()}, status:FINISHED, isAdult:false) {
                    ${watchCardDataFormat}
                }
            }
        }
    `;

    return fetchWithCache(query);
}

async function getContentAnime(id: string): Promise<any> {
    const query: string = `
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

    const variables = {
        id: id
    };

    return fetchWithCache(query, variables);
}

async function getContentManga(id: string): Promise<any> {
    const query: string = `
        query($id: Int) {
            Media(id: $id, type:MANGA) {
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
                chapters
                volumes
                countryOfOrigin
                source(version:3)
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
                averageScore
                favourites
                isAdult
            }
        }
    `;

    const variables = {
        id: id
    };

    return fetchWithCache(query, variables);
}

async function getGenreContent(type: string, genre: string, page: string, perPage: string = '20'): Promise<any> {
    const query: string = `
        query { 
            Page(page: ${page}, perPage: ${perPage}) {
                media(type:${type.toUpperCase()}, genre:"${genre}", isAdult:false) {
                    ${watchCardDataFormat}
                }
            }
        }
    `;

    return fetchWithCache(query);
}

async function getTagContent(type: string, genre: string, page: string, perPage: string = '20'): Promise<any> {
    const query: string = `
        query { 
            Page(page: ${page}, perPage: ${perPage}) {
                media(type:${type.toUpperCase()}, tag:"${genre}", isAdult:false) {
                    ${watchCardDataFormat}
                }
            }
        }
    `;

    return fetchWithCache(query);
}

async function getNewContent(category: string, date: String, page: string, perPage: string = '20'): Promise<any> {
    const query: string = `
        query { 
            Page(page: ${page}, perPage: ${perPage}) {
                media(type:${category.toUpperCase()}, sort:POPULARITY_DESC, startDate_greater:${date}, isAdult:false) {
                    ${watchCardDataFormat}
                }
            }
        }
    `;

    return fetchWithCache(query);
}

export default aniListFunctions;