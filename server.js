import { ApolloServer, gql } from 'apollo-server';

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