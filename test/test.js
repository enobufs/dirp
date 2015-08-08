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
        it("data should correctly be set", function () {
            var data = { msg: 'hello', st: { count: 21, happy: true }};
            var d = dirp.create(data);
            assert.deepEqual(data, d._data);
        });
        it("delimiter and data should correctly be set", function () {
            var data = { msg: 'hello', st: { count: 21, happy: true }};
            var d = dirp.create(':', data);
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
                d.set('item', val);
                assert.strictEqual(val, d.get('item'));
            });
        });
        it("set an object at the top", function () {
            var expects = { name: 'John', age: 30 };
            d.set('item', expects);
            assert.deepEqual(expects, d.get('item'));
        });
        it("set data at a path", function () {
            var expects = 'derp';
            var path = 'users.info.quality';
            d.set(path, expects);
            assert.deepEqual(expects, d.get(path));
        });
        it("only the leaf should be readable", function () {
            d.set('us.ca.sfx', 'San Mateo');
            //console.log('d:', JSON.stringify(d));
            assert.strictEqual('San Mateo', d.get('us.ca.sfx'));
            assert.strictEqual(undefined, d.get('us.ca'));
            assert.strictEqual(undefined, d.get('us'));
        })
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
            expects.forEach(function (i) {
                d.unset('item');
                assert.strictEqual(undefined, d.get('item'));
            });
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
            d.set('array.0', 0)
            d.set('array.1', 1)
            var d2 = d.clone();
            assert.ok(d != d2);
            assert.deepEqual(d.raw(), d2.raw());
        });
    });
});
