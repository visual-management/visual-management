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

// MongoDB
let uri = `${config.get('MONGODB.HOST')}:${config.get('MONGODB.PORT')}/${config.get('MONGODB.DATABASE')}`;
if (config.has('MONGODB.USERNAME') && config.has('MONGODB.PASSWORD')) {
  uri = `${config.get('MONGODB.USERNAME')}:${config.get('MONGODB.PASSWORD')}@` + uri;
}

// Use native promises for Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(uri);
