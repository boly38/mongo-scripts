/*global db,use,load */ // provided by mongo shell
// noinspection JSCheckFunctionSignatures    // remove warns (print with back quotes) "Invalid number of arguments, expected 0"

print('Work on db: mongo-script-test');
use mongo-script-test;

print('Load REQUIREMENT : minMaxFunctions.js');
load('minMax/minMaxFunctions.js');

print(' * reset myuser data')
db.myuser.drop()
db.myuser.save({
    "name":"George",
    "info": {
        "country": "fr",
        "children": [
            {"name":"lea"}
        ]
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
        "anotherKey": "valueHere",
        "children": [
            {"name":"joe"},{"name":"jacky"},{"name":"roberto-emilio-santiano-vaskez"}
        ]
    },
    "tags": ["more","complex","userWithTagsHere"],
    "properties": {
        "foo":"fooVal",
        "babar":"b"
    },
    "myBinary" : BinData(0,"aGVsbG8gd29ybGQgaGVyZQ=="),
    "comments": []
});


print(' * start myuser data analysis')

coll="myuser"

if (countCollection(coll)) {
    findMinMax(coll,"name");
    findMinMaxKeys(coll,"info");
    findSubFieldMinMax(coll,"info","country");
    findSubFieldArrayMinMax(coll,"info","children","name");
    findMinMaxKeys(coll,"tags");
    findSetMinMax(coll,"tags");
    findMinMax(coll,"comments");
    findArrayMinMax(coll,"comments","text");
    findArrayMinMax(coll,"comments","userId");
    findArraySubItemMinMax(coll,"comments","userIDENTITY","name");
    findMinMaxKeys(coll,"properties");
    findMapMinMax(coll,"properties");
    findMinMax(coll,"myBinary");
}
