---
layout: post
title:  "Clean Kali Setup for HTB"
categories: KaliSetup
tags: [LabSetup, HyperV, Kali]
thumb: \assets\images\KaliSetup\posts\1920px-Kali_Linux_2.0_wordmark.svg.png
---



In this post I'm going to look at setting up a base Kali image for [HTB](https://www.hackthebox.eu/home).

## Prerequisites

You will need a clean install of Kali Linux, my previous post [{{page.previous.title}}]({{page.previous.url}}) covers how to build one on Hyper-V and that's the image I'm starting from.

You will also need an account for Hack the Box so that you can connect. I won't be covering how to get an account for it here, as that's cheating &#128521; 

If you are really stuck, try looking at the source code.     

## Setting Up the System

### Update the Kali

I do a full clean and upgrade to ensure everything is up to date before I start:

{% highlight bash %}
sudo apt-get clean 
sudo apt-get update 
sudo apt-get upgrade -y 
sudo apt-get dist-upgrade -y
{% endhighlight %}

### Get an IDE

I tend to do all my work from an IDE and for ethical hacking I really like Visual Studio code. It is lightweight and comes with good extensions for a lot of different languages which allows easy context switching. Also with version control build right in, it is easy to save write-ups to a private git repo.

I need to pull the secure keys for the Microsoft code repo and add reference to it to my apt sources.

{% highlight bash %}
curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
{% endhighlight %}

Next I need to refresh my packages and install the software

{% highlight bash %}
sudo apt update
sudo apt install code -y
{% endhighlight %}


### Connect to HTB

Coming Soon!


Next post [{{page.next.title}}]({{page.next.url}}) I'm going to look at tackling a retired box on the platform using this VM.
