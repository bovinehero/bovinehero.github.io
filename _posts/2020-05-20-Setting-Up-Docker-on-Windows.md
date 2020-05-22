---
layout: post
title:  "Setting Up Docker on Windows"
categories: "SecDevOps"
tags: [LabSetup, HyperV, Docker]
thumb: \assets\images\SecDevOps\posts\Moby-logo.png
---

This post I'm looking at setting up a PoC Docker image for testing purposes

Working closely with Application Developers opens you eyes as a security professional, understanding the SDLC and applying it to testing and tooling is one of the most cost effective ways to apply good security practices. Just as developers learn security techniques to become more proficient engineers security professionals learning development process will become better at security.

> The full documentation for the tool is available on [docker docs](https://docs.docker.com/docker-for-windows/). Explaining the concepts of Docker is beyond the scope of this post, I'm assuming a little familiarity with the concepts but if you as the reader need more information the full documentation is available [here](https://docs.docker.com/).

## The Pre-requisites

I'm using a Windows 10 system with a decent CPU and 32GB Ram, although you _can_ run with less than 8GB I'd recommend at least 8GB of RAM and a few 100GB of disk space for storage. The system needs to be Hypervisor capable.

This post is covering how to set up Docker on Hyper V, so obviously we need a Windows Host OS with HyperV enabled. 
Before we go onto the next stage we to check if HyperV is installed.

{% highlight powershell %}
systeminfo
{% endhighlight %}

The following response indicates that I have already got it configured (as it was enabled by default during the OS install):

{% highlight shell %}
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
{% endhighlight %}

Running Hyper V by default is a good security practice as it sandboxes your OS giving you a protective layer against attackers. Sometimes this is not practical and it _may_ be disabled, instead of the above message if there is no hypervisor environment you will find the following message in the output: 

{% highlight shell %}
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
{% endhighlight %}

The above components need to be available to enable HyperV. HyperV is a windows feature that can be enabled/disabled via the __Add Remove Windows Features__ tool, how this looks will be a little different depending on your Host's Windows Version, full documentation on this can be found [here](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/).

### Docker

Traditionally Docker and Windows were not friends, the easiest way to create docker images _was_ to kickstart a Linux VM and run it docker through it. This was impractical and required a lot of effort, these days for windows [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows/) does all this for us.

#### A note on Daemon Errors

Before we get into the configuration we should note that sometimes there can be a little bit of a problem getting the daemon to work properly when docker commands are issued:

{% highlight error %}
Error response from daemon: open \\.\pipe\docker_engine_linux: The system cannot find the file specified.
{% endhighlight %}

A restart of the DockerDesktopVM via your Hyper-V Manager and docker service via powershell will usually fix this:

{% highlight powershell %}
Net stop com.docker.service
Net start com.docker.service
{% endhighlight %}

Failing that stop the VM then manually end all the docker tasks in __Task Manager__. Once they have all stopped restart the Docker Desktop App as Admin and try the above commands again.


#### Back to the Install

The desktop app has an easy wizard installer which leverages Hyper-V so that Docker Desktop can act as an abstract layer which managing the VM and provides us with functionality on powershell. 

It also comes with a getting started tutorial:

![dockerD](\assets\images\SecDevOps\posts\dockerD.png)


Skipping that I open a new admin powershell and run the following command to pull down a standard nginx image:

{% highlight powershell %}
docker pull nginxdemos/hello
{% endhighlight %}

This downloads the image

{% highlight shell %}
Using default tag: latest
latest: Pulling from nginxdemos/hello
550fe1bea624: Pull complete                                                                                             d421ba34525b: Pull complete                                                                                             fdcbcb327323: Pull complete                                                                                             bfbcec2fc4d5: Pull complete                                                                                             0497d4d5654f: Pull complete                                                                                             f9518aaa159c: Pull complete                                                                                             a70e975849d8: Pull complete                                                                                             Digest: sha256:f5a0b2a5fe9af497c4a7c186ef6412bb91ff19d39d6ac24a4997eaed2b0bb334
Status: Downloaded newer image for nginxdemos/hello:latest
docker.io/nginxdemos/hello:latest
{% endhighlight %}

And it can be started with:

{% highlight powershell %}
docker run -P -d nginxdemos/hello
{% endhighlight %}


I get the following message:

{% highlight shell %}
ae95a80511b8422ea3635f892b97d563390a399dca406dc0ce0b5484f581662f
{% endhighlight %}

Cool it started, I need to find out the port the container is serving on with a `docker ps` command.  

{% highlight shell %}
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                   NAMES
ae95a80511b8        nginxdemos/hello    "nginx -g 'daemon of…"   14 seconds ago      Up 13 seconds       0.0.0.0:32768->80/tcp   elastic_heisenberg
{% endhighlight %}

In the ports section I can see the container's port 80 has been forwarded to my host's port 32768. If I visit http://127.0.0.1:32768/ i get this:

![nginx](\assets\images\SecDevOps\posts\nginx.png)

We cn also double check via PoSH

{% highlight powershell %}
Invoke-WebRequest -Uri http://127.0.0.1:32768/
{% endhighlight %}

to get:

{% highlight shell %}
StatusCode        : 200
StatusDescription : OK
Content           : <!DOCTYPE html>
                    <html>
                    <head>
                    <title>Hello World</title>
                    <link href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAGPElEQVR42u1bDUyUd
                    Rj/iwpolMlcbZqtXFnNsuSCez/OIMg1V7SFONuaU8P1M...
RawContent        : HTTP/1.1 200 OK
                    Transfer-Encoding: chunked
                    Connection: keep-alive
                    Cache-Control: no-cache
                    Content-Type: text/html
                    Date: Wed, 20 May 2020 18:16:10 GMT
                    Expires: Wed, 20 May 2020 18:16:09 GMT
                    Serv...
Forms             : {}
Headers           : {[Transfer-Encoding, chunked], [Connection, keep-alive], [Cache-Control, no-cache], [Content-Type,
                    text/html]...}
Images            : {@{innerHTML=; innerText=; outerHTML=<IMG alt="NGINX Logo" src="data:image/png;base64,iVBORw0KGgoAA
                    AANSUhEUgAAAWAAAABICAMAAAD/N9+RAAAAVFBMVEUAAAAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAA
                    mQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQDBect+AAAAG3RSTlMAB0AY8SD5SM82v1npsJ/YjSl0EVL
                    ftqllgMdZgsoQAAAHd0lEQVR42szZ6XabMBCG4ZGFxSazLzZz//fZc9I4JpbEN8LQ0/dnGwJ5DJGG0HdpM9kkuzVXiqussmRpLr
                    RdnwqDp9ePyY7zXdFbqptHOz00RTVUxWiyquvJ26Upknp2/heWN0Uyzt3qYtKMn805ybsW/LdK01YVC6sVELH81XJ9o6j5q6Qkc
                    epe83dJp8ipf161HSgm1TyPK5//cuN1d5KmE342bsnkLK6hre78LNG0KuWfOrFDwats69w8ln+qFIlrx9Vxf8808e8eJGx9YEXh
                    CpZ3kX2gfFtbrX4m05IonTE7wsGLnpXY1/Kqr3v/5r+NcAOvy8HXCRt74W+alH568KqCJKmM37LafVhe3ZTU1/mmA7uV9Ar8vPj
                    ZVCPDZI+CDdwFC68yIooZnbhmIAx8XyoZu5mcYO9HzhSo47gGCqR53ULPlAGPkuyazJVeKWYsjH15Djy/VhPO8LoM/OJE4XNfeJ
                    19LUfRj18KF9gLA2GZL4/UsLdFHQVccWyTCDjZD9wm7Kt2PgIgjH3ZBlf46iDgnOO7nwusavZmVoCaPU0q1pcnshyoOwa44PiS6
                    6nANw7U0isbK5x7j3gQB0uPAB54T8WZwA/RHrxhLIx9TbsBnLSfA6uRd9WdBzywCFiNUcJ5wr4eRByu7j8G7nhfpj0LuE0A8Ots
                    SBj7ZooIL+dyYLxFm27+EvfSzgHua/GYXrK3Qol9a03bwNxEAeMt2ix/bptzgCeGwFhY7ouAufwIOA/PSni3nJ8B3DAElgtjXwx
                    s8k+Al/BdiVfDWh0PPDAAjhXGvgTnVjkwujzbk1t4TWkOB24TBBwrjH2JQZnaC6xGsPdCT296MHA/MgKWC2NfL7Blp2ov8AM88/
                    gNbX8osCrc5xMAA2Ho6wIXHTt1+4C1iZwMW8NvzYcCN67vAICBMPZ1galip3QXcAXHXzyVlB8AYyiT5wAYCWNfF1gtYGYWAufhN
                    ynyTWqiDwPOjeelnQiYShMQBr5+YNIWzMwy4CX69afv1NNRwHr07FKEwDT4hTPs6wL7P+tCxQKXm/eifJ963wmMF7hCYWBXGJdp
                    AsBUopkZAyv3j3+i9PUtTa/U9VcAGC1wmgAwFsa+LnBooLxj4K0t2qjo8AAwWuAIAO8TznoSANMEZmYErA14p3EyMF7gSgLAQBj
                    4ImBVg5kZAM/8u4VAJwJ7l+2GADAQBr4A2D+1Z0oMnKM3Y2cD4wUOAANh5IuB6cJOsxg4Q0eeCwwXuFETBnZLDfSVA1NwZsbAJX
                    wN/C+B7771BAAjYeyLgX0z8yACVlawx1NaXh+5TcMLHACGwtgXA6OZ2QUObdGsorfabjIsr4wcNOACB4CBMPLFwOHpcuwx8NWgL
                    XTJURW0H1gtngUOA8cLLz1FAsOZWQ4MfFH5B8CV7x75b4D/NHduS47CMBCVwYFAiDEmCQT+/z/3ZWumah1otZdL/MxMZc5gybJa
                    nU8tLI9DhF8PESXJ10k64PAxyn1LiPisMhr/N8kNHF+bpwPOis95+juS3IJOrsgQYBlXj2mWFVHRgHGC+4pj2kKjbG4ufKGRLmd
                    tTTJgc12WKn1BofE7zBTXzAhwtlIqP9h5gmTAbq1xcHqpvBbHBgRY7suXPTl/ROMB4wR36mUPKjXnNwLcrVxXXimRZTLgDBSiZ1
                    5XYj3XAwAWv3zh7gnAXtIAx6Etnq888cIdX/fZDgDul1tGvf4Vtn0S4M8J7i7ROq1lhCVHzzwGvBpYbJ5AOEgq4EEzZn5K01Mrm
                    qvNOmDTLrft+8FSRzQecFBpO05p26tlnw7oIso14YnJ3i5aL6DF0wMuleqkM4Qn+smcAKRTL1Y65UDQVAO+WK2+7gTplH54usjW
                    AXek+K+LCuxEwGMLul0R4EPFfz8L18zzKmDxIKSCN95LIuBGr3GujpevErqxGQDuLaPuyUAfBAPGg6Mx4OME2DhQVgUJWAIzQnB
                    FfRAeMI5N1XEjBBiwjCxg0+qHYG7wt/GA8capDh+CqYkpCoykjPKWesio2gywEwD4qDEuDNjUJGCptQqUAB5MB3w1APBhg4gYsP
                    QtCbib00Zpi3wrwM1FAOBjR2lrZBXCARY3J623bAS4yAQAPnIYHAOWkgSc2xS+T7MV4CAA8LF2BhiwBAwYP4+lPBsBdgIAH2XIg
                    QHjTf+SrRw5auEAG5Dg9ID3t5TBgM3EWR88eMAVCVieYM5aDXgHUyQAmKiZR9nIFckJC/gFnALUgHew9QKAiZq5A3+EXspDAw7g
                    P64GvIcxXQvfHl2B7tiozSf+y1JSNQ31gRYDQb6HteKQ4B3s4QucflRrDW8OKiHBujCO3s0u5qAjwKR0vnkDozL1emgd5W6EWa1
                    ud7l97G0n3jhYzACOEMlHtVpjeBA/mLf/7IOoQsa7y+b7GDR3Rbw98fKQLy+5xv7VIXowIhy1ztUfbdzLYrz7cbrvRb/K+nf7wP
                    PQpAXsEQ/7l2AXW97/AGkCwaNsIif8zU3y5eZaO/mK/jKDV1s872/Fz11K5TLE1zzEiP1km8ndDMcj3JvmFfqdvubhD8TgHPiN+
                    LViAAAAAElFTkSuQmCC">; outerText=; tagName=IMG; alt=NGINX Logo; src=data:image/png;base64,iVBORw0KG
                    goAAAANSUhEUgAAAWAAAABICAMAAAD/N9+RAAAAVFBMVEUAAAAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAA
                    mQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQDBect+AAAAG3RSTlMAB0AY8SD5SM82v1npsJ/YjSl
                    0EVLftqllgMdZgsoQAAAHd0lEQVR42szZ6XabMBCG4ZGFxSazLzZz//fZc9I4JpbEN8LQ0/dnGwJ5DJGG0HdpM9kkuzVXiqussm
                    RpLrRdnwqDp9ePyY7zXdFbqptHOz00RTVUxWiyquvJ26Upknp2/heWN0Uyzt3qYtKMn805ybsW/LdK01YVC6sVELH81XJ9o6j5q
                    6Qkcepe83dJp8ipf161HSgm1TyPK5//cuN1d5KmE342bsnkLK6hre78LNG0KuWfOrFDwats69w8ln+qFIlrx9Vxf8808e8eJGx9
                    YEXhCpZ3kX2gfFtbrX4m05IonTE7wsGLnpXY1/Kqr3v/5r+NcAOvy8HXCRt74W+alH568KqCJKmM37LafVhe3ZTU1/mmA7uV9Ar
                    8vPjZVCPDZI+CDdwFC68yIooZnbhmIAx8XyoZu5mcYO9HzhSo47gGCqR53ULPlAGPkuyazJVeKWYsjH15Djy/VhPO8LoM/OJE4X
                    NfeJ19LUfRj18KF9gLA2GZL4/UsLdFHQVccWyTCDjZD9wm7Kt2PgIgjH3ZBlf46iDgnOO7nwusavZmVoCaPU0q1pcnshyoOwa44
                    PiS66nANw7U0isbK5x7j3gQB0uPAB54T8WZwA/RHrxhLIx9TbsBnLSfA6uRd9WdBzywCFiNUcJ5wr4eRByu7j8G7nhfpj0LuE0A
                    8OtsSBj7ZooIL+dyYLxFm27+EvfSzgHua/GYXrK3Qol9a03bwNxEAeMt2ix/bptzgCeGwFhY7ouAufwIOA/PSni3nJ8B3DAElgt
                    jXwxs8k+Al/BdiVfDWh0PPDAAjhXGvgTnVjkwujzbk1t4TWkOB24TBBwrjH2JQZnaC6xGsPdCT296MHA/MgKWC2NfL7Blp2ov8A
                    M88/gNbX8osCrc5xMAA2Ho6wIXHTt1+4C1iZwMW8NvzYcCN67vAICBMPZ1galip3QXcAXHXzyVlB8AYyiT5wAYCWNfF1gtYGYWA
                    ufhNynyTWqiDwPOjeelnQiYShMQBr5+YNIWzMwy4CX69afv1NNRwHr07FKEwDT4hTPs6wL7P+tCxQKXm/eifJ963wmMF7hCYWBX
                    GJdpAsBUopkZAyv3j3+i9PUtTa/U9VcAGC1wmgAwFsa+LnBooLxj4K0t2qjo8AAwWuAIAO8TznoSANMEZmYErA14p3EyMF7gSgL
                    AQBj4ImBVg5kZAM/8u4VAJwJ7l+2GADAQBr4A2D+1Z0oMnKM3Y2cD4wUOAANh5IuB6cJOsxg4Q0eeCwwXuFETBnZLDfSVA1NwZs
                    bAJXwN/C+B7771BAAjYeyLgX0z8yACVlawx1NaXh+5TcMLHACGwtgXA6OZ2QUObdGsorfabjIsr4wcNOACB4CBMPLFwOHpcuwx8
                    NWgLXTJURW0H1gtngUOA8cLLz1FAsOZWQ4MfFH5B8CV7x75b4D/NHduS47CMBCVwYFAiDEmCQT+/z/3ZWumah1otZdL/MxMZc5g
                    ybJanU8tLI9DhF8PESXJ10k64PAxyn1LiPisMhr/N8kNHF+bpwPOis95+juS3IJOrsgQYBlXj2mWFVHRgHGC+4pj2kKjbG4ufKG
                    RLmdtTTJgc12WKn1BofE7zBTXzAhwtlIqP9h5gmTAbq1xcHqpvBbHBgRY7suXPTl/ROMB4wR36mUPKjXnNwLcrVxXXimRZTLgDB
                    SiZ15XYj3XAwAWv3zh7gnAXtIAx6Etnq888cIdX/fZDgDul1tGvf4Vtn0S4M8J7i7ROq1lhCVHzzwGvBpYbJ5AOEgq4EEzZn5K0
                    1MrmqvNOmDTLrft+8FSRzQecFBpO05p26tlnw7oIso14YnJ3i5aL6DF0wMuleqkM4Qn+smcAKRTL1Y65UDQVAO+WK2+7gTplH54
                    usjWAXek+K+LCuxEwGMLul0R4EPFfz8L18zzKmDxIKSCN95LIuBGr3GujpevErqxGQDuLaPuyUAfBAPGg6Mx4OME2DhQVgUJWAI
                    zQnBFfRAeMI5N1XEjBBiwjCxg0+qHYG7wt/GA8capDh+CqYkpCoykjPKWesio2gywEwD4qDEuDNjUJGCptQqUAB5MB3w1APBhg4
                    gYsPQtCbib00Zpi3wrwM1FAOBjR2lrZBXCARY3J623bAS4yAQAPnIYHAOWkgSc2xS+T7MV4CAA8LF2BhiwBAwYP4+lPBsBdgIAH
                    2XIgQHjTf+SrRw5auEAG5Dg9ID3t5TBgM3EWR88eMAVCVieYM5aDXgHUyQAmKiZR9nIFckJC/gFnALUgHew9QKAiZq5A3+EXspD
                    Aw7gP64GvIcxXQvfHl2B7tiozSf+y1JSNQ31gRYDQb6HteKQ4B3s4QucflRrDW8OKiHBujCO3s0u5qAjwKR0vnkDozL1emgd5W6
                    EWa1ud7l97G0n3jhYzACOEMlHtVpjeBA/mLf/7IOoQsa7y+b7GDR3Rbw98fKQLy+5xv7VIXowIhy1ztUfbdzLYrz7cbrvRb/K+n
                    f7wPPQpAXsEQ/7l2AXW97/AGkCwaNsIif8zU3y5eZaO/mK/jKDV1s872/Fz11K5TLE1zzEiP1km8ndDMcj3JvmFfqdvubhD8TgH
                    PiN+LViAAAAAElFTkSuQmCC}}
InputFields       : {@{innerHTML=; innerText=; outerHTML=<INPUT onchange=changeCookie() id=check type=checkbox>;
                    outerText=; tagName=INPUT; onchange=changeCookie(); id=check; type=checkbox}}
Links             : {}
ParsedHtml        : System.__ComObject
RawContentLength  : 7218
{% endhighlight %}


Now that I have a fully operational container I can look at getting it onto K8s, I stop the instance via its Container ID:

{% highlight powershell %}
docker stop ae95a80511b8
{% endhighlight %}

Excellent! Now that I have a PoC in play next post [{{page.next.title}}]({{page.next.url}}) I'm going to look into setting up a custom container we can use for auto deployments.