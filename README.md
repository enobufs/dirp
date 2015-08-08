# dirp
dirp - object directory accessor using tokenized path string.

## Installation
```
$ npm install dirp --save
```

## Examples

```javascript
var capitals = require('dirp').create();
capitals.set('us.alabama', 'montgomery');
capitals.set('us.california', 'sacramento');

console.log(capitals.get('us.alabama'));
-> mongomery

console.log(capitals.get('us.california'));
-> sacramento

console.log(capitals.get('us.tokyo'));
-> undefined

capitals.uset('us'); // clear all data at paths that start with 'us'

```

## API

### Constructor
```
create(delimiter, data) => instance {Dirp}
create(delimiter) => instance {Dirp}
create(delimiter) => instance {Dirp}
```
* delimiter {string} Path delimiter. Defaults to '.'
* data {object} Initial object. Defaults to {}

### Instance Methods
#### set(path, value) => {void}
* path {string} Path to a value
* value {any} Aribtrary value

#### get(path) => value {any}
* path {string} Path to a value

#### unset(path) => {void}
* path {string} Path to be unset

#### exist(path) => {boolean}
* path {string} Path to be tested
#### toJSON() => {object}
#### clone() => {Dirp}
