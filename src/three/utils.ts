import { isArray } from "lodash";
import type { Group, Mesh, PerspectiveCamera, Renderer, Scene } from "three";
import { EquirectangularReflectionMapping, Raycaster, Vector2 } from "three";
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import { createBuildingNameDom } from '@/utils/dom-operate';

export const createMouseRaycaster = ({ x, y }: position2D, camera: PerspectiveCamera) => {
  const mouse = new Vector2();
  // console.log("-------------question--------------");
  mouse.x = x;
  mouse.y = y;
  const raycaster = new Raycaster();
  // const rayVector = new THREE.Vector3();
  // console.log('鼠标点击位置:' + mouse.x + ':' + mouse.y);
  // rayVector.set(mouse.x, mouse.y, 0.5);
  raycaster.setFromCamera(mouse, camera);
  return raycaster;
};

export const changeRenderSize = (camera: PerspectiveCamera, renderer: Renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

/**
 * @description: 递归销毁物体对象
 * @param { Object } parent 销毁的物体的父级，从父级移除物体
 * @param { Mesh } object 销毁的物体
 * @return { void }
 * @文档: https://threejs.org/docs/#manual/zh/introduction/How-to-dispose-of-objects
 */
export const destroyObject = (parent: Scene, object?: Mesh) => {
  object && parent.remove(object);
  const current = object?.children as Array<Mesh>;
  if (!current) {
    return;
  }
  current.forEach(({ geometry, material, children }) => {
    geometry.dispose();
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose());
    } else {
      material?.dispose();
    }
    if (children.length) {
      children.forEach((item) => destroyObject(item as Scene, object));
    }
  });
};

// 数据归一化
export const getPosition2D = (x: number, y: number, width: number, height: number) => ({
  x: (x / width) * 2 - 1,
  y: (y / height) * -2 + 1
});

export const getCanvasRelativePosition = (e: MouseEvent, dom: HTMLCanvasElement) => {
  const canvas = dom;
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) * canvas.width) / rect.width,
    y: ((e.clientY - rect.top) * canvas.height) / rect.height
  };
};

export const getClickObject3D = (e: MouseEvent, object3D: Array<Mesh>, camera: PerspectiveCamera, dom: HTMLCanvasElement) => {
  const pos = getCanvasRelativePosition(e, dom);
  const Canvas = dom;
  const raycaster = createMouseRaycaster(
    getPosition2D(pos.x, pos.y, Canvas.width, Canvas.height),
    camera
  );
  if (isArray(object3D)) {
    return raycaster.intersectObjects(object3D);
  }
  return raycaster.intersectObject(object3D);
};

/**
 * @description 加载模型
 * @param { GLTFLoader } loader 加载器
 * @param { string } url 模型地址
 * @param { position3D } position3D 模型坐标
 * @param { position3D } scale 模型缩放比例
 * @param { String } name 模型名称
 * @param { function } onProcess 加载中回调函数
 * @return { Promise<Group> } 返回加载模型
 * */
export const loadModels = (loader: GLTFLoader, url: string, position3D: position3D, scale: position3D, name: string, onProcess: () => void): Promise<Group> => {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      gltf.scene.scale.set(scale.x, scale.y, scale.z);
      gltf.scene.position.set(position3D.x, position3D.y, position3D.z);
      gltf.scene.name = name;
      resolve(gltf.scene);
    }, onProcess, (error) => {
      console.error(error);
      reject(error);
    });
  });
};

export const loadTexture = (url: string, name: string, onProcess: () => void) => {
  return new Promise((resolve, reject) => {
    new RGBELoader().setPath(url).load(name, (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      resolve(texture);
    }, onProcess, (error) => {
      console.error(error);
      reject(error);
    });
  });
};

// export const createBuildingNameTag = (position3D: position3D, text: string) => {
//   const dom = createBuildingNameDom(text);
//   const objectCSS2D = new CSS2DObject(dom);
//   objectCSS2D.position.set(position3D.x, position3D.y, position3D.z);
//   return objectCSS2D;
// };
