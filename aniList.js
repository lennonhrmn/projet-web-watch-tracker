// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
var query = `
query { 
  Page(page: 1, perPage: 10)    
  {
    media(type:ANIME, format:TV, sort:POPULARITY_DESC, isAdult:false) {
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

// Define the config we'll need for our Api request
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

// Make the HTTP Api request
fetch(url, options).then(handleResponse)
    .then(handleData)
    .catch(handleError);

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log("Response Data:", data.data.Page.media);
}




function handleError(error) {
    console.error('Error:', error);
}
