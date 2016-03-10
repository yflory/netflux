import * as cs from '../constants'
import ServiceProvider from '../ServiceProvider'

export default class WebSocketProtocolService {

  constructor (options = {}) {}

  onmessage (e) {
    let msg = JSON.parse(e.data)
    let socket = e.currentTarget
    let webChannel = socket.webChannel
    let topology = cs.STAR_SERVICE
    let topologyService = ServiceProvider.get(topology)

    if (msg[0] !== 0) {
      return;
    }
    if (msg[1] === 'IDENT') {
      socket.uid = msg[2];
      webChannel.peers = [];
      webChannel.topology = topology;
      return;
    }
    if (msg[1] === 'PING') {
      msg[1] = 'PONG';
      socket.send(JSON.stringify(msg));
      return;
    }
    if (msg[2] === 'MSG') {
    }
    // We have received a new direct message from another user
    if (msg[2] === 'MSG' && msg[3] === socket.uid) {
      // If it comes form the history keeper, send it to the user
      if(msg[1] === '_HISTORY_KEEPER_') {
          var msgHistory = JSON.parse(msg[4]);
          webChannel.onmessage(msgHistory[1], msgHistory[4]);
      }
    }
    if (msg[2] === 'JOIN' && (webChannel.id == null || webChannel.id === msg[3])) {
      if(!webChannel.id) { // New unnamed channel : get its name from the first "JOIN" message
        if(!window.location.hash) {
          var chanName = window.location.hash = msg[3];
        }
        webChannel.id = msg[3];
      }

      if (msg[1] === socket.uid) { // If the user catches himself registering, he is synchronized with the server
        webChannel.onopen();
      }
      else { // Trigger onJoining() when another user is joining the channel

        // Register the user in the list of peers in the channel
        var linkQuality = (msg[1] === '_HISTORY_KEEPER_') ? 1000 : 0;
        var sendToPeer = function(data) {
          topologyService.sendTo(msg[1], webChannel, {type : 'MSG', msg: data});
        }
        var peer = {id: msg[1], connector: socket, linkQuality: linkQuality, send: sendToPeer};
        if(webChannel.peers.indexOf(peer) === -1) {
          webChannel.peers.push(peer);
        }

        if(typeof webChannel.onJoining === "function")
          webChannel.onJoining(msg[1]);
      }
    }
    // We have received a new message in that channel from another peer
    if (msg[2] === 'MSG' && msg[3] === webChannel.id) {
      // Find the peer who sent the message and display it
      //TODO Use Peer instead of peer.id (msg[1]) :
      if(typeof webChannel.onmessage === "function")
        webChannel.onmessage(msg[1], msg[4]);
    }
    // Someone else has left the channel, remove him from the list of peers
    if (msg[2] === 'LEAVE' && msg[3] === webChannel.id) {
      //TODO Use Peer instead of peer.id (msg[1]) :
      if(typeof webChannel.onLeaving === "function")
        webChannel.onLeaving(msg[1], webChannel);
    }
  }

  message (code, data) {
    let type
    switch (code) {
      case cs.USER_DATA:
        type = 'MSG'
        break
      case cs.JOIN_START:
        type = 'JOIN'
        break
    }
    return {type: type, msg: data.data}
  }
}
