# OS Concepts

**Domain:** Foundations · **Time Estimate:** 2–3 weeks · **Focus:** Windows and Linux only

> **Prerequisites:** [Networking](networking.md) is helpful. Basic command-line familiarity is expected.
>
> **Who needs this:** Systems programmers, DevOps engineers, and any developer who deploys software. The OS manages every resource your program uses. Understanding it makes you dramatically better at debugging, optimization, and system design.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Explain what a process and a thread are, and how they differ
- [ ] Describe how the OS schedules processes and use tools to inspect it
- [ ] Explain virtual memory, paging, and the virtual address space
- [ ] Navigate both NTFS (Windows) and ext4 (Linux) file system features
- [ ] Set and explain file permissions on both operating systems
- [ ] Write a simple inter-process communication example (pipe or socket)
- [ ] Manage services and daemons on Windows (Services) and Linux (systemd)
- [ ] Install and update software using native package managers (`winget` / `apt` / `dnf`)

---

## 📖 Concepts

### 1. Processes and Threads

A **process** is a running instance of a program. It has:
- Its own isolated virtual address space (memory)
- One or more threads
- File descriptors / handles
- Its own state (running, sleeping, zombie, etc.)

A **thread** is an execution unit within a process. All threads in a process share:
- The same virtual address space (memory)
- The same file handles
- But each has its own: stack, registers, program counter

```
Process: web_server (PID 1234)
│
├── Thread 0 (main): listening for connections → Stack 0 | Registers 0
├── Thread 1: handling request from client A  → Stack 1 | Registers 1
├── Thread 2: handling request from client B  → Stack 2 | Registers 2
│
├── Shared memory (heap, globals)             ← All threads see this
└── Open files (socket fd, log fd)            ← All threads share these
```

**Key difference:**
- **Process isolation:** One process can't access another's memory (without OS permission)
- **Thread hazard:** All threads share memory — bugs in one can corrupt data used by another

=== "Linux"
    ```bash
    # List all processes
    ps aux                        # All processes, BSD style
    ps -ef                        # All processes, System V style
    pstree                        # Show process parent/child tree
    top                           # Interactive, sorted by CPU
    htop                          # Better version of top

    # Specific process info
    ps aux | grep nginx           # Find nginx processes
    pgrep -a nginx                # Just PIDs and names
    pidof nginx                   # Just PIDs

    # Threads within a process
    ps -L -p <PID>                # Show threads of a process
    top -H -p <PID>               # Show threads in top

    # Process details
    ls /proc/<PID>/               # Everything about a process (Linux exposes this as files)
    cat /proc/<PID>/status        # Status (memory, state, parent PID)
    cat /proc/<PID>/cmdline       # Full command line
    ls -la /proc/<PID>/fd/        # Open file descriptors

    # Kill a process
    kill <PID>                    # Send SIGTERM (graceful)
    kill -9 <PID>                 # Send SIGKILL (force, no cleanup)
    killall nginx                 # Kill all processes named nginx
    ```

=== "Windows"
    ```powershell
    # List processes
    Get-Process                                      # All processes
    Get-Process | Sort-Object CPU -Descending        # Sort by CPU use
    Get-Process -Name "chrome" | Select-Object *     # Specific process detail

    # Process by ID or name
    Get-Process -Id 1234
    Get-Process | Where-Object {$_.WorkingSet -gt 500MB}  # Large memory users

    # Threads within a process
    (Get-Process -Id 1234).Threads

    # Terminate
    Stop-Process -Name "notepad"                     # Graceful
    Stop-Process -Id 1234 -Force                     # Force kill
    taskkill /F /PID 1234                            # Classic command

    # View process tree
    # GUI: Task Manager → Details tab (right-click → Select Columns → Parent PID)
    # CLI alternative:
    Get-CimInstance Win32_Process |
        Select-Object ProcessId, ParentProcessId, Name |
        Sort-Object ParentProcessId
    ```

---

### 2. Process Scheduling

The OS **scheduler** decides which thread gets CPU time and for how long. On a 4-core system, only 4 threads can physically execute simultaneously.

**Preemptive scheduling:** The OS forcibly interrupts running processes to give others a turn. No process can monopolize the CPU.

**Priority:** Each process/thread has a priority. Higher priority threads get more CPU time.

**States a process can be in:**
```
New ──→ Ready ──→ Running ──→ Terminated
                    ↕
                  Blocked/Waiting
                (waiting for I/O, lock, sleep)
```

=== "Linux"
    ```bash
    # Nice value: -20 (highest priority) to 19 (lowest)
    nice -n 10 ./my_script.sh     # Start with lower priority (nicer to others)
    renice -n 5 -p <PID>          # Change priority of running process
    renice -n -5 -p <PID>         # Increase priority (requires root for negative values)

    # Real-time scheduling (for latency-sensitive work)
    chrt -f 99 ./realtime_app     # SCHED_FIFO with priority 99 (root required)

    # See scheduling policy of a process
    chrt -p <PID>

    # CPU affinity — pin process to specific cores
    taskset -c 0,1 ./my_app       # Run on CPU 0 and 1 only
    taskset -p 0x3 <PID>          # Set affinity for running process

    # Load average
    uptime                        # System load averages (1m, 5m, 15m)
    # Load > number of CPUs means system is overloaded
    ```

=== "Windows"
    ```powershell
    # Process priority classes
    # Realtime, High, AboveNormal, Normal, BelowNormal, Idle

    # Set priority of running process
    (Get-Process -Name "notepad").PriorityClass = "High"
    # Or via WMI:
    $p = Get-WmiObject Win32_Process -Filter "Name='notepad.exe'"
    $p.SetPriority(32768)    # 32768=High, 64=Normal, 64=Below Normal

    # CPU affinity — pin to specific cores
    $p = Get-Process -Id 1234
    $p.ProcessorAffinity = 3   # Binary 11 = cores 0 and 1

    # Start process with priority
    Start-Process "notepad.exe" -Priority High

    # View load
    Get-Counter "\Processor(_Total)\% Processor Time"
    ```

---

### 3. Virtual Memory and Paging

The OS gives each process the *illusion* of having its own large, contiguous address space. This is **virtual memory**.

```
Virtual Address Space (each process sees this):
┌─────────────────┐ 0xFFFFFFFFFFFF (top)
│  Kernel space   │  (OS code — process can't access directly)
├─────────────────┤
│  Stack          │  ← grows downward (local variables, call frames)
│  ↓              │
│                 │  (unmapped — touching this = Segfault/Access Violation)
│  ↑              │
│  Heap           │  ← grows upward (malloc/new allocations)
├─────────────────┤
│  Data/BSS       │  (global/static variables)
├─────────────────┤
│  Text (code)    │  (compiled program instructions, read-only)
└─────────────────┘ 0x0 (bottom — null pointer lives here)
```

**Paging:** Physical RAM is divided into fixed-size pages (typically 4KB). Virtual pages map to physical pages via the page table. The CPU's MMU (Memory Management Unit) translates addresses automatically.

**What happens when you access unmapped memory?**  
The CPU raises a **page fault**. The OS either:
- Maps in the page from disk (legitimate access — swap or memory-mapped file)
- Kills the process (**segmentation fault** on Linux, **access violation** on Windows)

**Swap / Page file:** When RAM is full, less-used pages are written to disk. Reading them back is slow (~10,000x slower than RAM). Heavy swap usage = system is struggling.

=== "Linux"
    ```bash
    # Memory overview
    free -h                       # RAM and swap usage
    cat /proc/meminfo             # Detailed breakdown
    vmstat 1                      # Virtual memory stats per second

    # Per-process memory
    cat /proc/<PID>/status | grep -i vm  # Virtual memory info
    pmap <PID>                    # Memory map of a process

    # Swap
    swapon --show                 # Show swap devices
    cat /proc/swaps               # Swap usage

    # Page fault stats
    ps -o pid,majflt,minflt -p <PID>  # Major (disk) and minor (RAM) faults

    # Memory pressure
    dmesg | grep -i "oom"         # Out-of-memory killer events
    ```

=== "Windows"
    ```powershell
    # Memory overview
    Get-CimInstance Win32_OperatingSystem |
        Select-Object TotalVisibleMemorySize, FreePhysicalMemory

    # Page file (Windows' swap equivalent)
    Get-CimInstance Win32_PageFileUsage

    # Per-process memory
    Get-Process | Select-Object Name, WorkingSet, VirtualMemorySize, PagedMemorySize |
        Sort-Object WorkingSet -Descending | Select-Object -First 10

    # Working set = physical RAM used
    # Virtual memory = total virtual allocation (could be mostly unmapped)
    # Paged memory = memory that's been written to page file

    # Memory pressure indicator
    # Task Manager → Performance → Memory → "In Use" vs "Available"
    # Performance tab shows committed memory vs. installed RAM
    ```

---

### 4. File Systems

A **file system** organizes data on storage into files and directories and manages metadata (permissions, timestamps, etc.).

**Linux: ext4 / XFS / btrfs** — the default is usually ext4 or XFS  
**Windows: NTFS** — default for system drives; FAT32/exFAT for removable drives

**Key concepts common to both:**

| Concept | Linux (ext4) | Windows (NTFS) |
|---------|-------------|----------------|
| Directory separator | `/` (forward slash) | `\` (backslash) |
| Root | `/` | `C:\` |
| Symbolic links | `ln -s target link` | `mklink link target` |
| Hard links | `ln target link` | `mklink /H link target` |
| Journaling | Yes (crash recovery) | Yes (MFT journal) |
| Max file size | 16TB | 16EB |
| Case sensitivity | Yes by default | No by default |

**Inodes (Linux) and MFT entries (Windows):** Every file has a metadata entry (permissions, timestamps, size, block pointers). The filename in the directory just points to this entry.

=== "Linux"
    ```bash
    # Disk usage
    df -h                         # Disk usage per filesystem
    du -sh /var/log/*             # Size of each item in /var/log
    du -sh --max-depth=1 /home   # Top-level sizes in /home

    # File info
    stat filename                 # Timestamps, permissions, inode, size
    ls -li                        # List with inode numbers
    file filename                 # Detect file type by content

    # Hard links and symlinks
    ln /etc/hosts /tmp/hosts_hardlink   # Hard link (same inode)
    ln -s /etc/hosts /tmp/hosts_sym     # Symbolic link (pointer)
    readlink /tmp/hosts_sym             # Show where symlink points

    # Mount points
    mount                               # All mounted filesystems
    lsblk                               # Block device tree
    findmnt                             # Tree of mount points

    # Filesystem check and repair (unmounted only!)
    sudo fsck /dev/sdb1

    # Format (careful!)
    sudo mkfs.ext4 /dev/sdb1
    ```

=== "Windows"
    ```powershell
    # Disk usage
    Get-PSDrive                               # Drive usage summary
    Get-ChildItem C:\ | Measure-Object -Property Length -Sum  # Folder size

    # File info
    Get-Item C:\Windows\System32\notepad.exe | Select-Object *
    (Get-Item C:\test.txt).Attributes         # File attributes

    # Symlinks and junctions
    # Must run as Administrator
    New-Item -ItemType SymbolicLink -Path C:\link -Target C:\target
    New-Item -ItemType Junction -Path C:\junction -Target C:\target
    Get-Item C:\link | Select-Object LinkType, Target

    # Volume info
    Get-Volume                               # All volumes and health
    Get-Partition | Get-Disk                 # Disk layout

    # Check disk
    chkdsk C: /f /r                         # Check and repair (reboot required for C:)
    Repair-Volume C: -Scan

    # Format
    Format-Volume -DriveLetter D -FileSystem NTFS -NewFileSystemLabel "Data"
    ```

---

### 5. Permissions

**Linux — Unix permissions:**

```
ls -la output:
-rwxr-xr-- 2 alice devteam 4096 Apr 11 10:00 script.sh
│├──┤├──┤├─┤
││  │ │  └── Other permissions (r--)  = read only
││  │ └───── Group permissions (r-x)  = read + execute
││  └─────── Owner permissions (rwx)  = read + write + execute  
│└────────── File type (- = file, d = dir, l = symlink)
└──────────── Type indicator

Permission bits: r=4, w=2, x=1
rwx = 7, r-x = 5, r-- = 4
chmod 754 script.sh  → owner=rwx(7), group=r-x(5), other=r--(4)
```

```bash
# Linux permission commands
chmod 755 file.sh             # Owner: rwx, Group: r-x, Other: r-x
chmod +x file.sh              # Add execute to all
chmod -R 644 /var/www/html/   # Recursive, all files read/write for owner, read for others

chown alice file.txt          # Change owner
chown alice:devteam file.txt  # Change owner and group
chown -R alice:devteam /app/  # Recursive

# Special permissions
chmod u+s /usr/bin/passwd     # Setuid: runs as file owner (root), not caller
chmod g+s /shared/dir         # Setgid: new files inherit directory's group
chmod +t /tmp                 # Sticky bit: only owner can delete their files (on /tmp)

# ACLs (more fine-grained)
getfacl file.txt              # View ACL
setfacl -m u:bob:r file.txt   # Give bob read access
setfacl -m g:devteam:rw dir/ # Give devteam read+write
```

```powershell
# Windows NTFS permissions — ACL based

# View permissions
Get-Acl C:\myfile.txt | Format-List

# Grant a user read access
$acl = Get-Acl "C:\mydir"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "DOMAIN\username", "Read", "Allow")
$acl.SetAccessRule($rule)
Set-Acl "C:\mydir" $acl

# Take ownership (requires admin)
takeown /F C:\orphaned_file

# icacls — simpler CLI tool
icacls C:\mydir /grant "Users:(OI)(CI)RX"  # Read+Execute, inherited by subdirs
icacls C:\mydir /deny  "Guest:F"            # Deny full control to Guest
icacls C:\mydir /reset /T                   # Reset to inherited permissions recursively
```

---

### 6. Inter-Process Communication (IPC)

Processes are isolated. When they need to share data or coordinate, they use IPC mechanisms.

| Mechanism | Description | When to use |
|-----------|-------------|-------------|
| **Pipes** | One-way byte stream, parent→child | Shell piping, simple parent-child |
| **Named pipes (FIFO)** | Like pipes, but between unrelated processes | Different processes on same machine |
| **Unix domain sockets** | Full-duplex, like network sockets but local | High-performance local IPC |
| **Shared memory** | Processes map same physical RAM | Fastest IPC, requires synchronization |
| **Message queues** | Structured messages with priorities | Decoupled producer/consumer |
| **Signals (Linux)** | Async notifications | `SIGTERM`, `SIGKILL`, `SIGHUP` handlers |
| **Windows Events** | Kernel objects for synchronization | Windows multi-process coordination |

=== "Pseudocode"
    ```
    // Pipe: parent writes, child reads
    pipe_read, pipe_write ← create_pipe()

    child_pid ← fork()

    IF child_pid == 0 THEN    // Child process
        close(pipe_write)
        data ← read(pipe_read)
        PRINT "Child received: " + data
        close(pipe_read)
    ELSE                      // Parent process
        close(pipe_read)
        write(pipe_write, "Hello from parent")
        close(pipe_write)
        wait_for_child(child_pid)
    END IF
    ```

=== "Python"
    ```python
    import subprocess
    import os

    # Simple pipe: parent to child via subprocess
    proc = subprocess.Popen(
        ["grep", "error"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        text=True
    )
    stdout, _ = proc.communicate("info line\nerror: something failed\ninfo line")
    print(stdout)  # "error: something failed\n"

    # Named pipe (Unix FIFO)
    import os, threading

    FIFO_PATH = "/tmp/my_fifo"
    os.mkfifo(FIFO_PATH)

    def writer():
        with open(FIFO_PATH, 'w') as f:
            f.write("hello from writer")

    threading.Thread(target=writer).start()
    with open(FIFO_PATH, 'r') as f:
        print(f.read())  # "hello from writer"
    os.unlink(FIFO_PATH)

    # Shared memory (Python 3.8+)
    from multiprocessing import shared_memory
    shm = shared_memory.SharedMemory(create=True, size=1024)
    shm.buf[:5] = b"hello"
    # Other process can attach: shared_memory.SharedMemory(name=shm.name)
    shm.close()
    shm.unlink()
    ```

=== "Windows"
    ```powershell
    # Windows named pipes
    # Server (listener)
    $pipe = New-Object System.IO.Pipes.NamedPipeServerStream("mypipe")
    $pipe.WaitForConnection()
    $reader = New-Object System.IO.StreamReader($pipe)
    Write-Host "Received: $($reader.ReadLine())"
    $pipe.Close()

    # Client (sender) — run in another terminal
    $client = New-Object System.IO.Pipes.NamedPipeClientStream(".", "mypipe")
    $client.Connect()
    $writer = New-Object System.IO.StreamWriter($client)
    $writer.AutoFlush = $true
    $writer.WriteLine("Hello from client")
    $client.Close()
    ```

---

### 7. Services and Daemons

Long-running background processes are managed by the OS init system.

=== "Linux (systemd)"
    ```bash
    # Service management
    sudo systemctl start nginx         # Start service
    sudo systemctl stop nginx          # Stop service
    sudo systemctl restart nginx       # Restart
    sudo systemctl reload nginx        # Reload config without restart
    sudo systemctl enable nginx        # Start on boot
    sudo systemctl disable nginx       # Don't start on boot
    sudo systemctl status nginx        # Status + recent logs

    # Logs (via journald — systemd's logging system)
    journalctl -u nginx                # All logs for nginx
    journalctl -u nginx -f             # Follow (like tail -f)
    journalctl -u nginx --since "1 hour ago"
    journalctl -p err                  # Only error-level and above

    # Create your own service
    # /etc/systemd/system/myapp.service
    cat > /etc/systemd/system/myapp.service << 'EOF'
    [Unit]
    Description=My Application
    After=network.target

    [Service]
    Type=simple
    User=appuser
    WorkingDirectory=/opt/myapp
    ExecStart=/opt/myapp/server
    Restart=on-failure
    RestartSec=5s
    Environment=PORT=8080

    [Install]
    WantedBy=multi-user.target
    EOF

    sudo systemctl daemon-reload       # Reload systemd config
    sudo systemctl enable --now myapp  # Enable and start
    ```

=== "Windows (Services)"
    ```powershell
    # Service management
    Start-Service "nginx"
    Stop-Service "nginx"
    Restart-Service "nginx"
    Get-Service "nginx" | Select-Object *

    # All services
    Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name, DisplayName

    # Set startup type
    Set-Service "nginx" -StartupType Automatic
    Set-Service "nginx" -StartupType Disabled

    # Create a service (from existing exe)
    New-Service -Name "MyApp" `
        -BinaryPathName "C:\myapp\server.exe" `
        -DisplayName "My Application" `
        -StartupType Automatic `
        -Description "Our custom application service"

    # Start on creation
    Start-Service "MyApp"

    # View service logs → Event Viewer → Windows Logs → Application
    Get-EventLog -LogName Application -Source "MyApp" -Newest 20

    # NSSM — Non-Sucking Service Manager (recommended for wrapping scripts/apps)
    winget install NSSM.NSSM
    nssm install MyApp "C:\Python\python.exe" "C:\myapp\server.py"
    nssm start MyApp
    ```

---

### 8. Package Management

=== "Linux (Debian/Ubuntu — apt)"
    ```bash
    sudo apt update                    # Refresh package lists
    sudo apt upgrade                   # Upgrade installed packages
    sudo apt install nginx             # Install package
    sudo apt install nginx curl git    # Install multiple
    sudo apt remove nginx              # Remove (keep config)
    sudo apt purge nginx               # Remove + delete config
    sudo apt autoremove                # Remove orphaned dependencies
    sudo apt search "web server"       # Search available packages
    apt show nginx                     # Package info
    dpkg -l | grep nginx               # List installed packages matching

    # Add a third-party repo (example: NodeSource for Node.js)
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install nodejs
    ```

=== "Linux (RHEL/Fedora/CentOS — dnf)"
    ```bash
    sudo dnf check-update
    sudo dnf upgrade
    sudo dnf install nginx
    sudo dnf remove nginx
    sudo dnf search nginx
    sudo dnf info nginx
    rpm -qa | grep nginx               # List installed RPM packages

    # Enable EPEL (Extra Packages for Enterprise Linux)
    sudo dnf install epel-release
    ```

=== "Windows (winget + choco)"
    ```powershell
    # winget — Microsoft's official package manager (Windows 10 1709+)
    winget search nodejs
    winget install OpenJS.NodeJS
    winget install Git.Git
    winget install Microsoft.VisualStudioCode
    winget upgrade --all               # Upgrade all installed packages
    winget list                        # List installed packages
    winget uninstall "Notepad++"

    # Chocolatey — community package manager, larger selection
    # Install choco first: https://chocolatey.org/install
    choco install nodejs git vscode -y
    choco upgrade all -y
    choco list --local-only
    choco uninstall nodejs

    # Scoop — another alternative, good for dev tools
    # https://scoop.sh/
    scoop install git curl vim
    ```

---

## 📚 Resources

=== "Primary"
    - 📺 **[CS50 — Week 4: Memory (FREE)](https://cs50.harvard.edu/x/)** — Best intro to virtual memory and pointers
    - 📖 **[Linux Command Line — William Shotts (FREE online)](https://linuxcommand.org/tlcl.php)** — Comprehensive, free, excellent

=== "Supplemental"
    - 📺 **[Low Level Learning — OS Internals (YouTube, FREE)](https://www.youtube.com/@LowLevelLearning)** — Engaging deep dives into OS concepts
    - 📺 **[NetworkChuck — Linux for Hackers (YouTube, FREE)](https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL)** — Practical Linux from scratch

=== "Reference"
    - 📖 **[The Linux man pages (FREE)](https://man7.org/linux/man-pages/)** — The authoritative reference
    - 📖 **[Windows Sysinternals Suite (FREE)](https://learn.microsoft.com/en-us/sysinternals/)** — Process Explorer, Process Monitor, Autoruns — indispensable Windows tools

---

## 🏗️ Assignments

### Assignment 1 — Process Inspector
**Language:** Python or PowerShell/Bash

Build a process monitoring tool that:
- [ ] Lists all running processes with: PID, name, CPU%, memory MB, user
- [ ] Updates every 2 seconds
- [ ] Highlights processes over a configurable CPU% threshold in red
- [ ] Can kill a process by name (with confirmation prompt)
- [ ] Logs process stats to a CSV file every 30 seconds

---

### Assignment 2 — File Permissions Audit
**Language:** Bash (Linux) AND PowerShell (Windows)

Write a script that audits a directory:
- [ ] Finds all files writable by "other" (Linux: world-writable) — security risk
- [ ] Finds all setuid/setgid files (Linux)
- [ ] Finds files not owned by the expected user
- [ ] Generates a report: file path, current permissions, recommended permissions, risk level
- [ ] Automatically fixes any "low risk" issues with a `--fix` flag

Run on `/etc` (Linux) or `C:\Windows\System32` (Windows) — document what you find.

---

### Assignment 3 — Service Deployer
**Platform:** Linux (WSL2 or VM) AND Windows

Take one of your previous assignments (any web server or CLI tool) and:
- [ ] **Linux:** Write a systemd unit file for it. Include: restart on failure, environment vars, proper user, working directory. Enable and verify with `systemctl status`.
- [ ] **Windows:** Use NSSM (or New-Service) to register it as a Windows service. Verify it shows in `services.msc` and starts on boot.
- [ ] Document the differences: how does systemd's restart logic compare to Windows Services?

---

## ✅ Milestone Checklist

- [ ] Can explain the difference between a process and a thread with a concrete example
- [ ] Can view memory usage per-process on both Windows and Linux
- [ ] Can set Unix permissions using `chmod` numerically (e.g. 755, 644) without looking it up
- [ ] Can grant a specific Windows user read-only access to a folder using `icacls`
- [ ] Can write a systemd unit file from scratch
- [ ] Can install, start, enable, and view logs for a service on both Windows and Linux
- [ ] All 3 assignments complete

---

## 🏆 Milestone Complete!

> **You now know how the machine under your code works.**
>
> Understanding processes, memory, file systems, and services separates developers from the
> engineers who can actually debug production systems. You're now in that second group.

**Log this in your kanban:** Move `foundations/os_concepts` to ✅ Done.
