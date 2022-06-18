import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';

let tweets = [
    {
        id: "1",
        text: "hello1",
        userId: "2",
    },
    {
        id: "2",
        text: "hello2",
        userId: "1",
    },
];

let users = [
    {
        id: "1",
        firstName: "six",
        lastName: "water",
    },
    {
        id: "2",
        firstName: "seven",
        lastName: "stone",
    },
];

const typeDefs = gql`
type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
}
type Tweet {
    id: ID!
    text: String!
    author: User!
}
type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
}
type Query {
    """
    get all user list
    """
    allUsers: [User!]!
    """
    get all tweet list
    """
    allTweets: [Tweet!]!
    """
    get a single tweet
    """
    tweet(id: ID!): Tweet

    """
    get all movie list
    """
    allMovies: [Movie!]!
    """
    get a single movie
    """
    movie(id: String!): Movie
}

type Mutation {
    """
    post a single tweet and returns a newly uploaded tweet
    """
    postTweet(text: String!, userId: ID!): Tweet!
    """
    delete a single tweet and returns the result of operation
    """
    deleteTweet(id: ID!): Boolean!
}
`;

const resolvers = {
    Query: {
        allUsers() {
            return users;
        },
        allTweets() {
            return tweets;
        },
        tweet(root, {id}) {
            return tweets.find((tweet) => tweet.id === id);
        },
        allMovies() {
            const movie_url = 'https://yts.mx/api/v2/list_movies.json';
            return fetch(movie_url)
                .then(res => res.json())
                .then(json => json.data.movies);
        },
        movie(root, {id}) {
            const movie_url = `https://yts.mx/api/v2/movie_details.json?movie_id=${id}`;
            return fetch(movie_url)
                .then(res => res.json())
                .then(json => json.data.movie);
        }
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text,
                userId,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, {id}) {
            const tweet = tweets.find((t) => t.id === id);
            if(!tweet) return false;
            tweets = tweets.filter((t) => t.id !== id);
            return true;
        },
    },
    User: {
        fullName({firstName, lastName}) {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        author({userId}) {
            return users.find((user) => user.id === userId);
        }
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});