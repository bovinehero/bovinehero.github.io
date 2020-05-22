---
layout: post
title:  "Building a Kali Container"
categories: "SecDevOps"
tags: [LabSetup, HyperV, Docker]
thumb: \assets\images\SecDevOps\posts\dockerkali-948x350.png
---

Now that I have Docker setup I'm going to build a PoC nmap container out of a base Kali image.

[Last post]({{page.previous.url}}) I looked at setting up Docker and deploying a PoC demo of an Nginx server. This post I'm going to build a tool I can actually use. 

## Clearing the Decks

First I check that I have no docker processes running:

{% highlight powershell %}
docker ps
{% endhighlight %}

I don't:

{% highlight shell %}
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
{% endhighlight %}

Next I want to think about where I want to store my docker stuff. With docker running I right click on the icon on the taskbar to get to settings.

In Resources I can specify a storage location to a more convenient one than the default:

![image-location.png](\assets\images\SecDevOps\posts\image-location.png)

And so that I can easily share resources between containers I specify a file share location as well:

![fileShare.png](\assets\images\SecDevOps\posts\fileShare.png)

After an __Apply and Reset__ the changes take place.

## Getting a Base Image

I want to start with an official Kali linux base, luckily Kali Linux have published images on [DockerHub](https://registry.hub.docker.com/u/kalilinux).

Ordinarily I would kick off a pull of the remote image and run it interactively via the following commands: 

{% highlight powershell %}
docker pull kalilinux/kali-rolling
docker run -t -i kalilinux/kali-rolling /bin/bash
{% endhighlight %}

This would let me quickly configure a bare bones Kali (shell only) image. While this is fast I'm lazy, if I have to do something more than twice I want to leverage some automation. So I'm going to use a Dockerfile to configure and set up set up my base image.
What is a Dockerfile? It is a simple configuration file which specifies the initial setup of a container. 

This has several advantages, but where it really shines for me is the ability to refer to this file for a base image and then build on it to create custom Kali builds for individual test cases. This simplifies deployments and reduces my workload, indeed in enterprise these files can be templated with variables and quickly scaled as needed.

> When you issue a docker build command, the current working directory is called the build context. By default, the Dockerfile is assumed to be located here, but you can specify a different location with the file flag (-f). Regardless of where the Dockerfile actually lives, all recursive contents of files and directories in the current directory are sent to the Docker daemon as the build context.

First off I want to clean out all my stored images:

{% highlight powershell %}
docker rmi $(docker images -a -q) --force
{% endhighlight %}

`Dockerfile` contents:

{% highlight conf %}
# Kali Linux Base Image to start all Kali builds with
FROM kalilinux/kali-rolling 
LABEL Description="Base Image to start all Kali builds with" 
{% endhighlight %}

If I go to the same directory as my Docker file I can kick off a build for an image and tag it as `base` with:

{% highlight powershell %}
docker build -t base .
{% endhighlight %}

To get the following output

{% highlight shell %}
Sending build context to Docker daemon  2.048kB
Step 1/2 : FROM kalilinux/kali-rolling
 ---> 461ce11a4bd9
Step 2/2 : LABEL Description="base Image to start all Kali builds with"
 ---> Using cache
 ---> 1777f73dd909
Successfully built 1777f73dd909
Successfully tagged base:latest
SECURITY WARNING: You are building a Docker image from Windows against a non-Windows Docker host. All files and directories added to build context will have '-rwxr-xr-x' permissions. It is recommended to double check and reset permissions for sensitive files and directories.
{% endhighlight %}

I can run the base image interactively in this command prompt in privileged mode:

{% highlight powershell %}
docker run -t -i --privileged base bash
{% endhighlight %}

and perform some basic commands:

{% highlight shell %}
root@bcbf347910d1:/# id && uname -a
uid=0(root) gid=0(root) groups=0(root)
Linux bcbf347910d1 4.19.76-linuxkit #1 SMP Fri Apr 3 15:53:26 UTC 2020 x86_64 GNU/Linux
{% endhighlight %}

This is a pretty basic image it comes with very few tools by default and requires package installations to be of any real benefit for us, from here I'm free to customize the build manually. These changes only persist for the life of the container and if I want to persist them I will need to commit changes to the image in a separate shell on the host device.

As I mentioned earlier, manual configurations are tiresome it is my preference to automate as much of this as possible. To do this we can leverage RUM, CMD and ENTRYPOINT commands.

> RUN executes command(s) in a new layer and creates a new image. E.g., it is often used for installing software packages. CMD sets default command and/or parameters, which can be overwritten from command line when docker container runs. ENTRYPOINT configures a container that will run as an executable. [source](https://goinbigdata.com/docker-run-vs-cmd-vs-entrypoint/)

Below is an example of a dockerfile that will install nmap and exploitdb packages using RUN:

{% highlight conf %}
# Kali Linux base Image to start all Kali builds with
FROM kalilinux/kali-rolling 
LABEL Description="base Image to start all Kali builds with" 
RUN apt-get update && apt-get -y install nmap exploitdb
{% endhighlight %}

This time when I rebuild my base image:

{% highlight powershell %}
docker build -t base .
{% endhighlight %}

It pulls performs an install 

{% highlight shell %}
Sending build context to Docker daemon  2.048kB
Step 1/3 : FROM kalilinux/kali-rolling
 ---> 461ce11a4bd9
Step 2/3 : LABEL Description="base Image to start all Kali builds with"
 ---> Using cache
 ---> cf572134723d
Step 3/3 : RUN apt-get update && apt-get -y install nmap exploitdb
 ---> Running in ca06b3e4b27f
Get:1 http://kali.download/kali kali-rolling InRelease [30.5 kB]
Get:2 http://kali.download/kali kali-rolling/contrib amd64 Packages [99.4 kB]
Get:3 http://kali.download/kali kali-rolling/main amd64 Packages [16.5 MB]
Get:4 http://kali.download/kali kali-rolling/non-free amd64 Packages [195 kB]
Fetched 16.8 MB in 3s (5665 kB/s)
Reading package lists...
Reading package lists...
Building dependency tree...
The following additional packages will be installed:
  libblas3 libicu63 liblinear4 liblua5.3-0 libssh2-1 libssl1.1 libxml2
  libxml2-utils lua-lpeg nmap-common
Suggested packages:
  liblinear-tools liblinear-dev ncat ndiff zenmap
The following NEW packages will be installed:
  exploitdb libblas3 libicu63 liblinear4 liblua5.3-0 libssh2-1 libssl1.1
  libxml2 libxml2-utils lua-lpeg nmap nmap-common
0 upgraded, 12 newly installed, 0 to remove and 10 not upgraded.
Need to get 44.6 MB of archives.
After this operation, 251 MB of additional disk space will be used.
Get:1 http://kali.download/kali kali-rolling/main amd64 libblas3 amd64 3.9.0-2 [153 kB]
Get:2 http://kali.download/kali kali-rolling/main amd64 libicu63 amd64 63.2-3 [8296 kB]
Get:3 http://kali.download/kali kali-rolling/main amd64 liblinear4 amd64 2.3.0+dfsg-4 [43.7 kB]
Get:4 http://kali.download/kali kali-rolling/main amd64 liblua5.3-0 amd64 5.3.3-1.1+b1 [120 kB]
Get:5 http://kali.download/kali kali-rolling/main amd64 libssh2-1 amd64 1.8.0-2.1 [140 kB]
Get:6 http://kali.download/kali kali-rolling/main amd64 libssl1.1 amd64 1.1.1g-1 [1543 kB]
Get:7 http://kali.download/kali kali-rolling/main amd64 libxml2 amd64 2.9.10+dfsg-5 [709 kB]
Get:8 http://kali.download/kali kali-rolling/main amd64 libxml2-utils amd64 2.9.10+dfsg-5 [108 kB]
Get:9 http://kali.download/kali kali-rolling/main amd64 lua-lpeg amd64 1.0.2-1 [33.3 kB]
Get:10 http://kali.download/kali kali-rolling/main amd64 nmap-common all 7.80+dfsg1-2kali2 [3952 kB]
Get:11 http://kali.download/kali kali-rolling/main amd64 nmap amd64 7.80+dfsg1-2kali2 [1999 kB]
Get:12 http://kali.download/kali kali-rolling/main amd64 exploitdb all 20200515-0kali1 [27.5 MB]
debconf: delaying package configuration, since apt-utils is not installed
Fetched 44.6 MB in 4s (11.5 MB/s)
Selecting previously unselected package libblas3:amd64.
(Reading database ... 6524 files and directories currently installed.)
Preparing to unpack .../00-libblas3_3.9.0-2_amd64.deb ...
Unpacking libblas3:amd64 (3.9.0-2) ...
Selecting previously unselected package libicu63:amd64.
Preparing to unpack .../01-libicu63_63.2-3_amd64.deb ...
Unpacking libicu63:amd64 (63.2-3) ...
Selecting previously unselected package liblinear4:amd64.
Preparing to unpack .../02-liblinear4_2.3.0+dfsg-4_amd64.deb ...
Unpacking liblinear4:amd64 (2.3.0+dfsg-4) ...
Selecting previously unselected package liblua5.3-0:amd64.
Preparing to unpack .../03-liblua5.3-0_5.3.3-1.1+b1_amd64.deb ...
Unpacking liblua5.3-0:amd64 (5.3.3-1.1+b1) ...
Selecting previously unselected package libssh2-1:amd64.
Preparing to unpack .../04-libssh2-1_1.8.0-2.1_amd64.deb ...
Unpacking libssh2-1:amd64 (1.8.0-2.1) ...
Selecting previously unselected package libssl1.1:amd64.
Preparing to unpack .../05-libssl1.1_1.1.1g-1_amd64.deb ...
Unpacking libssl1.1:amd64 (1.1.1g-1) ...
Selecting previously unselected package libxml2:amd64.
Preparing to unpack .../06-libxml2_2.9.10+dfsg-5_amd64.deb ...
Unpacking libxml2:amd64 (2.9.10+dfsg-5) ...
Selecting previously unselected package libxml2-utils.
Preparing to unpack .../07-libxml2-utils_2.9.10+dfsg-5_amd64.deb ...
Unpacking libxml2-utils (2.9.10+dfsg-5) ...
Selecting previously unselected package lua-lpeg:amd64.
Preparing to unpack .../08-lua-lpeg_1.0.2-1_amd64.deb ...
Unpacking lua-lpeg:amd64 (1.0.2-1) ...
Selecting previously unselected package nmap-common.
Preparing to unpack .../09-nmap-common_7.80+dfsg1-2kali2_all.deb ...
Unpacking nmap-common (7.80+dfsg1-2kali2) ...
Selecting previously unselected package nmap.
Preparing to unpack .../10-nmap_7.80+dfsg1-2kali2_amd64.deb ...
Unpacking nmap (7.80+dfsg1-2kali2) ...
Selecting previously unselected package exploitdb.
Preparing to unpack .../11-exploitdb_20200515-0kali1_all.deb ...
Unpacking exploitdb (20200515-0kali1) ...
Setting up lua-lpeg:amd64 (1.0.2-1) ...
Setting up libssl1.1:amd64 (1.1.1g-1) ...
debconf: unable to initialize frontend: Dialog
debconf: (TERM is not set, so the dialog frontend is not usable.)
debconf: falling back to frontend: Readline
debconf: unable to initialize frontend: Readline
debconf: (Can't locate Term/ReadLine.pm in @INC (you may need to install the Term::ReadLine module) (@INC contains: /etc/perl /usr/local/lib/x86_64-linux-gnu/perl/5.30.0 /usr/local/share/perl/5.30.0 /usr/lib/x86_64-linux-gnu/perl5/5.30 /usr/share/perl5 /usr/lib/x86_64-linux-gnu/perl/5.30 /usr/share/perl/5.30 /usr/local/lib/site_perl /usr/lib/x86_64-linux-gnu/perl-base) at /usr/share/perl5/Debconf/FrontEnd/Readline.pm line 7.)
debconf: falling back to frontend: Teletype
Setting up libicu63:amd64 (63.2-3) ...
Setting up libblas3:amd64 (3.9.0-2) ...
update-alternatives: using /usr/lib/x86_64-linux-gnu/blas/libblas.so.3 to provide /usr/lib/x86_64-linux-gnu/libblas.so.3 (libblas.so.3-x86_64-linux-gnu) in auto mode
Setting up nmap-common (7.80+dfsg1-2kali2) ...
Setting up liblua5.3-0:amd64 (5.3.3-1.1+b1) ...
Setting up libssh2-1:amd64 (1.8.0-2.1) ...
Setting up libxml2:amd64 (2.9.10+dfsg-5) ...
Setting up liblinear4:amd64 (2.3.0+dfsg-4) ...
Setting up libxml2-utils (2.9.10+dfsg-5) ...
Setting up nmap (7.80+dfsg1-2kali2) ...
Setting up exploitdb (20200515-0kali1) ...
Processing triggers for libc-bin (2.30-7) ...
Removing intermediate container ca06b3e4b27f
 ---> a4c12ef59c80
Successfully built a4c12ef59c80
Successfully tagged base:latest
SECURITY WARNING: You are building a Docker image from Windows against a non-Windows Docker host. All files and directories added to build context will have '-rwxr-xr-x' permissions. It is recommended to double check and reset permissions for sensitive files and directories.
{% endhighlight %}

This time when I start up the container:

{% highlight powershell %}
docker run -t -i --privileged base bash
{% endhighlight %}

I can see I have nmap installed.

![nmapDocker.png](\assets\images\SecDevOps\posts\nmapDocker.png)

This is pretty cool, now I can quickly spin up an nmap capable container on demand. 

Taking it a step further, what if I want to execute nmap commands from the docker container without using invoking a shell? I can use CMD:

{% highlight conf %}
# Kali Linux base Image to start all Kali builds with
FROM kalilinux/kali-rolling 
LABEL Description="Base Image to start all Kali builds with" 
RUN apt-get update && apt-get -y install nmap exploitdb
CMD ["/usr/bin/nmap","--version"]
{% endhighlight %}

Now when I run it without the bash shell

{% highlight powershell %}
docker run -t -i -base
{% endhighlight %}

I get the output piped straight into my shell:

{% highlight shell %}
Nmap version 7.80 ( https://nmap.org )
Platform: x86_64-pc-linux-gnu
Compiled with: liblua-5.3.3 openssl-1.1.1d libssh2-1.8.0 libz-1.2.11 libpcre-8.39 nmap-libpcap-1.7.3 nmap-libdnet-1.12 ipv6
Compiled without:
Available nsock engines: epoll poll select
{% endhighlight %}

This is really useful for automated testing at scale, as the Dockerfiles can be dynamically generated with specific tools and commands prepared off of the back of CI/CD triggers. Perhaps more useful however is being able to run a specific tool on demand in docker as an executable, this requires an ENTRYPOINT.

{% highlight conf %}
# Kali Linux Base Image to start all Kali builds with
FROM kalilinux/kali-rolling 
LABEL Description="Base Image to start all Kali builds with" 
RUN apt-get update && apt-get -y install nmap exploitdb
ENTRYPOINT ["/usr/bin/nmap"]
CMD ["--version"]
{% endhighlight %}

The above Dockerfile does the following

1. Locates the Kali base image and pulls it down locally if required
2. Adds a Descriptive Label for humans to read
3. Updates the apt repos and installs nmap and searchsploit  
4. Defines the default execution on a docker run to be `nmap --version`

At this point running

{% highlight powershell %}
docker run -t -i base
{% endhighlight %}

Gives me the output I'm expecting:

{% highlight shell %}
Nmap version 7.80 ( https://nmap.org )
Platform: x86_64-pc-linux-gnu
Compiled with: liblua-5.3.3 openssl-1.1.1d libssh2-1.8.0 libz-1.2.11 libpcre-8.39 nmap-libpcap-1.7.3 nmap-libdnet-1.12 ipv6
Compiled without:
Available nsock engines: epoll poll select
{% endhighlight %}

the __CMD ["--version"]__ represents a default command context which the entry point uses to execute. I can overwrite this with a command of my own.
I want if I wanted to run `/usr/bin/nmap -A -T4 scanme.nmap.org` via docker I can over write `--version` by using the following command:

{% highlight powershell %}
docker run -t -i base -A -T4 scanme.nmap.org
{% endhighlight %}

This works!

{% highlight shell %}
Starting Nmap 7.80 ( https://nmap.org ) at 2020-05-22 13:38 UTC
Warning: 45.33.32.156 giving up on port because retransmission cap hit (6).
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.036s latency).
Other addresses for scanme.nmap.org (not scanned): 2600:3c01::f03c:91ff:fe18:bb2f
Not shown: 996 closed ports
PORT      STATE SERVICE    VERSION
22/tcp    open  ssh        OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 ac:00:a0:1a:82:ff:cc:55:99:dc:67:2b:34:97:6b:75 (DSA)
|   2048 20:3d:2d:44:62:2a:b0:5a:9d:b5:b3:05:14:c2:a6:b2 (RSA)
|   256 96:02:bb:5e:57:54:1c:4e:45:2f:56:4c:4a:24:b2:57 (ECDSA)
|_  256 33:fa:91:0f:e0:e1:7b:1f:6d:05:a2:b0:f1:54:41:56 (ED25519)
80/tcp    open  http       Apache httpd 2.4.7 ((Ubuntu))
|_http-server-header: Apache/2.4.7 (Ubuntu)
|_http-title: Go ahead and ScanMe!
9929/tcp  open  nping-echo Nping echo
31337/tcp open  tcpwrapped
Device type: printer|switch
Running (JUST GUESSING): HP embedded (85%), Dell embedded (85%)
OS CPE: cpe:/h:hp:designjet_650c cpe:/h:dell:powerconnect_5424
Aggressive OS guesses: HP DesignJet 650C printer (85%), Dell PowerConnect 5424 switch (85%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 80/tcp)
HOP RTT     ADDRESS
1   0.03 ms 172.17.0.1
2   1.83 ms 45.33.32.156

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 135.65 seconds
{% endhighlight %}


While this is pretty useful a fully interactive container may be more useful.

Using the following Dockerfile

{% highlight conf %}
# Kali Linux Base Image to start all Kali builds with
FROM kalilinux/kali-rolling 
LABEL Description="Base Image to start all Kali builds with" 
RUN apt-get update && apt-get -y install kali-tools-headless
{% endhighlight %}

I can build all the packages and start a session with Kali tools that don't need a GUI

{% highlight powershell %}
docker build -t headless .
docker run -t -i headless bash  
{% endhighlight %}

Simple! This gives me command line version of Kali with most of the tools needed to complete assessments via automation.
From here I can issue ENTRYPOINTS or CMDs to turn the image executable or simply run a bash shell and login.

Awesome, now I have an on demand kali version of I can run in powershell. This is the end of the Docker series Next post [{{page.next.title}}]({{page.next.url}}) I'm going to look at some other cool stuff around OSCE.


