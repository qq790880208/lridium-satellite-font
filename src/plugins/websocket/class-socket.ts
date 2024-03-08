export default class IridiumSocket {
  public webSocket: WebSocket;
  private readonly handleReceiveMessage: (e: MessageEvent) => void;
  private openSocketFunction: () => void;
  constructor(url: string, fn: (e: MessageEvent) => void, depth: number) {
    // 获取雷达接受到的数量的地址
    this.webSocket = new WebSocket(url);
    this.handleReceiveMessage = fn;
    this.openSocketFunction = () => {
      this.webSocket.send(depth.toString());
    };
    this.webSocket.addEventListener('open', this.openSocketFunction);
    this.webSocket.addEventListener('message', this.handleReceiveMessage);
  }

  dispose() {
    this.webSocket.removeEventListener('open', this.openSocketFunction);
    this.webSocket.removeEventListener('message', this.handleReceiveMessage);
    this.webSocket.close();
  }
}
