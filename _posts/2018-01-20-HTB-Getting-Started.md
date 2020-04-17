---
author: bhero
topic: htb
ip: "10.10.10.xx"
htbName: SAMPLE
pic: https://www.hackthebox.eu/images/logo600.png
user: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
root: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
hide: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
frontPage: False
---
Getting started with [Hack the Box](https://www.hackthebox.eu/)

## Hack Your Way In!

To get access to the site you need to prove your worth by hacking a webform.
You don't need any special tools, a browser and a bit of deep digging and you'll have access in no time.

## This Series [2019 edit]

The HTB series initially started as a collection of personal write ups for all retired boxes that I found to be useful for training for the OSCP certification. 

After I passed I wanted to share my experience and provide my insights to testing on suitable boxes. However post OSCP I had a few commitment changes and had little time to play on the platform.  

Fast forward from early 2018 to 2019 and I've got some time back to play. I'm glad to see the platform has gotten better, both the product and community has grown. 

These days it seems everyone and their dog has a write up of these boxes, this is my take on them and while there are some really useful guides I'm presenting my personal take on the challenges.

If you are looking to beat HTB, IppSec and his [YouTube Channel](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA) contains a walkthrough for all of the retired boxes. In hindsight I've taken different approaches to some of the attacks he used I'm really just focusing on ones I enjoyed or that I think will help cultivate specific OffSec skills.

## Useful Scriptlets

Some stuff I find handy

### Setup.sh

I like to run engagements from a dedicated `OffSec\tmp` in my home directory. I always take a backup of my `hosts` file as well as some boxes require that we add DNS records to be able to access all areas.

``` bash
sudo apt update && sudo apt upgrade
sudo cp /etc/hosts /etc/hosts.bkp 
mkdir ~/OffSec/tmp && cd ~/OffSec/tmp
```

And for the the clearup afterwards I like to revert the `hosts` file and make a password `{{ page.root }}` protected archive:

``` bash
cp /etc/hosts ~/OffSec/tmp/hosts
sudo cp /etc/hosts.bkp /etc/hosts
7za a ~/OffSec/{{ page.htbName }}.7z -p{{ page.root }} ~/OffSec/tmp
```

To get the archive back:

``` bash
7za x ~/OffSec/{{ page.htbName }}.7z -p{{ page.root }} -o/tmp/{{ page.htbName }}
```

### Hosts File

If we want to add a domain name to our hosts file: 

``` bash
sudo cp /etc/hosts /etc/hosts.bkp #always make a backup first!
sudo -- sh -c  "echo \"{{ page.ip }}\{{ page.htbName | downcase }}.htb\" >> /etc/hosts"
```

And I want to revert it back after the engagement:

``` bash
sudo cp /etc/hosts.bkp /etc/hosts
```

### Connection.sh

``` bash
openvpn {{ page.topic}}.opvn
```