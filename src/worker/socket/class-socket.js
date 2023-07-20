export default class socket {
  constructor(url, fn) {
    // 获取雷达接受到的数量的地址
    this.webSocket = new WebSocket(url);
    this.handleReceiveMessage = fn;
    this.openSocketFunction = () => {
      this.webSocket.send('hello world');
    };
    this.webSocket.addEventListener('open', this.openSocketFunction);
    this.webSocket.addEventListener('message', this.handleReceiveMessage);
  }

  dispose() {
    this.webSocket.removeEventListener('open', this.openSocketFunction);
    this.webSocket.removeEventListener('message', this.handleReceiveMessage);
  }
}
