import { destroyObject, loadModels } from '@/three/utils';
import type { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import type { Group } from "three/src/Three";
import { Object3D } from "three/src/Three";

export default class ParkProfile {
  private readonly modelUrl;
  private readonly loader;
  private modelList: Array<Group>;
  public type;
  constructor(loader: GLTFLoader, url: string) {
    this.modelUrl = url;
    this.loader = loader;
    this.type = ''
    this.modelList = []
  }

  // createCar(position3D: position3D, id: string) {
  // }

  dispose() {
    // if(this.modelList.length > 0) {
    //   this.modelList.forEach(item => {
    //     destroyObject(item)
    //   })
    // }
  }

  // getObject3DFromName(name) {
  //   return this.allCarModule[name];
  // }

  handleClickEvent(type: string, id: string) {
    if (type === this.type) {
      console.info(`点击设备id：${id}`);
    }
  }

  // handleUnClickEvent = () => {
  // };

  /**
   * @description 加载车模型设置初始位置添加对应阴影
   * @param { String } name 模型名称
   * @param { Object } position3D 模型坐标
   * @param { Object } scale 模型缩放比例
   * @param { Function } onProcess 模型加载中执行函数，参数为{ loaded: number, total: number }参考
   * @return { Promise<Group> } 需要加载的3D模型
   * */
  createModel = async (
    name: string,
    scale = { x: 25, y: 25, z: 25 },
    position3D = { x: 0, y: 0, z: 0 },
    onProcess: () => void,
  ) => {
    try {
      // const blob = await getModel(this.modelUrl, 10);
      // const url = await blob2Url(blob);
      // const url = URL.createObjectURL(new Blob([blob]));
      const model = await loadModels(
        this.loader,
        this.modelUrl,
        position3D,
        scale,
        name,
        onProcess,
      );
      this.modelList.push(model)
      return model;
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  };

  /**
   * @description 设置模型位置
   * @param { Object } module 模型
   * @param { Number } position3D 3D位置信息
   * */
  setPosition(module: Object3D, position3D: position3D) {
    const {
      x = 0,
      y = 0,
      z = 0,
    } = position3D;
    module.position.set(x, y, z);
  }

  /**
   * @description 设置当前模型角度
   * @param { Object } module 模型
   * @param { Number } rad Y旋转量
   * */
  setRotation(module: Object3D, rad: number) {
    module.rotation.set(0, rad, 0);
  }

  setScale(module: Object3D, position3D: position3D) {
    const {
      x = 0,
      y = 0,
      z = 0,
    } = position3D
    module.scale.set(x, y, z);
  }
}
