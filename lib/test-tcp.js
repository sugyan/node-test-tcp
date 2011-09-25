var net = require('net');

var exports = module.exports;
var empty_port, test_tcp;

var TestTCP = exports.TestTCP = function (options, callback) {
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

    var start = function () {
        if (self.auto_start) {
            self.start(callback);
        }
    };
    if (self.port) {
        start();
    } else {
        empty_port(function (err, port) {
            if (err) { throw err; }
            self.port = port;
            start();
        });
    }
};
TestTCP.prototype.start = function (callback) {
    var self = this;
    this.code.listen(this.port, function () {
        if (callback) {
            callback();
        }
    });
};
TestTCP.prototype.stop = function (callback) {
    this.code.on('close', function () {
        if (callback) { callback(); }
    });
    this.code.close();
};

// get a empty port on 49152 .. 65535
empty_port = exports.empty_port = function () {
    var port;
    var callback = arguments[arguments.length - 1];
    if (typeof arguments[0] === 'number' && arguments[0] < 65535) {
        port = arguments[0];
        if (port < 49152) { port = 49152; }
    } else {
        port = 50000 + Math.floor(Math.random() * 1000);
    }

    var loop; loop = function () {
        if (port >= 60000) {
            callback('empty port not found');
            return;
        }
        var server = net.createServer();
        server.on('error', function (err) {
            if (err.code === 'EADDRINUSE') {
                port++;
                loop();
            } else {
                callback(err);
            }
        });
        server.listen(port, function () {
            server.on('close', function () {
                callback(null, port);
            });
            server.close();
        });
    };
    loop();
};

test_tcp = exports.test_tcp = function (options) {
    if (options === undefined) {
        throw 'missing mandatory options';
    }
    ['client', 'server'].forEach(function (e) {
        if (options[e] === undefined) {
            throw 'missing mandatory prameter "' + e + '"';
        }
    });

    var start = function (port) {
        var server; server = new TestTCP({
            code: options.server,
            port: port
        }, function () {
            options.client(server.port, function (callback) {
                server.stop(callback);
            });
        });
    };
    if (options.port) {
        start(port);
    } else {
        empty_port(function (err, port) {
            if (err) { throw err; }
            start(port);
        });
    }
};
