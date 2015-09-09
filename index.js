var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
app.set('port', (process.env.PORT || 5000));
var http = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/chat', function(request, response) {
  response.render('pages/chatroom');
});

io.on('connection', function(socket){
    console.log("User Connected");
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log("Message: ", msg);
  });
   socket.on('disconnect', function(msg){
    console.log("User DisConnected");
  });


});
