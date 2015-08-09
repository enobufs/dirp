'use strict';

var dirp = require('..');
var assert = require('assert');

describe('test', function () {
    describe('constructor test', function () {
        it("default delimiter should be '.'", function () {
            var d = dirp.create();
            assert.strictEqual('.', d._delim);
        });
        it("default data should be empty", function () {
            var d = dirp.create();
            assert.deepEqual({}, d._data);
        });
        it("delimiter should correct be set", function () {
            var d = dirp.create(':');
            assert.strictEqual(':', d._delim);
        });
        it("default data should be empty", function () {
            var d = dirp.create();
            assert.deepEqual({}, d._data);
        });
        it("flat data should be imported (calls import internally)", function () {
            var data = { name: 'paul', age: 28 }
            var d = dirp.create(data);
            assert.deepEqual(data, d._data);
        });
        it("dirp data should correctly be set (calls import internally)", function () {
            var data = { msg: 'hello', st: { count: 21, happy: true }};
            var d = dirp.create();
            d.set('msg', 'hello');
            d.set('st.count', 21);
            d.set('st.happy', true);
            var d = dirp.create(d.raw());
            assert.deepEqual(data, d._data);
        });
        it("delimiter and data should correctly be set", function () {
            var data = { msg: 'hello', st: { count: 21, happy: true }};
            var d = dirp.create();
            d.set('msg', 'hello');
            d.set('st.count', 21);
            d.set('st.happy', true);
            var d = dirp.create(':', d.raw());
            assert.strictEqual(':', d._delim);
            assert.deepEqual(data, d._data);
        });
    });

    describe("#set/#get test", function () {
        var d;
        beforeEach(function () {
            d = dirp.create();
        });
        it("set a primitive data at the top", function () {
            var expects = [3, 'cool', true, null];
            expects.forEach(function (val) {
                assert(d.set('item', val));
                assert.strictEqual(val, d.get('item'));
            });
        });
        it("set an object at the top", function () {
            var expects = { name: 'John', age: 30 };
            assert(d.set('item', expects));
            assert.deepEqual(expects, d.get('item'));
        });
        it("set data at a path", function () {
            var expects = 'derp';
            var path = 'users.info.quality';
            assert(d.set(path, expects));
            assert.deepEqual(expects, d.get(path));
        });
        it("only the leaf should be readable", function () {
            assert(d.set('us.ca.sfx', 'San Mateo'));
            assert.strictEqual('San Mateo', d.get('us.ca.sfx'));
            assert.strictEqual(undefined, d.get('us.ca'));
            assert.strictEqual(undefined, d.get('us'));
        })
        it("empty string is a valid string", function () {
            var expects = 'derp';
            var path = '';
            assert(d.set(path, expects));
            assert.deepEqual(expects, d.get(path));
        });
        it("empty string is a valid string (2)", function () {
            var expects = 'derp';
            var path = '..';
            assert(d.set(path, expects));
            assert.deepEqual(expects, d.get(path));
        });
        it("invalid path should simply be ignored", function () {
            d.set(666, 'ignore me');
        });
        it("setting a path into value should be ignored", function () {
            var val = { type: 2 }
            assert(d.set('items.item', val));
            assert(!d.set('items.item.bad', true));
            assert.deepEqual(val, d.get('items.item'));
        });
        it("should not read prop of a user value", function () {
            var val = { type: 2 }
            assert(d.set('items.item', val));
            assert.strictEqual(undefined, d.get('items.item.type'));
        });
    });

    describe("#unset method test", function () {
        var d;
        beforeEach(function () {
            d = dirp.create();
        });
        it("set a primitive data at the top then unset", function () {
            var expects = [3, 'cool', true, null];
            expects.forEach(function (val) {
                d.set('item', val);
                assert.strictEqual(val, d.get('item'));
            });
            assert(d.unset('item'));
            assert.strictEqual(undefined, d.get('item'));
        });
        it("unset multiple paths at shared a path", function () {
            var shared = 'us.california';
            var paths = [
                shared + '.san_francisco',
                shared + '.san_mateo',
                shared + '.san_jose'
            ];
            paths.forEach(function (path) {
                d.set(path, true);
            })
            paths.forEach(function (path) {
                assert.ok(d.get(path));
            })
            d.unset(shared);
            paths.forEach(function (path) {
                assert.strictEqual(undefined, d.get(path));
            })
        });
        it("unset non-existing path shold return false", function () {
            assert(!d.unset('items.item'));
            assert.deepEqual(undefined, d.get('items.item'));
        });
        it("should not unset property of user value", function () {
            var val = { type: 2 }
            assert(d.set('items.item', val));
            assert(!d.unset('items.item.type'));
            assert.deepEqual(val, d.get('items.item'));
        });
    });

    describe("#exists method test", function () {
        var d;
        beforeEach(function () {
            d = dirp.create();
        });
        it("set a primitive data at the top then check existence", function () {
            var expects = [3, 'cool', true, null];
            expects.forEach(function (val) {
                d.set('item', val);
                assert.strictEqual(true, d.exists('item'));
            });
        });
        it("should return false if the path does not exist", function () {
            d.set('item', {});
            assert.strictEqual(false, d.exists('item.a'));
            assert.strictEqual(false, d.exists('item.a.b'));
            assert.strictEqual(false, d.exists('gem'));
            assert.strictEqual(false, d.exists('gem.value'));
        });
    });

    describe("#raw & #clone", function () {
        var d;
        beforeEach(function () {
            d = dirp.create();
        });
        it("#raw", function () {
            d.set('array.0', 0)
            d.set('array.1', 1)
            assert.deepEqual({ array: {0: 0, 1: 1}}, d.raw());
        });
        it("#clone", function () {
            d.set('id', 999)
            d.set('st', { xp: 3 })
            d.set('items', [4, 5, 6])
            var d2 = d.clone();
            assert.ok(d != d2);
            assert.deepEqual(d.raw(), d2.raw());
        });
    });

    describe("#import & #export", function () {
        var d;
        beforeEach(function () {
            d = dirp.create();
        });

        it("#import", function () {
            var input = {
                'items.a': { value: 3, quantity: 4 },
                'items.b': { value: 5, quantity: 6 },
                'st': { xp: 100, state: 'happy' }
            };
            var expected = {
                items: {
                    a: input['items.a'],
                    b: input['items.b']
                },
                st: input['st']
            }
            d.import(expected);
            assert.deepEqual(expected, d.raw());
        });

        it("#import succeeds with derp object", function () {
            var expected = {
                items: {
                    a: { value: 3, quantity: 4 },
                    b: { value: 5, quantity: 6 }
                },
                st: { xp: 100, state: 'happy' }
            }
            d.set('items.a', expected.items.a);
            d.set('items.b', expected.items.b);
            d.set('st', { xp: 100, state: 'happy' });
            d.import(d.raw());
            assert.deepEqual(expected, d.raw());
        });

        it("#import throws if not derp nor object", function () {
            assert.throws(function () {
                d.import([4]);
            }, 'cannot pass array');
            assert.throws(function () {
                d.import('bad');
            }, 'cannot pass primitive value');
        });

        it("#export", function () {
            var input = {
                'items.a': { value: 3, quantity: 4 },
                'items.b': { value: 5, quantity: 6 },
                'st': { xp: 100, state: 'happy' }
            };
            var expected = {
                items: {
                    a: input['items.a'],
                    b: input['items.b']
                },
                st: input['st']
            }
            d.import(input);
            var exported = d.export();
            assert.deepEqual(expected, d.raw());
            assert.deepEqual(input, exported);
        });
    });

    describe("#clear", function () {
        var d;
        beforeEach(function () {
            d = dirp.create();
        });
        it("should clear everything", function () {
            d.set('name', 'foo')
            d.set('age', 17)
            assert.strictEqual('foo', d.get('name'));
            assert.strictEqual(17, d.get('age'));
            d.clear();
            assert.strictEqual(undefined, d.get('name'));
            assert.strictEqual(undefined, d.get('age'));
            assert.equal(0, Object.keys(d.raw()).length);
        });
    });
});
