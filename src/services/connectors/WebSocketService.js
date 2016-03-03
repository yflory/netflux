import * as cs from '../../constants'
import ServiceProvider from '../../ServiceProvider'

export default class WebSocketService {

  constructor (options = {}) {
    this.NAME = this.constructor.name
    this.protocol = ServiceProvider.get(cs.EXCHANGEPROTOCOL_SERVICE)
    this.defaults = {
      signaling: 'ws://localhost:9000',
    }
    this.settings = Object.assign({}, this.defaults, options)
  }

  join (key, options = {}) {
    let settings = Object.assign({}, this.settings, options)
    return new Promise((resolve, reject) => {
      let connection
      let socket = new window.WebSocket(settings.signaling)
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
