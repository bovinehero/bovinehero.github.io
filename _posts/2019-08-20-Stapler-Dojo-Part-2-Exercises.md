---
author: bhero
topic: dojo
---

Reconnaissance portion of the Dojo

# Reconnaissance

The key to succeeding in an impact assessment is understanding the story of the target, when you understand the narrative of the system it allows you make leaps of faith during the testing process.

In order to read the story we need to extract information from the system via some reconnaissance. 

First thing's first, we need to find and identify the target. In order to do this we first apply a technique known as network sweeping and then identify it via scanning.

There are several ways that we can sweep a network, the most convenient is via ping sweep. Using standard linux commands, this can be achieved by a simple for loop:

``` bash
for ip in $(seq 1 254); do ping -c 1 192.168.56.$ip; done
```

However, this will take a little time to complete and the output can get a little messy. Our Kali distribution ships with a number of tools that can make this a little easier. While there is a wide selection of specialist tools, the lua written [nmap](https://nmap.org/) offers tactical versatility at the cost of little in specialisation.

While a nmap is a great tool for manual, interactive assessments it also has an extensible api that allows full automation. Third party development has ported much of this functionality into different languages and equivalents can be found in Java, Python and Ruby. While my preference is the CLI version of nmap, the API has allowed creation of a GUI version [zenmap](https://nmap.org/zenmap/) and many tools tools which include additional levels of automation. [SPARTA](https://sparta.secforce.com/) and [metasploit](https://www.metasploit.com/) are good examples of this and both available on your Kali VM. 


## Finding Stapler

To run a pingsweep on our network just like the bash for loop in the setup exercises, we can do the following:

``` bash
nmap -sP 192.168.56.0-255
```

We can also increase the speed to a factor of 5 and run many requests in parallel, below we do this with a little awk magic to filter out results:

``` bash
nmap -T5 --max-parallelism=100 -sP 192.168.56.0/24 | awk -v RS='([0-9]+\\.){3}[0-9]+' 'RT{print RT}'
```

While this approach will return results quickly it is noisy as we are essentially spamming out ping requests at a high rate. Intrusion Detection/Prevention Systems (IDS/IPS) can quickly identify this behaviour and react appropriately. It also runs the risk of DoS-ing a fragile network.

In this case we should be fine and the above command will identify some IP addresses.

With the IPs we have successfully identified get from hits we can perform a more targeted approach to determine the services and hopefully identify the target:

``` bash
nmap ip_address_1,ip_address_2,ip_address_3 ....
```

> Q. What do each of the IP addresses return? Can you determine which IP is 'Stapler'?  

> D. Consider the output, what can you determine about each IP?

## Active Recon

At this point I like to assign a shell variable for the target, an example in Kali is as follows:

``` bash
STAPLER_IP=192.168.56.104
```

From here we can consider using a more agressive stance and look at OS scanning

``` bash
nmap $STAPLER_IP -O
```

port ranges

``` bash
nmap $STAPLER_IP -p 1-1337
```

utlise the scripts in /usr/share/nmap/scripts/, for example to try a default bruteforce login on ssh in very verbose mode:

``` bash
nmap $STAPLER_IP -p 22 --script ssh-brute.nse -vv
```

By default nmap only scans via TCP SYN, but we can specify UDP (-sU flag) and different protocols on specific ports.

``` bash
nmap -sU -pT:21,22,23,U:53 $STAPLER_IP
```

Some other useful flags are:

* -sV: version
* -P0: discovery by ping (no scan)
* -oN -oG -oX  -oS: output for human, grepable, xml and l33tz (takes a filneme arguement)
* -A: Agressive
* -T 0-5: Timing
* -h: help

> Q. Using nmap and the resources below scan the target and take note of what you find.

If you prefere a GUI approach try Zenmap, all the nmap commands can be run in the window.
Next up is [Enumeration](Stapler-Dojo-Part-3-Exercises.html), where we'll look at everything that you found.

## Recommended Resources

* nmap [Official Site](https://nmap.org/)
* SANS Nmap Cheat Sheet v1.0 [pdf](https://blogs.sans.org/pen-testing/files/2013/10/NmapCheatSheetv1.1.pdf)
* High on Coffee Blog: [Nmap Cheat Sheet](https://highon.coffee/blog/nmap-cheat-sheet/)


