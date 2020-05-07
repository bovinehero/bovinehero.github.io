---
layout: post
title:  "Clean Kali Setup for HTB"
categories: KaliSetup
tags: [LabSetup, HyperV, Kali]
thumb: \assets\images\KaliSetup\posts\1920px-Kali_Linux_2.0_wordmark.svg.png
---

In this short post I'm going to look at setting up a base Kali image for [HTB](https://www.hackthebox.eu/home){:target="_blank"}.

## Prerequisites

You will need a clean install of Kali Linux, my previous post [{{page.previous.title}}]({{page.previous.url}}) covers how to build one on Hyper-V and that's the image I'm starting from.

You will also need an account for Hack the Box so that you can connect. I won't be covering how to get an account for it here, as that's cheating &#128521; 

If you are really stuck, try looking at the source code.     

## Setting Up the System

### Update the Kali

I do a full clean and upgrade to ensure everything is up to date before I start:

{% highlight shell %}
sudo apt-get clean 
sudo apt-get update 
sudo apt-get upgrade -y 
sudo apt-get dist-upgrade -y
{% endhighlight %}

### Get an IDE

I tend to do all my work from an IDE and for ethical hacking I really like Visual Studio code. It is lightweight and comes with good extensions for a lot of different languages which allows easy context switching. Also with version control build right in, it is easy to save write-ups to a private git repo.

I need to pull the secure keys for the Microsoft code repo and add reference to it to my apt sources.

{% highlight shell %}
curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
{% endhighlight %}

Next I need to refresh my packages and install the software

{% highlight shell %}
sudo apt update
sudo apt install code -y
{% endhighlight %}

### Additional Tools

Kali's default repos offer access to 1000s of tools, many of which have considerable feature overlap. If you can't find the tools you want in the apt repos, these days the next level tools can readily be found on many a git site. Post IDE install I rarely add anything else on a VM build, I prefer to restore a clean image and reconfigure it as the engagement requires. 

### Connect to HTB

On linux this is trivial, the instructions are on the website and the openvpn tool ships with the standard Kali install by default. I don't have any configuration changes that I _need_ to make on the VM as it has a public IP address. If my username was BovineHero on HTB then the command would look like this:

{% highlight shell %}
sudo openvpn BovineHero.ovpn
{% endhighlight %}

This opens a new tun0 adapter which connects to Hack the Box's network.

I can view the settings with the `ip` command:

{% highlight shell %}
ip address
{% endhighlight %}

It'll look something like this:

![tun0.png](\assets\images\KaliSetup\posts\tun0.png)

Next post [{{page.next.title}}]({{page.next.url}}) I'm going posting my writeup for Popcorn a retired box on the platform using Kali.
