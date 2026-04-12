# Lesson 04 — Server State with TanStack Query

> **Course:** React Advanced · **Time:** 60 minutes
> **🔗 Official Docs:** [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)

---

## 🎯 Learning Objectives

- [ ] Explain the difference between client state and server state
- [ ] Fetch data with `useQuery` and display loading/error/success states
- [ ] Mutate server data with `useMutation` and invalidate stale cache
- [ ] Configure caching, retry, and refetch strategies

---

## 📖 Concepts

### Client State vs Server State

| Client State | Server State |
|-------------|-------------|
| `useState`, `useReducer`, Context | TanStack Query, SWR |
| UI state: open/closed, selected tab | Remote data: users, posts |
| You own it | Server owns it (can change anytime) |
| Synchronous | Asynchronous, can be stale |

### Setup

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime:  1000 * 60 * 5,   // Data is fresh for 5 minutes
            retry:       2,               // Retry failed requests twice
            refetchOnWindowFocus: true,   // Refetch when tab regains focus
        }
    }
});

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
```

### `useQuery` — Reading Data

```tsx
import { useQuery } from '@tanstack/react-query';

interface Post {
    id:      number;
    title:   string;
    body:    string;
    userId:  number;
}

// Define API functions separately — keeps components clean
const api = {
    getPosts: async (): Promise<Post[]> => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    },
    getPost: async (id: number): Promise<Post> => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }
};

function PostList() {
    const { data: posts, isLoading, isError, error } = useQuery({
        queryKey: ['posts'],      // Cache key — must be unique per query
        queryFn:  api.getPosts,   // The fetching function
    });

    if (isLoading) return <div className="animate-pulse space-y-4">{Array.from({length:5}).map((_,i) => <div key={i} className="h-16 bg-gray-200 rounded-xl"/>)}</div>;
    if (isError)   return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <ul className="space-y-4">
            {posts?.map(post => (
                <li key={post.id} className="p-4 bg-white rounded-xl border">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{post.body.substring(0, 100)}…</p>
                </li>
            ))}
        </ul>
    );
}
```

### Dynamic Query Keys

```tsx
function PostDetail({ postId }: { postId: number }) {
    const { data: post, isLoading } = useQuery({
        queryKey: ['post', postId],   // Re-fetches when postId changes
        queryFn:  () => api.getPost(postId),
        enabled:  postId > 0,         // Only fetch if postId is valid
    });

    if (isLoading) return <Spinner />;
    if (!post)     return null;
    return <h1>{post.title}</h1>;
}
```

### `useMutation` — Writing Data

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreatePost() {
    const queryClient = useQueryClient();

    const createPost = useMutation({
        mutationFn: async (data: { title: string; body: string; userId: number }) => {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json() as Promise<Post>;
        },
        onSuccess: (newPost) => {
            // Invalidate the posts list — triggers a refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            // OR: Optimistically update the cache without a refetch
            queryClient.setQueryData<Post[]>(['posts'], old =>
                old ? [newPost, ...old] : [newPost]
            );
        },
        onError: (error) => {
            console.error('Failed to create post:', error);
        }
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        createPost.mutate({
            title:  (form.elements.namedItem('title') as HTMLInputElement).value,
            body:   (form.elements.namedItem('body') as HTMLTextAreaElement).value,
            userId: 1
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <input name="title" className="input w-full" placeholder="Title" required />
            <textarea name="body" className="input w-full h-32 resize-none" placeholder="Body" required />
            <button
                type="submit"
                disabled={createPost.isPending}
                className="btn btn-primary disabled:opacity-50"
            >
                {createPost.isPending ? 'Creating…' : 'Create post'}
            </button>
            {createPost.isError && <p className="text-red-500">{createPost.error.message}</p>}
        </form>
    );
}
```

---

## ✅ Milestone Checklist

- [ ] I understand the difference between client state and server state
- [ ] I use `useQuery` with a typed query key and API function
- [ ] I invalidate the cache after mutations so the list refetches
- [ ] I set `staleTime` to avoid hammering the API on every tab focus

## ➡️ Next Unit

[Lesson 05 — Error Boundaries & Suspense](./lesson_05.md)
