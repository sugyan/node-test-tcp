var TestTCP = require('./../index');
var net = require('net');

exports.simple = function (test) {
    TestTCP.test_tcp({
        client: function (port, done) {
            var socket = new net.Socket();
            socket.connect(port, function () {
                socket.on('close', function () {
                    done(function () {
                        test.done();
                    });
                });
                socket.on('data', function (data) {
                    test.equal(data.toString(), 'foo', 'echo');
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
};
