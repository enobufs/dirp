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
                o[prop] = {};
            }
            o = o[prop];
        } else {
            o[prop] = val;
        }
    });
};

Dirp.prototype.get = function (path) {
    var paths = this._splitPath(path);
    var o = this._data;
    for (var i = 0; i < paths.length; ++i) {
        var prop = paths[i];
        if (!o.hasOwnProperty(prop)) {
            return undefined;
        }
        o = o[prop];
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

Dirp.prototype.exist = function (path) {
    return (this.get(path) !== undefined);
};

Dirp.prototype.raw = function () {
    return JSON.parse(JSON.stringify(this._data));
};

Dirp.prototype.clone = function () {
    return new Dirp(this._delim, this.raw());
};

Dirp.prototype._splitPath = function (path) {
    return path.split(this._delim);
}


module.exports.create = function (delimiter, data) {
    return new Dirp(delimiter, data);
};

