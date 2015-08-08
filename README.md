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
    delimiter {string} Path delimiter. Defaults to '.'
```
* e.g. "products.users.name", "app/lib/test", "country:state:city" ...

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
