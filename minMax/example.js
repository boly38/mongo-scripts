print('Work on db: mongo-script-test');
use mongo-script-test;

print('Load REQUIREMENT : minMaxFunctions.js');
load('minMax/minMaxFunctions.js');

print(' * reset myuser data')
db.myuser.drop()
db.myuser.save({
    "name":"George",
    "info": {
        "country": "fr"
    },
    "tags": ["oO"],
    "comments": [
        {"text": "george is here", "userIDENTITY": { "id":1234, "name": "o"} },
        {"text": "array of comment is here", "userIDENTITY": { "id":1234, "name": "looooooooooong"} }
    ]
});
db.myuser.save({
    "name":"Ben",
    "info": {
        "country": "usa",
        "anotherKey": "valueHere"
    },
    "tags": ["more","complex","userWithTagsHere"],
    "properties": {
        "foo":"fooVal",
        "babar":"b"
    },
    "myBinary" : BinData(0,"aGVsbG8gd29ybGQgaGVyZQ==")
});


print(' * start myuser data analysis')

if (countCollection("myuser")) {
    findMinMax("myuser","name");
    findMinMaxKeys("myuser","info");
    findSubFieldMinMax("myuser","info","country");
    findMinMaxKeys("myuser","tags");
    findSetMinMax("myuser","tags");
    findMinMax("myuser","comments");
    findArrayMinMax("myuser","comments","text");
    findArrayMinMax("myuser","comments","userId");
    findArraySubItemMinMax("myuser","comments","userIDENTITY","name");
    findMinMaxKeys("myuser","properties");
    findMapMinMax("myuser","properties");
    findMinMax("myuser","myBinary");
}
