var TestTCP = require('./../index');
var assert = require('assert');
var net = require('net');

global.test('simple', function (done) {
    TestTCP.test_tcp({
        client: function (port, callback) {
            var socket = new net.Socket();
            socket.connect(port, function () {
                socket.on('close', function () {
                    callback(function () {
                        done();
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
});
