export default class StarTopologyService {

  constructor (options = {}) {}


  broadcast (webChannel, data) {
    console.log('sending');
    console.log(data);
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
