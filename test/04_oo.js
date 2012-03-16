var TestTCP = require('./../index');
var assert = require('assert');
var net = require('net');

global.test('oo', function (done) {
    var server; server = new TestTCP.TestTCP({
        code: net.createServer(function (socket) {
            socket.on('data', function (data) {
                socket.write(data);
            });
        })
    });
    server.on('start', function () {
        var socket = new net.Socket();
        socket.connect(server.port, function () {
            socket.on('close', function () {
                server.stop(function () {
                    done();
                });
            });
            socket.on('data', function (data) {
                assert.equal(data.toString(), 'foo', 'echo');
                socket.end();
            });
            socket.write('foo');
        });
    });
});

global.test('stop without callback', function (done) {
    var server; server = new TestTCP.TestTCP({
        code: net.createServer(function (socket) {
            socket.on('data', function (data) {
                socket.write(data);
            });
        })
    });
    server.on('start', function () {
        var socket = new net.Socket();
        socket.connect(server.port, function () {
            socket.on('close', function () {
                server.stop();
                done();
            });
            socket.on('data', function (data) {
                assert.equal(data.toString(), 'foo', 'echo');
                socket.end();
            });
            socket.write('foo');
        });
    });
});
