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

While a nmap is a great tool for manual, interactive assessments it also has an extensible api that allows full automation. Third party development has ported much of this functionality into different languages and equivalents can be found in Java, Python and Ruby. While my preference is the CLI version of nmap this open API has allowed creation of a GUI version [zenmap](https://nmap.org/zenmap/) and many tools tools which add additional levels of automation: Tools like [SPARTA](https://sparta.secforce.com/) and [metasploit](https://www.metasploit.com/). 

To run a pingsweep in the same fashon as our for loop, we can do the following:

``` bash
nmap -sP 192.168.56.0-255
```

we can also increase the speed by a factor of 5 and run many requests in parallel, below we do this with a little awk magic to filter out results:

``` bash
nmap -T5 --max-parallelism=100 -sP 192.168.56.0/24 | awk -v RS='([0-9]+\\.){3}[0-9]+' 'RT{print RT}'
```




todos:

1. passive tools, a description
    * find the VM
    * passive interactions

2. slightly aggressive
    * service discovery

3. full on aggressive
    * full scan, with options

tools
* nmap
* browser tools/plugins 
* curl/wget

optional tool ideas
* Burp/Zap

## Recommended Resources

tool websites & blogs


next up [Enumeration](Stapler-Dojo-Part-3-Exercises.html)