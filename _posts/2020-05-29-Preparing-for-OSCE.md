---
layout: post
title:  "Preparing for OSCE"
categories: "ExploitDev"
tags: [LabSetup, HyperV, ExploitDev]
thumb: \assets\images\ExploitDev\posts\PBCrichton-Malware-Hazard-Symbol.png.png
---

A while back I got my OSCP, did some Hack the Box and learned some custom exploits. After smashing through the CTP coursework I thought I was hot shit and booked my OSCE exam... I failed. After a break I decided to prepare for it again, this post I'm going to set up my training Lab for round 2.

## OSCE vs OSCP in a nutshell. 

There are loads of reviews for OSCP it is a great course. It looks at a broad scope of assessment techniques and gives students a strong foundation to build on, OSCE is more focused and is often touted as a level up from OSCP as it covers more advanced techniques. 

While I certainly found the OSCE exam more difficult (48 hours for OSCE vs 24 in OSCP) it isn't really a level up, more a specialization in exploit development. Much like medical doctors study medicine not every doctor will specialize in surgery some may look to practice anesthesiology or oncology instead. OSCE is not the same as OSCP, it primarily tests your ability to develop black box exploits (on windows) all of the other stuff takes a back seat. If you really liked the Buffer Overflow content in the PWK course, then this is a natural fit. The big difference is that in OSCE you will need to develop some tooling if you want to pass, passing the exam in manual mode is very difficult.

Many people feel the course is dated, while at time of writing the content IS old it does cover legitimate techniques to build on. I'm a big fan of walking before running and learning the legacy stuff is a great way to build foundations in an area. I really took a lot out of the course which has helped me become a better at my work. While I'd love to see some modernization in the content the course was definitely a worthwhile experience. 

## The Lab Setup

### VMs for Testing
The Cracking the Perimeter (CTP) course is pretty old, it relies on Windows XP and Vista to develop the exploits and Backtrack instead of Kali. This comes with a few challenges, in 2020 legitimate copies of both XP and Vista are very difficult to get a hold of. Windows 7 _is_ still available if you have a product key from [Microsoft](https://www.microsoft.com/en-gb/software-download/windows7) which I found is a suitable substitute for Vista. XP is a little harder to get, while not 100% necessary for practice it does make an appearance in the course. XP's (really, really) legacy browsers offer plenty of exploit opportunities to practice on. Just make sure you get the __x86__ version, __x64__ architecture OS are too modern and makes the learning more difficult.

Building images is a pretty standard task in HyperV and if you can get a hold of XP and Win7 Pro iso files, you can even enable remote desktop. I covered how set up virtual hardware for a Kali VM in this [post](/kalisetup/Kali-Linux-HyperV-Style.html). There is little difference in creating the 'hardware' components but for x86 guest VMs need to be GEN1 and I have specified the following hardware specs:

1. 1024 - 4096 MB RAM (more than 4GB is wasteful)
2. 128 GB HDD (gives a base install plus a little room for programs.)
3. 1 Network Adapter (I had to use a Legacy Adapter for XP)


For the windows VMs once the base Windows OS is installed make sure that updates are disabled and that the network adapter is pointed to an external network switch. This will allow easy downloads for tools. Once everything is installed remapping the VM's network Adapter to point internally will help stop any rogue code getting in or out.

> make sure to disable secure boot options!

When you sign up for CTP Offensive security give you a custom [Backtrack image](http://downloads.kali.org/BT5R3-GNOME-VM-32.7z) for the course. While the course can be completed with Kali the Metasploit version in Kali is more automated than the one in Backtrack. When on engagements this is obviously better it disadvantages learning as some of the code execution is obfuscated in encoding. Forgoing Backtrack isn't a deal breaker, but really helps with the course and so it is worthwhile creating a VM for it. 

The image supplied is optimized for VMWare Workstation/Player, but I can't use that as I'm on HyperV so it needs converted. Luckily [Microsoft Virtual Machine Converter](https://www.microsoft.com/en-gb/download/details.aspx?id=42497) comes with a handy set of tools that can do this for me. The GUI version isn't really optimized for VMWare Workstation/Player it is best with a VMWare ESX server, I don't have this but can leverage the `MvmcCmdlet.psd1` module in powershell. Once I extract the BT5R3-GNOME-VM-32 machine via 7zip All I need to do is import the module and execute conversion commands to get a compatible VHD disk:


{% highlight powershell %}
Import-Module "C:\Program Files\Microsoft Virtual Machine Converter\MvmcCmdlet.psd1"
ConvertTo-MvmcVirtualHardDisk -SourceLiteralPath .\BT5R3-GNOME-VM-32.vmdk -DestinationLiteralPath .\BT5R3-GNOME-VM-32 -VhdType DynamicHardDisk -VhdFormat Vhd
{% endhighlight %}

And it works:

{% highlight powershell %}
Destination                                Source
-----------                                ------
K:\BT5R3-GNOME-VM-32\BT5R3-GNOME-VM-32.vhd .\BT5R3-GNOME-VM-32.vmdk
{% endhighlight %}

Specifying the same hardware requirements as the Windows machines I need only point the Virtual hard disk to point to the `BT5R3-GNOME-VM-32.vhd` file and power it on.


![BT.png](\assets\images\ExploitDev\posts\BT.png)

### Software for Training

First things first, while Backtrack and Kali come with everything you might need to _exploit_ a target they don't have all the tools we need to develop the attack vector. As the exploit development process is against windows targets we need to set up a target app and development environment on our windows machines.

### Windows

1. __Firefox:__ because I'm going to be scraping the open web for tools, first thing I need is a safe(ish) browser, using legacy IE can be dangerous so a [modern version](https://www.mozilla.org/en-GB/firefox/new/) of firefox helps.
2. __Git for Windows:__ I need some way to manage the automation code and tooling that I'll be developing. Setting up a private git repo and pulling it down is very helpful. These days Linux ships with this as standard but I need to get it for windows. I like Git for Windows available [here](https://git-scm.com/download/win)
3. __VulnServer:__ For the target app [Vulnserver](https://github.com/stephenbradshaw/vulnserver) offers a lot of bang for your buck, if you can comfortably beat all the ways in here you are ready for CTP.
4. __Immunity Debugger:__ in CTP [OllyDB](http://www.ollydbg.de/) is the Debugger of choice, but if you've done OSCP then [Immunity Debugger](https://www.immunityinc.com/products/debugger/) is perhaps more familiar and offers a lot of extensibility with python. Its only downside is that it is not available in py3 (yet?!?)
5. __FUZZER__ Spike - boofuzz https://github.com/jtpereyda/boofuzz.git requires Py3 pip install mode: https://boofuzz.readthedocs.io/en/stable/user/install.html#prerequisites py2 https://www.python.org/downloads/release/python-2716/ 
  get boofuzz and do a pip install boofuzz
  get pydbg from here: https://github.com/Fitblip/pydbg 
  get libdasm to install pydasm: https://github.com/jtpereyda/libdasm 
  need C++ compiler for py2
  https://www.microsoft.com/en-us/download/details.aspx?id=44266 
  winpcap: 
  https://www.winpcap.org/install/default.htm 
  winpcap sdk:
  https://www.winpcap.org/devel.htm 

  how to modify: https://github.com/helpsystems/pcapy/wiki/Compiling-Pcapy-on-Windows-Guide 

  pip install typing

6. __Wireshark:__
7. __LordPE:__
8. __Anti Virus:__ AVG Anti Virus
9. __nasm:__ use backtrack / kali for this
10. __msfvenom:__ use backtrack / kali for this


https://www.youtube.com/watch?v=0n3Li63PwnQ&t=30s 

## Bible
* https://tulpa-security.com/2017/07/18...
## Reviews
* https://www.abatchy.com/2017/03/osce-...
* https://jhalon.github.io/OSCE-Review/
* https://netsec.ws/?p=517
* https://sock-raw.org/blog/osce-review/
* https://www.doyler.net/security-not-i...
* https://coffeegist.com/security/my-os...
* https://blog.own.sh/oscp-osce-oswp-re...
* https://stacktrac3.co/osce-review-ctp...
* https://medium.com/@david.valles/the-...
## Practice
* Vulnserver
  - http://www.thegreycorner.com/2010/12/...
  - https://github.com/stephenbradshaw/vu...
  - https://h0mbre.github.io/LTER_SEH_Suc...
  - http://sh3llc0d3r.com/vulnserver-gmon...
  - https://purpl3f0xsec.tech/2019/09/10/...
## Subencoding
* https://marcosvalle.github.io/re/expl...
* http://vellosec.net/2018/08/carving-s...