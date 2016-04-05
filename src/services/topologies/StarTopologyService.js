export default class StarTopologyService {

  constructor (options = {}) {}


  broadcast (webChannel, data) {
    return new Promise(function(resolve, reject) {
      for (let c of webChannel.channels) {
        let msg
        if (data.type === 'PING') {
          let date = (new Date()).getTime()
          msg = JSON.stringify([0, 'PING', date])
        }
        else {
          msg = JSON.stringify([c.seq++, data.type, webChannel.id, data.msg])
          if(data.type === 'MSG') {
            let srvMsg = JSON.parse(msg)
            srvMsg.shift()
            srvMsg.unshift(webChannel.myID)
            srvMsg.unshift(0)
            webChannel.waitingAck[c.seq-1] = srvMsg;
          }
        }
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
