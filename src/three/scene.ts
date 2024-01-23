import {
  AmbientLight, Color, DirectionalLight, Group, Mesh, Scene
} from "three";
// import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { destroyObject } from '@/three/utils';

export default class SceneNew extends Scene {
  constructor() {
    super();
    this._initSceneOptions();
  }

  _initSceneOptions() {
    const light = new AmbientLight(0x404040); // soft white light
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 10);
    directionalLight.position.set(10, 10, 10);

    // texture && this.setSceneAttribute('environment', texture);
    // this.setSceneAttribute('background', new Color('#88B9DD'));
    this.add(directionalLight);
    this.add(light);
  }

  dispose() {
    this.clear();
    destroyObject(this, this.children as any);
  }

  // setSceneAttribute(key, value) {
  //   this[key] = value;
  // }
}
