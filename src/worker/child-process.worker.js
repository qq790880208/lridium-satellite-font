import { get } from 'lodash';
import CustomWebsocket from './socket/class-socket';
let socketHash = {};
const handleCountData = (e) => {
  // console.info('handleCountData', e);
};

const handleTargetData = (e) => {
  // console.info('handleTargetData', e);
};

const handleTrackData = (e) => {
  // console.info('handleTrackData', e);
};

const handleDeviceData = (e) => {
  // console.info('handleDeviceData', e);
};

const oName2Fn = {
  countsData: handleCountData,
  objectMessage: handleTargetData,
  trailData: handleTrackData,
  deviceStatusData: handleDeviceData,
};

const createSocket = (list) => {
  return list.map(socket => {
    const item = new CustomWebsocket(socket.url, oName2Fn[socket.name]);
    socketHash[socket.name] = item;
    return item;
  });
};

const handleReceiveMainMessage = (e) => {
  // console.info(e);
  const type = get(e, 'data.type', '');
  if (type === 'createSocket') {
    createSocket(get(e, 'data.socketInfo', ''));
  }
};
self.addEventListener('message', handleReceiveMainMessage);
