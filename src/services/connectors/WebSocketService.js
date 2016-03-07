import * as cs from '../../constants'
import ServiceProvider from '../../ServiceProvider'

export default class WebSocketService {

  constructor (options = {}) {
    this.NAME = this.constructor.name
    this.protocol = ServiceProvider.get(cs.EXCHANGEPROTOCOL_SERVICE)
    this.defaults = {
      signaling: 'ws://localhost:9000',
      // Maximum number of milliseconds of lag before we fail the connection.
      MAX_LAG_BEFORE_DISCONNECT: 20000
    }
    this.settings = Object.assign({}, this.defaults, options)
  }

  join (key, options = {}) {
    let settings = Object.assign({}, this.settings, options)
    return new Promise((resolve, reject) => {
      let connection
      let socket = new window.WebSocket(settings.signaling)
      socket.facade = options.facade || null;
      socket.onopen = () => {
        resolve(socket);
      }
      socket.onerror = reject
      // Check the status of the socket connection
      let isSocketDisconnected = (realtime, sock) => {
          return sock.readyState === sock.CLOSING
              || sock.readyState === sock.CLOSED
              || (realtime.getLag().waiting && realtime.getLag().lag > this.settings.MAX_LAG_BEFORE_DISCONNECT);
      }
      socket.checkSocket = (realtime) => {
          if (isSocketDisconnected(realtime, socket) && !socket.intentionallyClosing) {
              return true;
          } else {
              return false;
          }
      };
    })
  }

  
  

}
