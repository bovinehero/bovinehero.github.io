So again our friends over at Zero Bank have some issues with logs. Hack the Gibson and tell me the user who tried to login on Fri Jan 25 02:00:26 EST 2013?

This url has LFI:

http://zero.webappsecurity.com/errors/errors.log

Scrape it to get:

```
Fri Jan 25 02:00:26 EST 2013 [ERROR] [local 10.5.157.10] [com.zero.bank.auth.UserAuthenticator.authenticate(UserAuthenticator.java:51)] - Not possible to authenticate a user with login [faucibus] and password [Sed].
```

Vic du Preez is the author and he is in the readme.txt

Dorks:
zero.webappsecurity.com intext:1.02

or http://zero.webappsecurity.com/readme.txt


Mossad: https://www.shodan.io/search?query=city%3Asunnyvale+port%3A%2280%22+%22It+wasn%27t+us%22


xlsm: upload the file here: https://www.onlinehashcrack.com/tools-online-extract-vba-from-office-word-excel.php

```
flag:N3verG0nnaG1veY000Up
```