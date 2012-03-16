var TestTCP = require('./../index');
var assert = require('assert');
var net = require('net');

global.test('nest', function (done) {
    TestTCP.test_tcp({
        client: function (port, callback1) {
            TestTCP.test_tcp({
                client: function (port, callback2) {
                    var socket = new net.Socket();
                    socket.connect(port, function () {
                        var write;
                        socket.on('close', function () {
                            callback2(function () {
                                callback1(function () {
                                    done();
                                });
                            });
                        });
                        socket.on('data', function (data) {
                            assert.equal(data.toString(), 'foo', 'echo');
                            socket.end();
                        });
                        socket.write('foo');
                    });
                },
                server: net.createServer(function (socket) {
                    socket.on('data', function (data) {
                        socket.write(data);
                    });
                })
            });
        },
        server: net.createServer(function (socket) {
            socket.on('data', function (data) {
                socket.write(data);
            });
        })
    });
});
