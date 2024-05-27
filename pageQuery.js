var query = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (search: $search) {
        id
        title {
          english
        }
      }
    }
  }
`;

var perPage = 3; // Set the number of items per page
var search = "Fate/Zero"; // Set the search query
var totalPages = 3; // Set the total number of pages to fetch

var url = 'https://graphql.anilist.co';
var options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
};

// Function to fetch data for a specific page
function fetchData(page) {
    var variables = {
        search: search,
        page: page,
        perPage: perPage,
    };

    options.body = JSON.stringify({
        query: query,
        variables: variables
    });

    return fetch(url, options)
        .then(handleResponse)
        .then(handleData)
        .catch(handleError);
}

// Function to handle the response
function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

// Function to handle the data
function handleData(data) {
    console.log(JSON.stringify(data, null, 2));
}

// Function to handle errors
function handleError(error) {
    console.error('Error:', error);
}

// Fetch data for the first 10 pages
for (var page = 1; page <= totalPages; page++) {
    fetchData(page);
}
