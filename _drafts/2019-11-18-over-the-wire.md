---
author: bhero
topic: otw
---

Over the wire walkthrough

## Level 0

creds bandit0:bandit0
password is in README.md

``` bash
ssh bandit0@bandit.labs.overthewire.org -p 2220
less readme
boJ9jbbUNNfktd78OOpsqOltutMc3MY1
```

password: boJ9jbbUNNfktd78OOpsqOltutMc3MY1

## Level 1

The password for the next level is stored in a file called - located in the home directory

bandit1:boJ9jbbUNNfktd78OOpsqOltutMc3MY1

Notes `-` is a special character, can't use relative, use absolute and auto complete 

``` bash
ssh bandit1@bandit.labs.overthewire.org -p 2220
less ./-
```

CV1DtqXWVFXTvM2F0k09SHz0YwRINYA9

## Level 2

The password for the next level is stored in a file called spaces in this filename located in the home directory. 

bandit2:CV1DtqXWVFXTvM2F0k09SHz0YwRINYA9

can use autocomplete in bash

``` bash
ssh bandit2@bandit.labs.overthewire.org -p 2220
less spaces\ in\ this\ filename
```

UmHadQclWmgdLOKQ3YNgjWxGoRMb5luK

## Level 3

The password for the next level is stored in a hidden file in the inhere directory.


bandit3:UmHadQclWmgdLOKQ3YNgjWxGoRMb5luK

``` bash
ssh bandit3@bandit.labs.overthewire.org -p 2220
cd inhere/ && ls -la
less .hidden
```

pIwrPrtPN36QITSp3EQaw936yaFoFgAB

## Level 4

The password for the next level is stored in the only human-readable file in the inhere directory. Tip: if your terminal is messed up, try the “reset” command.

bandit4:pIwrPrtPN36QITSp3EQaw936yaFoFgAB

``` bash
ssh bandit4@bandit.labs.overthewire.org -p 2220
cd inhere
file ./-fi*
```

gives:

```
./-file00: data
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data
```

``` bash
less ./-file07
```

koReBOKuIDDepwhWk7jZC0RTdopnAYKh

## Level 5

The password for the next level is stored in a file somewhere under the inhere directory and has all of the following properties:
human-readable
1033 bytes in size
not executable

bandit5:koReBOKuIDDepwhWk7jZC0RTdopnAYKh

```
ssh bandit5@bandit.labs.overthewire.org -p 2220
filename=$(find ./inhere -type f -readable ! -executable -size 1033c)
while read F  ; do
        echo $F
done < $filename
```

DXjZPULLxYr17uwoI01bNLQbtFemEgo7

## Level 6

The password for the next level is stored somewhere on the server and has all of the following properties:

owned by user bandit7
owned by group bandit6
33 bytes in size

bandit6:DXjZPULLxYr17uwoI01bNLQbtFemEgo7

```
ssh bandit6@bandit.labs.overthewire.org -p 2220

filename=$(find . -name data.txt)
while read F  ; do
        echo $F
done < $filename
```

HKBPTKQnIay4Fw76bEy8PVxKEDQRKTzs

## Level 7

The password for the next level is stored in the file data.txt next to the word millionth

bandit7:HKBPTKQnIay4Fw76bEy8PVxKEDQRKTzs

```
ssh bandit7@bandit.labs.overthewire.org -p 2220

filename=$(find . -name data.txt)
while read F  ; do
    if grep "millionth"
        then
            echo $filename
            echo $F
    fi
done < $filename

```

millionth       cvX2JJa4CFALtqS87jk27qwqGhBM9plV

## Level 8

The password for the next level is stored in the file data.txt and is the only line of text that occurs only once

bandit8:cvX2JJa4CFALtqS87jk27qwqGhBM9plV

```
ssh bandit8@bandit.labs.overthewire.org -p 2220
sort data.txt | uniq -u

```

UsvVyFSfZZWbi6wgC7dAFyFuR6jQQUhR

## Level 9

The password for the next level is stored in the file data.txt and is the only line of text that occurs only once

bandit9:UsvVyFSfZZWbi6wgC7dAFyFuR6jQQUhR

```
ssh bandit9@bandit.labs.overthewire.org -p 2220
strings data.txt | grep ^"=="
```

truKLdjsbJ5g7yyJ2X2R0o3a5HQJFuLk

## Level 10

The password for the next level is stored in the file data.txt, which contains base64 encoded data

bandit10:truKLdjsbJ5g7yyJ2X2R0o3a5HQJFuLk

``` bash
ssh bandit10@bandit.labs.overthewire.org -p 2220
cat data.txt | base64 --decode
```

IFukwKGsFW8MOq3IRFqrxE1hxTNEbUPR


## Level 11

The password for the next level is stored in the file data.txt, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions

bandit11:IFukwKGsFW8MOq3IRFqrxE1hxTNEbUPR


``` bash
ssh bandit11@bandit.labs.overthewire.org -p 2220
less data.txt
```
gives:

```
Gur cnffjbeq vf 5Gr8L4qetPEsPk8htqjhRK8XSP6x2RHh
```

Need a ROT 13 cipher algo

``` bash
less data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

```
The password is 5Te8Y4drgCRfCx8ugdwuEX8KFC6k2EUu
```

5Te8Y4drgCRfCx8ugdwuEX8KFC6k2EUu

## Level 12

The password for the next level is stored in the file data.txt, which is a hexdump of a file that has been repeatedly compressed. For this level it may be useful to create a directory under /tmp in which you can work using mkdir. For example: mkdir /tmp/myname123. Then copy the datafile using cp, and rename it using mv (read the manpages!)

bandit12:5Te8Y4drgCRfCx8ugdwuEX8KFC6k2EUu

``` bash
ssh bandit12@bandit.labs.overthewire.org -p 2220
less data.txt # hexdump of file
file data.txt # shows data.txt: ASCII text
mkdir /tmp/ggrant && cp ./data.txt /tmp/ggrant && cd /tmp/ggrant
xxd data.txt # gives bin data ok!
xxd -r data.txt > outfile #write to file
file outfile #outfile: gzip compressed data, was "data2.bin", last modified: Tue Oct 16 12:00:23 2018, max compression, from Unix
zcat outfile > outfile_rev #put compressed file into a file
file outfile_zcat #outfile_zcat: bzip2 compressed data, block size = 900k
bzip2 -d outfile_zcat #bzip2: Can't guess original name for outfile_zcat -- using outfile_zcat.out
file outfile_zcat.out #outfile_zcat.out: gzip compressed data, was "data4.bin", last modified: Tue Oct 16 12:00:23 2018, max compression, from Unix
zcat outfile_zcat.out > outfile_rev2
file outfile_rev2 #outfile_rev2: POSIX tar archive (GNU)
tar xvf outfile_rev2 #data5.bin
file data5.bin #data5.bin: POSIX tar archive (GNU)
tar xvf data5.bin #data6.bin
file data6.bin #data6.bin: bzip2 compressed data, block size = 900k
bzip2 -d data6.bin #bzip2: Can't guess original name for data6.bin -- using data6.bin.out
file data6.bin.out #data6.bin.out: POSIX tar archive (GNU)
tar xvf data6.bin.out #data8.bin
file data8.bin #data8.bin: gzip compressed data, was "data9.bin", last modified: Tue Oct 16 12:00:23 2018, max compression, from Unix
zcat data8.bin > outfile_rev3
file outfile_rev3 #outfile_rev3: ASCII text
less outfile_rev3 #The password is 8ZjyCRiBWFYkneahHwxCv3wb2a1ORpYL
```

8ZjyCRiBWFYkneahHwxCv3wb2a1ORpYL


## Level 13

The password for the next level is stored in /etc/bandit_pass/bandit14 and can only be read by user bandit14. For this level, you don’t get the next password, but you get a private SSH key that can be used to log into the next level. Note: localhost is a hostname that refers to the machine you are working on

bandit13:8ZjyCRiBWFYkneahHwxCv3wb2a1ORpYL

``` bash
ssh bandit13@bandit.labs.overthewire.org -p 2220
less sshkey.private
```

gives 

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAxkkOE83W2cOT7IWhFc9aPaaQmQDdgzuXCv+ppZHa++buSkN+
gg0tcr7Fw8NLGa5+Uzec2rEg0WmeevB13AIoYp0MZyETq46t+jk9puNwZwIt9XgB
ZufGtZEwWbFWw/vVLNwOXBe4UWStGRWzgPpEeSv5Tb1VjLZIBdGphTIK22Amz6Zb
ThMsiMnyJafEwJ/T8PQO3myS91vUHEuoOMAzoUID4kN0MEZ3+XahyK0HJVq68KsV
ObefXG1vvA3GAJ29kxJaqvRfgYnqZryWN7w3CHjNU4c/2Jkp+n8L0SnxaNA+WYA7
jiPyTF0is8uzMlYQ4l1Lzh/8/MpvhCQF8r22dwIDAQABAoIBAQC6dWBjhyEOzjeA
J3j/RWmap9M5zfJ/wb2bfidNpwbB8rsJ4sZIDZQ7XuIh4LfygoAQSS+bBw3RXvzE
pvJt3SmU8hIDuLsCjL1VnBY5pY7Bju8g8aR/3FyjyNAqx/TLfzlLYfOu7i9Jet67
xAh0tONG/u8FB5I3LAI2Vp6OviwvdWeC4nOxCthldpuPKNLA8rmMMVRTKQ+7T2VS
nXmwYckKUcUgzoVSpiNZaS0zUDypdpy2+tRH3MQa5kqN1YKjvF8RC47woOYCktsD
o3FFpGNFec9Taa3Msy+DfQQhHKZFKIL3bJDONtmrVvtYK40/yeU4aZ/HA2DQzwhe
ol1AfiEhAoGBAOnVjosBkm7sblK+n4IEwPxs8sOmhPnTDUy5WGrpSCrXOmsVIBUf
laL3ZGLx3xCIwtCnEucB9DvN2HZkupc/h6hTKUYLqXuyLD8njTrbRhLgbC9QrKrS
M1F2fSTxVqPtZDlDMwjNR04xHA/fKh8bXXyTMqOHNJTHHNhbh3McdURjAoGBANkU
1hqfnw7+aXncJ9bjysr1ZWbqOE5Nd8AFgfwaKuGTTVX2NsUQnCMWdOp+wFak40JH
PKWkJNdBG+ex0H9JNQsTK3X5PBMAS8AfX0GrKeuwKWA6erytVTqjOfLYcdp5+z9s
8DtVCxDuVsM+i4X8UqIGOlvGbtKEVokHPFXP1q/dAoGAcHg5YX7WEehCgCYTzpO+
xysX8ScM2qS6xuZ3MqUWAxUWkh7NGZvhe0sGy9iOdANzwKw7mUUFViaCMR/t54W1
GC83sOs3D7n5Mj8x3NdO8xFit7dT9a245TvaoYQ7KgmqpSg/ScKCw4c3eiLava+J
3btnJeSIU+8ZXq9XjPRpKwUCgYA7z6LiOQKxNeXH3qHXcnHok855maUj5fJNpPbY
iDkyZ8ySF8GlcFsky8Yw6fWCqfG3zDrohJ5l9JmEsBh7SadkwsZhvecQcS9t4vby
9/8X4jS0P8ibfcKS4nBP+dT81kkkg5Z5MohXBORA7VWx+ACohcDEkprsQ+w32xeD
qT1EvQKBgQDKm8ws2ByvSUVs9GjTilCajFqLJ0eVYzRPaY6f++Gv/UVfAPV4c+S0
kAWpXbv5tbkkzbS0eaLPTKgLzavXtQoTtKwrjpolHKIHUz6Wu+n4abfAIRFubOdN
/+aLoRQ0yBDRbdXMsZN/jvY44eM+xRLdRVyMmdPtP8belRi2E2aEzA==
-----END RSA PRIVATE KEY-----
```

set permissions locally

``` cmd
set key="sshkey.private"
cmd /c icacls %key% /c /t /inheritance:d
cmd /c icacls %key% /c /t /grant %username%:F
cmd /c icacls %key%  /c /t /remove Administrator "Authenticated Users" BUILTIN\Administrators BUILTIN Everyone System Users
cmd /c icacls %key%
```

login via:

```
ssh bandit14@bandit.labs.overthewire.org -i sshkey.private -p 2220
find / -user bandit14  -size 33c 2>&1 | grep -v "Permission denied"
less /etc/bandit_pass/bandit14
```

4wcYUJFw0k0XLShlDzztnTBHiqxU3b3e


## Level 14

The password for the next level can be retrieved by submitting the password of the current level to port 30000 on localhost.

login via:

```
ssh bandit14@bandit.labs.overthewire.org -i sshkey.private -p 2220
nc localhost 30000 < /etc/bandit_pass/bandit14
```

gives:

```
Correct!
BfMYroe26WYalil77FoDi9qh59eK5xNr
```

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDGSQ4TzdbZw5PshaEVz1o9ppCZAN2DO5cK/6mlkdr75u5KQ36CDS1yvsXDw0sZrn5TN5zasSDRaZ568HXcAihinQxnIROrjq36OT2m43BnAi31eAFm58a1kTBZsVbD+9Us3A5cF7hRZK0ZFbOA+kR5K/lNvVWMtkgF0amFMgrbYCbPpltOEyyIyfIlp8TAn9Pw9A7ebJL3W9QcS6g4wDOhQgPiQ3QwRnf5dqHIrQclWrrwqxU5t59cbW+8DcYAnb2TElqq9F+BiepmvJY3vDcIeM1Thz/YmSn6fwvRKfFo0D5ZgDuOI/JMXSKzy7MyVhDiXUvOH/z8ym+EJAXyvbZ3 rudy@localhost 
```


BfMYroe26WYalil77FoDi9qh59eK5xNr
## Level 15

bandit15:BfMYroe26WYalil77FoDi9qh59eK5xNr