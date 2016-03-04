export default class StarTopologyService {

  constructor (options = {}) {}


  broadcast (webChannel, data) {
    for (let c of webChannel.channels) {
      let msg = JSON.stringify([c.seq++, data.type, webChannel.id, data.msg])
      c.send(msg)
    }
  }

  sendTo (id, webChannel, data) {
    for (let c of webChannel.channels) {
      let msg = JSON.stringify([c.seq++, data.type, id, data.msg])
      c.send(msg)
    }
  }

}
