var TestTCP = require('./../index');
var net = require('net');

exports.oo = function (test) {
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
                    test.done();
                });
            });
            socket.on('data', function (data) {
                test.equal(data.toString(), 'foo', 'echo');
                socket.end();
            });
            socket.write('foo');
        });
    });
};

exports.stop_without_callback = function (test) {
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
                test.done();
            });
            socket.on('data', function (data) {
                test.equal(data.toString(), 'foo', 'echo');
                socket.end();
            });
            socket.write('foo');
        });
    });
};
