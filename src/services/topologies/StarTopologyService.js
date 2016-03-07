export default class StarTopologyService {

  constructor (options = {}) {}


  broadcast (webChannel, data) {
    for (let c of webChannel.channels) {
      c.send(data)
    }
  }

  sendTo (id, webChannel, data) {
    for (let c of webChannel.channels) {
      c.send(data)
    }
  }

}
