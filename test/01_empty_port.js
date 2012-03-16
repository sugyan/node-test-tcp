var TestTCP = require('./../index');
var assert = require('assert');
var net = require('net');

global.test('normal', function (done) {
    TestTCP.empty_port(function (err, port) {
        assert.ok(! err, 'no error');
        assert.ok(50000 <= port && port < 60000, 'port range');
        var server = net.createServer();
        server.listen(port, function () {
            assert.ok(true, 'listen');
            server.on('close', function () {
                done();
            });
            server.close();
        });
    });
});

global.test('specify', function (done) {
    TestTCP.empty_port(55555, function (err, port) {
        assert.ok(! err, 'no error');
        assert.ok(55555 <= port && port < 60000, 'port range');
        done();
    });
});

global.test('minimum', function (done) {
    TestTCP.empty_port(80, function (err, port) {
        assert.ok(! err, 'no error');
        assert.ok(49152 <= port && port < 60000, 'port range');
        done();
    });
});

global.test('maximum', function (done) {
    TestTCP.empty_port(530000, function (err, port) {
        assert.ok(! err, 'no error');
        assert.ok(49152 <= port && port < 60000, 'port range');
        done();
    });
});

global.test('used', function (done) {
    TestTCP.empty_port(function (err, port1) {
        var server = net.createServer();
        server.listen(port1, function () {
            TestTCP.empty_port(port1, function (err, port2) {
                assert.ok(! err, 'no error');
                assert.ok(port1 !== port2, 'different port');
                server.on('close', function () {
                    done();
                });
                server.close();
            });
        });
    });
});

global.test('fail', function (done) {
    var port1 = 61000;
    var server = net.createServer();
    server.listen(port1, function () {
        TestTCP.empty_port(port1, function (err, port2) {
            assert.ok(err, 'error');
            assert.equal(err, 'empty port not found', 'error message');
            assert.ok(! port2, 'port not found');
            server.on('close', function () {
                done();
            });
            server.close();
        });
    });
});

global.test('empty_ports', function (done) {
    TestTCP.empty_ports(3, function (err, ports) {
        assert.ok(! err, 'no error');
        assert.equal(ports.length, 3, 'ports number');
        assert.ok(ports[0] !== ports[1], 'different port 0-1');
        assert.ok(ports[0] !== ports[2], 'different port 0-2');
        assert.ok(ports[1] !== ports[2], 'different port 1-2');
        done();
    });
});
