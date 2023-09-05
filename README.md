Mongo Scripts
=============

## Description

This repository provide various mongoDB scripts.


## `minMax/` field length

Original idea : [post SO - govin answer](https://stackoverflow.com/questions/26395422/how-to-find-longest-and-shortest-length-of-a-value-for-a-field-in-mongodb)

 - [`minMaxFunctions.js`](./minMax/minMaxFunctions.js) : functions to check min and max length of some field.
 
 - [`example.js`](./minMax/example.js) : sample usage

## Quick example

```shell
$ mongo.exe --host localhost --port 27017 < minMax/example.js
MongoDB shell version (...)
Work on db: mongo-script-test
switched to db mongo-script-test
Load REQUIREMENT : minMaxFunctions.js
true
 * reset myuser data
true
WriteResult({ "nInserted" : 1 })
WriteResult({ "nInserted" : 1 })
 * start myuser data analysis
myuser.count 2
myuser [name].length - min: 3  max: 6
myuser [info].keys.length - min: 1  max: 2
myuser [info][country].length - min: 2  max: 3
myuser [tags].keys.length - min: 1  max: 3
myuser [tags](set).length - min: 2  max: 16
myuser [comments].length - min: 180  max: 180
myuser [comments][*][text].length - min: 14  max: 24
myuser [comments][*][userId] missing
myuser [comments][*][userIDENTITY][name].length - min: 1  max: 14
myuser [properties].keys.length - min: 2  max: 2
myuser [properties](k,v).length - minK: 3  maxK: 5 - minV: 1  maxV: 6
myuser [myBinary].length - min: 16  max: 16
bye
```
 