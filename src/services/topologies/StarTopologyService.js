export default class StarTopologyService {

  constructor (options = {}) {}


  broadcast (webChannel, data) {
    return new Promise(function(resolve, reject) {
      for (let c of webChannel.channels) {
        let msg
        // Create the string message
        let date = (new Date()).getTime()
        if (data.type === 'PING') {
          msg = JSON.stringify([c.seq++, 'PING', date])
        }
        else {
          msg = JSON.stringify([c.seq++, data.type, webChannel.id, data.msg])
        }
        // Store the message with his sequence number to know what message has caused the reception of an ACK
        // This is used in WebSocketProtocolService
        let srvMsg = JSON.parse(msg)
        srvMsg.shift()
        srvMsg.unshift(webChannel.myID)
        srvMsg.unshift(0)
        webChannel.waitingAck[c.seq-1] = {resolve: resolve, reject: reject, time: date, data: srvMsg};
        // Send the message to the server
        c.send(msg)
      }
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
