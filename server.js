var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var exec = require('child_process').exec;
var tmp = require('tmp');

tmp.setGracefulCleanup();

app.set('port', (process.env.PORT || 9001));
app.use(express.static('static'));

var uploadurl = 'http://images.google.com/searchbyimage/upload';
io.on('connection', function (socket) {
    socket.on('image_upload', function (data) {
        var opts = { postfix: '.' + data['fext'] };
        tmp.file(opts, function (err, path, fd, cleanupCallback) {
            if (err) throw err;
            var buffer = data['fbuf'];
            fs.write(fd, buffer, 0, buffer.length);
            fs.close(fd, function (err) {
                if (err) throw err;
                var cmd = ['curl', '-s', '-F', 'encoded_image=@' + path, uploadurl]
                          .join(' ');
                exec(cmd, function (err, stdout, stderr) {
                    var arr = /HREF="(.+)"/gi.exec(stdout);
                    if (arr != null) {
                        socket.emit('image_search', { url: arr[1],
                                                      fname: data['fname'] });
                    }
                });
            });
        });
    });
});

http.listen(app.get('port'));
