# dirp
dirp - a key-value in-memory store using tokenized path as a key.

## Features
* Internally manages values in a tree structure:
    * `unset()` can remove all values under the same path (performance)
    * Sharing upstream paths saves memory size (efficiency)
* Accessing non-existing path returns `undefined` (safety)

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
// montgomery
 
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

### Module Methods
#### create *(creates a new instance of "Dirp"(an internal class))*
```
create() => instance {Dirp}
create(delimiter) => instance {Dirp}
create(delimiter, data) => instance {Dirp}
create(data) => instance {Dirp}
    delimiter {string} Path delimiter. Defaults to '.'
    data {object} Data to be imported.
```
* e.g. "products.users.name", "app/lib/test", "country:state:city" ...
* For `data`, see [import](#import) section below.

### Instance Methods
#### set *(sets the path to a value)*
```
set(path, value) => {void}
    path {string} Path to a value
    value {any} Arbitrary value
```

#### get *(gets a value at the path)*
```
get(path) => {any}
    path {string} Path to a value
```
* `undefined` is returned if the `path` is not a leaf.

#### unset *(unsets value at the path)*
```
unset(path) => {void}
    path {string} Path to be unset
```

#### exists *(tests if the path exists)*
```
exists(path) => {boolean}
    path {string} Path to be tested
```
#### raw *(returns a raw data {object})*
```
raw() => {object}
```
* This returns a direct reference to the internal data. Any modification to the object will affect the source.
#### clone *(returns a new instance of Dirp with a deep-copy of its raw data)*
```
clone() => {Dirp}
```
* It only deep-copies *stringifiable* data. If a value passed to `set()` contains a getter/setter, or properties that are not enumerable, those would be ignored. *(Note: this may change in the future)*

#### import *(imports data into derp)*
```
import(data) => {void}
    data {object} Object to be imported. e.g { 'user.name': 'foo', 'user.age': 27 } // a list of `path`:`value` pairs.
```
* Throws if the data is not a valid object.

#### export *(returns exported object)*
```
export() => {object}
    data {object} Exported object with a list of `path`:`value` pairs.
```

