$(function() {
    $('#clearbtn').click(function () {
        $('#searchbody').empty();
    });
});

function handleFiles(files) {
    var imageType = /^image\//;
    for (var i = 0, numFiles = files.length; i < numFiles; i++) {
        var file = files[i];
        if (!imageType.test(file.type)) {
            continue;
        }
        socket.emit('image_upload', {
            fbuf: file,
            fname: file.name,
            fext: file.name.split('.').pop()
        });
    }
}

function shortenStr(str, maxlen) {
    if (str.length > maxlen) {
        str = str.substring(0, maxlen) + "...";
    }
    return str;
}

socket.on('image_search', function (data) {
    var shorturl = shortenStr(data['url'], 50);
    var fname = shortenStr(data['fname'], 50);
    $('#searchbody').append(
        $('<tr>')
            .append($('<td>')
                .text(fname)
            )
            .append($('<td>')
                .append($('<a>')
                    .attr('href', data['url'])
                    .text(shorturl)
                )
            )
    );
});
