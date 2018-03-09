const app   = require('http').createServer(),
  io        = require('socket.io')(app),
  mongoose  = require('mongoose'),
  config    = require('config'),

  Component  = require('./lib/component/component.model'),
  ComponentController = require('./lib/component/component.controller');

app.listen(9090);

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');

  // Emit grid on client's connection
  Component.find().then((grid) => {
    socket.emit('grid', grid.map((item) => {
      item.i = item._id;

      return item;
    }))
  });

  const componentController = new ComponentController(socket);

  socket.on('component.update', (data) => componentController.update(data));
  socket.on('component.update-all', (data) => componentController.updateAll(data));
  socket.on('component.save', (component) => componentController.save(component));
  socket.on('component.remove', (component) => componentController.removeOne(component));
});

const MONGO_HOST = process.env.MONGO_HOST || config.get('MONGODB.HOST') || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || config.get('MONGODB.PORT') || 27017;
const MONGO_DATABASE = process.env.MONGO_DATABASE || config.get('MONGODB.DATABASE') || 'db';
const MONGO_USERNAME = process.env.MONGO_USERNAME || (config.has('MONGODB.USERNAME') && config.get('MONGODB.USERNAME')) || null;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || (config.has('MONGODB.PASSWORD') && config.get('MONGODB.PASSWORD')) || null;

// MongoDB
let uri = `${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
if (MONGO_USERNAME && MONGO_PASSWORD) {
  uri = `${MONGO_USERNAME}:${MONGO_PASSWORD}@` + uri;
}

// Use native promises for Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(uri);
