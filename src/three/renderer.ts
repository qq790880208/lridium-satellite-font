import {
  ACESFilmicToneMapping, sRGBEncoding, PMREMGenerator, WebGLRenderer,
} from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

export default class Renderer {
  PMREMGenerator: PMREMGenerator;

  WebGLRenderer;

  CSSRenderer;

  constructor() {
    this.WebGLRenderer = this._initWebGLRendererOptions();
    this.PMREMGenerator = new PMREMGenerator(this.WebGLRenderer)
    this.CSSRenderer = this._initCSSRendererOptions();
  }

  _initWebGLRendererOptions() {
    const WebGLRendererInstance = new WebGLRenderer({
      antialias: true,
      // canvas: container,
      alpha: true,
      logarithmicDepthBuffer: true,
    });
    WebGLRendererInstance.setPixelRatio(window.devicePixelRatio);
    // WebGLRendererInstance.toneMapping = ACESFilmicToneMapping;
    // WebGLRendererInstance.toneMappingExposure = 1;
    // WebGLRendererInstance.outputColorSpace = sRGBEncoding;
    // WebGLRendererInstance.setClearAlpha(0.05);
    // WebGLRendererInstance.setSize(window.innerWidth, window.innerHeight);
    WebGLRendererInstance.shadowMap.enabled = true;
    return WebGLRendererInstance;
  }

  _initCSSRendererOptions() {
    const css2DRender = new CSS2DRenderer();
    // css2d css3d css3dprite保持渲染尺寸和webgl画布大小一样的
    // css2DRender.setSize(window.innerWidth, window.innerHeight);
    css2DRender.domElement.style.position = 'absolute';
    css2DRender.domElement.style.top = '0px';
    css2DRender.domElement.style.left = '0px';
    css2DRender.domElement.style.pointerEvents = 'none';
    this.WebGLRenderer.domElement.appendChild(css2DRender.domElement);
    return css2DRender;
  }

  dispose() {
    this.PMREMGenerator.dispose();
    this.WebGLRenderer.dispose();
    // this.CSSRenderer.dispose();
  }
}
