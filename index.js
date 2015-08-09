'use strict';

function Dirp(delimiter, data) {
    if (typeof delimiter !== 'string') {
        data = delimiter;
        delimiter = void(0);
    }
    this._delim = delimiter || '.';
    this._data = makeDirp();

    if (data) {
        this.import(data);
    }
}

Dirp.prototype.set = function (path, val) {
    var paths = this._splitPath(path);
    var o = this._data;
    var res = false;
    for (var i = 0; i < paths.length; ++i) {
        if (!isDirp(o)) {
            // cannot write into user value. abort.
            break;
        }
        var prop = paths[i];
        if (i < paths.length - 1) {
            if (!o.hasOwnProperty(prop)) {
                o[prop] = makeDirp();
            }
            o = o[prop];
        } else {
            o[prop] = val;
            res = true;
        }
    }
    return res;
};

Dirp.prototype.get = function (path) {
    var o = getRawValue(this._splitPath(path), this._data);
    if (o && o._dirp) {
        return undefined;
    }
    return o;
};

Dirp.prototype.unset = function (path) {
    var paths = this._splitPath(path);
    var o = this._data;
    var res = false;
    for (var i = 0; i < paths.length; ++i) {
        if (!isDirp(o)) {
            break;
        }
        var prop = paths[i];
        if (!o.hasOwnProperty(prop)) {
            break;
        }
        if (i === paths.length - 1) {
            delete o[prop];
            res = true;
            break;
        }
        o = o[prop];
    }
    return res;
};

Dirp.prototype.clear = function () {
    this._data = makeDirp();
};

Dirp.prototype.exists = function (path) {
    var o = getRawValue(this._splitPath(path), this._data);
    return (o !== undefined);
};

Dirp.prototype.raw = function () {
    return this._data;
};

Dirp.prototype.clone = function () {
    return new Dirp(this._delim, deepCopy(this._data));
};

Dirp.prototype.import = function (data) {
    if (isDirp(data)) {
        this._data = data;
        return;
    }
    if (isAssociativeArray(data)) {
        var self = this;
        this._data = makeDirp();
        Object.keys(data).forEach(function (prop) {
            self.set(prop, data[prop]);
        });
        return;
    }
    throw new Error('Faled to import');
};

Dirp.prototype.export = function () {
    var self = this;
    var exported = {};
    var cd = function (cwd, obj) {
        Object.keys(obj).forEach(function (prop) {
            var newCwd = cwd? [cwd, prop].join(self._delim):prop;
            var o = obj[prop];
            if (isDirp(o)) {
                cd(newCwd, o);
                return;
            }

            exported[newCwd] = o;
        });
    };
    cd(null, this._data);
    return exported;
};

Dirp.prototype._splitPath = function (path) {
    if (typeof path !== 'string') {
        return [];
    }
    return path.split(this._delim);
};

function markAsDirp(obj) {
    // mark it derp .. no, dirp
    Object.defineProperty(obj, '_dirp', {
        get: function () { return true; }
    });
    return obj;
}

function makeDirp() {
    return markAsDirp({});
}

function isDirp(obj) {
    return (isAssociativeArray(obj) && obj._dirp);
}

function getRawValue(paths, obj) {
    var o = obj;
    for (var i = 0; i < paths.length; ++i) {
        if (!isDirp(o)) {
            return undefined;
        }
        var prop = paths[i];
        if (!o.hasOwnProperty(prop)) {
            return undefined;
        }
        o = o[prop];
    }
    return o;
}

function deepCopy(obj) {
    if (!obj._dirp) {
        return JSON.parse(JSON.stringify(obj));
    }

    var copy = makeDirp();
    Object.keys(obj).forEach(function (prop) {
        var o = obj[prop];
        if (isAssociativeArray(o)) {
            // associative array
            copy[prop] = deepCopy(o);
        } else if (Array.isArray(o)) {
            // array
            copy[prop] = JSON.parse(JSON.stringify(o));
        } else {
            // primitive
            copy[prop] = o;
        }
    });
    return copy;
}

function isAssociativeArray(o) {
    return (o && typeof o === 'object' && !Array.isArray(o));
}

module.exports = {
    create: function (delimiter, data) {
        return new Dirp(delimiter, data);
    }
};

