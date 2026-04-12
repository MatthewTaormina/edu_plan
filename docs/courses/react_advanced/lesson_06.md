# Lesson 06 — Testing React with Vitest + Testing Library

> **Course:** React Advanced · **Time:** 60 minutes
> **🔗 Official Docs:** [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) · [Vitest](https://vitest.dev/)

---

## 🎯 Learning Objectives

- [ ] Configure Vitest with jsdom for browser-like tests
- [ ] Render components with `render()` and query them by role/label/text
- [ ] Fire events and assert on DOM changes
- [ ] Mock `fetch` for API-dependent components
- [ ] Test custom hooks with `renderHook`

---

## 📖 Concepts

### Setup

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',                // Browser-like environment
        globals:     true,                   // No need to import describe/it/expect
        setupFiles:  './src/test/setup.ts',  // Global test setup
    }
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';  // Adds .toBeInTheDocument(), .toHaveValue(), etc.
```

### Querying the DOM — Priority Order

Testing Library provides multiple query types. Use them in this priority order:
1. `getByRole` — most accessible and resilient (e.g. `getByRole('button', { name: /save/i })`)
2. `getByLabelText` — for form inputs
3. `getByPlaceholderText` — fallback for inputs
4. `getByText` — for visible text
5. `getByTestId` — last resort only

```tsx
// src/components/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
    it('starts at zero', () => {
        render(<Counter />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('increments when + is clicked', async () => {
        const user = userEvent.setup();
        render(<Counter />);

        await user.click(screen.getByRole('button', { name: '+' }));
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('decrements when - is clicked', async () => {
        const user = userEvent.setup();
        render(<Counter />);

        await user.click(screen.getByRole('button', { name: '-' }));
        expect(screen.getByText('-1')).toBeInTheDocument();
    });
});
```

### Testing Forms

```tsx
// src/components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
    it('shows validation errors when submitted empty', async () => {
        const user = userEvent.setup();
        const mockSubmit = vi.fn();
        render(<LoginForm onSubmit={mockSubmit} />);

        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with form values', async () => {
        const user = userEvent.setup();
        const mockSubmit = vi.fn();
        render(<LoginForm onSubmit={mockSubmit} />);

        await user.type(screen.getByLabelText(/email/i), 'alex@example.com');
        await user.type(screen.getByLabelText(/password/i), 'secret123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(mockSubmit).toHaveBeenCalledWith({
            email:    'alex@example.com',
            password: 'secret123'
        });
    });
});
```

### Mocking `fetch`

```tsx
// src/components/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

const mockUser = { id: 1, name: "Alex Kim", email: "alex@example.com" };

describe('UserProfile', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('displays user data after loading', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok:   true,
            json: async () => mockUser
        });

        render(<UserProfile userId={1} />);

        // Should show loading initially
        expect(screen.getByRole('status')).toBeInTheDocument();  // aria-live loading region

        // Wait for the async render
        await waitFor(() => {
            expect(screen.getByText('Alex Kim')).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledWith('/api/users/1', expect.any(Object));
    });

    it('shows error message when fetch fails', async () => {
        (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok:     false,
            status: 404,
            statusText: 'Not Found'
        });

        render(<UserProfile userId={1} />);

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });
});
```

### Testing Custom Hooks

```tsx
// src/hooks/useCounter.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
    it('initialises with default value', () => {
        const { result } = renderHook(() => useCounter());
        expect(result.current.count).toBe(0);
    });

    it('increments count', () => {
        const { result } = renderHook(() => useCounter(5));

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(6);
    });

    it('respects max constraint', () => {
        const { result } = renderHook(() => useCounter(10, { max: 10 }));

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(10);  // Did not exceed max
    });
});
```

### Running Tests

```bash
# Run all tests
npx vitest

# Watch mode
npx vitest --watch

# Coverage report
npx vitest --coverage
```

---

## ✅ Milestone Checklist

- [ ] I query elements by role/label — not by `data-testid` unless I have to
- [ ] I use `userEvent` instead of `fireEvent` for realistic user interaction
- [ ] I mock `fetch` using `vi.fn()` rather than making real network calls
- [ ] I test custom hooks with `renderHook`

## ➡️ Next Unit

[Lesson 07 — Capstone: Multi-Page Dashboard](./lesson_07.md)
