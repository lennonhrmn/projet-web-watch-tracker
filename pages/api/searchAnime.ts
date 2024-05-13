const searchAnime = async (query: string) => {
  const url = 'https://graphql.anilist.co';
  const searchQuery = `
      query ($search: String) {
        Page(perPage: 10) {
          media(search: $search, type: ANIME) {
            id
            title {
              english
              native
              romaji
            }
          }
        }
      }
    `;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      variables: { search: query },
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error("error", error);
    return [];
  }
};
