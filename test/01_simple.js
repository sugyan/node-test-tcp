var TestTCP = require('./../index');
var net = require('net');

exports.test_tcp = function (test) {
    TestTCP.test_tcp({
        client: function (port, callback) {
            var socket = new net.Socket();
            socket.connect(port, function () {
                var write;
                socket.on('close', function () {
                    callback(function () {
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
