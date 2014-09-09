var net = require('net');
require('buffer');

var HOST = '192.168.0.194';
var PORT = 1024;
var PASSWORD = '1234';
var CARD_ADDR = '00000000';

var seq = 0;
var wlacz = 'wlacz';

var client = new net.Socket();

client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 

});

// Convert hex to ASCII
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var out = new Buffer(hex.length/2);
    for (var i = 0; i < hex.length; i += 2) {
        out.writeUInt8(parseInt(hex.substr(i, 2), 16),i/2);
    }
    return out;
}

// Sleep
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// Add a 'close' event handler for the client socket
client.on('connect', function() {

    console.log('Connection opened');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {

    console.log('DATA: ' + data);
    
    if (data=='Welcome to AISIS server.') {
        client.write('plain\n\0');
    } else if (data=='NO uSSL') {
        // MD5 HASH of password
        var crypto = require('crypto');
        var hash_ascii = new Buffer(17);
        var hash = crypto.createHash('md5').update(PASSWORD).digest('hex');
        hash_ascii = hex2a(hash);
        console.log('HASH: ' + hash);
        client.write(hash_ascii);
    } else if (data=='LOGIN FAILED') {
        // Close the client socket completely
        client.destroy();
    } else if (data=='LOGIN OK') {
        console.log('hello');
        client.write('!\0');
        client.write('@' + CARD_ADDR + ':system info Hello World!\0');
    } else if (data=='CMD OK') {
        //console.log('SEQ : ' + seq);
        // Here we can send commands
        switch (seq) {
            case 0: 
                seq = 1;
                client.write('@' + CARD_ADDR + ':system C \'przek salon\' ?\0');
                //client.write('@' + CARD_ADDR + ':ping\0');
                break;
            case 1:
                seq = 0;
                sleep(1000);
                client.write('@' + CARD_ADDR + ':get\0');
                break;
        }


    } else if (data.toString().substr(0,9)=='~' + CARD_ADDR) {
        console.log(data.toString().substr(9,data.length-9));
        
        //sleep(1000);
        //client.write('@' + CARD_ADDR + ':system command ' + wlacz + ' \'przek salon\'\0');

        seq = 1;
        client.write('@' + CARD_ADDR + ':system C \'przek salon\' ?\0');

        if (wlacz == 'wlacz') wlacz = 'wylacz'; else wlacz = 'wlacz';
        // Here we can process answers

    } else {
        console.log('?' + data[0]);
        //client.destroy();
    }

});

// Add a 'close' event handler for the client socket
client.on('close', function() {

    console.log('Connection closed');

});

// Add a 'end' event handler for the client socket
client.on('end', function() {

    console.log('Connection ended');

});

// Add a 'timeout' event handler for the client socket
client.on('timeout', function() {

    console.log('Connection timed out');

});

// Add a 'drain' event handler for the client socket
client.on('drain', function() {

    console.log('Connection drained');

});

// Add a 'error' event handler for the client socket
client.on('error', function() {

    console.log('Connection error');

});
