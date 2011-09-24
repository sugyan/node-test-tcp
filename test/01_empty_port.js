var TestTCP = require('./../index');
var net = require('net');

exports.normal = function (test) {
    TestTCP.empty_port(function (err, port) {
        test.ok(! err, 'no error');
        test.ok(50000 <= port && port < 60000, 'port range');
        var server = net.createServer();
        server.listen(port, function () {
            test.ok(true, 'listen');
            server.on('close', function () {
                test.done();
            });
            server.close();
        });
    });
};

exports.specify = function (test) {
    TestTCP.empty_port(55555, function (err, port) {
        test.ok(! err, 'no error');
        test.ok(55555 <= port && port < 60000, 'port range');
        test.done();
    });
};

exports.minimum = function (test) {
    TestTCP.empty_port(80, function (err, port) {
        test.ok(! err, 'no error');
        test.ok(49152 <= port && port < 60000, 'port range');
        test.done();
    });
};

exports.maximum = function (test) {
    TestTCP.empty_port(530000, function (err, port) {
        test.ok(! err, 'no error');
        test.ok(49152 <= port && port < 60000, 'port range');
        test.done();
    });
};

exports.used = function (test) {
    TestTCP.empty_port(function (err, port1) {
        var server = net.createServer();
        server.listen(port1, function () {
            TestTCP.empty_port(port1, function (err, port2) {
                test.ok(! err, 'no error');
                test.ok(port1 !== port2, 'different port');
                server.on('close', function () {
                    test.done();
                });
                server.close();
            });
        });
    });
};

exports.fail = function (test) {
    var port1 = 61000;
    var server = net.createServer();
    server.listen(port1, function () {
        TestTCP.empty_port(port1, function (err, port2) {
            test.ok(err, 'error');
            test.equal(err, 'empty port not found', 'error message');
            test.ok(! port2, 'port not found');
            server.on('close', function () {
                test.done();
            });
            server.close();
        });
    });
};