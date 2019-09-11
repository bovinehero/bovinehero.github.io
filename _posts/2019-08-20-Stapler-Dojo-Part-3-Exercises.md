---
author: bhero
topic: dojo
---

Enumeration portion of the Dojo

# Enumeration

Cover every service discovered, what it does and how to interact with it manually.
Suggest a tool to try against each service 

tools
* nmap
* browser tools/plugins 
* curl/wget

optional tool ideas
* Burp/Zap

> This is the biggest section of the dojo. Recap here


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



## Recommended Resources

tutorial site for each manual step

next up [Attacking](Stapler-Dojo-Part-4-Exercises.html)