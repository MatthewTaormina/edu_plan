# Lesson 09 — Capstone: Reading List Tracker

> **Course:** React Fundamentals · **Time:** 2–3 hours
> **📖 Wiki:** [Frontend Frameworks](../../domains/web_dev/frontend_frameworks.md) · [REST APIs](../../domains/web_dev/rest_api.md)
> **🔗 Official Docs:** [React Docs](https://react.dev/learn) · [Open Library API](https://openlibrary.org/developers/api)

---

## 🎯 Project Overview

Build a **Reading List Tracker** that:
- Searches books via the [Open Library Search API](https://openlibrary.org/search.json?q=...) (free, no auth)
- Allows adding/removing books from "Want to Read", "Reading", and "Finished" lists
- Persists the reading list to `localStorage`
- Filters and sorts the reading list
- Renders completly in TypeScript using the hooks and patterns from this course

---

## Architecture

```
App
├── ThemeProvider (Context)
├── ReadingListProvider (Context)  ← Persisted to localStorage
├── SearchSection
│   ├── SearchBar          ← useDebounce
│   ├── SearchResults
│   │   └── BookCard       ← Presentational
│   └── useFetch(url)      ← Custom hook
└── ReadingListSection
    ├── ShelfTabs          ← Filter by status
    ├── BookList
    │   └── ReadingListItem ← with status change + remove
    └── EmptyState
```

---

## Types

```tsx
// src/types.ts
export type ReadingStatus = "want" | "reading" | "finished";

export interface Book {
    key:        string;       // Open Library ID e.g. "/works/OL45804W"
    title:      string;
    author_name?: string[];
    cover_i?:   number;       // Cover image ID
    first_publish_year?: number;
}

export interface ReadingListBook extends Book {
    status:    ReadingStatus;
    addedAt:   string;  // ISO date string (stored as string in JSON)
}
```

## Context

```tsx
// src/contexts/ReadingListContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Book, ReadingListBook, ReadingStatus } from '../types';

interface ReadingListContextValue {
    books:      ReadingListBook[];
    addBook:    (book: Book, status: ReadingStatus) => void;
    removeBook: (key: string) => void;
    updateStatus: (key: string, status: ReadingStatus) => void;
    isInList:   (key: string) => boolean;
    getStatus:  (key: string) => ReadingStatus | null;
}

const ReadingListContext = createContext<ReadingListContextValue | null>(null);

export function ReadingListProvider({ children }: { children: ReactNode }) {
    const [books, setBooks] = useState<ReadingListBook[]>(() => {
        try {
            const saved = localStorage.getItem('reading-list');
            return saved ? JSON.parse(saved) as ReadingListBook[] : [];
        } catch { return []; }
    });

    function persist(updated: ReadingListBook[]) {
        setBooks(updated);
        localStorage.setItem('reading-list', JSON.stringify(updated));
    }

    function addBook(book: Book, status: ReadingStatus) {
        if (books.some(b => b.key === book.key)) return;
        persist([...books, { ...book, status, addedAt: new Date().toISOString() }]);
    }

    function removeBook(key: string) {
        persist(books.filter(b => b.key !== key));
    }

    function updateStatus(key: string, status: ReadingStatus) {
        persist(books.map(b => b.key === key ? { ...b, status } : b));
    }

    return (
        <ReadingListContext.Provider value={{
            books,
            addBook,
            removeBook,
            updateStatus,
            isInList: key => books.some(b => b.key === key),
            getStatus: key => books.find(b => b.key === key)?.status ?? null
        }}>
            {children}
        </ReadingListContext.Provider>
    );
}

export function useReadingList(): ReadingListContextValue {
    const ctx = useContext(ReadingListContext);
    if (!ctx) throw new Error('useReadingList must be inside ReadingListProvider');
    return ctx;
}
```

## Search with Debounce

```tsx
// src/components/SearchSection.tsx
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import type { Book } from '../types';
import { BookCard } from './BookCard';

interface SearchResponse { docs: Book[]; numFound: number; }

export function SearchSection() {
    const [query, setQuery] = useState('');
    const debouncedQuery    = useDebounce(query, 500);

    const searchUrl = debouncedQuery.length > 2
        ? `https://openlibrary.org/search.json?q=${encodeURIComponent(debouncedQuery)}&limit=10&fields=key,title,author_name,cover_i,first_publish_year`
        : null;

    const { data, loading, error } = useFetch<SearchResponse>(searchUrl);

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4">Search Books</h2>
            <input
                type="search"
                placeholder="Search by title, author, ISBN..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="input w-full max-w-xl mb-6"
            />

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-40 rounded-xl bg-gray-200 animate-pulse" />
                    ))}
                </div>
            )}

            {error && <p className="text-red-500">Search failed: {error}</p>}

            {data && data.docs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.docs.map(book => (
                        <BookCard key={book.key} book={book} />
                    ))}
                </div>
            )}

            {data && data.docs.length === 0 && (
                <p className="text-gray-500">No results for "{debouncedQuery}"</p>
            )}
        </section>
    );
}
```

## Book Card Component

```tsx
// src/components/BookCard.tsx
import type { Book, ReadingStatus } from '../types';
import { useReadingList } from '../contexts/ReadingListContext';

const COVER_URL = (id: number) => `https://covers.openlibrary.org/b/id/${id}-M.jpg`;

export function BookCard({ book }: { book: Book }) {
    const { addBook, removeBook, isInList, getStatus } = useReadingList();
    const inList = isInList(book.key);
    const status = getStatus(book.key);

    return (
        <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
            {book.cover_i ? (
                <img
                    src={COVER_URL(book.cover_i)}
                    alt={`Cover of ${book.title}`}
                    className="w-16 h-24 object-cover rounded-lg shrink-0"
                    loading="lazy"
                />
            ) : (
                <div className="w-16 h-24 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center text-2xl">📖</div>
            )}

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">{book.title}</h3>
                {book.author_name && (
                    <p className="text-xs text-gray-500 mt-1">{book.author_name[0]}</p>
                )}
                {book.first_publish_year && (
                    <p className="text-xs text-gray-400">{book.first_publish_year}</p>
                )}

                <div className="mt-3">
                    {inList ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full capitalize">
                                {status === 'want' ? 'Want to read' : status === 'reading' ? 'Reading' : 'Finished'}
                            </span>
                            <button
                                onClick={() => removeBook(book.key)}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {(['want', 'reading', 'finished'] as ReadingStatus[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => addBook(book, s)}
                                    className="text-xs px-2 py-1 rounded-full border border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {s === 'want' ? '+ Want' : s === 'reading' ? '+ Reading' : '+ Finished'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
```

---

## 🏗️ Extension Assignments

1. Add **sort controls** to the reading list: by title, by date added, by author
2. Add a **progress counter** per shelf (e.g. "3 reading, 12 finished")
3. Add **notes** to each book — a small text area that saves with the book data
4. Add **export to CSV** functionality

---

## ✅ Milestone Checklist

- [ ] Search uses `useDebounce` and `useFetch` custom hooks
- [ ] Reading list state uses Context and persists to localStorage
- [ ] All TypeScript is strict — zero `any`
- [ ] Book cards show loading skeletons via `animate-pulse`
- [ ] Removing and status-changing work correctly

## 🏆 React Fundamentals Complete!

You've built a production-quality, API-driven React app in TypeScript.

## ➡️ Next Course

- [React Advanced](../react_advanced/index.md) — performance, routing, data fetching, testing
- [Next.js](../nextjs/index.md) — add SSR and SSG to your React knowledge
