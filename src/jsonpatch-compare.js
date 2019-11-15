const jsonpatch = require('fast-json-patch');

const userOrigin = { user: { firstName: 'Albert', lastName: 'Einstein' } };
const userUpdated = { user: { firstName: 'Albert', lastName: 'Chervet', toto:2 } };

const diff = jsonpatch.compare(userOrigin, userUpdated);
console.log(diff);

const userPatched = jsonpatch.applyPatch(userOrigin,diff).newDocument;
console.log(userPatched);