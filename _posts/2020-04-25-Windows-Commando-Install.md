---
layout: post
title:  "Windows Commando"
categories: "CommandoSetup"
tags: [LabSetup, HyperV, Windows]
thumb: \assets\images\CommandoSetup\posts\CVM_logo.png
---


Kali is the industry agreed Linux platform for Penetration Testing. While it is an excellent framework, sometimes it can be challenging getting it to fit Windows use-cases. Often it is simpler just to use Windows, in this post I'm going to setup a Windows Commando VM.

## Prerequisites

You will need a genuine copy of windows 10 to follow along, __I DO NOT__ recommend running the Commando configuration on bare metal. The setup scripts really strip out the defenses on the OS, so using Commando as your daily driver can be really risky. __You have been warned!__

At time of writing you will need the following spec:

* Windows 10 1803, 1809, 1903 or 1909 - Windows 7 is no longer supported. Install should work but issues will not be resolved. New tools will not be added but can be manually installed.
* 60 GB Hard Drive
* 2 GB RAM

### The Virtual Machine

Building a VM is beyond the scope of this post. I'm using a gen1 hyper-v machine and windows 10, I wrote [Kali Linux HyperV Style](/kalisetup/Kali-Linux-HyperV-Style.html) outlining how to set up a Kali VM on Hyper-V, the steps can be easily adapted to Windows 10. 

It doesn't really matter which platform you chose, there are plenty to chose from and plenty of guides to follow on how to create them. I don't believe in re-inventing the wheel, nor do I want to sway you in the solution you chose. I repeat, __I DO NOT__ recommend running the Commando configuration on bare metal (although some features will not work as a VM).  

> If you are using Windows to download the image you will need to download the Setup Tool and select the ISO file option to get the image. Pretending to be Linux will let you go straight to the ISO downloads.

As for a new Windows 10 'Machine', I'm using the __Windows.iso__ iso available [here](https://www.microsoft.com/en-gb/software-download/windows10). You may need a valid Activation Key of format (xxxxx-xxxxx-xxxxx-xxxxx-xxxxx) to use images from this source.


### A note about Commando

This is a short read, but loooong install process. The installer script will throw errors during the process but a re-running it _after_ it completes will bring you closer to a full install as dependencies are updated and met. You can reduce the tool-set (I won't be), the Kali Linux subsystem in particular takes a fair chunk of time to finish.

The Commando [repo](https://github.com/fireeye/commando-vm) is basically a powershell script that installs dependencies and packages for a lot of security tools. It runs on an install and forced reboot cycle which can take some time to complete. 

It is still a little experimental, but the install script does a good job of handling issues. It often requires a couple of runs (which are not unattended), but will eventually pick up everything without the need for manual configuration.


![warning.png](\assets\images\CommandoSetup\posts\warning.png)

While this is tedious, we must remember that the base OS is not designed to accommodate the security tools out of the box, in fact Windows has many layers designed to defend against them.

## Going Commando

Download the installer packages from [here](https://github.com/fireeye/commando-vm)

Log into the windows host and open a powershell as an admin.

Run the following commands to allow unrestricted access for the installer and execute it. (see the risk here?!? &#128521;)

{% highlight powershell %}
Unblock-File .\install.ps1
Set-ExecutionPolicy Unrestricted -f
.\install.ps1
{% endhighlight %}


Make sure to turn off Tamper Protection:


![tamperOff.png](\assets\images\CommandoSetup\posts\tamperOff.png)

> More detailed Instructions on how to [Turn off Tamper Protection](https://www.tenforums.com/tutorials/123792-turn-off-tamper-protection-windows-defender-antivirus.html)

The PoSH terminal will through errors as dependencies need to be met, but following the on screen prompts will eventually produces the framework.

First time round it reboots:

![cycle.png](\assets\images\CommandoSetup\posts\cycle.png)

after a few moments it restarts the script:

![restart.png](\assets\images\CommandoSetup\posts\restart.png)

An issue I had was with the command `apt-get -y update --fix-missing && apt-get -y dist-upgrade && exit` when the script was installing the kali linux subsystem:

![dpkg.png](\assets\images\CommandoSetup\posts\dpkg.png)

My network card went into hibernate on the host machine and interrupted the install, doh!

I ran the suggested command to attempt a repair:
{% highlight shell %}
dpkg --configure -a 
{% endhighlight %}

This will take a while.

At various stages, some of the Kali packages may fail. In some cases this will be because the host won't have the "hardware" (Bluetooth for example) or because the packages are not compatible (yet). The Kali packages in the subsystem aren't as big a deal for me as my preference is to use a Kali VM for Linux, but the benefits of having Linux tooling on Windows (curl, wget, ssh etc) make this a worthwhile tool to configure.

Once the command finishes, the installation can continue if I run the following in the Kali subsystem terminal:

{% highlight shell %}
apt-get -y update --fix-missing && apt-get -y dist-upgrade && exit
{% endhighlight %}

This caused the script to time out and fail on the cmd terminal:

![scriptFail.png](\assets\images\CommandoSetup\posts\scriptFail.png)


Full disclosure: I had to run the script once to complete the setup, but it took about 8 hours to complete.

I let the rest of the Kali install, but it doesn't complete the build, if like me you don't see the README.md and the Background Commando you might need to run the script again as admin: 

{% highlight powershell %}
.\install.ps1
{% endhighlight %}

This time it progresses a lot faster, the PoSH terminal will throw and handle errors as it encounters dependencies that it missed the first time round and validates packages that are already installed. 

Following the on screen prompts eventually produces the finished framework:

> As I'm running this on a VM, the Hyper-V tooling is not available and will always throw an error.

Note the README.md and the Background have been set.


![commando.png](\assets\images\CommandoSetup\posts\commandoDesktop.png)

## Wrap Up

During this post we introduced Commando on Windows 10 and took a look at the steps to install it. Next post [{{page.next.title}}]({{page.next.url}}) I'm going to look at building on this image and get set up for [HTB](https://www.hackthebox.eu/home)