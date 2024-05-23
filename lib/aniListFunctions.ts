import prismadb from "@/lib/prismadb";

const aniListFunctions = {
    getFavorites,
    getPopular,
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

async function getPopular(): Promise<any> {
    console.log('getPopular');
    return [];
}

export default aniListFunctions;
