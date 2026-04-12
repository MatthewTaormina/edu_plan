import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Linux CLI

**Domain:** DevOps · **Time Estimate:** 1–2 weeks · **Platform:** Linux (also applies to macOS and WSL2 on Windows)

> **Prerequisites:** None — this is one of the first things to learn.
>
> **Who needs this:** Everyone in tech who touches a server. Virtually every cloud instance, container, and server runs Linux. Being comfortable at the command line is a baseline expectation for DevOps, backend development, and systems work.

:::tip Windows Users
Install **WSL2 (Windows Subsystem for Linux)** to follow along with a real Linux environment on your Windows machine. See: [Microsoft WSL2 Setup Guide](https://learn.microsoft.com/en-us/windows/wsl/install)
:::


---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Navigate the filesystem using `cd`, `ls`, `pwd`, `find`
- [ ] Create, move, copy, and delete files and directories
- [ ] Read and search file content with `cat`, `less`, `grep`, `head`, `tail`
- [ ] Use pipes and redirects to chain commands
- [ ] Manage processes with `ps`, `kill`, `top`, and `htop`
- [ ] Check and manage disk, memory, and network with system tools
- [ ] Write basic Bash scripts with variables, loops, and conditionals
- [ ] Use `ssh` to connect to remote servers
- [ ] Manage users and permissions

---

## 📖 Concepts

### 1. The Shell and Terminal

The **terminal** is the window. The **shell** is the program running inside it (Bash, Zsh, Fish).

The shell prompt shows: `user@hostname:~$`
- `~` is shorthand for your home directory (`/home/username`)
- `$` means you're a regular user; `#` means root

```bash
# Getting help
man ls             # Manual page for ls — press q to quit
ls --help          # Brief help for most commands
tldr ls            # Simplified examples (install with: apt install tldr)
```

---

### 2. Filesystem Navigation

```bash
# Where am I?
pwd                          # Print Working Directory: /home/alice/projects

# What's here?
ls                           # List files
ls -l                        # Long format (permissions, size, date)
ls -la                       # Including hidden files (starting with .)
ls -lh                       # Human-readable file sizes (KB, MB, GB)
ls -lt                       # Sort by modification time, newest first

# Move around
cd /etc                      # Absolute path (starts from root /)
cd projects                  # Relative path (from current dir)
cd ..                        # Parent directory
cd -                         # Previous directory (toggle back and forth)
cd ~                         # Home directory
cd ~/projects/myapp          # Home-relative path

# Special paths
/                            # Root — top of the filesystem
~                            # Your home: /home/username
.                            # Current directory
..                           # Parent directory
```

**Linux filesystem layout:**

```
/
├── bin/     Core binaries (ls, cp, bash)
├── sbin/    System binaries (fdisk, reboot) — usually root only
├── etc/     Configuration files (text files, always look here)
├── home/    User home directories (/home/alice)
├── root/    Root user's home
├── var/     Variable data (logs in /var/log, spool files)
├── tmp/     Temporary files (cleared on reboot)
├── usr/     User programs and libraries
│   ├── bin/     Installed user programs
│   └── lib/     Libraries
├── opt/     Optional/third-party software
├── proc/    Virtual filesystem: running processes and kernel info
├── sys/     Virtual filesystem: hardware and kernel parameters
├── dev/     Device files (disks, terminals)
└── mnt/     Mount points for additional filesystems
```

---

### 3. File Operations

```bash
# Create files and directories
touch filename.txt           # Create empty file (or update timestamp)
mkdir mydir                  # Create directory
mkdir -p path/to/nested/dir  # Create all parent dirs as needed

# Copy
cp file.txt copy.txt         # Copy file
cp -r source/ dest/          # Recursive copy (for directories)
cp -rv source/ dest/         # Verbose — shows each copied file

# Move / Rename
mv old.txt new.txt           # Rename
mv file.txt /var/tmp/        # Move to directory
mv -i old.txt new.txt        # Interactive: prompt before overwrite

# Delete
rm file.txt                  # Delete file
rm -r directory/             # Recursive delete (directory + contents)
rm -rf directory/            # Force recursive delete — NO CONFIRMATION
                             # ⚠️ There is no undo. Be very careful.
rmdir emptydir/              # Remove empty directory only

# Links
ln file.txt hardlink.txt     # Hard link (same inode)
ln -s /etc/hosts /tmp/hosts  # Symbolic link (pointer to target)
readlink /tmp/hosts          # Show what symlink points to

# View/verify
file photo.jpg               # Detect type: "JPEG image data"
stat file.txt                # Timestamps, size, permissions, inode
```

---

### 4. Reading File Content

```bash
# Print entire file
cat file.txt                 # Print to terminal (good for small files)
cat -n file.txt              # Print with line numbers

# Paginate large files
less file.txt                # Paginate. Navigate: arrows, space, /search, q to quit
more file.txt                # Older, less capable paginator

# Parts of files
head file.txt                # First 10 lines
head -n 50 file.txt          # First 50 lines
tail file.txt                # Last 10 lines
tail -n 100 file.txt         # Last 100 lines
tail -f /var/log/syslog      # Follow: stream new lines as they're added (great for logs)

# Word count / line count
wc file.txt                  # Lines, words, bytes
wc -l file.txt               # Line count only

# Sort and deduplicate
sort file.txt                # Sort alphabetically
sort -n file.txt             # Sort numerically
sort -rn file.txt            # Reverse numerical sort
sort file.txt | uniq         # Remove consecutive duplicates
sort file.txt | uniq -c      # Count occurrences
```

---

### 5. Searching

```bash
# grep: search file content
grep "error" app.log                # Lines containing "error"
grep -i "error" app.log            # Case-insensitive
grep -n "error" app.log            # Show line numbers
grep -r "TODO" ./src/              # Recursive search
grep -l "error" *.log              # Only print filenames, not matching lines
grep -v "debug" app.log            # Invert: lines NOT matching

# Extended regex
grep -E "error|warning" app.log    # Match either pattern
grep -E "^\d{4}" file.txt         # Lines starting with 4 digits

# find: search by filename and properties
find /var/log -name "*.log"        # Find all .log files
find . -name "*.py" -type f        # Files only (not dirs)
find . -type d -name "__pycache__" # Find directories
find . -mtime -7                   # Modified in last 7 days
find . -size +10M                  # Files larger than 10MB
find . -name "*.tmp" -delete       # Find AND delete
find /home -user alice             # Files owned by alice

# Run a command on each found file
find . -name "*.log" -exec wc -l {} \;  # Count lines in each log
find . -name "*.py" | xargs wc -l       # Alternative with xargs

# locate: search filenames from a database (faster than find, not real-time)
sudo updatedb                      # Update the locate database
locate nginx.conf                  # Fast filename search

# which: find where a command lives
which python3                      # → /usr/bin/python3
which -a python                    # All python executables in PATH
```

---

### 6. Pipes, Redirection, and Text Processing

The **pipe** `|` sends the output of one command as input to the next. This is the shell's superpower.

```bash
# Redirect output
command > file.txt          # Write stdout to file (overwrite)
command >> file.txt         # Append stdout to file
command 2> errors.txt       # Write stderr to file
command 2>&1                # Redirect stderr to stdout (combine them)
command > file.txt 2>&1     # Write both stdout and stderr to file
command < input.txt         # Read stdin from file

# Pipes
ps aux | grep nginx                    # Find nginx processes
cat /var/log/syslog | grep error | wc -l  # Count error lines
ls -la | sort -k5 -rn | head -20      # Largest 20 files in current dir

# Text manipulation
cat /etc/passwd | cut -d: -f1         # Cut: extract field 1 (colon-delimited)
echo "hello world" | tr 'a-z' 'A-Z'  # Translate: lowercase to uppercase
echo "  hello  " | tr -d ' '         # Delete spaces

# sed: stream editor (find + replace)
sed 's/foo/bar/g' file.txt            # Replace foo with bar
sed -i 's/foo/bar/g' file.txt        # In-place edit
sed '/^#/d' file.txt                 # Delete comment lines (starting with #)
sed -n '10,20p' file.txt             # Print lines 10-20

# awk: field processing
awk '{print $1}' file.txt            # Print first field (whitespace-delimited)
awk -F: '{print $1, $7}' /etc/passwd # Print username and shell (colon-delimited)
awk '{sum += $1} END {print sum}' numbers.txt  # Sum a column of numbers
ps aux | awk 'NR>1 {print $2, $11}' # Skip header, print PID and command

# jq: JSON processor
cat data.json | jq '.users[].name'   # Extract names from JSON array
curl api.example.com | jq '.count'   # Process API response
```

---

### 7. System Information and Monitoring

```bash
# Who, what, when
whoami                       # Current username
id                           # User ID, group memberships
who                          # Who is logged in
uptime                       # How long system has been running, load average
hostname                     # Machine's hostname
uname -a                     # OS, kernel version, architecture
date                         # Current date and time
date +%Y-%m-%d               # Custom format: 2024-04-11
cal                          # Calendar

# CPU and Memory
top                          # Interactive process view (q to quit)
htop                         # Better version (install: apt install htop)
ps aux                       # All processes snapshot
ps aux --sort=-%cpu | head   # Top CPU consumers
free -h                      # Memory usage (human readable)
vmstat 1                     # Memory and CPU stats every second

# Disk
df -h                        # Disk usage per filesystem
du -sh /var/log/*            # Size of items in /var/log
du -sh --max-depth=1 /       # Top-level sizes from root
lsblk                        # Block device tree (disks and partitions)

# Network
ip addr                      # IP addresses and interfaces
ip route                     # Routing table
ss -tulpn                    # Listening ports with process names
netstat -tlnp                # Alternative to ss (older)
curl ifconfig.me             # Your public IP address

# Hardware
lscpu                        # CPU info (cores, architecture, cache)
lsusb                        # USB devices
lspci                        # PCI devices (GPU, NIC, etc.)
```

---

### 8. Process Management

```bash
# Run and control
command &                    # Run in background
command && next              # Run next only if command succeeded (exit 0)
command || fallback          # Run fallback only if command failed (exit != 0)
command ; always             # Run always (semicolon, ignore exit code)
nohup command &              # Keep running after terminal closes

# Job control
jobs                         # List background jobs
fg %1                        # Bring job 1 to foreground
bg %1                        # Send paused job 1 to background
Ctrl+Z                       # Suspend foreground process (brings to background paused)
Ctrl+C                       # Interrupt (SIGINT) — stop current process

# Signals
kill <PID>                   # Send SIGTERM (graceful stop request)
kill -9 <PID>               # Send SIGKILL (forced, immediate)
kill -HUP <PID>              # Send SIGHUP (reload config — nginx, sshd use this)
killall nginx                # Kill all processes named nginx
pkill -f "python server.py"  # Kill by matching command string

# Scheduling — run later
at 5pm tomorrow <<< "backup.sh"    # Run once at a specific time
crontab -e                          # Edit scheduled tasks (cron)
# Cron format: minute hour day month weekday command
# 0 2 * * *  /backup.sh            ← Run at 2:00 AM every day
# */5 * * * * /check.sh            ← Run every 5 minutes
# 0 0 * * 1  /weekly.sh           ← Run at midnight every Monday
```

---

### 9. SSH — Connecting to Remote Servers

```bash
# Basic connection
ssh username@server.example.com
ssh -p 2222 user@server.example.com  # Non-standard port

# Key-based auth (more secure than passwords)
ssh-keygen -t ed25519 -C "my-laptop"   # Generate key pair
# → Creates ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public)

ssh-copy-id user@server               # Copy public key to server's authorized_keys
# OR manually: cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys on remote

# SCP: copy files over SSH
scp file.txt user@server:/home/user/  # Upload
scp user@server:/var/log/app.log ./   # Download
scp -r ./mydir user@server:/opt/app/  # Upload directory

# rsync: smarter sync (only transfers changes)
rsync -av ./src/ user@server:/opt/app/src/   # Sync directory
rsync -avz --delete ./src/ user@server:/opt/ # Delete files removed locally too

# SSH config (~/.ssh/config) — save connection settings
# Host myserver
#     HostName 203.0.113.5
#     User deploy
#     IdentityFile ~/.ssh/myserver_key
#     Port 2222
# Then: ssh myserver  # Uses all the settings above

# SSH tunnels
ssh -L 5432:localhost:5432 user@server  # Forward local:5432 to server's postgres
ssh -R 80:localhost:8080 user@server    # Expose your local:8080 on server:80
```

---

### 10. Bash Scripting Basics

```bash
#!/bin/bash
# Save as: script.sh
# Make executable: chmod +x script.sh
# Run: ./script.sh  OR  bash script.sh

# Variables (no spaces around =)
NAME="Alice"
COUNT=42
OUTPUT=$(ls -la)           # Command substitution
CURRENT_DATE=$(date +%Y-%m-%d)

echo "Hello, $NAME"       # → Hello, Alice
echo "Count: ${COUNT}"    # Curly braces for disambiguation

# User input
read -p "Enter your name: " USER_NAME
echo "Hello, $USER_NAME"

# Conditionals
if [ -f /etc/hosts ]; then
    echo "hosts file exists"
elif [ -d /etc/nginx ]; then
    echo "nginx is installed"
else
    echo "unexpected state"
fi

# File test operators
# -f file    → regular file exists
# -d dir     → directory exists
# -r file    → file is readable
# -z "$var"  → string is empty
# -n "$var"  → string is not empty

# String comparison
if [ "$NAME" = "Alice" ]; then echo "Hi Alice"; fi
if [ "$NAME" != "Bob" ]; then echo "You're not Bob"; fi

# Numeric comparison
if [ $COUNT -gt 40 ]; then echo "big"; fi
# -eq -ne -lt -le -gt -ge

# Loops
for i in 1 2 3 4 5; do
    echo "Iteration $i"
done

for file in *.log; do
    echo "Processing $file"
    wc -l "$file"
done

# C-style for loop
for ((i=0; i<10; i++)); do
    echo $i
done

# While loop
COUNT=0
while [ $COUNT -lt 5 ]; do
    echo $COUNT
    ((COUNT++))
done

# Functions
backup_dir() {
    local SOURCE="$1"              # $1 = first argument
    local DEST="$2"
    local DATE=$(date +%Y%m%d)

    if [ ! -d "$SOURCE" ]; then
        echo "Error: $SOURCE does not exist" >&2
        return 1                   # Non-zero = failure
    fi

    tar -czf "${DEST}/backup-${DATE}.tar.gz" "$SOURCE"
    echo "Backed up $SOURCE to $DEST"
    return 0                       # Zero = success
}

backup_dir /etc /tmp
echo "Exit code: $?"              # $? = exit code of last command

# Error handling
set -e                            # Exit on any error
set -u                            # Exit if undefined variable used
set -o pipefail                   # Pipe fails if any command fails
# Add these at top of any serious script
```

---

## 📚 Resources

<Tabs>
<TabItem value="primary" label="Primary">

- 📖 **[The Linux Command Line — William Shotts (FREE online)](https://linuxcommand.org/tlcl.php)** — Comprehensive, beginner-friendly, free
- 📖 **[Bash Guide for Beginners — Machtelt Garrels (FREE)](https://tldp.org/LDP/Bash-Beginners-Guide/html/)** — Best intro to shell scripting


</TabItem>
<TabItem value="supplemental" label="Supplemental">

- 🌐 **[explainshell.com (FREE)](https://explainshell.com/)** — Paste any command, every part is explained
- 🌐 **[tldr pages (FREE)](https://tldr.sh/)** — Short, practical examples for 500+ commands
- 🌐 **[ShellCheck (FREE)](https://www.shellcheck.net/)** — Finds bugs in your bash scripts — use this always


</TabItem>
<TabItem value="practice" label="Practice">

- 🎮 **[OverTheWire: Bandit (FREE)](https://overthewire.org/wargames/bandit/)** — Learn Linux CLI through a wargame — highly recommended
- 🎮 **[Linux Survival (FREE)](https://linuxsurvival.com/)** — Beginner interactive course


</TabItem>
</Tabs>

---

## 🏗️ Assignments

### Assignment 1 — Sysinfo Script
Build a system information report script:

- [ ] Output: hostname, OS version, uptime, CPU model, core count
- [ ] Output: total/used/free RAM
- [ ] Output: disk usage for each mounted filesystem
- [ ] Output: top 5 CPU-consuming processes
- [ ] Output: public and private IP addresses
- [ ] Output: last 5 lines of /var/log/syslog (or equivalent)
- [ ] Format it nicely with headers and save to `sysinfo.txt`

---

### Assignment 2 — Log Analyzer (Bash)
Process a web server access log:

- [ ] Count total requests
- [ ] Find top 10 IPs by request count
- [ ] Find top 10 most-requested URLs
- [ ] Count 404 errors
- [ ] Find all requests that took longer than 1 second (if timing data present)
- [ ] Output a report to stdout and save to `log_report.txt`

Use: `awk`, `sort`, `uniq`, `grep`, `cut`, `wc`

---

### Assignment 3 — Backup Script
A production-style automated backup:

- [ ] Configuration at top: `SOURCE_DIR`, `BACKUP_DIR`, `RETAIN_DAYS=7`
- [ ] Creates timestamped tar.gz: `backup-2024-04-11-1430.tar.gz`
- [ ] Deletes backups older than `RETAIN_DAYS`
- [ ] Logs every action with timestamp to `backup.log`
- [ ] Exits with error code 1 if source dir doesn't exist
- [ ] Checks available disk space before backup
- [ ] Sends a summary to stdout: started, finished, archive size, deleted old backups
- [ ] Schedule with cron to run daily at 2:00 AM

---

## ✅ Milestone Checklist

- [ ] Can navigate any directory path without looking up commands
- [ ] Can search file content with `grep` including regex and recursive search
- [ ] Can use pipes to chain 3+ commands together
- [ ] Can write a Bash script with variables, conditionals, and a loop
- [ ] Can connect to a remote server with SSH using key-based auth
- [ ] Can find the process using a specific port with `ss -tulpn`
- [ ] Completed OverTheWire Bandit levels 0–10
- [ ] All 3 assignments committed to GitHub

---

## 🏆 Milestone Complete!

> **The terminal is now your home.**
>
> Every server you ever touch will give you a shell prompt. You're ready for it.
> Docker containers, cloud VMs, CI pipelines — they're all just Linux under the hood.

**Log this in your kanban:** Move `devops/linux_cli` to ✅ Done.

## ➡️ Next Unit

→ [Git Workflow](git_workflow.md)
