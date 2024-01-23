import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera } from "three";
export default class Controls extends OrbitControls {
  constructor(camera: PerspectiveCamera, dom: HTMLCanvasElement) {
    super(camera, dom);
    this._initControlsOptions();
  }

  _initControlsOptions() {
    // 设置控制器阻尼
    // this.enableDamping = true;
    // 设置自动旋转
    // this.autoRotate = true;
    // this.autoRotateSpeed = 0.8;
    this.maxDistance = 165;    // 将相机向外移动的最大距离
    // this.minDistance = 100;
    this.maxPolarAngle = 1.65;  // 垂直旋转的角度的上限
    this.minPolarAngle = 0.5;          // 垂直旋转的角度的下限
  }
}
