// REQUIREMENT : minMaxFunctions.js

use mydb;

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
