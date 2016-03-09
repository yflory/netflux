import * as cs from './constants'
import ServiceProvider from './ServiceProvider'

export default class WebChannel {

  constructor (options = {}) {
    this.defaults = {
      connector: cs.WEBRTC_SERVICE,
      topology: cs.FULLYCONNECTED_SERVICE,
      protocol: cs.EXCHANGEPROTOCOL_SERVICE
    }
    this.settings = Object.assign({}, this.defaults, options)

    // Private attributes
    this.protocol = cs.EXCHANGEPROTOCOL_SERVICE

    // Public attributes
    this.id
    this.myID = this._generateID()
    this.channels = new Set()
    this.onjoining
    this.onleaving
    this.onmessage
  }

  leave () {}
  send (data) {
    let channel = this;
    return new Promise(function(resolve, reject) {
      if(channel.channels.size === 0) {console.log('sizenull'); resolve();}
      let protocol = ServiceProvider.get(channel.settings.protocol)
      channel.topologyService.broadcast(channel, protocol.message(
        cs.USER_DATA,
        {id: channel.myID, data}
      )).then(resolve, reject)
    });
  }

  getHistory (historyKeeperID) {
    let channel = this;
    return new Promise(function(resolve, reject) {
      console.log(channel);
      console.log('Je veux history '+channel.myID);
      let protocol = ServiceProvider.get(channel.settings.protocol)
      channel.topologyService.sendTo(historyKeeperID, channel, protocol.message(
        cs.GET_HISTORY,
        {id: channel.myID, data: ''}
      )).then(resolve, reject)
    });
  }

  sendTo (id, msg) {
    let channel = this;
    return new Promise(function(resolve, reject) {
      let protocol = ServiceProvider.get(channel.settings.protocol)
      console.log('WCsendTo '+id);
      channel.topologyService.sendTo(id, channel, protocol.message(
        cs.USER_DATA,
        {id: channel.myID, data: msg}
      )).then(resolve, reject)
    });
  }

  openForJoining (options = {}) {
    let settings = Object.assign({}, this.settings, options)
    let connector = ServiceProvider.get(settings.connector)
    return connector
      .open((channel) => {
        // 1) New dataChannel connection established.
        //    NEXT: add it to the network
        let protocol = ServiceProvider.get(this.protocol)
        this.topologyService = ServiceProvider.get(this.settings.topology)
        channel.webChannel = this
        channel.onmessage = protocol.onmessage

        // 2.1) Send to the new client the webChannel topology name
        channel.send(protocol.message(cs.JOIN_START, this.settings.topology))

        // 2.2) Ask to topology to add the new client to this webChannel
        this.topologyService
          .addStart(channel, this)
          .then((id) => {
            this.topologyService.broadcast(this, protocol.message(
              cs.JOIN_FINISH,
              id
            ))
            this.onJoining(id)
          })
      }, settings)
      .then((data) => {
        return data
      })
  }
  closeForJoining () {}
  isInviting () {}

  set topology (topologyServiceName) {
    this.settings.topology = topologyServiceName
    this.topologyService = ServiceProvider.get(topologyServiceName)
  }

  get topology () {
    return this.settigns.topology
  }

  _generateID () {
    const MIN_LENGTH = 10
    const DELTA_LENGTH = 10
    const MASK = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    const length = MIN_LENGTH + Math.round(Math.random() * DELTA_LENGTH)

    for (let i = 0; i < length; i++) {
      result += MASK[Math.round(Math.random() * (MASK.length - 1))]
    }
    return result
  }
}
