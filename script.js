// doesitlookgreat requirements:

// - plane texture (map, normal map, roughness map)
// - shadow map as texture overlay
// - apply imported texture on plane
// - program mouse to light





// import * as THREE from 'three';

import Stats from 'https://unpkg.com/three@0.144.0/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.144.0/examples/jsm/controls/OrbitControls.js';

import blurMono16 from './mono16.js';

// import dat gui
// import * as dat from "./dat.gui.min.js"
// console.log(dat)
// const GUI = dat.gui
// import { GUI } from "./dat.gui.min.js"
// "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js"

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

let container, stats;
var camera, scene, renderer, light, cube;

await init();
animate();

async function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.set(0, 15, 0);

    camera.rotation.y = 0;
    camera.rotation.x = -Math.PI / 2;
    camera.rotation.z = -Math.PI / 2;


    // SCENE

    scene = new THREE.Scene();




    // create a texture image from the alpha.png


    // let omg = new RGBLoader().image.load('alpha.png', img => {
    //     new BlurredEnvMapGenerator(renderer).generate(img, 0)
    // })




    // var customDepthMaterial = new THREE.MeshDepthMaterial({

    //     depthPacking: THREE.RGBADepthPacking,

    //     alphaMap: textureCube, // or, alphaMap: myAlphaMap

    //     alphaTest: 0.5

    // });
    // creating a texture with canvas
    // var canvas = document.createElement('canvas'),
    //     ctx = canvas.getContext('2d');
    // canvas.width = 64;
    // canvas.height = 64;
    // // drawing gray scale areas
    // ctx.fillStyle = '#ffffff';
    // ctx.fillRect(0, 0, 50, 50);
    // ctx.fillStyle = '#808080';
    // ctx.fillRect(32, 0, 32, 32);
    // ctx.fillStyle = '#c0c0c0';
    // ctx.fillRect(0, 32, 32, 32);
    // ctx.fillStyle = '#f0f0f0';
    // ctx.fillRect(32, 32, 32, 32);
    // var myImg = new Image();
    // img.onload = function() {
    //     ctx.drawImage(myImg, 0, 0);
    // };
    // img.src = 'https://www.tutorialspoint.com/images/seaborn-4.jpg?v=2';



    const textureImage = new Image();
    textureImage.src = 'alpha.png';

    // create a texture from textureImage
    const texture = new THREE.Texture(textureImage);
    texture.matrixAutoUpdate = false;

    // var text = new THREE.CanvasTexture(canvas);



    // make cube not visable
    // cube.visible = false;

    // cube.customDepthMaterial = customDepthMaterial
    // cube.material = customDepthMaterial
    // cube.alphaMap = texture
    // cube.material.map = texture


    // add a texture to the cube using textureCube
    // cube.material.map = texture
    // cube.material.alphaMap = text






    // add plane on y 0 that recieves shadows
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);



    // with textures

    // add texture to paper

    // add shadow object in front of light source

    // LIGHTS

    light = new THREE.DirectionalLight(0xaabbff, 0.3);
    light.position.x = 4.5;
    light.position.y = 22;
    light.position.z = 0;
    light.intensity = 0.3;

    // make light face downwards
    light.target = plane


    // add shadow cast to light variable
    light.castShadow = true;
    // light.shadow.radius = 0.001;
    scene.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 10; // default
    light.shadow.camera.far = 50; // default
    light.shadow.radius = 0;
    // light.shadow.blurSample = 10000

    // const d = 10;

    // light.shadow.camera.left = -d;
    // light.shadow.camera.right = d;
    // light.shadow.camera.top = d;
    // light.shadow.camera.bottom = -d;

    // SKYDOME

    const vertexShader = document.getElementById('vertexShader').textContent;
    const fragmentShader = document.getElementById('fragmentShader').textContent;
    const uniforms = {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 400 },
        exponent: { value: 0.6 }
    };
    uniforms.topColor.value.copy(light.color);

    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    // scene.add(sky);

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
    // renderer.shadowMapWidth = 1024; // default is 512
    // renderer.shadowMapHeight = 1024; // default is 512

    // generate sleep function promise
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // const ctxx = document.createElement('canvas').getContext('2d');
    const dst = document.getElementById('myCanvas')
    const ctxx = document.getElementById('myCanvas').getContext('2d');
    ctxx.canvas.width = 256;
    ctxx.canvas.height = 256;
    // ctxx.fillStyle = '#fff';
    // ctxx.fillRect(0, 0, ctxx.canvas.width - 120, ctxx.canvas.height);
    let url = "alpha.png";
    let img = new Image();
    await new Promise(r => img.onload = r, img.src = url)
    var r = 4


    ctxx.drawImage(img, 0, 0, 256, 256);
    await sleep(100)

    var imageData = ctxx.getImageData(0, 0, dst.width, dst.height);
    var data = imageData.data;
    var size = 256 * 256;
    var dataMono16 = new Uint16Array(256 * 256);
    var i;

    for (i = 0; i < size; i++) {
        dataMono16[i] = (data[4 * i] + data[4 * i + 1] + data[4 * i + 2]) / 3;
    }

    blurMono16(dataMono16, 256, 256, r);

    for (i = 0; i < size; i++) {
        data[4 * i] = data[4 * i + 1] = data[4 * i + 2] = dataMono16[i];
    }

    ctxx.putImageData(imageData, 0, 0);


    await sleep(200)
    const textur = new THREE.CanvasTexture(ctxx.canvas);








    //  SHADOW BOX
    const geometry = new THREE.BoxGeometry(10, 0.0001, 10);
    const loader = await new THREE.TextureLoader();

    const t = await loader.loadAsync('alpha.png')
        // const blurred_t = t


    const material = new THREE.MeshBasicMaterial({
        alphaMap: textur,
        colorWrite: false,
        depthWrite: false,
    });

    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 6
    cube.position.x = 2
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.material.alphaTest = 0.5
    cube.material.alphaMap.needsUpdate = true;

    scene.add(cube);



    // CONTROLS

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.enableZoom = true;

    // STATS

    stats = new Stats();
    container.appendChild(stats.dom);

    // MODEL
    const sceneJsonURL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/json/lightmap/lightmap.json'


    // three objectloader load file scene.json

    // const loader = new THREE.ObjectLoader();
    // const object = await loader.loadAsync("scene.json");
    // scene.add(object);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

const gui = new dat.GUI()

// cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
// cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
// cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
// cubeFolder.open()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', -50, 50)
cameraFolder.add(camera.position, 'y', 0, 200)
cameraFolder.add(camera.position, 'z', -50, 50)

const lightFolder = gui.addFolder('Light')
lightFolder.add(light.position, 'x', -50, 500)
lightFolder.add(light.position, 'y', 0, 200)
lightFolder.add(light.position, 'z', -50, 500)

// create a cube folder for cube variable in x y z
const cubeFolder = gui.addFolder('Cube')
cubeFolder.add(cube.position, 'x', -10, 10)
cubeFolder.add(cube.position, 'y', -10, 10)
cubeFolder.add(cube.position, 'z', -10, 10)




cameraFolder.open()


function animate() {

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    stats.update();
    // console.log(camera.rotation)
}

// function blur(imageObj, context, passes) {
//     var i, x, y;
//     passes = passes || 4;
//     context.globalAlpha = 0.125;
//     // Loop for each blur pass.
//     for (i = 1; i <= passes; i++) {
//       for (y = -1; y < 2; y++) {
//         for (x = -1; x < 2; x++) {
//             context.drawImage(imageObj, x, y);
//         }
//       }
//     }
//     context.globalAlpha = 1.0;
//   }

//   //add the function call in the imageObj.onload
//   imageObj.onload = function(){
//     blur(imageObj, context);
//   };

function blurTexture(texture) {

    const width = texture.image.width;
    const height = texture.image.height;

    const cameraRTT = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sceneRTT = new THREE.Scene();

    // render targets

    const renderTargetTemp = new THREE.WebGLRenderTarget(width, height);
    const renderTargetFinal = new THREE.WebGLRenderTarget(width, height);

    // shader materials

    const hBlurMaterial = new THREE.ShaderMaterial({
        vertexShader: THREE.HorizontalBlurShader.vertexShader,
        fragmentShader: THREE.HorizontalBlurShader.fragmentShader,
        uniforms: THREE.UniformsUtils.clone(THREE.HorizontalBlurShader.uniforms)
    });

    hBlurMaterial.uniforms.tDiffuse.value = texture;
    hBlurMaterial.uniforms.h.value = 1 / width;

    const vBlurMaterial = new THREE.ShaderMaterial({
        vertexShader: THREE.VerticalBlurShader.vertexShader,
        fragmentShader: THREE.VerticalBlurShader.fragmentShader,
        uniforms: THREE.UniformsUtils.clone(THREE.VerticalBlurShader.uniforms)
    });

    vBlurMaterial.uniforms.tDiffuse.value = renderTargetTemp.texture;
    vBlurMaterial.uniforms.v.value = 1 / height;

    // fullscreen quad

    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    const fullScreenQuad = new THREE.Mesh(planeGeometry, hBlurMaterial);
    sceneRTT.add(fullScreenQuad);

    // first pass

    renderer.setRenderTarget(renderTargetTemp);
    renderer.render(sceneRTT, cameraRTT);
    renderer.setRenderTarget(null);

    // second pass

    fullScreenQuad.material = vBlurMaterial;

    renderer.setRenderTarget(renderTargetFinal);
    renderer.render(sceneRTT, cameraRTT)
    renderer.setRenderTarget(null);




    //

    return renderTargetFinal.texture;


}