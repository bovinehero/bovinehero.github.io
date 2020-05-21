---
layout: post
title:  "Debunking OSCP"
categories: "OffsecMusings"
tags: [Offsec]
thumb: \assets\images\KaliSetup\posts\Group-175@2x-300x270.png
---

A couple of years ago I passed my Offensive Security Certified Professional (OSCP) certification. Often considered __the__ certification to get in the pen-testing space it has a fearsome reputation for being very difficult. In this post I'm looking at debunking some of the myths.

## What is Offensive Security Certified Professional?

The internet will tell you a lot anecdotally about OSCP but the best place to learn about it is the official [PWK/OSCP Site](https://www.offensive-security.com/pwk-oscp/). In summary OSCP is a 2 day exam consisting of a 24 hour practical exam of 5 challenges followed by a further 24 hours to submit your written report of your efforts.

In order to sit the exam, you need to sign up for the Penetration Testing with Kali (PWK) which not only gives you personal training documentation and videos but also access to one of many shared network labs. The course content is excellent as are the scenarios presented in the lab, I've had the good fortune of sampling many different trainings in this area and PWK with OSCP is one of the best available publicly. I thoroughly recommend it for anyone interested in technical security as it exposes you to hacker techniques and teaches hard lessons.

## What will PWK teach me?

It is important to remember that PWK is a foundational course, it covers a lot of different content but does not go too deep. It will not turn you into an elite hacker but it will give you exposure to many of the different techniques needed to perform attacks. The OSCP exam proves that you have sufficient mastery of these techniques and can adapt perform assessments on non standard environments.

The main thing you learn is how to use Kali Linux for pentesting, which is expected as the course is is Pen-Testing With Kali Linux. This isn't a bad thing, Kali is a pretty decent OS, recently it underwent a massive facelift and has become far more user friendly than older iterations. 

At time of writing it does not require exploit development from scratch, although being able to read and edit existing python, perl, C, PoSH, ruby, JS, php and bash is expected. While this seems like a multitude of languages to learn you need only a rudimentary understanding of how to read and where to edit it to customize existing exploits. Prior to sitting PWK I had some exposure to python and bash, by the end I could confidently read and edit all of the above languages.

The biggest thing you learn from PWK is how to __Try Harder__, as so eloquently described [here](https://www.offensive-security.com/offsec/what-it-means-to-try-harder/). It took me 3 attempts to get the certification, each time I became more determined to pass until eventually I tried Hard enough to succeed.


## Why do OSCP?

As I mentioned earlier it took me 3 attempts to get the certification. Each time I became more determined to pass until eventually I Tried Hard enough to succeed.
This is why I recommend it, not because I became a 'l33tz h4xx0r' but because it developed new skills and an attitude which have served me well in my professional career so far. 

For me OSCP was more than a certification, it was a challenge to overcome a marathon to complete or a mountain to climb. I did a lot of reading on it before hand and it's reputation made it something I wanted to achieve. It gave me something to aim for and something to train for, which I really wanted at the time and so I went for it.

At the time I was the first of my peers to sit it, but since then I've met many individuals with different skill sets and the difficulty factor varies. Depending on your experience many of the sections can be trivial to learn and if you've spent considerable time on alternate platforms many of the techniques explored will already be in your repertoire.

Do OSCP if you want to learn something, not if you want a certification it is a measure of a learning journey and not a post to say you made it to the destination. 
Buying one round of training is a hard requirement to sit the exam. So if you want value for money just sign up, a resit costs a fraction of the price and you'll know what to expect next time. If you pass first time... great!

## Will OSCP get me a job?

No, OSCP is great to have on your CV but you get yourself a job. It's my experience that in technology, certifications and education show that you can learn how to do something and will help get you through HR requirements but ultimately individual's make themselves employable. OSCP may get you noticed, but you need to deliver on attitude.

## What Should I do to Prepare?

From the website, all students are required to have:

1. Solid understanding of TCP/IP networking
2. Reasonable Windows and Linux administration experience
3. Familiarity of Bash scripting with basic Python or Perl a plus
 
And to be fair, if you can commit to the lab time then that is enough. If you want more preparation the free [Metasploit Unleashed Course](https://www.offensive-security.com/metasploit-unleashed/) course gives you a good grounding. Platforms like [Try Hack Me](https://tryhackme.com/) and [Hack the Box](https://www.hackthebox.eu/) offer a good way to practice and learn. Try Hack Me is a bit more beginner friendly than Hack the Box but both have great practice resources. The key thing to remember is that PWK (and OSCP) offers a training opportunity, so to get the most out of it you need to be prepared to learn. 

The OSCP certification is notorious for being really difficult and many people fall a foul of the fear of failure here. As a result they over-prepare and don't really get the full value of the PWK training. Check the course pre-requisites, if you think you are close to them you are good to go. 

Worst case if you fail you will still have the PWK training resources, a grounding of the basics and experience of the exam. A re-sit is inexpensive relative to the initial outlay and you will be free to work on the areas you need to improve on to get the cert.

There are of course other resources that specialize in different disciplines, but for most of the challenges in the course I'd recommend searching the web for appropriate techniques. Some folks like to book learn, ones that I found useful were:

1. [Penetration Testing: A Hands-On Introduction to Hacking](https://www.amazon.co.uk/gp/product/1593275641/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=1593275641&linkCode=as2&tag=bovinehero-21&linkId=4bf1565c65d493fcf8a63cac421e43e2) - A little dated now but an excellent addition to your library if you want something to read before you start. It covers most of the basic techniques, but the lab examples are not easy to set up in a Windows 10 world.
2. [Metasploit: The Penetration Tester's Guide](https://www.amazon.co.uk/gp/product/159327288X/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=159327288X&linkCode=as2&tag=bovinehero-21&linkId=a22a8ca0e7ba93e0710dcd92666ed58c) - A lot of folks don't like to use metasploit while training for OSCP, none the less it is an excellent tool for learning how the exploits work and worthwhile read to learn how the framework works.
3. Kali Linux Revealed – Mastering the Penetration Testing Distribution [free Kali Linux Book](https://www.kali.org/download-kali-linux-revealed-book/) - Free e-book and a worth reading, especially if you want to learn _how_ to manage and install Kali.
4. [Nmap Network Scanning: The Official Nmap Project Guide to Network Discovery and Security](https://www.amazon.co.uk/gp/product/0979958717/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0979958717&linkCode=as2&tag=bovinehero-21&linkId=2e755e3b8aad584ddbe0369ae70d1e4d) - Despite being written in 2011, this book still remains one of the most useful guides for nmap. Highly recommended. 

Some folks recommend the [Hacker Playbooks](https://www.amazon.co.uk/gp/product/1980901759/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=bovinehero-21&creative=6738&linkCode=as2&creativeASIN=1980901759&linkId=cb6b2ad0c7fe92414987588356225d45), the [RTFM](https://www.amazon.co.uk/gp/product/1494295504/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=bovinehero-21&creative=6738&linkCode=as2&creativeASIN=1494295504&linkId=a3c2a24d7aad6e643c13208e7a378150) and the [Web Application Hacker's Handbook](https://www.amazon.co.uk/gp/product/1118026470/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=bovinehero-21&creative=6738&linkCode=as2&creativeASIN=1118026470&linkId=6044f5d0496a62693004e5244ba610e0). All excellent resources but not really required for OSCP.

## How hard is it?

Meh! It is hard until it isn't. It took me a year from starting to passing it. In the beginning it was very difficult, but at the time I had little knowledge of the resources available. These days there are many more tools available and a lot of the manual steps can be heavily automated. It is a foundation course, but not a beginner course. The right attitude and good time management will make it easier. Many folks offer 'OSCP Cheat Sheets' and 'OSCP like boxes', in truth the only real OSCP cheat sheet is the one you make for yourself on the course and the OSCP boxes... well they are the ones you sit on the exam.

## In Summary

Hopefully this post has given you a little insight into the OSCP certification and debunked some of the concerns you may have. 

While the course and the labs are both educational and fun, the real value of this certification (for me at least) is the learning experience. For that reason it's my opinion that if you you want to do become OSCP and you think you meet the requirements, then sign up and take the course. I would add the caveat that if you are a beginner, plan to budget for 180 days and an additional resit. 

The first exam attempt and 90 days will give you a good measure of your abilities, if you need more independent study take the second 90 days (or less) and a resit after a break and a little while on other platforms. If you beat the labs and training in under 30 days, you didn't need to take this course.