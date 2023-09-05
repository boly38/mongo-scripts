/*global db,BinData,ObjectId,str,bsonsize */ // provided by mongo shell
// noinspection JSCheckFunctionSignatures    // remove warns (print with back quotes) "Invalid number of arguments, expected 0"

function getCollection(collName) {
    // noinspection JSUnresolvedReference
    return db.getCollection(collName);
}

function countCollection(collName) {
    const coll = getCollection(collName);
    const count = coll.count();
    print(`${collName}.count: ${count}`);
    return count > 0;
}

/**
 * @param myValue
 * @param myValue.str - mongo native
 * @param myValue.bsonsize - mongo native
 * @param myValue.length - mongo native
 */
function getValueLength(myValue) {
    if (myValue == null) {
        return 0;
    } else if (myValue instanceof BinData) {
        return myValue.length();
    } else if (myValue instanceof ObjectId) {
        return myValue.str.length;
    } else if (myValue instanceof Object) {
        return Object.bsonsize(myValue);
    } else {
        return myValue.length;
    }
}

/**
 * print min and max length of a given field in a collection
 *  field.length for a string
 *  or array size for and array field
 * @param collName collection
 * @param fieldName field to check
 */
function findMinMax(collName, fieldName) {
    const coll = getCollection(collName);
    let min, max;

    coll.find().forEach(function (doc) {
        let curField = doc[fieldName];
        if (curField === undefined) {
            return;
        }
        let currentLength = getValueLength(curField);
        min = min === undefined ? currentLength : Math.min(min, currentLength);
        max = max === undefined ? currentLength : Math.max(max, currentLength);
    });

    if (min === undefined) {
        print(`${collName} [${fieldName}] is missing`);
        return;
    }
    print(`${collName} [${fieldName}].length - min: ${min}  max: ${max}`);
}

/**
 * print min and max length of a given sub-field in a collection
 *  field.subFieldName.length for a string
 *  or field.subFieldName array size for and array field
 * @param collName collection
 * @param fieldName field to check
 * @param subFieldName sub-field to check
 */
function findSubFieldMinMax(collName, fieldName, subFieldName) {
    const coll = getCollection(collName);
    let min, max;

    coll.find().forEach(function (doc) {
        let curField = doc[fieldName];
        if (curField === undefined) {
            return;
        }
        curField = curField[subFieldName];
        if (curField === undefined) {
            return;
        }
        let currentLength = getValueLength(curField);
        min = min === undefined ? currentLength : Math.min(min, currentLength);
        max = max === undefined ? currentLength : Math.max(max, currentLength);
    });

    if (min === undefined) {
        print(`${collName} [${fieldName}][${subFieldName}] is missing`);
        return;
    }
    print(`${collName} [${fieldName}][${subFieldName}].length - min: ${min}  max: ${max}`);
}

/**
 * print min and max length of a given field of an array field in a collection
 *  arrayField.itemFieldName.length for a string
 *  or arrayField.itemFieldName array size for and array field
 * @param collName collection
 * @param arrayField array field to check
 * @param itemFieldName array item field to check
 */
function findArrayMinMax(collName, arrayField, itemFieldName) {
    const coll = getCollection(collName);
    let min, max, minCount, maxCount;

    coll.find().forEach(function (doc) {
        let curArray = doc[arrayField];
        if (curArray === undefined) {// lint duplicate: mongo js engine refuse function in forEach
            return;
        }
        minCount = minCount === undefined ? curArray.length : Math.min(minCount, curArray.length);
        maxCount = maxCount === undefined ? curArray.length : Math.max(maxCount, curArray.length);
        curArray.forEach(function (arrayEntry) {
            let curField = arrayEntry[itemFieldName];
            if (curField === undefined) {
                return;
            }
            let currentLength = getValueLength(curField);
            min = min === undefined ? currentLength : Math.min(min, currentLength);
            max = max === undefined ? currentLength : Math.max(max, currentLength);
        });
    });

    if (min === undefined) {
        print(`${collName} [${arrayField}][${itemFieldName}] is missing`);
        return;
    }
    print(`${collName} [${arrayField}][].length - min: ${minCount}  max: ${maxCount}`);
    print(`${collName} [${arrayField}][*][${itemFieldName}].length - min: ${min}  max: ${max}`);
}


/**
 * print min and max length of a given array under arrayParentField in a collection
 *  arrayParentField.arrayField.itemFieldName.length for a string
 *  or arrayParentField.arrayField.itemFieldName array size for and array field
 * @param collName collection
 * @param arrayParentField array parent field to check
 * @param arrayField array field to check
 * @param itemFieldName array item field to check
 */
function findSubFieldArrayMinMax(collName, arrayParentField, arrayField, itemFieldName) {
    const coll = getCollection(collName);
    let min, max, minCount, maxCount;

    coll.find().forEach(function (doc) {
        let curArray = doc[arrayParentField];
        if (curArray === undefined) {
            return;
        }
        curArray = curArray[arrayField];
        if (curArray === undefined) {// lint duplicate: mongo js engine refuse function in forEach
            return;
        }
        minCount = minCount === undefined ? curArray.length : Math.min(minCount, curArray.length);
        maxCount = maxCount === undefined ? curArray.length : Math.max(maxCount, curArray.length);
        curArray.forEach(function (arrayEntry) {
            let curField = arrayEntry[itemFieldName];
            if (curField === undefined) {
                return;
            }
            let currentLength = getValueLength(curField);
            min = min === undefined ? currentLength : Math.min(min, currentLength);
            max = max === undefined ? currentLength : Math.max(max, currentLength);
        });
    });

    if (min === undefined) {
        print(`${collName} [${arrayParentField}.${arrayField}][*][${itemFieldName}] missing`);
        return;
    }
    print(`${collName} [${arrayParentField}.${arrayField}][].length - min:${minCount} max:${maxCount}`);
    print(`${collName} [${arrayParentField}.${arrayField}][*][${itemFieldName}].length - min:${min}  max:${max}`);
}

/**
 * print min and max length of a given array item::subfield in a collection
 *  arrayField[*].itemFieldName.subItemFieldName.length for a string
 *  or arrayField[*].itemFieldName.subItemFieldName array size for and array field
 * @param collName collection
 * @param arrayField array field to check
 * @param itemFieldName array entry field to check
 * @param subItemFieldName array entry field sub-field to check
 */
function findArraySubItemMinMax(collName, arrayField, itemFieldName, subItemFieldName) {
    const coll = getCollection(collName);
    let min, max, minCount, maxCount;

    coll.find().forEach(function (doc) {
        let curArray = doc[arrayField];// lint duplicate: mongo js engine refuse function in forEach
        if (curArray === undefined) {
            return;
        }
        minCount = minCount === undefined ? curArray.length : Math.min(minCount, curArray.length);
        maxCount = maxCount === undefined ? curArray.length : Math.max(maxCount, curArray.length);
        curArray.forEach(function (arrayEntry) {
            let curField = arrayEntry[itemFieldName];
            if (curField === undefined) {
                return;
            }
            curField = curField[subItemFieldName];
            if (curField === undefined) {
                return;
            }
            let currentLength = getValueLength(curField);
            min = min === undefined ? currentLength : Math.min(min, currentLength);
            max = max === undefined ? currentLength : Math.max(max, currentLength);
        });
    });

    if (min === undefined) {
        print(`${collName} [${arrayField}][*][${itemFieldName}.${subItemFieldName}] missing`);
        return;
    }
    print(`${collName} [${arrayField}][].length - min:${minCount} max:${maxCount}`);
    print(`${collName} [${arrayField}][*][${itemFieldName}.${subItemFieldName}].length - min:${min}  max:${max}`);
}

/**
 * print min and max length of a keys,values field of a map field in a collection
 * @param collName collection
 * @param mapField keys,values field to check
 */
function findMapMinMax(collName, mapField) {
    const coll = getCollection(collName);
    let minK, maxK, minV, maxV, minCount, maxCount;

    coll.find().forEach(function (doc) {
        let curMap = doc[mapField];
        if (curMap === undefined) {
            return;
        }
        let keys = Object.keys(curMap);
        minCount = minCount === undefined ? keys.length : Math.min(minCount, keys.length);
        maxCount = maxCount === undefined ? keys.length : Math.max(maxCount, keys.length);
        keys.forEach(function (key) {
            let currentKLength = key.length;
            minK = minK === undefined ? currentKLength : Math.min(minK, currentKLength);
            maxK = maxK === undefined ? currentKLength : Math.max(maxK, currentKLength);

            let value = curMap[key];
            if (value === undefined) {
                return;
            }
            let currentVLength = getValueLength(value);
            minV = minV === undefined ? currentVLength : Math.min(minV, currentVLength);
            maxV = maxV === undefined ? currentVLength : Math.max(maxV, currentVLength);
        });
    });

    if (minK === undefined) {
        print(`${collName} [${mapField}](k,v) missing`);
        return;
    }
    print(`${collName} [${mapField}](keys).length - min:${minCount} max:${maxCount}`);
    print(`${collName} [${mapField}](k,v).length - minK:${minK} maxK:${maxK} minV:${minV} maxV:${maxV}`);
}

/**
 * print min and max length of a values field of a set field in a collection
 * @param collName collection
 * @param setField set to check
 */
function findSetMinMax(collName, setField) {
    const coll = getCollection(collName);
    let min, max, minCount, maxCount;

    coll.find().forEach(function (doc) {
        const curSet = doc[setField];
        if (curSet === undefined) {
            return;
        }
        let keys = Object.keys(curSet);
        minCount = minCount === undefined ? keys.length : Math.min(minCount, keys.length);
        maxCount = maxCount === undefined ? keys.length : Math.max(maxCount, keys.length);
        keys.forEach(function (key) {
            const value = curSet[key];
            if (value === undefined) {
                return;
            }
            const currentLength = getValueLength(value);
            min = min === undefined ? currentLength : Math.min(min, currentLength);
            max = max === undefined ? currentLength : Math.max(max, currentLength);
        });
    });

    if (min === undefined) {
        print(`${collName} [${setField}](set) missing`);
        return;
    }
    print(`${collName} [${setField}](keys).length - min:${minCount} max:${maxCount}`);
    print(`${collName} [${setField}](k).length - min:${min} max:${max}`);
}

/**
 * print min and max keys of a given field in a collection
 * @param collName collection
 * @param fieldName field to ckeck
 */
function findMinMaxKeys(collName, fieldName) {
    const coll = getCollection(collName);
    let min, max;

    coll.find().forEach(function (doc) {
        let curField = doc[fieldName];
        if (curField === undefined) {
            return;
        }
        let currentLength = Object.keys(curField).length;
        min = min === undefined ? currentLength : Math.min(min, currentLength);
        max = max === undefined ? currentLength : Math.max(max, currentLength);
    });

    if (min === undefined) {
        print(`${collName} [${fieldName}] missing`);
        return;
    }
    print(`${collName} [${fieldName}].keys.length - min:${min} max:${max}`);
}

