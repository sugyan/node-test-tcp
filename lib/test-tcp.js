var exports = module.exports;

var empty_port = exports.empty_port = function () {
    // TODO
    return 44444;
};

function TestTCP (options) {
    var self = this;
    if (options === undefined) {
        throw 'missing mandatory options';
    }
    if (options.code === undefined) {
        throw 'missing mandatory parameter "code"';
    }
    self.auto_start = true;
    Object.keys(options).forEach(function (e) {
        self[e] = options[e];
    });
    self.port = self.port || empty_port();
    if (self.auto_start) {
        self.start();
    }
}

TestTCP.prototype.start = function (callback) {
    this.code.listen(this.port, callback);
};
TestTCP.prototype.stop = function (callback) {
    this.code.on('close', function () {
        if (callback) { callback(); }
    });
    this.code.close();
};

exports.wait_port = function () {
};

exports.test_tcp = function (options) {
    if (options === undefined) {
        throw 'missing mandatory options';
    }
    ['client', 'server'].forEach(function (e) {
        if (options[e] === undefined) {
            throw 'missing mandatory prameter "' + e + '"';
        }
    });
    var server = new TestTCP({
        code: options.server,
        port: options.port || empty_port()
    });
    options.client(server.port, function (callback) {
        server.stop(callback);
    });
};
