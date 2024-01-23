<template>
  <div class="three-component" ref="container"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
// 导入场景
import ThreeScene from "@/three/scene";
// 导入相机
import ThreeCamera from "@/three/camera";
// 导入相机
import ThreeControl from "@/three/controls";
// 导入渲染器
import ThreeRenderer from "@/three/renderer";
// 导入loader
import ThreeLoad from "@/three/loader";
import AxesHelper from "@/three/axesHelper";
import Computer from "@/three/mesh/computer";
import Board from "@/three/mesh/board";
import Satellite from "@/three/mesh/satellite";
import Tower from "@/three/mesh/tower";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


const container = ref();
const renderer = new ThreeRenderer();
const scene = new ThreeScene();
const camera = new ThreeCamera(75, 1, 0.1, 1000);
const helper = new AxesHelper(50);
const controls = new ThreeControl(camera, renderer.WebGLRenderer.domElement);
controls.addEventListener("change", animate);
const loader = new ThreeLoad();
scene.add(helper);


initAllModelAndAddScene().then(() => {
  renderer.WebGLRenderer.render(scene, camera);
});


onMounted(async () => {
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.position.set(30, 30, 30);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  renderer.WebGLRenderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.WebGLRenderer.domElement);
  renderer.WebGLRenderer.render(scene, camera);
});

function animate() {

  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update();

  renderer.WebGLRenderer.render(scene, camera);

}

async function initAllModelAndAddScene() {
  const computer = new Computer(loader as GLTFLoader, "/model/computer.glb");
  const board = new Board(loader as GLTFLoader, "/model/board.glb");
  const satellite = new Satellite(loader as GLTFLoader, "/model/satellite.glb");
  const tower = new Tower(loader as GLTFLoader, "/model/tower.glb");

  scene.add(await computer.createModel("computer", { x: 1, y: 1, z: 1 }, { x: 20, y: -10, z: 7 }, handleModelLoader));
  scene.add(await board.createModel("board", { x: 0.2, y: 0.2, z: 0.2 }, { x: 12, y: -10, z: 12 }, handleModelLoader));
  scene.add(await satellite.createModel("satellite", { x: 1, y: 1, z: 1 }, { x: 1, y: 20, z: 1 }, handleModelLoader));
  scene.add(await tower.createModel("tower", { x: 0.1, y: 0.1, z: 0.1 }, { x: 1, y: -10, z: 15 }, handleModelLoader));
}

function handleModelLoader() {
  console.info();
}

</script>

<style lang="less" scoped>
.three-component {
  // background: url("~@/assets/bg02.png");
  // padding: 10px;
  height: 100%;
  width: 386px;
}
</style>
