import { PerspectiveCamera } from 'three';

export default class Camera extends PerspectiveCamera {
  constructor(fov?: number, aspect?: number, near?: number, far?: number) {
    super(fov, aspect, near, far);
    this._initCameraOptions();
  }

  _initCameraOptions() {
    // 更新摄像头
    // this.aspect = window.innerWidth / window.innerHeight;
    //  更新摄像机的投影矩阵
    this.updateProjectionMatrix();
    // 设置相机位置
    // object3d具有position，属性是1个3维的向量
    // const { x, y, z } = position3D;
    // this.position.set(x, y, z);
  }
}
