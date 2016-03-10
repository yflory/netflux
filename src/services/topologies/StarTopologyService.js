export default class StarTopologyService {

  constructor (options = {}) {}


  broadcast (webChannel, data) {
    return new Promise(function(resolve, reject) {
      for (let c of webChannel.channels) {
        let msg = JSON.stringify([c.seq++, data.type, webChannel.id, data.msg])
        c.send(msg)
      }
      resolve();
    });
  }

  sendTo (id, webChannel, data) {
    return new Promise(function(resolve, reject) {
      for (let c of webChannel.channels) {
        let msg = JSON.stringify([c.seq++, data.type, id, data.msg])
        c.send(msg)
      }
      resolve();
    });
  }

}
