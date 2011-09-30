var TestTCP = require('./../index');
var net = require('net');

exports.server_code = function (test) {
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
        server: function (port, done) {
            var tcp = require('child_process').spawn(
                'node', [
                    '-e',
                    'require("net").createServer(function(s){s.on("data",function(d){s.write(d);})}).listen(' + port + ',function(){console.log("ok");});1;'
                ]
            );
            tcp.stdout.on('data', function (chunk) {
                if (/ok/.test(chunk)) {
                    done();
                }
            });
            return function (done) {
                tcp.on('exit', done);
                tcp.kill();
            };
        }
    });
};

exports.server_code_oo = function (test) {
    var server = new TestTCP.TestTCP({
        code: function (port, done) {
            var tcp = require('child_process').spawn(
                'node', [
                    '-e',
                    'require("net").createServer(function(s){s.on("data",function(d){s.write(d);})}).listen(' + port + ',function(){console.log("ok");});1;'
                ]
            );
            tcp.stdout.on('data', function (chunk) {
                if (/ok/.test(chunk)) {
                    done();
                }
            });
            return function (done) {
                tcp.on('exit', done);
                tcp.kill();
            };
        }
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
