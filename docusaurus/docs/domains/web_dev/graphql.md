import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# GraphQL

> **Tool:** GraphQL · **Introduced:** 2015 (Facebook open-sourced) · **Latest:** 2021 spec · **Status:** 🟢 Modern (strong adoption in product teams)

GraphQL is a **query language for APIs** and a runtime for executing those queries. Unlike REST (which exposes multiple endpoints), GraphQL exposes **one endpoint** and lets the client specify exactly what data it needs.

> **Prerequisite:** [REST APIs](./rest_api.md) · [JavaScript Core — fetch](./javascript_core.md)
> **See also:** [Frontend Frameworks](./frontend_frameworks.md) (TanStack Query integrates with GraphQL)

---

## REST vs GraphQL

| | REST | GraphQL |
|-|------|---------|
| **Endpoints** | Many (`/posts`, `/users`, `/comments`) | One (`/graphql`) |
| **Data shape** | Fixed by server | Specified by client |
| **Over-fetching** | Common (server sends all fields) | None (client asks for exactly what it needs) |
| **Under-fetching** | Common (need multiple requests) | None (fetch nested data in one query) |
| **Type system** | Optional (OpenAPI) | Built-in Schema Definition Language |
| **Caching** | HTTP caching works out of the box | Requires client-side normalised cache (Apollo, urql) |
| **Tooling** | Widespread | Strong but specialised |
| **Learning curve** | Low | Medium |

---

## Core Concepts

### Schema Definition Language (SDL)

The schema is the contract between client and server. It defines all types and operations.

```graphql
# Types define the shape of data
type User {
    id: ID!            # ! means non-nullable (always present)
    name: String!
    email: String!
    posts: [Post!]!     # Array of Post objects
}

type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    createdAt: String!
}

# Query type — read operations
type Query {
    user(id: ID!): User        # Returns a single User (or null)
    users: [User!]!            # Always returns an array
    post(id: ID!): Post
    posts(published: Boolean): [Post!]!
}

# Mutation type — write operations
type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
}

# Subscription type — real-time updates via WebSocket
type Subscription {
    postPublished: Post!
}

# Input types for mutations
input CreatePostInput {
    title: String!
    body: String!
    authorId: ID!
}
```

### Queries — Reading Data

```graphql
# Ask for exactly what you need (no over-fetching)
query GetUser {
    user(id: "1") {
        name
        email
        # Nested — fetch related posts in the same request
        posts {
            title
            published
        }
    }
}

# Variables make queries reusable
query GetPost($id: ID!) {
    post(id: $id) {
        title
        body
        author {
            name
        }
    }
}
```

### Mutations — Writing Data

```graphql
mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
        id
        title
        createdAt
    }
}
```

---

## Consuming GraphQL from JavaScript

Without a GraphQL client library, you call the `/graphql` endpoint with a POST:

```javascript
async function graphqlRequest(query, variables = {}) {
    const response = await fetch('https://api.example.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ query, variables })
    });

    const { data, errors } = await response.json();

    // GraphQL always returns 200 — errors are in the body
    if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
    }

    return data;
}

// Usage
const GET_USER = `
    query GetUser($id: ID!) {
        user(id: $id) {
            name
            email
        }
    }
`;

const { user } = await graphqlRequest(GET_USER, { id: "1" });
console.log(user.name);
```

### With Apollo Client (React)

Apollo Client is the most popular GraphQL client for React applications. It provides caching, loading/error states, and React hooks.

```jsx
// Setup: wrap your app with ApolloProvider
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://api.example.com/graphql',
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <MyApp />
        </ApolloProvider>
    );
}

// In a component — useQuery hook
import { useQuery, gql } from '@apollo/client';

const GET_POSTS = gql`
    query GetPosts {
        posts(published: true) {
            id
            title
            author { name }
        }
    }
`;

function PostList() {
    const { loading, error, data } = useQuery(GET_POSTS);

    if (loading) return <p>Loading...</p>;
    if (error)   return <p>Error: {error.message}</p>;

    return (
        <ul>
            {data.posts.map(post => (
                <li key={post.id}>{post.title} by {post.author.name}</li>
            ))}
        </ul>
    );
}

// useMutation hook
import { useMutation, gql } from '@apollo/client';

const CREATE_POST = gql`
    mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
            id title createdAt
        }
    }
`;

function NewPostForm() {
    const [createPost, { loading }] = useMutation(CREATE_POST);

    async function handleSubmit(e) {
        e.preventDefault();
        await createPost({ variables: { input: { title: "Hello", body: "World", authorId: "1" } } });
    }

    return <button onClick={handleSubmit} disabled={loading}>Create Post</button>;
}
```

---

## When to Use GraphQL vs REST

**Choose GraphQL when:**
- Your frontend needs different shapes of data on different pages
- You have multiple client types (web, mobile, third-party) with different data needs
- You want a strong, self-documenting type contract between teams
- You're building an API gateway over multiple microservices

**Choose REST when:**
- Your API is simple and CRUD-based
- You have strong HTTP caching requirements
- Your team is smaller or less familiar with GraphQL
- You need to integrate with third-party systems that expect REST

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- [GraphQL.org — Learn](https://graphql.org/learn/) — the official specification explained
- [Apollo Docs](https://www.apollographql.com/docs/react/) — Apollo Client for React


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- [How to GraphQL](https://www.howtographql.com/) — free full-stack tutorial
- [GraphQL vs REST (Apollo Blog)](https://www.apollographql.com/blog/graphql-vs-rest) — when to use each


</TabItem>
</Tabs>