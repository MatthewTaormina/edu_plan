# Networking

**Domain:** Foundations · **Time Estimate:** 2–3 weeks · **Focus:** Practical understanding for developers and DevOps

> **Prerequisites:** [Protocols & Standards](protocols_and_standards.md) — understand HTTP, TCP/IP, and DNS first.
>
> **Who needs this:** DevOps engineers, backend developers, anyone who deploys software. Every production issue eventually becomes a networking issue.

---

## 🎯 Learning Objectives

By the end of this unit, you will be able to:

- [ ] Read and write CIDR notation and calculate subnet masks
- [ ] Explain how routers make forwarding decisions
- [ ] Configure basic firewall rules (iptables / Windows Firewall)
- [ ] Explain the difference between L4 and L7 load balancing
- [ ] Use `ping`, `traceroute`, `netstat`, `ss`, `nmap`, and `curl` to diagnose issues
- [ ] Explain NAT, VPN, and proxy server purposes
- [ ] Set up a simple home lab network and understand what each component does

---

## 📖 Concepts

### 1. IP Addresses and Subnetting

Every device on a network has an **IP address** — a unique identifier for routing.

**IPv4** addresses are 32 bits, written as 4 octets in decimal:
```
192.168.1.1
│   │   │ └── Host portion (varies by subnet mask)
│   │   └──── Network portion (varies by subnet mask)
│   └──────── 
└──────────── 
```

**CIDR notation** (`/prefix`) defines how many bits are the network portion:

```
192.168.1.0/24

/24 means the first 24 bits are the network → last 8 bits are host
Subnet mask: 255.255.255.0
Usable hosts: 2^8 - 2 = 254  (subtract network + broadcast address)
Range: 192.168.1.1 – 192.168.1.254
Broadcast: 192.168.1.255
```

**Common CIDR blocks:**

| CIDR | Hosts | Use Case |
|------|-------|---------|
| `/8` | 16M | Large ISP allocations |
| `/16` | 65,534 | Large enterprise network |
| `/24` | 254 | Typical LAN segment |
| `/28` | 14 | Small office or cloud subnet |
| `/30` | 2 | Point-to-point links |
| `/32` | 1 | Single specific host |

**Private IP ranges (RFC 1918 — not routable on internet):**

```
10.0.0.0     – 10.255.255.255   /8
172.16.0.0   – 172.31.255.255   /12
192.168.0.0  – 192.168.255.255  /16
127.0.0.0    – 127.255.255.255  Loopback (localhost)
```

!!! tip "Try It 🔍"
    Run `ip addr` (Linux) or `ipconfig /all` (Windows). Find your machine's IP address and subnet mask. Calculate the network range you're on. Then ping another device on the same network.

---

### 2. Routing

A **router** connects networks and forwards packets based on a **routing table** — a list of networks and which interface/next-hop to use for each.

```
Routing table example:
Destination         Gateway         Interface    Metric
0.0.0.0/0          192.168.1.1     eth0         100    ← Default route (internet)
192.168.1.0/24     0.0.0.0         eth0         0      ← Local network (direct)
10.8.0.0/24        10.8.0.1        tun0         50     ← VPN network

Decision process for packet to 8.8.8.8:
1. Check: does 8.8.8.8 match 10.8.0.0/24?  No
2. Check: does 8.8.8.8 match 192.168.1.0/24? No
3. Use default route 0.0.0.0/0 → send to gateway 192.168.1.1
```

=== "Linux"
    ```bash
    # View routing table
    ip route show
    # Or older command:
    route -n

    # Add a static route
    sudo ip route add 10.0.0.0/8 via 192.168.1.254

    # Delete a route
    sudo ip route del 10.0.0.0/8

    # Show which interface + gateway will be used for a destination
    ip route get 8.8.8.8
    ```

=== "Windows"
    ```powershell
    # View routing table
    route print
    # Or:
    Get-NetRoute | Where-Object {$_.AddressFamily -eq "IPv4"} | Format-Table

    # Add static route
    route add 10.0.0.0 mask 255.0.0.0 192.168.1.254

    # Persistent route (survives reboot)
    route -p add 10.0.0.0 mask 255.0.0.0 192.168.1.254

    # Delete route
    route delete 10.0.0.0
    ```

---

### 3. NAT — Network Address Translation

**NAT** is how millions of private devices share a handful of public IP addresses.

```
Your home:
  Laptop    192.168.1.10 ─┐
  Phone     192.168.1.11 ─┼── Router (NAT) ── Public IP: 203.0.113.5 ── Internet
  Smart TV  192.168.1.12 ─┘

When your laptop (192.168.1.10:54321) requests google.com:
1. Router replaces src IP:port with 203.0.113.5:40001 and records the mapping
2. Google responds to 203.0.113.5:40001
3. Router looks up mapping → forwards to 192.168.1.10:54321
4. Your laptop receives the response

From Google's perspective, all three devices are the same IP: 203.0.113.5
```

**Port forwarding** is the reverse — mapping an inbound request on the public IP to a specific internal device:
```
Inbound to 203.0.113.5:80 → DNAT → 192.168.1.20:80 (your web server)
```

---

### 4. DNS — Deeper

You learned DNS in [Protocols & Standards](protocols_and_standards.md). Here's the operational knowledge:

=== "Linux"
    ```bash
    # DNS lookup (basic)
    nslookup github.com
    nslookup github.com 8.8.8.8   # Use specific DNS server (Google)

    # dig — more powerful
    dig github.com                 # A record lookup
    dig github.com MX              # Mail records
    dig github.com NS              # Nameserver records
    dig +short github.com          # Just the IP(s)
    dig +trace github.com          # Full resolution chain step by step
    dig @1.1.1.1 github.com       # Query Cloudflare's resolver

    # DNS configuration
    cat /etc/resolv.conf           # Which DNS servers this machine uses
    cat /etc/hosts                 # Local DNS overrides (hosts file)
    sudo systemd-resolve --status  # systemd-resolved info

    # Flush DNS cache
    sudo systemd-resolve --flush-caches   # systemd
    sudo resolvectl flush-caches          # newer
    ```

=== "Windows"
    ```powershell
    # DNS lookup
    Resolve-DnsName github.com
    Resolve-DnsName github.com -Type MX     # Mail records
    Resolve-DnsName github.com -Server 8.8.8.8  # Specific DNS server
    nslookup github.com                     # Classic tool (still works)

    # DNS configuration
    Get-DnsClientServerAddress             # Which DNS servers are configured
    ipconfig /displaydns                   # View Windows DNS cache
    ipconfig /flushdns                     # Flush DNS cache

    # Hosts file
    notepad C:\Windows\System32\drivers\etc\hosts

    # Set DNS server (PowerShell)
    Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 1.1.1.1,8.8.8.8
    ```

---

### 5. Firewalls

A **firewall** controls which network traffic is allowed through based on rules.

**Stateful vs. stateless:**
- **Stateless:** Each packet evaluated independently. Simple, fast, can't track connections.
- **Stateful:** Tracks connection state. Allows return traffic for established connections automatically.

Modern firewalls are stateful. A rule allowing outbound HTTP automatically allows the response back.

=== "Linux (iptables / nftables)"
    ```bash
    # iptables — still widely used, lower-level
    # View current rules
    sudo iptables -L -v -n

    # Allow established/related connections (don't lock yourself out!)
    sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

    # Allow loopback
    sudo iptables -A INPUT -i lo -j ACCEPT

    # Allow SSH (port 22) from anywhere
    sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

    # Allow HTTP/HTTPS
    sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

    # Drop everything else
    sudo iptables -A INPUT -j DROP

    # Save rules (Ubuntu/Debian)
    sudo netfilter-persistent save

    # UFW (simpler frontend to iptables)
    sudo ufw status
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw deny 8080
    sudo ufw enable
    sudo ufw status verbose
    ```

=== "Windows (Windows Firewall)"
    ```powershell
    # View firewall status
    Get-NetFirewallProfile | Select-Object Name, Enabled

    # Allow inbound on port 8080
    New-NetFirewallRule -DisplayName "Allow Port 8080" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 8080 `
        -Action Allow

    # Block outbound to specific IP
    New-NetFirewallRule -DisplayName "Block Bad IP" `
        -Direction Outbound `
        -RemoteAddress 1.2.3.4 `
        -Action Block

    # Remove a rule
    Remove-NetFirewallRule -DisplayName "Allow Port 8080"

    # Enable/disable firewall profiles
    Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

    # Check which rules are active
    Get-NetFirewallRule | Where-Object {$_.Enabled -eq "True"} |
        Format-Table DisplayName, Direction, Action
    ```

---

### 6. Load Balancers

A **load balancer** distributes incoming traffic across multiple backend servers.

```
Clients ──→ Load Balancer ──→ Server 1 (50% of requests)
                          └──→ Server 2 (50% of requests)
                          └──→ Server 3 (waiting if others fail)
```

**L4 vs L7 load balancing:**

| | L4 (Transport Layer) | L7 (Application Layer) |
|-|---------------------|----------------------|
| Sees | IP + Port | Full HTTP request |
| Routing based on | IP/TCP only | URL, headers, cookies, content |
| Examples | AWS NLB, HAProxy TCP mode | AWS ALB, nginx, Traefik |
| Speed | Faster (less processing) | Slower but smarter |
| SSL termination | Usually not | Yes |
| Use when | Raw throughput, non-HTTP | HTTP routing, A/B testing, auth |

**Common load balancing algorithms:**

| Algorithm | Behaviour |
|-----------|-----------|
| Round Robin | Each request to next server in rotation |
| Least Connections | Route to server with fewest active connections |
| IP Hash | Same client IP always → same server (session stickiness) |
| Weighted | Servers get proportional traffic based on capacity |

---

### 7. VPNs and Proxies

**VPN (Virtual Private Network):** Creates an encrypted tunnel between your device and a remote network, making you appear to be on that network.

```
Without VPN:
Your device → ISP → Internet → GitHub

With VPN:
Your device → Encrypted tunnel → VPN Server → Internet → GitHub

Your traffic looks like it comes from the VPN server's IP.
ISP can't read your traffic (only sees encrypted gibberish).
```

**Types:**
- **Site-to-site:** Connects two office networks (or office to cloud VPC)
- **Remote access:** Individual users connect to office network remotely
- **Personal VPN:** For privacy, bypassing geo-restrictions (not relevant for DevOps)

**Common tools:** WireGuard (modern, fast), OpenVPN (widely supported), IPsec

**Proxy vs. VPN:** A proxy only routes specific app traffic (e.g., HTTP). A VPN routes all traffic at the OS level.

=== "Linux (WireGuard setup snippet)"
    ```bash
    # Install WireGuard
    sudo apt install wireguard

    # Generate key pair
    wg genkey | sudo tee /etc/wireguard/privatekey | \
        wg pubkey | sudo tee /etc/wireguard/publickey

    # Create interface config (/etc/wireguard/wg0.conf)
    # See: https://www.wireguard.com/quickstart/ for full setup

    # Bring interface up/down
    sudo wg-quick up wg0
    sudo wg-quick down wg0

    # Status
    sudo wg show
    ```

=== "Windows"
    ```powershell
    # WireGuard has an official Windows client (GUI + CLI)
    winget install WireGuard.WireGuard

    # Or use the GUI application from https://www.wireguard.com/install/
    # Import tunnel config file via the GUI or:
    & "C:\Program Files\WireGuard\wireguard.exe" /installtunnelservice "wg0.conf"
    ```

---

### 8. Network Troubleshooting Toolkit

When something doesn't connect, work layer by layer from bottom to top.

```
Troubleshooting hierarchy:
1. Physical/link → Is the cable plugged in? Is Wi-Fi connected? (ip link / ipconfig)
2. IP → Do I have an IP? Is it the right network? (ip addr / ipconfig)
3. Routing → Can I reach the gateway? (ping 192.168.1.1)
4. DNS → Does name resolution work? (nslookup google.com)
5. Transport → Is the port open? (telnet / nc / Test-NetConnection)
6. Application → Is the service responding correctly? (curl / Invoke-WebRequest)
```

=== "Linux"
    ```bash
    # 1. Is my interface up and do I have an IP?
    ip link show
    ip addr show

    # 2. Can I reach my gateway?
    ping -c 4 $(ip route | grep default | awk '{print $3}')

    # 3. Can I reach a public IP? (bypasses DNS)
    ping -c 4 8.8.8.8

    # 4. DNS working?
    nslookup github.com

    # 5. Is port open? (TCP)
    # Using nc (netcat)
    nc -zv github.com 443      # -z = just check, don't send data, -v = verbose
    nc -zv -w 5 10.0.0.1 22   # 5 second timeout

    # Using ss (socket statistics — modern replacement for netstat)
    ss -tulpn                   # TCP/UDP listening ports with process names
    ss -tn dst 8.8.8.8         # Connections to specific IP
    ss -s                       # Summary statistics

    # 6. What path does traffic take?
    traceroute 8.8.8.8         # UDP probes
    traceroute -T 8.8.8.8     # TCP SYN probes (works through more firewalls)
    mtr 8.8.8.8               # Interactive, combines ping + traceroute

    # 7. Port scanner (use only on systems you own!)
    nmap -p 80,443,22 192.168.1.1
    nmap -sV 192.168.1.0/24   # Service version detection on whole subnet

    # 8. Capture actual packets
    sudo tcpdump -i eth0 port 80           # Watch HTTP traffic
    sudo tcpdump -i any host github.com    # All traffic to/from github.com
    sudo tcpdump -w capture.pcap           # Save for Wireshark analysis
    ```

=== "Windows"
    ```powershell
    # 1. Interface status and IPs
    ipconfig /all
    Get-NetIPAddress
    Get-NetAdapter | Where-Object {$_.Status -eq "Up"}

    # 2. Can I reach my gateway?
    $gw = (Get-NetRoute -DestinationPrefix "0.0.0.0/0").NextHop
    Test-Connection $gw -Count 4

    # 3. Ping by IP (bypass DNS)
    Test-Connection 8.8.8.8 -Count 4

    # 4. DNS
    Resolve-DnsName github.com

    # 5. Is a port open?
    Test-NetConnection -ComputerName github.com -Port 443
    Test-NetConnection -ComputerName 10.0.0.1 -Port 22 -InformationLevel Detailed

    # 6. Trace route
    Test-NetConnection github.com -TraceRoute
    tracert github.com            # Classic command

    # 7. Active connections and listening ports
    netstat -ano                  # All connections with PID
    Get-NetTCPConnection | Where-Object {$_.State -eq "Listen"}
    # Map PID to process: Get-Process -Id <PID>

    # 8. Network capture (built-in)
    # netsh trace start capture=yes tracefile=C:\trace.etl
    # netsh trace stop
    # Open .etl file in Network Monitor or Message Analyzer

    # Wireshark (install separately) is the best GUI option
    winget install WiresharkFoundation.Wireshark
    ```

---

## 📚 Resources

=== "Primary"
    - 📖 **[Julia Evans — Networking Zines (FREE)](https://wizardzines.com/)** — "How DNS Works", "TCP/IP", "Bite Size Networking" — fun, accurate, memorable
    - 📺 **[Practical Networking — YouTube (FREE)](https://www.youtube.com/@PracticalNetworking)** — Clear explanations of routing, NAT, subnetting

=== "Supplemental"
    - 📺 **[NetworkChuck — Networking for Beginners (YouTube, FREE)](https://www.youtube.com/@NetworkChuck)** — Engaging, practical, covers Cisco concepts too
    - 📖 **[High Performance Browser Networking — Free online](https://hpbn.co/)** — TCP internals, latency, HTTP from a network performance lens

=== "Tools"
    - 🔧 **[Wireshark (FREE)](https://www.wireshark.org/)** — Full packet capture and analysis. Must-have.
    - 🔧 **[Subnet Calculator (FREE)](https://www.subnet-calculator.com/)** — Visualize CIDR notation
    - 🔧 **[DNS Checker (FREE)](https://dnschecker.org/)** — See DNS propagation across global resolvers

---

## 🏗️ Assignments

### Assignment 1 — Network Topology Map
Document your home or lab network:

- [ ] Map every device: name, IP, MAC address, role
- [ ] Identify your gateway, DNS servers, subnet mask
- [ ] Calculate: how many usable IPs does your subnet have?
- [ ] Ping every device and note which respond (and which don't — why?)
- [ ] Run `traceroute` to `8.8.8.8` and label each hop

---

### Assignment 2 — Port Scanner (build your own)
**Language:** Your choice — low-level practice

Build a basic TCP port scanner:
- [ ] Accept a hostname/IP and a port range (e.g., `scanner.py 192.168.1.1 1-1024`)
- [ ] Attempt TCP connections to each port with a 1-second timeout
- [ ] Report: open ports with service name (look up by port number from a local map)
- [ ] Use threading or async to scan ports concurrently (10 at a time)
- [ ] Report scan time and total open/closed/filtered counts

⭐ **Stretch:** Add banner grabbing — once connected, send a blank line and read the response (reveals SSH version, HTTP headers, etc.)

---

### Assignment 3 — Firewall Lab
Setup and test a local firewall:

- [ ] On a Linux VM (or WSL2): configure UFW to allow only SSH (22) and HTTPS (443)
- [ ] Verify with `nc` that port 80 is rejected, 443 is accepted
- [ ] On Windows: create a firewall rule blocking your browser from accessing port 80
- [ ] Test with `Test-NetConnection` and verify it blocks
- [ ] Document: what happens to blocked packets vs rejected packets? (`DROP` vs `REJECT`)

---

## ✅ Milestone Checklist

- [ ] Can calculate subnet ranges and host counts from CIDR notation (without a calculator)
- [ ] Can read a routing table and explain which rule applies for a given packet
- [ ] Can use `ping`, `traceroute`, `ss`/`netstat`, and `nslookup` to diagnose a connectivity issue
- [ ] Can explain the difference between L4 and L7 load balancing
- [ ] Can explain what NAT does and why it exists
- [ ] All 3 assignments complete and documented

---

## 🏆 Milestone Complete!

> **You can now navigate the network layer.**
>
> When a service "can't connect" you'll know exactly which tool to reach for and which layer to blame.
> This is one of the most underrated skills in software — most developers stop at "it works on my machine."

**Log this in your kanban:** Move `foundations/networking` to ✅ Done.
