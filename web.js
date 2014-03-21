var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var clients = {};
wss.on('connection', function(ws) {
    console.log('websocket connection open');

    ws.on('message', function(json) {
      var obj = JSON.parse(json);
      obj.chatdate = JSON.stringify( new Date() );

      if(!clients.hasOwnProperty(obj.id)) {
        console.log('adding client: ' + obj.person);
        clients[obj.id] = ws;
      }

      console.log("Broadcasting message: " + obj.chatstr );
     
      var msg = JSON.stringify( obj );
      for( var ws_id in clients ) {
        clients[ws_id].send( msg );
      }
    });

    ws.on('close', function() {
        console.log('websocket connection close');
        //clearInterval(id);
    });
});



