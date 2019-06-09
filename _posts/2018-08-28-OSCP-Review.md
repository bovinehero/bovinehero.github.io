---
layout: post
title:  "/Documents/OSCP_Review"
name: OSCP_Review.md
author: bhero
time: "00:01"
description: "review of the OSCP curriculum and exam"
categories: [training, certs]
---

## root@bovinehero:{{ page.title }}$ cat {{ page.name }}

### Offensive Security Certified Professional (OSCP)

About 6 months ago I managed a pass on the OSCP exam.

Pentesting with Kali (PWK) is the official training for the exam, and it is some of the most enjoyable in the business.

The entire course is hands on, it comes with course notes, videos and virtual lab access for either 30,60 or 90 days.

In the lab is universally praised, in it you will have the opportunity to break into around 30 virtual machines.

If you are persistent and #TryHarder, you can pivot into other networks and find additional victims to exploit.

PWK ends with the OSCP challenge, a 24 hour exam where you need to pwn 5 boxes and collect evidence for a report.

Once the practical element is complete you will have an additional 24 hours to submit the report.

A few days later you will know if you have tried hard enough and achieved OSCP.


### My Experience

First and foremost I loved this course, it really challenged me and I learned a lot.

While OSCP is an introductory level course it has a reputation for being difficult.

The reputation is well earned, it took me a year and 3 attempts to pass the exam.

This was not because it was hard, but because I was not ready. 

The [curriculum](https://www.offensive-security.com/information-security-certifications/oscp-offensive-security-certified-professional/) is pretty broad but covers the basics for full stack assessments on systems.

The course content gives you enough to take on the low hanging fruit in the lab, the rest take a bit of research to beat.

Previously I'd had limited exposure to development, C in particular was new to me.

While the content is great, as are the forums and the IRC chat there are a few (basic) things I'd recommend doing first:


* Get comfortable with Python - if you can python you can Ruby or Perl
* Be able to read and understand how a C program builds and runs - Windows and Linux
* Get comfortable with Linux and Windows terminal, scripting is a bonus
* Do [Metasploit Unleashed](https://www.offensive-security.com/metasploit-unleashed/)
* Get and try [Penetration Testing: A Hands-On Introduction to Hacking](https://bulbsecurity.com/products/penetration-testing-book/)
* Try [Hack the Box](https://www.hackthebox.eu/login), but don't sweat it if you get stuck.

> Edit: Zed Shaw has a great series of books Learn X the Hard Way, I found his Python and Ruby books helpful, but really all you need is a bit of practice. Also after OSCP I ended up getting his C book as well.

The real difficulty in OSCP is not the technical stuff, in the mindset and time management.

24 hours is a long time to stay focused, when it comes to the exam have a plan. Take breaks and change focus when you get stuck.

The best advice I can give is to try and enjoy it, the best part is the learning and when it comes to the exams try to have fun.

Good luck and Try Harder!