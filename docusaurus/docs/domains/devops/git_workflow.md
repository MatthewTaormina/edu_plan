# Git Workflow

**Domain:** DevOps · **Time Estimate:** 1 week · **Platform:** Cross-platform

> **Prerequisites:** [Linux CLI](linux_cli.md) — you need basic terminal comfort.
>
> **Who needs this:** Everyone who writes code. Git is non-negotiable in professional software development. Every team, every open-source project, every CI/CD system runs on Git.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Initialize repos, stage, and commit changes with meaningful messages
- [ ] Use branches to isolate work and merge changes cleanly
- [ ] Resolve merge conflicts
- [ ] Use `git log`, `git diff`, and `git blame` to understand a codebase's history
- [ ] Recover from common mistakes (`reset`, `revert`, `stash`)
- [ ] Collaborate via pull/merge requests on GitHub or GitLab
- [ ] Write a conventional commit message
- [ ] Understand Git internals: objects, trees, and refs

---

## 📖 Concepts

### 1. What Git Is (and Isn't)

Git is a **distributed version control system**. Every contributor has a full copy of the repo including all history. There is no single "master server" required — GitHub/GitLab are just convenient hosting.

```
Your machine:         GitHub / GitLab:
┌──────────────┐      ┌──────────────────┐
│  Working dir │      │   Remote repo    │
│  (./ files)  │      │  (bare clone)    │
├──────────────┤      └──────────────────┘
│ Staging area │◄──────── push / pull ──►
│  (index)     │
├──────────────┤
│  Local repo  │
│  (.git/)     │
└──────────────┘
```

**Three areas in Git:**
1. **Working directory** — your files as they are on disk
2. **Staging area (index)** — what will go into the next commit
3. **Local repo (`.git/`)** — all your commits, branches, history

---

### 2. Core Workflow

```bash
# One-time setup
git config --global user.name "Alice Smith"
git config --global user.email "alice@example.com"
git config --global core.editor "code --wait"    # VS Code
git config --global init.defaultBranch main

# Start a new project
git init                                # Initialize repo in current dir
git init myproject                      # Create new dir + initialize

# Clone existing repo
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git  # SSH (faster, needs SSH key setup)
git clone https://... mydir             # Clone into specific directory

# Daily workflow
git status                              # What's changed?
git diff                                # What exactly changed (unstaged)?
git diff --staged                       # What's in the staging area?

git add filename.py                     # Stage specific file
git add .                               # Stage all changes in current dir
git add -p                              # Interactive: choose hunks to stage

git commit -m "feat: add user login"    # Commit staged changes
git commit --amend                      # Modify the last commit (before pushing!)

git push origin main                    # Push commits to remote
git pull                                # Fetch + merge remote changes
git fetch                               # Fetch only (don't merge yet)
```

---

### 3. Branching

Branches let you isolate work. The default branch is `main` (or `master` in older repos).

```bash
# View branches
git branch                              # Local branches (* = current)
git branch -a                           # All branches including remote
git branch -v                           # With last commit info

# Create and switch
git branch feature/user-auth            # Create branch (don't switch)
git checkout feature/user-auth          # Switch to branch
git checkout -b feature/user-auth       # Create AND switch (shortcut)
git switch feature/user-auth            # Modern alternative to checkout
git switch -c feature/user-auth         # Create AND switch (modern)

# Rename / delete
git branch -m old-name new-name         # Rename
git branch -d feature/user-auth         # Delete (safe: won't delete unmerged)
git branch -D feature/user-auth         # Force delete (even unmerged)

# Push branch to remote
git push -u origin feature/user-auth    # Push + set upstream tracking
git push                                # Subsequent pushes on same branch

# Delete remote branch
git push origin --delete feature/user-auth
```

**Branch naming conventions:**

```
feature/short-description    New feature
fix/what-was-broken          Bug fix
docs/what-was-documented     Documentation only
refactor/what-was-refactored Code change, no behavior change
test/what-was-tested         Tests only
release/1.2.0                Release preparation
hotfix/critical-security     Emergency production fix
```

---

### 4. Merging and Rebasing

**Merge:** combines two branches by creating a merge commit.  
**Rebase:** replays your commits on top of the target branch (cleaner linear history).

```bash
# Merge feature branch into main
git switch main
git merge feature/user-auth             # Fast-forward if possible, else merge commit
git merge --no-ff feature/user-auth     # Always create merge commit (better history)
git merge --squash feature/user-auth    # Squash all feature commits into one staged change

# Rebase (your branch onto main)
git switch feature/user-auth
git rebase main                         # Replay your commits on top of latest main
# → cleaner history, but rewrites commit hashes (only safe on your own branch)

# Interactive rebase — edit, reorder, squash commits
git rebase -i HEAD~3                    # Edit last 3 commits
# Opens editor: pick, squash, reword, edit, drop
```

**When to use which:**
- `merge` — public/shared branches, want to preserve full history of when work happened
- `rebase` — your local feature branch, want cleaner linear history before PR
- `squash merge` — squash many small commits into one when merging a PR (common at companies)

---

### 5. Merge Conflicts

When two branches change the same lines, Git can't automatically decide which is correct.

```bash
git merge feature/user-auth
# AUTO-MERGING index.html
# CONFLICT (content): Merge conflict in index.html
# Automatic merge failed; fix conflicts and then commit the result.

# Conflict markers in the file:
<<<<<<< HEAD          ← your current branch's version
<h1>My App</h1>
=======              ← divider
<h1>Our App</h1>
>>>>>>> feature/user-auth  ← incoming branch's version

# Steps to resolve:
# 1. Edit the file — remove the markers, keep what you want
# 2. Stage the resolved file
git add index.html
# 3. Complete the merge
git commit

# VS Code, IntelliJ, etc. have visual conflict resolution tools
# Or use:
git mergetool                           # Opens configured merge tool
```

---

### 6. Understanding History

```bash
# View history
git log                                 # Full log
git log --oneline                       # Compact: one line per commit
git log --oneline --graph               # ASCII branch graph
git log --oneline --graph --all         # All branches in the graph
git log -10                             # Last 10 commits
git log --author="Alice"               # Filter by author
git log --since="2024-01-01"           # Since a date
git log --grep="fix"                    # Commits with "fix" in message
git log -- filename.py                  # History of a specific file
git log main..feature/branch           # Commits in feature not yet in main

# Inspect specific commits
git show abc1234                        # Full details of a commit
git show HEAD                           # Latest commit
git show HEAD~2                         # 2 commits ago

# Compare
git diff main feature/user-auth         # Differences between branches
git diff HEAD~1 HEAD -- app.py         # What changed in app.py in last commit

# Who wrote this line?
git blame filename.py                   # Each line: commit hash, author, date
git blame -L 20,35 filename.py         # Specific line range

# Find which commit introduced a bug (binary search)
git bisect start
git bisect bad                          # Current HEAD is broken
git bisect good v1.0                    # v1.0 was working
# Git checks out midpoint, you test it:
git bisect bad                          # Still broken
git bisect good                         # This one works
# Repeat until git finds the exact breaking commit
git bisect reset                        # Return to HEAD when done
```

---

### 7. Undoing and Recovery

```bash
# Discard changes in working directory
git restore filename.py                 # Discard unstaged changes to file
git restore .                           # Discard ALL unstaged changes (irreversible!)
git checkout -- filename.py             # Older equivalent

# Unstage (remove from staging, keep changes)
git restore --staged filename.py        # Unstage specific file
git reset HEAD filename.py              # Older equivalent

# Undo commits (local, before pushing)
git reset --soft HEAD~1                 # Undo last commit, keep changes staged
git reset --mixed HEAD~1                # Undo last commit, keep changes unstaged (default)
git reset --hard HEAD~1                 # Undo last commit, DISCARD changes ⚠️

# Amend last commit
git commit --amend -m "Better message"  # Change message
git commit --amend                      # Add staged changes to last commit

# Revert a pushed commit (SAFE — adds a new commit that undoes)
git revert abc1234                      # Creates new "revert" commit
git revert HEAD                         # Revert most recent commit

# Stash: temporarily shelve work
git stash                               # Save dirty working directory
git stash push -m "wip: adding tests"  # Stash with a message
git stash list                          # See all stashes
git stash pop                           # Apply most recent stash + delete
git stash apply stash@{1}              # Apply specific stash (keep stash entry)
git stash drop stash@{0}              # Delete a stash

# Find lost commits (after hard reset)
git reflog                              # History of where HEAD has pointed
# Find the hash → git reset --hard <hash>
```

**Reset vs Revert:**

| | `git reset` | `git revert` |
|-|------------|-------------|
| Safe to use after push? | ❌ No — rewrites history | ✅ Yes — adds new commit |
| Useful for | Local, unpushed mistakes | Fixing pushed/shared commits |
| History | Removes commits | Preserves all history |

---

### 8. Collaborating: Pull Requests and Code Review

```bash
# Standard feature branch workflow:
# 1. Create feature branch
git switch -c feature/add-dark-mode

# 2. Make commits
git add -p
git commit -m "feat: add dark mode toggle to settings"
git commit -m "test: add dark mode toggle tests"

# 3. Keep up to date with main
git fetch origin
git rebase origin/main               # Or: git merge origin/main

# 4. Push your branch
git push -u origin feature/add-dark-mode

# 5. Open Pull Request on GitHub/GitLab (via web UI)
#    → Title, description, link to issue, screenshots if UI change

# 6. After review and approval — merge via UI or:
git switch main
git merge --no-ff feature/add-dark-mode
git push
git branch -d feature/add-dark-mode  # Clean up
```

---

### 9. Conventional Commits

A standard for commit messages that enables automated changelog generation, semantic versioning, and better `git log` readability.

```
Format: <type>(<scope>): <description>

Types:
  feat:     New feature (triggers MINOR version bump)
  fix:      Bug fix (triggers PATCH version bump)
  docs:     Documentation only
  style:    Formatting, whitespace — no logic change
  refactor: Code change that doesn't fix or add
  test:     Adding or fixing tests
  chore:    Build tools, package updates, CI
  perf:     Performance improvements
  ci:       CI/CD configuration

Scope (optional): what part of the codebase
  feat(auth): add OAuth2 login
  fix(api): return 404 when user not found
  docs(readme): add development setup guide

BREAKING CHANGE footer:
  feat!: change API response format
  
  BREAKING CHANGE: The 'data' field is now 'results'
  
Examples:
  feat: add dark mode toggle
  fix(auth): prevent login with expired token
  docs: update API authentication guide
  chore: upgrade dependencies to latest
  test(api): add integration tests for user endpoint
  refactor!: replace rest client with graphql

  BREAKING CHANGE: API clients must update to use /graphql endpoint
```

---

### 10. Git Internals (Understanding the Foundation)

Git stores everything as content-addressable objects in `.git/objects/`:

```
Object types:
  blob    → file content (no filename, just bytes)
  tree    → directory listing (name → hash mappings)
  commit  → snapshot (tree hash + parent + author + message)
  tag     → named pointer to a commit

Every object is identified by its SHA-1 hash of content.
Two identical files have the same hash → stored once (deduplication).

A commit points to:
  parent commit(s)  → the chain of history
  tree object       → the root directory at that snapshot
  metadata          → author, committer, date, message

refs/ maps names to hashes:
  refs/heads/main   → abc1234  (local branch "main")
  refs/tags/v1.0    → def5678  (tag "v1.0")
  HEAD              → ref to current branch (or a commit in detached HEAD)
```

```bash
# Explore git internals
ls .git/objects/                        # All stored objects (as files)
git cat-file -t abc1234                # Type of object
git cat-file -p abc1234                # Content of object
git ls-tree HEAD                        # Tree of current commit (files and hashes)
git ls-tree HEAD -- src/               # Just the src/ subtree
```

---

## 📚 Resources

=== "Primary"
    - 📖 **[Pro Git — Scott Chacon (FREE online)](https://git-scm.com/book/en/v2)** — The definitive book. Read Ch. 1-3 now, rest as needed.
    - 🌐 **[Oh Shit, Git!](https://ohshitgit.com/)** — Plain-English recipes for when things go wrong. Bookmark this.

=== "Supplemental"
    - 🎮 **[Learn Git Branching (interactive, FREE)](https://learngitbranching.js.org/)** — Visualized, hands-on branching exercises
    - 📺 **[Fireship — Git in 100 Seconds (YouTube)](https://www.youtube.com/watch?v=hwP7WQkmECE)** — Best quick overview

=== "Reference"
    - 📖 **[Git Reference (git-scm.com)](https://git-scm.com/docs)** — Official command reference
    - 📖 **[Conventional Commits Spec](https://www.conventionalcommits.org/en/v1.0.0/)** — The commit message standard

---

## 🏗️ Assignments

### Assignment 1 — History Archaeology
Pick any real open-source project (e.g., `curl`, `flask`, `htop`):

- [ ] Clone it
- [ ] Find the oldest commit and read it
- [ ] Find the commit that added a specific feature (use `git log --grep`)
- [ ] Use `git blame` on a key source file — who wrote the most important function?
- [ ] Use `git bisect` to find a specific commit (practise with any change you can identify)
- [ ] Count commits per author: `git shortlog -sn`

---

### Assignment 2 — Conflict Resolution Practice
Deliberately create and resolve conflicts:

- [ ] Create two branches from the same base
- [ ] Edit the same file in both branches with conflicting changes
- [ ] Attempt to merge — observe the conflict
- [ ] Resolve it correctly
- [ ] Repeat with a 3-way conflict (base changed + branch A + branch B all modified same section)
- [ ] Document: what was easy, what was confusing, how did you resolve ambiguity?

---

### Assignment 3 — Contribution Simulation
Simulate a complete open-source contribution workflow:

- [ ] Fork a (real or practice) repository on GitHub
- [ ] Clone your fork locally
- [ ] Create a feature branch with a conventional name
- [ ] Make 3–5 commits with conventional commit messages
- [ ] Push and open a Pull Request with a full description template:
  - What changed, why, how to test, screenshots if applicable
- [ ] Practice: use `rebase -i` to squash your commits into one clean commit before PR

---

## ✅ Milestone Checklist

- [ ] Can initialize a repo, stage selectively with `git add -p`, and commit
- [ ] Can create, switch between, and delete branches
- [ ] Can resolve a merge conflict without losing changes
- [ ] Can use `git log --oneline --graph` to understand a repo's history
- [ ] Can undo any mistake using the right tool (restore / reset / revert / stash)
- [ ] Know when to use merge vs rebase
- [ ] Write commit messages in Conventional Commits format
- [ ] All 3 assignments completed

---

## 🏆 Milestone Complete!

> **Git is now a power tool, not a mystery.**
>
> You can navigate any codebase's history, collaborate with any team,
> and recover from any mistake. These skills apply for the rest of your career —
> every language, every framework, every company.

**Log this in your kanban:** Move `devops/git_workflow` to ✅ Done.

## ➡️ Next Unit

→ [Docker](docker.md)
