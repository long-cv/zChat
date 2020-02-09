const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const config = require('./config/config');
const model = require('./model/model');
const morgan = require('morgan');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

module.exports = app;
model.dbConnect()
.then((result) => {
  server.listen(config.port, () => {
    console.log('Server is running on port', config.port);
  });
})
.catch((error) => {
  console.log('error in conneting to DB.');
  console.log(error);
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

const userRouter = require('./routes/user');
app.use('/user', userRouter);

app.get('/', (request, response) => {
  response.status(200).json({isOk: true, message: "server is running."});
});

const messageRouter = require('./routes/message');
app.use('/message', messageRouter);

const msgEvent = require('./constants/msgEvent');
io.on('connection', socket => {
  console.log('a user connected.');
  socket.on(msgEvent.SUBSCRIBE, room => {
    socket.join(room);
  });
  socket.on(msgEvent.UNSUBSCRIBE, room => {
    socket.leave(room);
  });
  socket.on(msgEvent.SEND_MESSAGE, async (message, sendResultBack) => {
    try {
      await model.dbCreate('message', [message], {});
      let room = message.idTo;
      socket.to(room).emit(msgEvent.NEW_MESSAGE, message);
      sendResultBack({isOk: true, message: "send message successfully."});
    } catch (error) {
      sendResultBack({isOk: false, message: "sending message failed.", error});
    }
  });
});

process.stdin.resume();
//press Ctrl-C
process.on('SIGINT', () => {
   console.log('Server stops running');
   model.dbDisconnect();
   process.exit();
});