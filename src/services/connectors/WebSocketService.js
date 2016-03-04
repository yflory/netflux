import * as cs from '../../constants'
import ServiceProvider from '../../ServiceProvider'

export default class WebSocketService {

  constructor (options = {}) {
    this.NAME = this.constructor.name
    this.protocol = ServiceProvider.get(cs.EXCHANGEPROTOCOL_SERVICE)
    this.defaults = {
      signaling: 'ws://localhost:9000',
      /**
       * If an error is encountered but it is recoverable, do not immediately fail
       * but if it keeps firing errors over and over, do fail.
       */
      recoverableErrorCount: 0,
      MAX_RECOVERABLE_ERRORS: 15,
      // Maximum number of milliseconds of lag before we fail the connection.
      MAX_LAG_BEFORE_DISCONNECT: 20000
    }
    this.settings = Object.assign({}, this.defaults, options)
  }

  join (key, options = {}) {
    let settings = Object.assign({}, this.settings, options)
    console.log(settings.signaling);
    return new Promise((resolve, reject) => {
      let connection
      let socket = new window.WebSocket(settings.signaling)
      console.log('socketOK');
      socket.facade = options.facade || null;
      socket.onopen = () => {
        resolve(socket);
      }
      socket.onerror = reject
    })
  }

    // Check the status of the socket connection
  /*var isSocketDisconnected = function (realtime) {
    let sock = ws._socket;
      return sock.readyState === sock.CLOSING
          || sock.readyState === sock.CLOSED
          || (realtime.getLag().waiting && realtime.getLag().lag > MAX_LAG_BEFORE_DISCONNECT);
  }
  var checkSocket = module.exports.checkSocket = function (realtime) {
      if (isSocketDisconnected(realtime) && !socket.intentionallyClosing) {
          return true;
      } else {
          return false;
      }
  };*/

}
