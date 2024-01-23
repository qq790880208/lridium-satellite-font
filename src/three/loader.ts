import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class ThreeLoad {
  constructor() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/gltf/'); // 解压压缩模型的相关js文件路径
    const loader = new GLTFLoader();  // .setPath('/model/');
    loader.setDRACOLoader(dracoLoader); // 设置DRACOloader
    return loader;
  }
}
