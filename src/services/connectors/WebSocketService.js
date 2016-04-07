import * as cs from '../../constants'
import ServiceProvider from '../../ServiceProvider'

export default class WebSocketService {

  constructor (options = {}) {
    this.NAME = this.constructor.name
    this.protocol = ServiceProvider.get(cs.EXCHANGEPROTOCOL_SERVICE)
    this.defaults = {
      signaling: 'ws://localhost:9000',
      REQUEST_TIMEOUT: 5000
    }
    this.settings = Object.assign({}, this.defaults, options)
  }

  join (key, options = {}) {
    let settings = Object.assign({}, this.settings, options)
    return new Promise((resolve, reject) => {
      let connection
      let socket = new window.WebSocket(settings.signaling)
      setInterval(() => {
        if(socket.webChannel && socket.webChannel.waitingAck) {
          const waitingAck = socket.webChannel.waitingAck
          for (let id in waitingAck) {
            const req = waitingAck[id];
            const now = (new Date()).getTime()
            if (now - req.time > settings.REQUEST_TIMEOUT) {
              delete socket.webChannel.waitingAck[id];
              req.reject({ type: 'TIMEOUT', message: 'waited ' + now - req.time + 'ms' });
            }
          }
        }
      }, 5000);
      socket.seq = 1
      socket.facade = options.facade || null;
      socket.onopen = () => {
        if (key && key !== '') {
          socket.send(JSON.stringify([socket.seq++, 'JOIN', key]));
        } else {
          socket.send(JSON.stringify([socket.seq++, 'JOIN']));
        }
        resolve(socket);
      }
      socket.onerror = reject
    })
  }
}
