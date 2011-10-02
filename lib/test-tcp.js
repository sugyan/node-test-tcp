var net = require('net');
var util = require('util');
var events = require('events');

var exports = module.exports;
var empty_port, test_tcp;

var TestTCP = exports.TestTCP = function (options) {
  var self = this;
  var start_server = function () {
    if (self.auto_start) {
      self.start();
    }
  };
  if (options === undefined) {
    throw 'missing mandatory options';
  }
  if (options.code === undefined) {
    throw 'missing mandatory parameter "code"';
  }
  self.auto_start = true;
  Object.keys(options).forEach(function (e) {
    self[e] = options[e];
  });

  if (self.port) {
    start_server();
  } else {
    empty_port(function (err, port) {
      if (err) {
        throw err;
      }
      self.port = port;
      start_server();
    });
  }
  return this;
};
util.inherits(TestTCP, events.EventEmitter);

TestTCP.prototype.start = function () {
  var self = this;
  if (typeof this.code === 'function') {
    this.stop_function = this.code(this.port, function () {
      self.emit('start');
    });
  } else {
    this.code.listen(this.port, function () {
      self.emit('start');
    });
  }
};
TestTCP.prototype.stop = function (callback) {
  if (this.stop_function) {
    this.stop_function(callback || function () {});
  } else {
    this.code.on('close', function () {
      if (callback) {
        callback();
      }
    });
    this.code.close();
  }
};

// get a empty port on 49152 .. 65535
empty_port = exports.empty_port = function (port, callback) {
  if (typeof port === 'function') {
    callback = port;
    port = null;
  }
  if (typeof port === 'number' && port < 65535) {
    if (port < 49152) {
      port = 49152;
    }
  } else {
    port = 50000 + Math.floor(Math.random() * 1000);
  }

  var loop;
  loop = function () {
    if (port >= 60000) {
      callback('empty port not found');
      return;
    }
    var server = net.createServer();
    server.on('error', function (err) {
      if (err.code === 'EADDRINUSE') {
        port++;
        loop();
      } else {
        callback(err);
      }
    });
    server.listen(port, function () {
      server.on('close', function () {
        callback(null, port);
      });
      server.close();
    });
  };
  loop();
};

test_tcp = exports.test_tcp = function (options) {
  if (options === undefined) {
    throw 'missing mandatory options';
  }
  ['client', 'server'].forEach(function (e) {
    if (options[e] === undefined) {
      throw 'missing mandatory prameter "' + e + '"';
    }
  });

  var start_server = function (port) {
    var server;
    server = new TestTCP({
      code: options.server,
      port: port
    });
    server.on('start', function () {
      options.client(server.port, function (callback) {
        server.stop(callback);
      });
    });
  };
  if (options.port) {
    start_server(port);
  } else {
    empty_port(function (err, port) {
      if (err) {
        throw err;
      }
      start_server(port);
    });
  }
};
