// 此文件跟同级目录的 global.d.ts 文件一样也是全局类型声明，只不过这里存放一些零散的全局类型，无需引入直接在 .vue 、.ts 、.tsx 文件使用即可获得类型提示
interface chartDataset {
  dimensions: Array;
  source: Array;
}

interface position2D {
  x: number;
  y: number;
}
interface position3D extends position2D {
  z: number;
}

interface barSingleData {
  id: string,
  result: boolean
}

interface connectWebsocket {
  status: boolean;
}
