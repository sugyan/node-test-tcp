var TestTCP = require('./../index');

exports.test_tcp = function (test) {
    TestTCP.test_tcp({
        client: function (port, callback) {
            callback(function () {
                test.done();
            });
        },
        server: (function () {
            var net = require('net');
            return net.createServer(function (socket) {
            });
        }())
    });
};
