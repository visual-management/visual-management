const Component = require('./component.model');

class ComponentController {

  constructor (socket) {
    this.socket = socket;
  }

  async update (item) {
    const id = item._id;
    delete item._id;

    await Component.update({ _id: id }, { $set: item });

    this.socket.emit('componentUpdated', item);
    this.socket.broadcast.emit('refreshView', null);
    // this.sockets.emit('refreshView', null);
  }

  async updateAll (data) {
    for (const item of data) {
      const id = item._id;
      delete item._id;

      await Component.update({ _id: id }, { $set: item })
    }

    // this.sockets.emit('refreshView', null);
    this.socket.broadcast.emit('refreshView', null);
  }

  removeOne (data) {
    return Component.remove({ _id: data._id }).then(() => {
      this.socket.emit('componentDeleted', data);
    }).catch(err => console.error(err));
  }

  save (data) {
    const component = new Component({
      x: 0,
      y: 0,
      w: data.defaultWidth || 5,
      h: data.defaultHeight || 5,
      plugin: data.plugin,
      component: data.tag,
      config: data.config
    });

    return component.save()
      .then((cmpt) => {
        cmpt.i = cmpt._id;

        this.socket.emit('componentCreated', cmpt);
        this.socket.broadcast.emit('refreshView', null);
      })
      .catch(err => console.error(err));
  }

}

module.exports = ComponentController;
