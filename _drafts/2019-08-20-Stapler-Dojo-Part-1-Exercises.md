---
author: bhero
topic: dojo
---

This is the dojo version of Stapler for use in October 2019

# The Setup

This Dojo aspires to emulate the steps of a full impact pentest on a known vulnerable by design machine called [Stapler](https://www.vulnhub.com/entry/stapler-1,150/). 

This box is one of my favourites on the site as it does a really good job of telling a story and I have a lot of respect for the creator G0tmi1k, his [blog](https://blog.g0tmi1k.com/) really helped me break into this industry.

[Stefano](https://synackfin.tech/) and I will be facilitating the October version of this.

## What is the Dojo?

The exercises are in dojo format, meaning that we'll have a short demo of each tool and allow participants time to explore and discover what additional uses they can from the tool. After a determined period of time we'll pull everyone back in to discuss what we found out. Collaberation is encouraged.

## Prerequisites

You will need an internet connected laptop with at least 4GB of RAM and at least 200GB of Disk Space and that can handle virtualisation. The links provided assume that you are using the current version of VirtualBox. 

Please note all of the screenshots were taken using Virtual Box 5 on a Windows 10 machine. Since VBox 6 the GUI has changed, some of the windows will look different. 

### Installed

Please have these installed prior to attending.

1. Virtual Box - [latest version](https://www.virtualbox.org/wiki/Downloads)
If using Windows, Install this package as administrator to ensure all the virtual drivers get installed.

2. Virtual Box Addons - [latest version](https://download.virtualbox.org/virtualbox/6.0.4/Oracle_VM_VirtualBox_Extension_Pack-6.0.4.vbox-extpack)

3. \[OPTIONAL\] 7zip - [latest version](https://www.7-zip.org/download.html)

If your OS can handle unpacking Zips you do not need 7zip

### VM Downloads

> Make sure that you download the __Virtual Box__ and __not__ the VMware versions of these images.

These are the resources you will need for the Lab, downloading them prior to attending will ensure you have adequete time to complete all exercises. 

1. Kali VM [OVA](https://www.offensive-security.com/kali-linux-vm-vmware-virtualbox-image-download/)
2. VulnHub Image [Stapler](https://download.vulnhub.com/stapler/Stapler.zip)

## Setting up the Lab.

To begin with we will be setting up an incredibly basic Virtual Network using Virtual Box.
There are of course alternatives to this software, but Oracle's Virtual Box is free and convenient package that runs on Windows, Linux and Apple Macs.

## 1. Configure Host Only Adapter Network

In order to get a quick start we are going to hack together a quick host only network. This has the advantage of letting us get to the good stuff quickly but carries the disadvantage of removing their internet access.

By default, when installed, Virtual Box creates a Host Only Adapter which can be used to allow a Host system to connect to its guest VMs. This adapter is a virtual NIC, and as a vNIC it can also can be used to host multiple IP Addresses. We are going to use this capability to host a 2 VM network.

1. From the VirtualBox GUI, select __Host Network Manager__ from the __File__ dropdown.

2. If you don't already have a _VirtualBox Host-Only Etherner Adapter_ select __Create__ to make one. - If you can't create one, you might need to re-install as admin

3. Right click on the __Name__ and select __properties__

![v-adapter.png](/assets/images/Lab-Setup/v-adapter.png)

In the __Adapter__ tab, select __Configure Adapter Automatically__ and _enable the server_ in __DHCP Server__. You can configure the network as you see fit, but the defaults are suitable for our purposes.

At this satge we have completed all the Virtual Box configuration that we need to do to complete the Lab.

## 2. First VM: Import the Kali OVA

I like to run Kali as my base OS on a burner laptop for this stuff, but if that isn't an option this portion of the Lab will cover how to import and configure a Kali Linux Virtual appliance for our network. 

> Please note all of the screenshots here are taken using Virtual Box 5 on a Windows 10 machine. 

Kali Linux  is the spiritual successor to Backtrack and is a Pentesting Framework built on Debian Testing. It has been designed to provide pentesters all the tools they need while removing the hassle of system configuration. By default Kali only comes with the root user, which makes it unsafe to use as a primary OS if you do not know what you are doing. Using Kali as a VM elimiates a lot of this risk as you can still use the Host's OS for your day to day activites.  

An OVA is a is the file type which VirtualBox uses to identify virtual appliances. It is a package that contains files used to describe a virtual machine, which includes an .OVF descriptor file, optional manifest (.MF) and certificate files, and other related files. We are going to import a Kali [OVA](https://www.offensive-security.com/kali-linux-vm-vmware-virtualbox-image-download/) for use in our Lab. 

Via the GUI select __File > Import__ and search for your downloaded Kali OVA. Once selected the appliance's configuration will populate in the settings window. Before you click __Import__  make sure that you __Reinitialize the MAC address of all network cards__. This will prevent networking issues later on.

![ova-import.png](/assets/images/Lab-Setup/ova_import.png)

After a few minutes your Appliance will be ready to power on. Before we do we want to configure a __Host only Adapter__ for some easy networking. Making sure the imported VM is selected click on __Network__ on the right hand side of the GUI. In Adapter 1 Changed the _Attached to:_ dropdown to __Host-only Adapter__ and click OK. 

![host_only.png](/assets/images/Lab-Setup/host_only.png)

This will connect the Appliance to the default Host Only Network on your Host device.

Power On the VM and in the window that pops up, select the __Devices__ menu and __Insert Guest Additions CD image__. All the features will take effect on the next re-boot, but for now log in to the VM using the default credentials of:

* username: root
* password: toor

Check you see if you can connect to the internet by pinging Google and check out your network configuration with the following commands:

``` bash
ping google.com -c 3 && ifconfig
```

Take note of the IP address in eth0. It should be within the subnet specified on the host adapter.

Now you have a full fledged Kali Linux Appliance that you can use for internal assessments.

## 3. Second VM: Import the Stapler OVF.

An OVF is an open file format that defines the specification of a virtual appliance. It basically tells Virtual Box how to build our Victim Machine.

After downloading copy and unzip the Stapler.zip to a place of your choice. Keep the zip, as during the dojo if you totally brick the VM you can do a full remove and quickly rebuild without the need to download. Take a note of its location and go to the VBox GUI

Follow the same steps as before to import the OVF, remembering to __Reinitialize the MAC address of all network cards__.

Stapler.ovf
![stapler_import.jpg](/assets/images/Lab-Setup/stapler_import.png)

Start the VM and when you see the login prompt you will be ready.

This time though we don't have the luxury of being able to login to the server to check the IP address.

From your host you can check via an arp check:

``` bash
arp -a
# sample output
? (192.168.56.104) at 08:00:27:44:61:fc [ether] on vboxnet0
```
or pingsweep:

``` bash
for ip in $(seq 1 254); do ping -c 1 192.168.56.$ip; done
```
WINTEL can use:

``` cmd
FOR /L %i IN (1,1,254) DO ping -n 1 192.168.56.%i | FIND /i "Reply"
```

next up [Scanning](Stapler-Dojo-Part-2.html)