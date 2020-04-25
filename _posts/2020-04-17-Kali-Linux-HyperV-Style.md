---
layout: post
title:  "Kali Linux HyperV Style"
categories: "KaliSetup"
tags: [LabSetup, HyperV]
thumb: \assets\images\KaliSetup\posts\1920px-Kali_Linux_2.0_wordmark.svg.png
---

Sometimes I run Kali in HyperV, because I have a beefy windows 10 (professional) laptop and also why the hell not?!? 
This post I'm going to build out a HyperV Kali VM from the base image available from Offensive Security. 

## Prerequisites

Once you have these on your system, we can start building.

1. Kali Image, I'm using the __Kali Linux 64-Bit (Installer) 2020.1b__ iso, but the latest builds are available [here](https://www.kali.org/downloads/).
2. You will need [HyperV](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/) and [Remote Desktop](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients).
I'm using Windows 10 Pro, so I have the native windows clients for these built in.


## HyperV vs VMWare Player and Virtual Box

Before I begin, we should note that there are a few differences between HyperV and other popular virtualization platforms like VMWare or VirtualBox. Purists will point out that these platforms have been optimized and don't _quite_ fit this model anymore, historically both VMWare and VirtualBox were Type2 hypervisors. What this means is that they use a hypervisor engine which manages virtualization on top of the base OS. For the sake of simplicity we can think of these as running the hypervisor software and it's VMs at the same logic level as applications. 

![Type2.png](\assets\images\KaliSetup\posts\Type2.png)

HyperV isn't software that runs on top of the 'host' OS, it abstracts out the Host OS to be a 'Parent' VM that we can use for admin functions: 

![micro.png](\assets\images\KaliSetup\posts\micro.png)

> When I talk about Host VMs, I am referring to the Parent or Admin VM, while technically they are different, functionally they perform the same role in most cases. The Guests are all the other VMs managed by the hypervisor. 

This technique turns HyperV into a Type1 hypervisor which not only exposes more hardware resources for the VMs but also offers logical sand-boxing increasing security. The main problem with this approach is that the host machine is now a VM, which means it is very, very difficult to use other virtualization platforms at the same time as HyperV.

Anecdotally I've noticed better performance than with VMWare and VirtualBox but the actual mileage varies depending on your base hardware and the Guests. These days I'm using HyperV because once it is set up it feels more like using genuine machines. 

Before we go onto the next stage we need HyperV installed. This can be configured via [here](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/) .

## Setup the Virtual Hardware

First we need a Virtual switch manager for our server, so open __Hyper-V Manager__ and select the server you want to connect to. In my case this is my Laptop is the only server I can connect to.

Right click on it and select __New__, __Virtual Switch Manager__, __New virtual network switch__ and as I'll be wanting a host that can connect to the HTB Labs I'll be selecting an __External__ Virtual Switch.

![vsm.png](\assets\images\KaliSetup\posts\vsm.png)

Next I need to make a Virtual Machine, I go to the server again and right click on it and select __New__, __Virtual Machine__.

This starts the wizard.

![wiz.png](\assets\images\KaliSetup\posts\wiz.png)

I follow the wizard, specifying where I want to store the VM details.

![vmLocation.png](\assets\images\KaliSetup\posts\vmLocation.png)

I specify __gen2__ because I want all the performance benefits that my OS supports and I'm using the 2020 version of Kali. However, older OS versions like XP, Win7 and 32 Bit may require gen1 mode.

![gen2.png](\assets\images\KaliSetup\posts\gen2.png)

Next is the memory, I want a beefy machine for this and can cope with a __16GB__ VM.

![mem.png](\assets\images\KaliSetup\posts\mem.png)

I select the __External__ network I set up previously.

![net.png](\assets\images\KaliSetup\posts\net.png)

I take the defaults for the storage as I'm not anticipating keeping a lot of data on this VM.

![store.png](\assets\images\KaliSetup\posts\store.png)

I go to the __kali-linux-2020.1b-installer-amd64.iso__ I previously downloaded and select it as the iso I want to use.

![iso.png](\assets\images\KaliSetup\posts\iso.png)

After reviewing the settings in the Summary, I select Finish to build the hardware.

And I get a finished bare bones guest called Kali ready for me to install.

## Advanced Hardware [OPTIONAL]
It's best to do all the Hardware configuration __BEFORE__ you install the OS, this way the installer will pick up what it can automatically and you don't need to organize anything at the OS level later on. I want to use the power of my graphics card to make the system work better. The following items are things you might want to consider before we install Kali, my build skips all of these and jumps to [Power On!](#powerOn)

### GPU forwarding for RemoteFX  

RemoteFX is a deprecated feature as of Windows 10/Server 2019, we can't use it by default via the GUI.

![noRemFX.png](\assets\images\KaliSetup\posts\noRemFX.png)

If I really want to use it (because I can't get RDP for example) as its easier than messing around with my drivers on the host.
We aren't running production servers for multiple users, so this could be a good way to manage our VMs in a pinch and also makes use of the GPU I have in my Laptop.
Because it is no-longer supported, I can't enable this in the GUI but can via powershell. 

First I want to check my card supports it and is on:

{% highlight ps %}
Get-VMRemoteFXPhysicalVideoAdapter
{% endhighlight %}

And it does:

```
# REDACTED #
Name                        : NVIDIA GeForce GTX 1070
# REDACTED #
Enabled                     : True
CompatibleForVirtualization : True
# REDACTED #

```

I Enable Host GPU for RemoteFX vGPU

{% highlight ps %}
Enable-VMRemoteFXPhysicalVideoAdapter "NVIDIA GeForce GTX 1070"
{% endhighlight %}

I can check the VM names I want to make this available to with `Get-VM` but I know that its called Kali, so I run:

{% highlight ps %}
Add-VMRemoteFx3dVideoAdapter -VMName "Kali"
{% endhighlight %}


> If I want to disable this at a later date I can use `Disable-VMRemoteFXPhysicalVideoAdapter "NVIDIA GeForce GTX 1070"`

This allows me to configure Advanced features RemoteFX 3D Video Adapter, like 8 monitors!

![remFX.png](\assets\images\KaliSetup\posts\remFX.png)

I don't need that many, and I'll be using standard RDP, but it is good to know we can use some customization on the default remote client.

### Second NIC

Sometimes I also like to have a secondary NIC for the default network, this lets me easily test against local machines.

On the machine settings, I select __Add Hardware__

![2ndNic.png](\assets\images\KaliSetup\posts\2ndNic.png)

Pick __Network Adapter__ with __Default Switch__. 

![2ndNicConfig.png](\assets\images\KaliSetup\posts\2ndNicConfig.png)

Once I select apply I get a second Network card.

### Other Items

At this point I'm happy to start the Kali install, but I _could_ look at setting up a network share, or tweaking the processors but at this point I really don't need to, this VM will be for use in [HTB](https://www.hackthebox.eu/home) all the extras are overkill at this stage.

## <a name="powerOn"></a> Power On!

Happy with this I make sure to un-check the secure boot option so that I can install Kali:

![secBoot.png](\assets\images\KaliSetup\posts\secBoot.png)

I power on the VM in the main menu to check everything works and select __Graphic Install__ to kick it off...

Not re-inventing the wheel on this page, the official guide is [here](https://www.kali.org/docs/base-images/kali-linux-hard-disk-install/) and will keep you right better than I ever could.

I had some graphical glitches until I got the system installed, but opted for the standard 2020 packages:

![default.png](\assets\images\KaliSetup\posts\default.png)


Once the installer completes I'm left with a fully functional kali machine.

![kaliVM.png](\assets\images\KaliSetup\posts\kaliVM.png)


## Remote Desktop

At this point I _could_ finish up, but the problem with HyperV is that the default RDP client is a little poor on features and doesn't scale desktop resizes so well. It is really only designed to enable you to login for admin purposes, I need is something closer to a multi-screen desktop experience. For that teh HypeV Manager viewer just won't cut it, I'll need to set up either RDP or VNC. My preference from a windows host is RDP as its a native to the OS and requires only a little additional configuration.

On windows hosts this is fairly trivial, but on linux we need to install some software. After logging in I pop a terminal and run the following command to install an rdp server on Kali:

{% highlight bash %}
sudo apt install xrdp -y
{% endhighlight %}

Next I want to ensure it works, first i take note of the IP address `192.168.0.47` via the `ifconfig` command. I'll need this to connect from my Host to the Kali guest.

root logins over RDP are not a good idea, you may want to create an admin user if you have not already done so.

Next I run the following commands in order to start the RDP service now and on every reboot:

{% highlight bash %}
sudo service xrdp start
sudo service xrdp-sesman start
update-rc.d xrdp enable
{% endhighlight %}

Once that completes I log out of the Virtual Machine Connection and go to the RDP program in windows, and try to connect to VM's IP address and to get to the session login page.

![xorg.png](\assets\images\KaliSetup\posts\xorg.png)


With the Xorg session I can login with the same user credentials I supplied when I set up my Kali OS, but a single screen isn't going to be enough.

Fortunately The rdp client has the option to use all of your screens for RDP connections, but this is overkill I only need want 2 screens. The GUI only has an all or none solution here, I only want to apply 2 screens. I need to create a custom config file to do this.

I click the show options to allow me to use a custom config file:

![rdp.png](\assets\images\KaliSetup\posts\rdp.png)

Because I've already attempted to connect there is a Default.rdp file in My Documents Folder.

it looks like this:

```
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,1,-3229,-897,-1292,-251
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.0.47
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
drivestoredirect:s:
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
```

In order to use more than one monitor I need to set `use multimon:i:1` and `selectedmonitors:` to the monitors I want to use.

using `mstsc.exe /l` helps to identify the values I want:

![mstsc_l.png](\assets\images\KaliSetup\posts\mstsc_l.png)

`selectedmonitors:s:1,3` is the new value and for quickness I add `full address:s:192.168.0.47` so that it auto-populates the GUI. My config now looks like this:

```
screen mode id:i:2
use multimon:i:1
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,1,-3229,-897,-1292,-251
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:192.168.0.47
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
drivestoredirect:s:
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
selectedmonitors:s:1,3
```

Sometimes the monitor identities change on host reboots and depending on how the IP Address is managed it _can_ change, stabilizing these isn't really a priority for this tutorial as it is a minor thing to correct if I have issues getting on to the machine. 

Now the login spans 2 screens, and when I login I'm met with an authentication challenge:

![multiMonKali.png](\assets\images\KaliSetup\posts\multiMonKali.png)

I need to provide elevated credentials in order to complete the display profile setup. I do this and the Kali VM is ready.

## 'Backup' the VM

This machine is destined to be my base 'backup' image, so the last thing I want do is make a snapshot. Microsoft uses a term checkpoint for quick rollback snapshots, while this is useful I want to keep a full clone of this build in case I need to go a different way with the tooling configurations.

I do this using the __Export__ function, but first I need to power off the VM. So I log out of RDP and Power off the VM in the __Hyper-V Manager__.
This triggers a Merging for the VM, which acts as the starting point of the VM next time. Next I select __Export__ in Kali in the Actions pane.

![export.png](\assets\images\KaliSetup\posts\export.png)

This triggers an Exporting Status for the Kali VM, which when complete gives me a backup I can Import.


## Wrap Up

During this post we looked at how to set up a base Kali VM for HTB on Windows 10 Professional using HyperV. 
We configured some virtual hardware, looked at some optional additions for GPU and an extra NIC. 
Next we configured RDP from a post install of the Kali OS on our hardware and finally we made a backup image for use in the future.

Next post [{{page.next.title}}]({{page.next.url}}) I'm going to look at building on this image and get set up for [HTB](https://www.hackthebox.eu/home)