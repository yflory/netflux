import WebChannel from './WebChannel'
import ServiceProvider from './ServiceProvider'

export default class Facade {
  constructor (options = {}) {
    this.defaults = {
      webrtc: {}
    }
    this.settings = Object.assign({}, this.defaults, options)
  }

  create (options = {}) {
    return new WebChannel()
  }

  join (key, options = {}) {
    let defaults = {
      connector: 'WebRTCService',
      protocol: 'ExchangeProtocolService'
    }
    let settings = Object.assign({}, defaults, options)
    let connector = ServiceProvider.get(settings.connector)
    console.log(settings.protocol);
    let protocol = ServiceProvider.get(settings.protocol)
    console.log(protocol.onmessage);
    let connectorOptions = {signaling: settings.signaling, facade: this};
    return new Promise((resolve, reject) => {
      console.log('test111test');
      connector
        .join(key, connectorOptions)
        .then((channel) => {
          console.log('testtest');
          let webChannel = new WebChannel(options)
          channel.webChannel = webChannel
          console.log(protocol);
          console.log(channel);
          channel.onmessage = protocol.onmessage;
          console.log(channel);
          console.log(channel.onmessage);
          webChannel.channels.add(channel)
          console.log('test22232test');
          /*webChannel.onopen = () => { */resolve(webChannel)// }
        })
    })
  }

  invite () {
    // TODO
  }

  _onJoining () {
    // TODO
  }

  _onLeaving () {
    // TODO
  }

  _onMessage () {
    // TODO
  }

  _onPeerMessage () {
    // TODO
  }

  _onInvite () {
    // TODO
  }
}
