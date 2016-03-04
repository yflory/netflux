import * as cs from './constants'
import FullyConnectedService from './services/topologies/FullyConnectedService'
import StarTopologyService from './services/topologies/StarTopologyService'
import WebRTCService from './services/connectors/WebRTCService'
import WebSocketService from './services/connectors/WebSocketService'
import ExchangeProtocolService from './services/ExchangeProtocolService'
import WebSocketProtocolService from './services/WebSocketProtocolService'

let services = new Map()

export default class ServiceProvider {
  static get (code, options = {}) {
    let service
    switch (code) {
      case cs.WEBRTC_SERVICE:
        service = new WebRTCService(options)
        break
      case cs.WEBSOCKET_SERVICE:
        service = new WebSocketService(options)
        break
      case cs.FULLYCONNECTED_SERVICE:
        service = new FullyConnectedService(options)
        break
      case cs.STAR_SERVICE:
        service = new StarTopologyService(options)
        break
      case cs.EXCHANGEPROTOCOL_SERVICE:
        service = new ExchangeProtocolService(options)
        break
      case cs.WSPROTOCOL_SERVICE:
        console.log("bonservice..........");
        service = new WebSocketProtocolService(options)
        break
    }
    services.set(code, service)
    return service
  }
}
