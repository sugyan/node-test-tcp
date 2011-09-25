# node-test-tcp #

Testing TCP program, like as Perl's [Test::TCP](http://search.cpan.org/~tokuhirom/Test-TCP/).

## Usage ##

net:

    var TestTCP = require('./lib/test-tcp');
    var assert = require('assert');
    var net = require('net');
    
    TestTCP.test_tcp({
        server: net.createServer(function (socket) {
            socket.on('data', function (data) {
                socket.write(data);
            });
        }),
        client: function (port, done) {
            var socket = new net.Socket();
            socket.connect(port, function () {
                socket.on('close', done);
                socket.on('data', function (data) {
                    assert.equal(data.toString(), 'foo');
                    socket.end();
                });
                socket.write('foo');
            });
        }
    });

http:

    var TestTCP = require('./lib/test-tcp');
    var assert = require('assert');
    var http = require('http');
    
    TestTCP.test_tcp({
        server: http.createServer(function (req, res) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello, world!');
        }),
        client: function (port, done) {
            http.get({
                port: port
            }, function (res) {
                var buffer = '';
                assert.equal(res.statusCode, 200);
                res.on('data', function (chunk) {
                    buffer += chunk;
                });
                res.on('end', function () {
                    assert.equal(buffer, 'Hello, world!');
                    done();
                });
            });
        }
    });

OO-ish:

    var TestTCP = require('./lib/test-tcp');
    var assert = require('assert');
    var net = require('net');
    
    var server; server = new TestTCP.TestTCP({
        code: net.createServer(function (socket) {
            socket.on('data', function (data) {
                socket.write(data);
            });
        })
    }, function () {
        var socket = new net.Socket();
        socket.connect(server.port, function () {
            socket.on('data', function (data) {
                assert.equal(data.toString(), 'foo');
                socket.on('close', function () {
                    server.stop();
                });
                socket.end();
            });
            socket.write('foo');
        });
    });

## Functions ##

### test_tcp(opts) ###

__Arguments__

* opts - An object, following two parameters are required.
 * server - [net.Server](http://nodejs.org/docs/v0.4.12/api/net.html#net.Server) instance.
 * client(port, done) - A function which is called after server started. `port` is server's listening port, `done` is a function which should be called when client program finished.

### empty_port([port, ]callback) ###

Get the available port number, you can use.

__Arguments__

* port - Optional, the number you want to use.
* callback(err, port) - A callback which is called after available port was found (or failed).

## Testing ##

    $ make test

## License ##

(The MIT License)

Copyright (c) 2011 Yoshihiro Sugi &lt;sugi1982+github@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
