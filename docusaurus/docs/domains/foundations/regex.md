import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Regular Expressions

**Domain:** Foundations · **Time Estimate:** 1 week · **Language:** Syntax is universal; runtime is language-specific

> **Prerequisites:** [Programming Basics](programming_basics.md) — you need to know strings.
>
> **Who needs this:** Everyone. Regex appears in every language, every editor, every shell, CI pipelines, log analysis tools, and security tools. It's one skill that transfers almost perfectly across the entire industry.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Read and write basic regex patterns for common use cases
- [ ] Use character classes, quantifiers, anchors, and groups
- [ ] Apply regex in your chosen language (Python / TS / Rust)
- [ ] Write regex for: email validation, URL matching, log parsing, date extraction
- [ ] Use capture groups to extract data from strings
- [ ] Know when **not** to use regex (and what to use instead)

---

## 📖 Concepts

### 1. What Regex Is

A **regular expression** (regex) is a pattern that describes a set of strings. It lets you:

- **Test** whether a string matches a pattern (`does this look like an email?`)
- **Find** all occurrences of a pattern in text (`find all phone numbers`)
- **Extract** parts of a match (`get the domain from a URL`)
- **Replace** matched text (`redact all SSNs in a document`)

Regex is **not a programming language** — it's a mini-language for describing string patterns. The syntax is nearly identical across Python, JavaScript, Rust, Go, Java, Ruby, grep, sed, and most editors.

---

### 2. Literal Characters and Special Characters

Most characters match themselves literally:

```
Pattern: hello
Matches: "hello world" → ✅ (contains "hello")
         "Hello world" → ❌ (case-sensitive by default)
         "say hello"   → ✅
```

**Special characters (metacharacters)** have special meaning and must be escaped with `\` to match literally:

```
. * + ? ^ $ { } [ ] | ( ) \

Pattern: 3.14    ← the . matches ANY character
Matches: "3.14", "3x14", "3!14"   ← all match

Pattern: 3\.14   ← escaped dot = literal dot
Matches: "3.14" only
```

---

### 3. Character Classes `[...]`

A **character class** matches any ONE character from a set:

```
[abc]      → matches 'a', 'b', or 'c'
[a-z]      → any lowercase letter
[A-Z]      → any uppercase letter
[0-9]      → any digit
[a-zA-Z]   → any letter
[a-zA-Z0-9] → any alphanumeric
[^abc]     → any character EXCEPT a, b, or c  (^ negates inside [])
```

**Shorthand character classes:**

| Shorthand | Equivalent | Meaning |
|-----------|------------|---------|
| `\d` | `[0-9]` | Any digit |
| `\D` | `[^0-9]` | Any non-digit |
| `\w` | `[a-zA-Z0-9_]` | Any "word" character |
| `\W` | `[^\w]` | Any non-word character |
| `\s` | `[ \t\n\r\f]` | Any whitespace |
| `\S` | `[^\s]` | Any non-whitespace |
| `.` | `[^\n]` | Any character except newline |

---

### 4. Quantifiers

Quantifiers control **how many times** the preceding element repeats:

| Quantifier | Meaning | Example | Matches |
|------------|---------|---------|---------|
| `*` | 0 or more | `ab*c` | "ac", "abc", "abbbbc" |
| `+` | 1 or more | `ab+c` | "abc", "abbc" — NOT "ac" |
| `?` | 0 or 1 (optional) | `colou?r` | "color" or "colour" |
| `{n}` | Exactly n times | `\d{4}` | "2024" |
| `{n,}` | n or more times | `\d{2,}` | "12", "123", "1234"... |
| `{n,m}` | Between n and m | `\d{2,4}` | "12", "123", "1234" |

**Greedy vs. Lazy:**  
By default, quantifiers are **greedy** — they match as much as possible.  
Add `?` after a quantifier to make it **lazy** — match as little as possible.

```
Text:    "<b>bold</b> and <i>italic</i>"

Pattern: <.+>      ← greedy: matches entire "<b>bold</b> and <i>italic</i>"
Pattern: <.+?>     ← lazy: matches "<b>", then "</b>", then "<i>", then "</i>"
```

---

### 5. Anchors

Anchors match **positions**, not characters:

| Anchor | Matches |
|--------|---------|
| `^` | Start of string (or line in multiline mode) |
| `$` | End of string (or line in multiline mode) |
| `\b` | Word boundary (between `\w` and `\W`) |
| `\B` | Non-word boundary |

```
Pattern: ^hello     → matches "hello world" but NOT "say hello"
Pattern: world$     → matches "hello world" but NOT "worldwide"
Pattern: ^hello$    → matches ONLY "hello" (exact, nothing else)
Pattern: \bcat\b    → matches "the cat sat" but NOT "concatenate"
```

---

### 6. Groups and Capturing

**Parentheses `()`** create **groups** — for two purposes:

1. **Grouping** — apply a quantifier to multiple characters
2. **Capturing** — extract the matched text

```
Pattern: (ha)+      → matches "ha", "haha", "hahaha"
Pattern: (\d{4})-(\d{2})-(\d{2})
         applied to "2024-04-11"
         → Group 1 captures "2024"
         → Group 2 captures "04"
         → Group 3 captures "11"
```

**Non-capturing group:** `(?:...)` — groups without capturing (more efficient):
```
Pattern: (?:https?|ftp)://  → matches "http://" or "https://" or "ftp://"
                               but doesn't capture the protocol
```

**Named groups:** `(?P<name>...)` in Python, `(?<name>...)` in most others:
```python
# Python
import re
m = re.match(r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})', '2024-04-11')
m.group('year')   # → "2024"
m.group('month')  # → "04"
```

---

### 7. Alternation `|`

The pipe `|` means OR:

```
Pattern: cat|dog     → matches "cat" or "dog"
Pattern: (cat|dog)s  → matches "cats" or "dogs"
Pattern: https?://   → matches "http://" or "https://"
```

---

### 8. Common Patterns (Build Your Library)

These are production-ready patterns. Study the structure — don't memorize them blindly.

```
// Email (simplified — full RFC is nightmarishly complex, don't bother)
[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}

// URL
https?://[\w.-]+(?:/[\w./?=%&-]*)?

// IP Address (IPv4)
\b(?:\d{1,3}\.){3}\d{1,3}\b

// Date formats
\d{4}-\d{2}-\d{2}                    // ISO: 2024-04-11
\d{2}/\d{2}/\d{4}                    // US:  04/11/2024

// Phone (US)
\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}  // (555) 867-5309 or 555-867-5309

// Hex color
#[0-9a-fA-F]{3,6}                    // #fff or #a3b2c1

// Credit card (for detection, not validation)
\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b

// Positive integer
^[1-9]\d*$

// Slug (URL-safe string)
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

:::warning Don't Parse HTML with Regex
Regex cannot reliably parse HTML. HTML is not a regular language — it's hierarchical. Use a proper HTML parser (BeautifulSoup in Python, DOMParser in JS). This is one of the most famous "when not to use regex" rules in programming.
:::


---

### 9. Flags / Modifiers

Flags change how the pattern is applied:

| Flag | Effect |
|------|--------|
| `i` / `IGNORECASE` | Case-insensitive matching |
| `m` / `MULTILINE` | `^` and `$` match start/end of each line |
| `s` / `DOTALL` | `.` matches newlines too |
| `g` / (global) | Find all matches, not just first (JS) |
| `x` / `VERBOSE` | Allow whitespace and comments in pattern (Python) |

---

### 10. Using Regex in Practice

<Tabs>
<TabItem value="python" label="Python">

```python
import re

text = "Contact us at support@example.com or sales@company.org"
pattern = r'[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}'

# Test: does it match anywhere?
if re.search(pattern, text):
    print("Found an email")

# Find first match
match = re.search(pattern, text)
if match:
    print(match.group())     # → "support@example.com"
    print(match.start())     # → start index in string
    print(match.end())       # → end index in string

# Find ALL matches
emails = re.findall(pattern, text)
print(emails)  # → ["support@example.com", "sales@company.org"]

# Find all matches WITH position info
for m in re.finditer(pattern, text):
    print(f"Found '{m.group()}' at position {m.start()}")

# Replace
redacted = re.sub(pattern, "[REDACTED]", text)
print(redacted)  # → "Contact us at [REDACTED] or [REDACTED]"

# Split on pattern
re.split(r'\s+', "hello   world\t!")  # ["hello", "world", "!"]

# Compile pattern for reuse (faster if used often)
email_re = re.compile(r'[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}', re.IGNORECASE)
emails = email_re.findall(text)

# Named capture groups
date_re = re.compile(r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})')
m = date_re.match("2024-04-11")
if m:
    print(m.groupdict())  # → {'year': '2024', 'month': '04', 'day': '11'}
```


</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const text = "Contact us at support@example.com or sales@company.org";
const pattern = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g;

// Test: does it match?
/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/.test(text);     // → true

// Find first match
const match = text.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/);
if (match) console.log(match[0]);                  // "support@example.com"

// Find ALL matches (requires /g flag)
const emails = text.match(pattern);
console.log(emails);  // ["support@example.com", "sales@company.org"]

// Replace
text.replace(pattern, "[REDACTED]");

// matchAll — gives position info (returns iterator)
for (const m of text.matchAll(pattern)) {
    console.log(`Found '${m[0]}' at index ${m.index}`);
}

// Named capture groups
const datePattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const dm = "2024-04-11".match(datePattern);
if (dm?.groups) {
    const { year, month, day } = dm.groups;
    console.log(year, month, day);  // "2024" "04" "11"
}
```


</TabItem>
<TabItem value="rust" label="Rust">

```rust
// Rust requires the 'regex' crate: add to Cargo.toml:
// [dependencies]
// regex = "1"

use regex::Regex;

fn main() {
    let text = "Contact us at support@example.com or sales@company.org";
    let pattern = Regex::new(r"[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}").unwrap();

    // Test
    println!("{}", pattern.is_match(text));  // true

    // Find first match
    if let Some(m) = pattern.find(text) {
        println!("{}", m.as_str());  // "support@example.com"
    }

    // Find ALL matches
    for m in pattern.find_iter(text) {
        println!("Found: {} at {}", m.as_str(), m.start());
    }

    // Replace
    let redacted = pattern.replace_all(text, "[REDACTED]");
    println!("{}", redacted);

    // Capture groups
    let date_re = Regex::new(
        r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})"
    ).unwrap();
    if let Some(caps) = date_re.captures("2024-04-11") {
        println!("{}-{}-{}", &caps["year"], &caps["month"], &caps["day"]);
    }
}
```


</TabItem>
<TabItem value="cli-grep-sed" label="CLI (grep / sed)">

```bash
# grep: search files for a pattern
grep -E '[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}' file.txt   # Find emails
grep -rn 'TODO' ./src                                 # Recursive search
grep -v 'DEBUG' app.log                               # Exclude lines with DEBUG

# grep flags: -E (extended regex), -i (ignore case), -n (line numbers),
#             -r (recursive), -l (filenames only), -c (count matches)

# sed: find and replace in-place or output
sed 's/foo/bar/g' file.txt              # Replace all 'foo' with 'bar'
sed -i 's/foo/bar/g' file.txt          # In-place edit
sed 's/\([0-9]\{4\}\)-\([0-9]\{2\}\)/\2-\1/g' dates.txt  # Rearrange dates

# Extract with grep -oP (only matching, Perl-compatible regex)
grep -oP '[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}' file.txt  # Print only emails
```


</TabItem>
</Tabs>

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary (Do These)">

- 🌐 **[Regex101 (FREE)](https://regex101.com/)** — Live tester with explanation of each part. Choose your language flavor. **Bookmark this now.**
- 📖 **[Regular-Expressions.info (FREE)](https://www.regular-expressions.info/)** — The definitive reference site. Not for reading front-to-back — use it as a lookup.


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 🎮 **[Regexone — Interactive Tutorial (FREE)](https://regexone.com/)** — 15-minute interactive intro, great first exposure
- 📺 **[Corey Schafer — Python re module (YouTube, FREE)](https://www.youtube.com/watch?v=K8L6KVGG-7o)** — Best Python-specific walkthrough


</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[Regex Crossword (FREE)](https://regexcrossword.com/)** — Fun puzzles that build intuition fast
- 🎮 **[HackerRank — Regex challenges (FREE)](https://www.hackerrank.com/domains/regex)** — Practical extraction tasks


</TabItem>
</Tabs>

---

## 🏗️ Assignments

### Assignment 1 — Log Analyzer (Extraction)
**Combines:** Regex, file I/O, dictionaries, sorting

Parse a web server access log file and extract:
- [ ] All unique IP addresses that made requests
- [ ] Count of requests per IP (top 10)
- [ ] All 404 URL paths (not found errors)
- [ ] All requests between two specific time ranges
- [ ] Summary: total requests, error rate, most common endpoint

Use a real Apache/Nginx log format:
```
192.168.1.1 - - [11/Apr/2024:10:22:33 +0000] "GET /api/users HTTP/1.1" 200 1234
```

⭐ **Stretch:** Detect potential brute-force: any IP with >100 requests in a minute.

---

### Assignment 2 — Data Extractor (Multi-pattern)
**Combines:** Multiple regex patterns, validation, file output

Build a tool that scans a text file and extracts:
- [ ] All email addresses
- [ ] All URLs (http/https)
- [ ] All dates in any of three formats (ISO, US, UK)
- [ ] All hex color codes
- [ ] All IPv4 addresses

Output a structured JSON report with each category and deduplicated results.

---

### Assignment 3 — Form Validator (Regex in practice)
**Language:** Your choice (preferably TypeScript for a web context)

Build a form validation library with regex-based rules:
- [ ] `validate_email(email) → (valid: bool, error: str)`
- [ ] `validate_password(pw) → (valid: bool, errors: list)` — min 8 chars, 1 upper, 1 lower, 1 digit, 1 special
- [ ] `validate_url(url) → bool`
- [ ] `validate_phone(phone, country='US') → bool` — handle multiple formats
- [ ] `validate_date(date, format) → bool` — at least 2 formats

Write unit tests for each validator with valid AND invalid inputs.

---

## ✅ Milestone Checklist

- [ ] Can write a regex for email, URL, and date without using Regex101 first
- [ ] Can explain the difference between `*`, `+`, and `?`
- [ ] Can use capture groups to extract data from a match in my chosen language
- [ ] Know when NOT to use regex (HTML parsing, very complex nested structures)
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **Regex is now a superpower.** You can now parse, extract, and validate text in ways that would take 20 lines of manual code in one pattern. Every codebase you ever work on will have regex — now you can read and write it.

**Log this in your kanban:** Move `foundations/regex` to ✅ Done.

---

## ➡️ Next Unit

→ [Protocols & Standards](protocols_and_standards.mdx) — or return to your path
