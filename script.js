// doesitlookgreat requirements:

// - plane texture (map, normal map, roughness map)
// - shadow map as texture overlay
// - apply imported texture on plane
// - program mouse to light





import * as THREE from 'three';

import Stats from 'https://unpkg.com/three@0.144.0/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.144.0/examples/jsm/controls/OrbitControls.js';

// import dat gui
// import * as dat from "./dat.gui.min.js"
// console.log(dat)
// const GUI = dat.gui
// import { GUI } from "./dat.gui.min.js"
// "https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js"

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

let container, stats;
let camera, scene, renderer, light, cube;

await init();
animate();

async function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(40, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.set(0, 50, 0);

    camera.rotation.y = 0;
    camera.rotation.x = -Math.PI / 2;
    camera.rotation.z = -Math.PI / 2;


    // SCENE

    scene = new THREE.Scene();




    // create a texture image from the alpha.png
    const textureImage = new Image();
    textureImage.src = 'alpha.png';

    // create a texture from textureImage
    const texture = new THREE.Texture(textureImage);
    texture.matrixAutoUpdate = false;



    // var customDepthMaterial = new THREE.MeshDepthMaterial({

    //     depthPacking: THREE.RGBADepthPacking,

    //     alphaMap: textureCube, // or, alphaMap: myAlphaMap

    //     alphaTest: 0.5

    // });
    // creating a texture with canvas
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;
    // drawing gray scale areas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 50, 50);
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

    // ctx.drawImage(img, 0, 0);

    var text = new THREE.CanvasTexture(canvas);

    // add box with shadows
    const geometry = new THREE.BoxGeometry(10, 0.0001, 10);
    const loader = new THREE.TextureLoader();

    const material = new THREE.MeshBasicMaterial({
        // map: loader.load('https://r105.threejsfundamentals.org/threejs/resources/images/wall.jpg'),
        alphaMap: loader.load('alpha.png'),
        colorWrite: false,
        depthWrite: false,
    });
    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 6
    cube.position.x = 2
    cube.castShadow = true;
    cube.receiveShadow = true;

    // make cube not visable
    // cube.visible = false;

    // cube.customDepthMaterial = customDepthMaterial
    // cube.material = customDepthMaterial
    // cube.alphaMap = texture
    // cube.material.map = texture


    // add a texture to the cube using textureCube
    // cube.material.map = texture
    // cube.material.alphaMap = text
    cube.material.alphaTest = 0.5

    scene.add(cube);





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
    light.shadow.mapSize.width = 1024; // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.near = 0.1; // default
    light.shadow.camera.far = 5000; // default
    light.shadow.radius = 1;

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.shadowMapWidth = 1024; // default is 512
    // renderer.shadowMapHeight = 1024; // default is 512

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