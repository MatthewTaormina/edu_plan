import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Testing

**Domain:** DevOps ┬╖ **Time Estimate:** 2 weeks

> **Tool:** pytest ┬╖ **Introduced:** 2004 ┬╖ **Latest:** 8.x (2024) ┬╖ **Deprecated:** N/A ┬╖ **Status:** ≡ƒƒó Modern ΓÇö the dominant Python test framework  
> **Tool:** Vitest ┬╖ **Introduced:** 2021 ┬╖ **Latest:** 1.x (2024) ┬╖ **Deprecated:** N/A ┬╖ **Status:** ≡ƒƒó Modern ΓÇö fast, Vite-native test runner for TypeScript/JavaScript  
> **Tool:** Jest ┬╖ **Introduced:** 2014 ┬╖ **Latest:** 29.x (2024) ┬╖ **Deprecated:** N/A ┬╖ **Status:** ≡ƒƒí Legacy for new Vite/TS projects ΓÇö still dominant in React; superseded by Vitest in Vite projects  
> **Tool:** k6 ┬╖ **Introduced:** 2017 ┬╖ **Latest:** 0.51 (2024) ┬╖ **Deprecated:** N/A ┬╖ **Status:** ≡ƒƒó Modern ΓÇö load and performance testing  
> **Tool:** Playwright ┬╖ **Introduced:** 2020 ┬╖ **Latest:** 1.43 (2024) ┬╖ **Deprecated:** N/A ┬╖ **Status:** ≡ƒƒó Modern ΓÇö end-to-end browser testing (cross-platform: Windows + Linux + macOS)

:::warning ≡ƒƒí Legacy ΓÇö acknowledged
**Selenium** ┬╖ Introduced 2004 ┬╖ Still maintained ┬╖ Status: ≡ƒƒí Legacy ΓÇö superseded by Playwright and Cypress for new projects; still common in enterprise. **Cypress** ┬╖ Introduced 2015 ┬╖ Still maintained ┬╖ Status: ≡ƒƒí ΓÇö strong community but Playwright's cross-browser support is more complete.
:::


> **Prerequisites:** [Git Workflow](git_workflow.md), [CI/CD](ci_cd.md) (testing feeds directly into pipelines)  
> **Who needs this:** Every developer and every DevOps engineer. Untested code is a ticking clock. Tests are how you change code with confidence.

---

## ≡ƒÄ» Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain the difference between unit, integration, and end-to-end tests
- [ ] Write unit tests with pytest (Python) and Vitest (TypeScript)
- [ ] Apply the AAA pattern ΓÇö Arrange, Act, Assert
- [ ] Use mocking to isolate units under test
- [ ] Measure and interpret test coverage
- [ ] Write a contract test to protect service boundaries
- [ ] Run load tests with k6
- [ ] Integrate a test suite into a CI/CD pipeline

---

## ≡ƒôû Concepts

### 1. The Testing Pyramid

```
                    Γû▓
                   /E2E\          Small number ΓÇö slow, brittle, high value
                  /ΓöÇΓöÇΓöÇΓöÇΓöÇ\         Tests real browser / full system
                 /       \
                /Integration\     Medium number ΓÇö test components together
               /ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\    Database, API calls, filesystem
              /               \
             /   Unit Tests    \  Most tests ΓÇö fast, isolated, cheap
            /ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\  Test one function/class in isolation
           ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

Cost: ΓùäΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      Expensive              Cheap
Speed:ΓùäΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      Slow                   Fast
```

**Rules of thumb:**
- Most of your tests should be **unit tests** ΓÇö they're fast and cheap to run and fix
- A smaller number of **integration tests** verify components work together
- A handful of **E2E tests** verify critical user journeys (login, checkout, deployment)

---

### 2. Unit Tests

A **unit test** tests one function or class in complete isolation. Dependencies are replaced with **mocks** or **fakes**.

**The AAA Pattern ΓÇö every unit test follows this:**

```
Arrange   Set up the inputs, create mock objects, prepare the environment
Act       Call the function under test with those inputs
Assert    Verify the output is what you expected
```

<Tabs>
<TabItem value="python-pytest" label="Python (pytest)">

```python
# pip install pytest pytest-cov
# pytest: Introduced 2004, Latest 8.x (2024) ΓÇö ≡ƒƒó Modern

# src/calculator.py
def add(a: float, b: float) -> float:
    return a + b

def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# tests/test_calculator.py
import pytest
from src.calculator import add, divide

# ΓöÇΓöÇ Basic assertions ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
def test_add_two_positive_numbers():
    # Arrange
    a, b = 3, 4

    # Act
    result = add(a, b)

    # Assert
    assert result == 7

def test_add_negative_and_positive():
    assert add(-1, 1) == 0

def test_add_floats():
    assert add(0.1, 0.2) == pytest.approx(0.3)   # Never use == with floats

# ΓöÇΓöÇ Testing exceptions ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
def test_divide_by_zero_raises():
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)

def test_divide_normal():
    assert divide(10, 2) == 5.0

# ΓöÇΓöÇ Parametrize ΓÇö run the same test with multiple inputs ΓöÇΓöÇ
@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (-1, -1, -2),
    (0, 0, 0),
    (100, -50, 50),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected
```

```bash
# Run tests
pytest                          # All tests
pytest tests/test_calculator.py # Specific file
pytest -v                       # Verbose output (test names shown)
pytest -k "divide"              # Tests matching name pattern
pytest --cov=src --cov-report=term-missing  # With coverage
```


</TabItem>
<TabItem value="typescript-vitest" label="TypeScript (Vitest)">

```typescript
// npm install -D vitest
// vitest: Introduced 2021, Latest 1.x (2024) ΓÇö ≡ƒƒó Modern

// src/calculator.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}

// tests/calculator.test.ts
import { describe, it, expect } from 'vitest';
import { add, divide } from '../src/calculator';

describe('add', () => {
  it('adds two positive numbers', () => {
    // Arrange
    const a = 3, b = 4;
    // Act
    const result = add(a, b);
    // Assert
    expect(result).toBe(7);
  });

  it('handles negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });

  it('handles floating point', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});

describe('divide', () => {
  it('throws on division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('divides correctly', () => {
    expect(divide(10, 2)).toBe(5);
  });
});
```

```bash
# package.json: "scripts": { "test": "vitest" }
npx vitest              # Watch mode
npx vitest run          # Single run (CI)
npx vitest run --coverage  # With coverage
```


</TabItem>
</Tabs>

---

### 3. Mocking ΓÇö Isolating Dependencies

Mocks replace real dependencies (databases, APIs, email services) so tests run fast and don't need external services.

<Tabs>
<TabItem value="python-pytest-unittest-mock" label="Python (pytest + unittest.mock)">

```python
# src/user_service.py
import requests

def get_user_name(user_id: int) -> str:
    response = requests.get(f"https://api.example.com/users/{user_id}")
    response.raise_for_status()
    return response.json()["name"]

# tests/test_user_service.py
from unittest.mock import patch, MagicMock
from src.user_service import get_user_name

def test_get_user_name_returns_name():
    # Mock the HTTP call ΓÇö no network needed
    mock_response = MagicMock()
    mock_response.json.return_value = {"id": 1, "name": "Alice"}
    mock_response.raise_for_status.return_value = None

    with patch("src.user_service.requests.get", return_value=mock_response):
        result = get_user_name(1)

    assert result == "Alice"

def test_get_user_name_propagates_http_error():
    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = requests.HTTPError("404")

    with patch("src.user_service.requests.get", return_value=mock_response):
        with pytest.raises(requests.HTTPError):
            get_user_name(999)
```


</TabItem>
<TabItem value="typescript-vitest-vi-mock" label="TypeScript (Vitest vi.mock)">

```typescript
// src/userService.ts
import axios from 'axios';

export async function getUserName(userId: number): Promise<string> {
  const response = await axios.get(`https://api.example.com/users/${userId}`);
  return response.data.name;
}

// tests/userService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getUserName } from '../src/userService';

vi.mock('axios');

describe('getUserName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user name', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { name: 'Alice' } });

    const name = await getUserName(1);

    expect(name).toBe('Alice');
    expect(axios.get).toHaveBeenCalledWith('https://api.example.com/users/1');
  });

  it('propagates errors', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

    await expect(getUserName(999)).rejects.toThrow('Network error');
  });
});
```


</TabItem>
</Tabs>

---

### 4. Integration Tests

Integration tests verify that multiple components work together ΓÇö real database queries, real HTTP calls between services, real filesystem operations.

```python
# Integration test: real database call
# tests/integration/test_user_repo.py
import pytest
from src.database import create_db_connection
from src.user_repo import UserRepository

@pytest.fixture(scope="module")
def db():
    """Real test database ΓÇö destroyed after tests."""
    conn = create_db_connection("postgresql://localhost/test_db")
    yield conn
    conn.execute("DROP TABLE IF EXISTS users")
    conn.close()

@pytest.fixture
def user_repo(db):
    db.execute("DELETE FROM users")   # Clean slate each test
    return UserRepository(db)

def test_create_and_find_user(user_repo):
    # Arrange
    user_repo.create(name="Alice", email="alice@example.com")

    # Act
    user = user_repo.find_by_email("alice@example.com")

    # Assert
    assert user is not None
    assert user.name == "Alice"

def test_find_nonexistent_user_returns_none(user_repo):
    assert user_repo.find_by_email("nobody@example.com") is None
```

**Integration tests need a real environment.** In CI, use Docker to spin up the dependencies:

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest tests/integration/ -v
        env:
          DATABASE_URL: postgresql://postgres:test@localhost/test_db
```

---

### 5. End-to-End Tests with Playwright

> **Tool:** Playwright ┬╖ **Introduced:** 2020 (Microsoft) ┬╖ **Latest:** 1.43 (2024) ┬╖ **Status:** ≡ƒƒó Modern  
> **Runs on:** Windows Γ£à Linux Γ£à macOS Γ£à ΓÇö native support for all three

```bash
# Setup ΓÇö cross-platform
npm init playwright@latest
npx playwright install   # Downloads Chromium, Firefox, WebKit
```

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('wrong password shows error', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="submit"]');

    await expect(page.locator('[data-testid="error"]')).toBeVisible();
    await expect(page.locator('[data-testid="error"]')).toContainText('Invalid credentials');
  });
});
```

```bash
# Run E2E tests
npx playwright test                      # All browsers (headless)
npx playwright test --headed             # Show browser window
npx playwright test --browser=chromium  # Specific browser
npx playwright test --debug             # Debug mode with inspector
npx playwright show-report              # View HTML test report
```

---

### 6. Load Testing with k6

> **Tool:** k6 ┬╖ **Introduced:** 2017 ┬╖ **Latest:** 0.51 (2024) ┬╖ **Status:** ≡ƒƒó Modern  
> **Runs on:** Windows Γ£à Linux Γ£à (native binaries for both)

k6 scripts are written in JavaScript (TypeScript supported) and run from the CLI.

```javascript
// load_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Custom metrics
const responseTime = new Trend('response_time');
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '1m', target: 10 },    // Ramp up to 10 virtual users over 1 minute
    { duration: '3m', target: 50 },    // Ramp up to 50 users over 3 minutes
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    error_rate: ['rate<0.01'],          // Error rate under 1%
  },
};

export default function () {
  const response = http.get('https://api.example.com/users/1');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  responseTime.add(response.timings.duration);
  errorRate.add(response.status !== 200);

  sleep(1);   // 1 second think time between requests
}
```

```bash
# Install k6
# Windows: winget install k6
# Linux:   sudo gpg --no-default-keyring ... (see https://k6.io/docs/get-started/installation/)

k6 run load_test.js
k6 run --vus 10 --duration 30s load_test.js   # Quick run: 10 users, 30 seconds
```

---

### 7. Test Coverage

Coverage tells you which lines of code were executed during tests. It's a useful **guard** (not a goal ΓÇö 100% coverage with poor tests is worthless).

```bash
# Python ΓÇö pytest-cov
pytest --cov=src --cov-report=term-missing --cov-report=html

# Output:
# Name                   Stmts   Miss  Cover   Missing
# src/calculator.py         12      2    83%   34-35
# src/user_service.py       18      0   100%

# TypeScript ΓÇö Vitest built-in
npx vitest run --coverage
# Produces: coverage/index.html ΓÇö open in browser
```

**Useful thresholds (enforce in CI):**

```python
# pytest.ini or pyproject.toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-fail-under=80"  # Fail CI if coverage drops below 80%
```

```typescript
// vitest.config.ts
export default {
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
      },
    },
  },
};
```

---

### 8. Testing in CI

Tests should run automatically on every push and pull request. Failing tests block the merge.

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -e ".[dev]"
      - run: pytest tests/unit/ --cov=src --cov-fail-under=80 -v

  e2e-tests:
    runs-on: ubuntu-latest
    needs: unit-tests          # Only run E2E if unit tests pass
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## ≡ƒôÜ Resources

<Tabs>
<TabItem value="primary" label="Primary">

- ≡ƒôû **[pytest Docs (FREE)](https://docs.pytest.org/)** ΓÇö Comprehensive and well-structured
- ≡ƒôû **[Vitest Docs (FREE)](https://vitest.dev/guide/)** ΓÇö Concise and excellent; covers all modern patterns
- ≡ƒôû **[Playwright Docs (FREE)](https://playwright.dev/docs/intro)** ΓÇö Best E2E testing docs available


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- ≡ƒô║ **[ArjanCodes ΓÇö pytest Tutorial (YouTube, FREE)](https://www.youtube.com/watch?v=cHYq1MRoyI0)** ΓÇö Thorough pytest walkthrough with fixtures and parametrize
- ≡ƒôû **[k6 Docs (FREE)](https://k6.io/docs/)** ΓÇö Load testing reference and examples
- ≡ƒôû **[Google SRE Book ΓÇö Testing Chapter (FREE)](https://sre.google/sre-book/testing-reliability/)** ΓÇö Testing from a reliability engineering perspective


</TabItem>
<TabItem value="external" label="External Courses">

- ≡ƒÄô **[Test-Driven Development with Python ΓÇö Harry Percival (PAID book, free online)](https://www.obeythetestinggoat.com/)** ΓÇö Full TDD course with Django, worth the read


</TabItem>
</Tabs>

---

## ≡ƒÅù∩╕Å Assignments

### Assignment 1 ΓÇö Unit Test a Real Module
Choose a module from a previous project (calculator, API routes, data transformer):

- [ ] Write at least 10 unit tests covering happy paths and error cases
- [ ] Use `@pytest.mark.parametrize` or `it.each` to test multiple inputs in one test
- [ ] Mock at least one external dependency (HTTP call, database, file system)
- [ ] Achieve 80%+ coverage ΓÇö check with `--cov` or `--coverage`
- [ ] All tests pass in CI (GitHub Actions workflow)

### Assignment 2 ΓÇö Integration Tests with Docker
Set up a real integration test suite:

- [ ] Run a real database (PostgreSQL) in Docker as a service in GitHub Actions
- [ ] Test at least 3 CRUD operations against the real database
- [ ] Use fixtures to set up and tear down data between tests
- [ ] Verify tests pass in the CI pipeline

### Assignment 3 ΓÇö E2E + Load Test
Test a web application end-to-end:

- [ ] Write 3 Playwright tests covering the most critical user flows
- [ ] All tests run headless and pass on both Windows and Linux
- [ ] Write a k6 load test that ramps to 50 concurrent users
- [ ] Set a performance threshold: p95 response time < 500ms
- [ ] Run the full test suite: unit ΓåÆ integration ΓåÆ E2E ΓåÆ load in sequence in CI

---

## Γ£à Milestone Checklist

- [ ] Can explain unit, integration, and E2E tests and when to use each
- [ ] Can write unit tests with pytest and Vitest using the AAA pattern
- [ ] Can mock external dependencies without hitting real services
- [ ] Can measure coverage and enforce a threshold in CI
- [ ] Have written at least one Playwright E2E test that runs cross-platform
- [ ] Have run a k6 load test and interpreted the results
- [ ] All 3 assignments committed to GitHub as passing CI runs

---

## ≡ƒÅå Milestone Complete!

> **The DevOps domain is complete.**
>
> You can now build, containerise, orchestrate, provision, monitor, and test production software.
> That's the full lifecycle of modern cloud-native engineering.

**Log this in your kanban:** Move `devops/testing` to Γ£à Done. Move the entire DevOps domain to Γ£à Complete.
