class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getAnswer(offer) {
    try {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(ans);
        return ans;
      }
    } catch (err) {
      console.error("Error in getAnswer:", err);
      throw err;
    }
  }

  async setLocalDescription(ans) {
    try {
      if (this.peer) {
        await this.peer.setRemoteDescription(ans);
      }
    } catch (err) {
      console.error("Error in setLocalDescription:", err);
      throw err;
    }
  }

  async getOffer() {
    try {
      if (this.peer) {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
      }
    } catch (err) {
      console.error("Error in getOffer:", err);
      throw err;
    }
  }
}

export default new PeerService();
