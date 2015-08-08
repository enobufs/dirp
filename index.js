'use strict';

function Dirp(delimiter, data) {
    if (typeof delimiter !== 'string') {
        data = delimiter;
        delimiter = void(0);
    }
    this._delim = delimiter || '.';
    this._data = (typeof data === 'object' && !Array.isArray(data))? data:{};
}

Dirp.prototype.set = function (path, val) {
    var paths = this._splitPath(path);
    var o = this._data;
    paths.forEach(function (prop, i) {
        var prop = paths[i];
        if (i < paths.length - 1) {
            if (!o.hasOwnProperty(prop)) {
                o[prop] = makeDir();
            }
            o = o[prop];
        } else {
            o[prop] = val;
        }
    });
};

Dirp.prototype.get = function (path) {
    var o = getRaw(this._splitPath(path), this._data);
    if (o && o._dirp) {
        return undefined;
    }
    return o;
};

Dirp.prototype.unset = function (path) {
    var paths = this._splitPath(path);
    var o = this._data;
    for (var i = 0; i < paths.length; ++i) {
        var prop = paths[i];
        if (!o.hasOwnProperty(prop)) {
            return;
        }
        if (i === paths.length - 1) {
            delete o[prop];
            return;
        }
        o = o[prop];
    }
};

Dirp.prototype.exists = function (path) {
    var o = getRaw(this._splitPath(path), this._data);
    return (o !== undefined);
};

Dirp.prototype.raw = function () {
    return this._data;
};

Dirp.prototype.clone = function () {
    return new Dirp(this._delim, deepCopy(this._data));
};

Dirp.prototype._splitPath = function (path) {
    return path.split(this._delim);
}

function makeDir(obj) {
    var obj = {};
    // mark it as derp ..
    Object.defineProperty(obj, '_dirp', {
        get: function () { return true; }
    });
    return obj;
};

function getRaw(paths, obj) {
    var o = obj;
    for (var i = 0; i < paths.length; ++i) {
        var prop = paths[i];
        if (!o.hasOwnProperty(prop)) {
            return undefined;
        }
        o = o[prop];
    }
    return o;
}

function deepCopy(obj) {
    // TODO: switch to faster deep-copy
    return JSON.parse(JSON.stringify(obj));
};


module.exports = {
    create: function (delimiter, data) {
        return new Dirp(delimiter, data);
    },
    deepCopy: deepCopy
};

