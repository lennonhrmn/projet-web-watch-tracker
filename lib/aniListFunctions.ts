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
};

async function getFavorites(favoriteIds: string[], category: string): Promise<any> {

    var query: string = `
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

    var variables = {
        ids: favoriteIds.map(id => parseInt(id))
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
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Page || !data.data.Page.media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
        }

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(data.data.Page.media),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return data.data.Page.media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getLastContentAnime(contentId: string): Promise<any> {

    var query: string = `
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                episodes
                nextAiringEpisode {
                    episode
                }
            }
        }`;

    var variables = {
        id: parseInt(contentId)
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
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
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

        return data.data.Media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getLastContentManga(contentId: string): Promise<any> {

    var query: string = `
        query ($id: Int) {
            Media(id: $id, type: MANGA) {
                chapters
            }
        }`;

    var variables = {
        id: parseInt(contentId)
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
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
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

        return data.data.Media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getPopular(category: string): Promise<any> {

    var query: string = `
        query { 
            Page(page: 1, perPage: 30) {
                media(type:${category.toUpperCase()}, sort:POPULARITY_DESC, isAdult:false) {
                    id
                    title {
                        english
                    }
                    description(asHtml: true)
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

    if (cacheData) {
        console.log("using cache");
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Page || !data.data.Page.media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
        }

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(data.data.Page.media),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return data.data.Page.media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getTrending(category: string): Promise<any> {

    var query: string = `
        query { 
            Page(page: 1, perPage: 30) {
                media(type:${category.toUpperCase()}, sort:TRENDING_DESC, isAdult:false) {
                    id
                    title {
                        english
                    }
                    description(asHtml: true)
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

    if (cacheData) {
        console.log("using cache");
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Page || !data.data.Page.media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
        }

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(data.data.Page.media),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return data.data.Page.media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getFinishedContent(category: string): Promise<any> {

    var query: string = `
        query { 
            Page(page: 1, perPage: 30) {
                media(type:${category.toUpperCase()}, status:FINISHED, isAdult:false) {
                    id
                    title {
                        english
                    }
                    description(asHtml: true)
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

    if (cacheData) {
        console.log("using cache");
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Page || !data.data.Page.media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
        }

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(data.data.Page.media),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return data.data.Page.media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getContentAnime(id: string): Promise<any> {
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
        return JSON.parse(cacheData.value);
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
            return JSON.parse(cacheData.value);
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

        return data.data.Media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getContentManga(id: string): Promise<any> {
    var query: string = `
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
        return JSON.parse(cacheData.value);
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
            return JSON.parse(cacheData.value);
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

        return data.data.Media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getGenreContent(type: string, genre: string): Promise<any> {

    var query: string = `
        query { 
            Page(page: 1, perPage: 30) {
                media(type:${type.toUpperCase()}, genre:"${genre}", isAdult:false) {
                    id
                    title {
                        english
                    }
                    description(asHtml: true)
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

    if (cacheData) {
        console.log("using cache");
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Page || !data.data.Page.media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
        }

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(data.data.Page.media),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return data.data.Page.media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}

async function getTagContent(type: string, genre: string): Promise<any> {

    var query: string = `
        query { 
            Page(page: 1, perPage: 30) {
                media(type:${type.toUpperCase()}, tag:"${genre}", isAdult:false) {
                    id
                    title {
                        english
                    }
                    description(asHtml: true)
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

    if (cacheData) {
        console.log("using cache");
        return JSON.parse(cacheData.value);
    }

    console.log("fetching data");

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.errors) {
            console.error("AniList API returned errors:", data.errors);
            return [];
        }

        if (!data.data || !data.data.Page || !data.data.Page.media) {
            console.error("AniList API returned unexpected response structure:", data);
            return [];
        }

        const cacheData = await prismadb.cacheData.findUnique({
            where: { key: key }
        });

        if (cacheData) {
            console.log("using cache");
            return JSON.parse(cacheData.value);
        }

        // Store the data in the database with the unique cache key
        prismadb.cacheData.create({
            data: {
                key: key,
                value: JSON.stringify(data.data.Page.media),
                expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
            }
        }).catch((error) => {
            console.log("error", error);
        });

        return data.data.Page.media;
    } catch (error) {
        console.error("error", error);
        return [];
    }
}


export default aniListFunctions;
