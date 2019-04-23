

function countCollection(collName) {
    var coll = db.getCollection(collName);
    var count = coll.count();
    print(collName + ".count " + count);
    return count > 0;
}

function getValueLength(myValue) {
    if (myValue instanceof BinData) {
      return myValue.length();
    } else if (myValue instanceof ObjectId) {
      return myValue.str.length;
    } else if (myValue instanceof Object) {
      return Object.bsonsize(myValue);
    } else {
      return myValue.length;
    }
}

// print min and max length of a given field in a collection
//   field.length for a string
//   or array size for and array field
function findMinMax(collName, fieldName) {
    var coll = db.getCollection(collName);
    var min, max;

    coll.find().forEach(function(doc) {
        var curField = doc[fieldName];
        if (curField == undefined) {
          return;
        }
        var currentLength = getValueLength(curField);
        if ((max == undefined) || currentLength > max) {
          max = currentLength;
        }
        if ((min == undefined) || currentLength < min) {
          min = currentLength;
        }
    });

    if (min == undefined) {
       print(collName + " [" + fieldName + "] missing");
    } else {
       print(collName + " [" + fieldName + "].length - min: " + min + "  max: " + max);
    }
}

function findSubFieldMinMax(collName, fieldName, subFieldName) {
    var coll = db.getCollection(collName);
    var min, max;

    coll.find().forEach(function(doc) {
        var curField = doc[fieldName];
        if (curField == undefined) {
          return;
        }
        curField = curField[subFieldName];
        if (curField == undefined) {
          return;
        }
        var currentLength = getValueLength(curField);
        if ((max == undefined) || currentLength > max) {
          max = currentLength;
        }
        if ((min == undefined) || currentLength < min) {
          min = currentLength;
        }
    });

    if (min == undefined) {
       print(collName + " [" + fieldName + "][" + subFieldName + "] missing");
    } else {
       print(collName + " [" + fieldName + "][" + subFieldName + "].length - min: " + min + "  max: " + max);
    }
}

// print min and max length of a given field of an array field in a collection
//  field.length for a string
//  or array size for and array field
function findArrayMinMax(collName, arrayField, itemFieldName) {
    var coll = db.getCollection(collName);
    var min, max;

    coll.find().forEach(function(doc) {
        var curArray = doc[arrayField];
        if (curArray == undefined) {
          return;
        }
        curArray.forEach(function(arrayEntry) {
            var curField = arrayEntry[itemFieldName];
            if (curField == undefined) {
              return;
            }
            var currentLength = getValueLength(curField);
            if ((max == undefined) || currentLength > max) {
              max = currentLength;
            }
            if ((min == undefined) || currentLength < min) {
              min = currentLength;
            }
        });
    });

    if (min == undefined) {
       print(collName + " [" + arrayField+ "][*][" + itemFieldName + "] missing");
    } else {
       print(collName + " [" + arrayField+ "][*][" + itemFieldName + "].length - min: " + min + "  max: " + max);
    }
}

function findArraySubItemMinMax(collName, arrayField, itemFieldName, subItemFieldName) {
    var coll = db.getCollection(collName);
    var min, max;

    coll.find().forEach(function(doc) {
        var curArray = doc[arrayField];
        if (curArray == undefined) {
          return;
        }
        curArray.forEach(function(arrayEntry) {
            var curField = arrayEntry[itemFieldName];
            if (curField == undefined) {
              return;
            }
            curField = curField[subItemFieldName];
            if (curField == undefined) {
              return;
            }
            var currentLength = getValueLength(curField);
            if ((max == undefined) || currentLength > max) {
              max = currentLength;
            }
            if ((min == undefined) || currentLength < min) {
              min = currentLength;
            }
        });
    });

    if (min == undefined) {
       print(collName + " [" + arrayField+ "][*][" + itemFieldName + "][" + subItemFieldName + "] missing");
    } else {
       print(collName + " [" + arrayField+ "][*][" + itemFieldName + "][" + subItemFieldName + "].length - min: " + min + "  max: " + max);
    }
}


// print min and max length of a keys,values field of a map field in a collection
function findMapMinMax(collName, mapField) {
    var coll = db.getCollection(collName);
    var minK, maxK;
    var minV, maxV;

    coll.find().forEach(function(doc) {
        var curMap = doc[mapField];
        if (curMap == undefined) {
          return;
        }
        Object.keys(curMap).forEach(function(key) {
            var currentKLength = key.length;
            if ((maxK == undefined) || currentKLength > maxK) {
              maxK = currentKLength;
            }
            if ((minK == undefined) || currentKLength < minK) {
              minK = currentKLength;
            }

            var value = curMap[key];
            if (value == undefined) {
              return;
            }
            var currentVLength = getValueLength(value);
            if ((maxV == undefined) || currentVLength > maxV) {
              maxV = currentVLength;
            }
            if ((minV == undefined) || currentVLength < minV) {
              minV = currentVLength;
            }
        });
    });

    if (minK == undefined) {
       print(collName + " [" + mapField+ "](k,v) missing");
    } else {
       print(collName + " [" + mapField+ "](k,v).length - minK: " + minK + "  maxK: " + maxK +
                        " - minV: " + minV + "  maxV: " + maxV);
    }
}


// print min and max length of a values field of a set field in a collection
function findSetMinMax(collName, setField) {
    var coll = db.getCollection(collName);
    var min, max;

    coll.find().forEach(function(doc) {
        var curSet = doc[setField];
        if (curSet == undefined) {
          return;
        }
        Object.keys(curSet).forEach(function(key) {
            var value = curSet[key];
            if (value == undefined) {
              return;
            }
            var currentLength = getValueLength(value);
            if ((max == undefined) || currentLength > max) {
              max = currentLength;
            }
            if ((min == undefined) || currentLength < min) {
              min = currentLength;
            }
        });
    });

    if (min == undefined) {
       print(collName + " [" + setField + "](set) missing");
    } else {
       print(collName + " [" + setField+ "](set).length - min: " + min + "  max: " + max);
    }
}

// print min and max keys of a given field in a collection
function findMinMaxKeys(collName, fieldName) {
    var coll = db.getCollection(collName);
    var min, max;

    coll.find().forEach(function(doc) {
        var curField = doc[fieldName];
        if (curField == undefined) {
          return;
        }
        var currentLength = Object.keys(curField).length;
        if ((max == undefined) || currentLength > max) {
          max = currentLength;
        }
        if ((min == undefined) || currentLength < min) {
          min = currentLength;
        }
    });

    if (min == undefined) {
       print(collName + " [" + fieldName + "] missing");
    } else {
       print(collName + " [" + fieldName + "].keys.length - min: " + min + "  max: " + max);
    }
}

