# Lesson 07 — Capstone: CLI File Processor

> **Course:** Node.js Fundamentals · **Time:** 90 minutes
> **Prerequisites:** All previous lessons

---

## 🎯 Project Overview

Build a **command-line file processing tool** called `fileops` that:
- Accepts a subcommand (`stat`, `find`, `transform`, `report`)
- Reads and processes files using streams
- Outputs results to stdout or a file
- Shows a progress indicator for large operations

---

## Project Structure

```text
fileops/
├── src/
│   ├── index.js          ← Entry point, CLI arg parsing
│   ├── commands/
│   │   ├── stat.js       ← File/directory statistics
│   │   ├── find.js       ← Find files by pattern
│   │   ├── transform.js  ← Transform file content
│   │   └── report.js     ← Summary report
│   └── utils/
│       ├── progress.js   ← Progress bar to stdout
│       └── format.js     ← Output formatting
├── package.json
└── .gitignore
```

---

## Implementation

### Entry Point

```js
// src/index.js
import { parseArgs } from 'node:util';
import path          from 'node:path';
import { stat }      from './commands/stat.js';
import { find }      from './commands/find.js';
import { transform } from './commands/transform.js';
import { report }    from './commands/report.js';

const { values, positionals } = parseArgs({
    args:    process.argv.slice(2),
    options: {
        output:     { type: 'string',  short: 'o' },
        pattern:    { type: 'string',  short: 'p', default: '*' },
        format:     { type: 'string',  short: 'f', default: 'text' },
        recursive:  { type: 'boolean', short: 'r', default: false },
        verbose:    { type: 'boolean', short: 'v', default: false },
    },
    allowPositionals: true,
});

const [command, target] = positionals;

if (!command || !target) {
    console.error('Usage: fileops <command> <path> [options]');
    console.error('Commands: stat, find, transform, report');
    process.exit(1);
}

const targetPath = path.resolve(target);
const opts       = { ...values, verbose: Boolean(values.verbose) };

const commands = { stat, find, transform, report };
const handler  = commands[command];

if (!handler) {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}

try {
    await handler(targetPath, opts);
} catch (err) {
    console.error(`Error: ${err.message}`);
    if (opts.verbose) console.error(err.stack);
    process.exit(1);
}
```

### `stat` Command

```js
// src/commands/stat.js
import { stat as fsStat, readdir } from 'node:fs/promises';
import path from 'node:path';

export async function stat(targetPath, opts) {
    const info = await fsStat(targetPath);

    if (info.isFile()) {
        printFileStat(targetPath, info);
        return;
    }

    // Directory — walk and aggregate
    const stats = { totalFiles: 0, totalDirs: 0, totalSize: 0, byExt: {} };
    await walkAndAccumulate(targetPath, stats, opts.recursive);
    printDirReport(targetPath, stats, opts.format);
}

async function walkAndAccumulate(dir, stats, recursive) {
    const entries = await readdir(dir, { withFileTypes: true });

    await Promise.all(entries.map(async entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            stats.totalDirs++;
            if (recursive) await walkAndAccumulate(fullPath, stats, recursive);
        } else {
            const info = await fsStat(fullPath);
            stats.totalFiles++;
            stats.totalSize += info.size;
            const ext = path.extname(entry.name) || '(no ext)';
            stats.byExt[ext] = (stats.byExt[ext] || 0) + 1;
        }
    }));
}

function printFileStat(filePath, info) {
    console.log(`File:     ${filePath}`);
    console.log(`Size:     ${(info.size / 1024).toFixed(2)} KB`);
    console.log(`Modified: ${info.mtime.toISOString()}`);
}

function printDirReport(dirPath, stats, format) {
    if (format === 'json') {
        console.log(JSON.stringify(stats, null, 2));
        return;
    }

    console.log(`Directory: ${dirPath}`);
    console.log(`Files:     ${stats.totalFiles}`);
    console.log(`Dirs:      ${stats.totalDirs}`);
    console.log(`Total:     ${(stats.totalSize / 1024).toFixed(2)} KB`);
    console.log('\nBy extension:');
    const sorted = Object.entries(stats.byExt).sort((a, b) => b[1] - a[1]);
    for (const [ext, count] of sorted) {
        console.log(`  ${ext.padEnd(12)} ${count}`);
    }
}
```

### Progress Utility

```js
// src/utils/progress.js
export class Progress {
    constructor(label, total) {
        this.label   = label;
        this.total   = total;
        this.current = 0;
    }

    tick(n = 1) {
        this.current += n;
        this.render();
    }

    render() {
        const pct  = Math.floor((this.current / this.total) * 100);
        const bar  = '█'.repeat(Math.floor(pct / 5)).padEnd(20, '░');
        process.stdout.write(`\r${this.label} [${bar}] ${pct}% (${this.current}/${this.total})`);
        if (this.current >= this.total) process.stdout.write('\n');
    }
}
```

---

## ✅ Milestone Checklist

- [ ] `fileops stat ./src --recursive` prints a correct file/extension breakdown
- [ ] `fileops stat ./large-file.csv --format json` outputs valid JSON
- [ ] Progress renders correctly for large directory scans
- [ ] The tool exits with code `1` and a clear message on bad input
- [ ] All async operations use `async/await` with proper error handling
- [ ] I did not use `readFileSync` anywhere

## 🏆 Node.js Fundamentals Complete!

## ➡️ Next Course

[Express API](../express_api/index.md) — Build production REST APIs with Express and TypeScript
