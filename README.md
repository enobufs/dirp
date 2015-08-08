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
capitals.set('jp.tokyo', 'shinjuku');
capitals.set('jp.osaka', 'osaka');
 
console.log(capitals.get('us.alabama'));
// mongomery
 
console.log(capitals.get('us.california'));
// sacramento
 
console.log(capitals.raw());
// { us: { alabama: 'montgomery', california: 'sacramento' },
//   jp: { tokyo: 'shinjuku', osaka: 'osaka' } }

console.log(capitals.get('us.tokyo')); // incorrect
// undefined
 
capitals.unset('us'); // clear all data at paths that start with 'us' 
console.log(capitals.raw());
// { jp: { tokyo: 'shinjuku', osaka: 'osaka' } }
```

## API

### Constructor
#### create
```
create(delimiter, data) => instance {Dirp}
create(delimiter) => instance {Dirp}
create(data) => instance {Dirp}
```
* delimiter {string} *optional* Path delimiter. Defaults to '.'
* data {object} *optional* Initial object. Defaults to {}

### Instance Methods
#### set
```
set(path, value) => {void}
```
* path {string} Path to a value
* value {any} Aribtrary value

#### get
```
get(path) => value {any}
```
* path {string} Path to a value

#### unset
```
unset(path) => {void}
```
* path {string} Path to be unset

#### exist(path) => {boolean}
```
exist(path) => {boolean}
```
* path {string} Path to be tested
#### raw
```
raw() => {object}
```
#### clone
```
clone() => {Dirp}
```
