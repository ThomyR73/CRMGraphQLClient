import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'
const httpLink = createHttpLink({
    uri: "https://limitless-temple-56534.herokuapp.com/",
    fetch
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token")
    if (token) {
        return {
            headers: {
                ...headers,
                authorization: token
            }
        }
    }
    return headers
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client