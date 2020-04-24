import * as THREE from "../resources/three.module.js";
//import { OrbitControls } from "../resources/examples/jsm/controls/OrbitControls.js";
import { OBJLoader2 } from "../resources/examples/jsm/loaders/OBJLoader2.js";
import { FBXLoader } from "../resources/examples/jsm/loaders/FBXLoader.js";
import { MTLLoader } from "../resources/examples/jsm/loaders/MTLLoader.js";
import { MtlObjBridge } from "../resources/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";

import { EffectComposer } from "../resources/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../resources/examples/jsm/postprocessing/RenderPass.js";
import { BloomPass } from "../resources/examples/jsm/postprocessing/BloomPass.js";
import { FilmPass } from "../resources/examples/jsm/postprocessing/FilmPass.js";

const canvas = document.querySelector("#c");

const preview = document.querySelector("#preview");
const surgery = document.getElementById("surgery");
const adVideo = document.getElementById("introVideo");
const fishJazz = document.getElementById("fishjazz");
const soundBackground = document.getElementById("360sound");

const faceUrl =
  "https://firebasestorage.googleapis.com/v0/b/thisisatestfordrawing.appspot.com/o/images%2Famy?alt=media&token=ae5ad2cb-1f37-462d-b1f4-265c7a0f8e55";
const eyeUrl =
  "https://firebasestorage.googleapis.com/v0/b/thisisatestfordrawing.appspot.com/o/images%2Feyes?alt=media&token=6fb11a69-4ac5-4f32-9fa9-8285250dbddd";
let mixer, renderer, camera, scene, composer;
let obj1,
  obj2,
  obj3,
  obj4,
  obj5,
  waterBackground,
  face1,
  face2,
  face3,
  decay1,
  decay2,
  decay3,
  fish1;

let uniforms = {
  u_time: { value: 0.0 },
  u_resolution: { value: { x: 0, y: 0 } },
};

let clock = new THREE.Clock();

const FBXloader = new FBXLoader();
const loader = new THREE.TextureLoader();
loader.setCrossOrigin("");
let facematerial;

let stage0 = new THREE.Vector3(0, -400, 450);
let stage1 = new THREE.Vector3(0, 0, 0);
let stage2 = new THREE.Vector3(0, 0, -400);
let stage3 = new THREE.Vector3(0, 0, -800);
let stage4 = new THREE.Vector3(0, 0, -1200);
let stage5 = new THREE.Vector3(0, 0, -1600);
let stage6 = new THREE.Vector3(0, 0, -2000);
let stage7 = new THREE.Vector3(0, 0, -2200);
let stage9 = new THREE.Vector3(0, 0, -2400);

function main() {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  facematerial = new THREE.MeshBasicMaterial({
    map: loader.load(faceUrl),
  });

  // set up camera
  const fov = 30;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 450;
  camera.rotation.x = -(90 * Math.PI) / 180;

  //set up scene

  scene = new THREE.Scene();

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  {
    const bloomPass = new BloomPass(
      1.5, // strength
      25, // kernel size
      4, // sigma ?
      2000 // blur render target resolution
    );
    composer.addPass(bloomPass);
  }

  {
    const filmPass = new FilmPass(
      0.05, // noise intensity
      0.025, // scanline intensity
      60, // scanline count
      false // grayscale
    );
    filmPass.renderToScreen = true;
    composer.addPass(filmPass);
  }
  // const controls = new OrbitControls(camera, canvas);
  // controls.target.set(0, 5, 0);
  // controls.update();

  //add a directional light

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
  }
  //load skybox
  {
    const skyLoader = new THREE.CubeTextureLoader();
    const texture = skyLoader.load([
      "../skybox/px.jpg",
      "../skybox/nx.jpg",
      "../skybox/py.jpg",
      "../skybox/ny.jpg",
      "../skybox/nz.jpg",
      "../skybox/pz.jpg",
    ]);
    scene.background = texture;
  }

  scene0Construct(stage0);
  scene1Construct();
  scene2Construct(stage2);
  scene3Construct(stage3);
  scene4Construct(stage4);
  scene5Construct(stage5);
  scene6Construct(stage6);
  scene7Construct(stage7);
  scene9Construct(stage9);

  // ----------------------------------------------------------------
  let then = 0;
  function render(now) {
    var delta = clock.getDelta();
    uniforms.u_time.value += delta;
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;
    if (sceneTracking === 0) {
      obj1.rotation.y = now;

      if (obj2) {
        obj2.position.set(
          -100 + Math.sin(now) * 100,
          -400 + Math.cos(now) * 100,
          450
        );
      }
      obj3.rotation.x = now * 2;
      obj3.rotation.z = now * 3;

      obj4.position.set(
        -50 + Math.cos(now) * 80,
        -400 + Math.sin(now / 2) * 100,
        450 + Math.sin(now * 3) * 50
      );

      obj5.position.set(
        50,
        -400 + Math.sin(now) * 50,
        450 + Math.cos(now * 2) * 50
      );
      obj5.rotation.x = now * 2;
    }
    if (sceneTracking === 8) {
      face1.rotation.x = now;
      face2.rotation.z = now;
      face3.rotation.y = now;
    }

    if (sceneTracking === 9) {
      // let x = fish1.head.position.x;
      // let y = fish1.head.position.y;
      // let z = fish1.head.position.z;
      changeFishPos(fish1, 0 + 3 * Math.sin(now * 3), 0, -2400);
    }

    if (mixer) mixer.update(delta);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      composer.setSize(canvas.width, canvas.height);
      uniforms.u_resolution.value.x = window.innerWidth;
      uniforms.u_resolution.value.y = window.innerHeight;
    }

    //composer.render(deltaTime);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function addObject(x, y, z, obj, scene) {
  obj.position.x = x;
  obj.position.y = y;
  obj.position.z = z;
  scene.add(obj);
  return obj;
}

function addSolidGeometry(x, y, z, geometry, material, scene) {
  const mesh = new THREE.Mesh(geometry, material);
  return addObject(x, y, z, mesh, scene);
}

let sceneTracking = 0;
function move() {
  if (sceneTracking <= 10) {
    var elem = document.getElementById("myBar");
    elem.style.left = sceneTracking * 10 + "%";
  }
  sceneTracking++;

  if (sceneTracking == 1) {
    gsap.to(camera.position, {
      duration: 5,
      z: 100,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });

    gsap.to(camera.rotation, {
      duration: 5,
      x: 0.5,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking == 2) {
    gsap.to(camera.position, {
      duration: 5,
      z: -200,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
    gsap.to(camera.rotation, {
      duration: 5,
      x: -0.05,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking == 3) {
    adVideo.play();
    gsap.to(camera.position, {
      duration: 5,
      z: -600,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking === 4) {
    adVideo.pause();
    gsap.to(camera.position, {
      duration: 5,
      z: -1000,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking === 5) {
    surgery.play();
    gsap.to(camera.position, {
      duration: 5,
      z: -1450,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking === 6) {
    surgery.pause();
    gsap.to(camera.position, {
      duration: 5,
      z: -1800,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }
  if (sceneTracking === 7) {
    fishJazz.play();
    gsap.to(camera.position, {
      duration: 5,
      z: -2050,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
    gsap.to(waterBackground.position, {
      duration: 5,
      z: -2250,
    });
  }

  if (sceneTracking === 8) {
    gsap.to(face1.position, {
      duration: 3,
      z: stage7.z + 30,
    });
    gsap.to(face2.position, {
      duration: 3,
      z: stage7.z + 30,
    });
    gsap.to(face3.position, {
      duration: 3,
      z: stage7.z + 30,
    });
    gsap.to(decay1.position, {
      duration: 3,
      z: stage7.z + 30,
    });
    gsap.to(decay2.position, {
      duration: 3,
      z: stage7.z + 30,
    });
    gsap.to(decay3.position, {
      duration: 3,
      z: stage7.z + 30,
    });
  }

  if (sceneTracking === 9) {
    fishJazz.pause();
    gsap.to(camera.position, {
      duration: 5,
      z: -2300,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }
}

const scene0Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;

  {
    const radius = 30;
    const tubeRadius = 5;
    const radialSegments = 13;
    const tubularSegments = 65;
    const geometry = new THREE.TorusBufferGeometry(
      radius,
      tubeRadius,
      radialSegments,
      tubularSegments
    );
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xffff00,
    });

    obj1 = addSolidGeometry(x, y, z, geometry, material, scene);
    obj1.rotation.x = 1.7;
  }

  {
    const loader = new THREE.FontLoader();
    loader.load(
      "../resources/examples/fonts/helvetiker_regular.typeface.json",
      function (font) {
        var geometry = new THREE.TextGeometry("Memory Generating", {
          font: font,
          size: 20,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 1,
          bevelOffset: 0,
          bevelSegments: 5,
        });
        const material = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
          color: 0xffffff,
        });
        obj2 = addSolidGeometry(x - 100, y, z, geometry, material, scene);
        obj2.rotation.x = -1.7;
      }
    );
  }

  {
    const width = 50;
    const height = 20;
    const depth = 50;
    const geometry = new THREE.BoxBufferGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xff6347,
    });

    obj3 = addSolidGeometry(x - 100, y, z, geometry, material, scene);
  }

  {
    const radius = 28;
    const detail = 2;
    const geometry = new THREE.DodecahedronBufferGeometry(radius, detail);
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0x00ff00,
    });

    obj4 = addSolidGeometry(x, y, z, geometry, material, scene);
  }
  {
    const radiusTop = 15;
    const radiusBottom = 15;
    const height = 35;
    const radialSegments = 12;

    const geometry = new THREE.CylinderBufferGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments
    );
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xff69b4,
    });

    obj5 = addSolidGeometry(x + 100, y, z, geometry, material, scene);
    obj5.rotation.x = 1.7;
  }
};

const scene1Construct = () => {
  {
    const radiusTop = 15;
    const radiusBottom = 10;
    const height = 30;
    const radialSegments = 29;
    let face = addSolidGeometry(
      -57,
      10,
      -10,
      new THREE.CylinderBufferGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments
      ),
      facematerial,
      scene
    );
    face.rotation.y = 3.14;
  }

  {
    const width = 10;
    const height = 40;
    const depth = 35;
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    let status = addSolidGeometry(
      -57,
      10,
      -10,
      new THREE.BoxBufferGeometry(width, height, depth),
      material,
      scene
    );
    status.rotation.y = -1.6;
  }
  // background big ball
  {
    const width = 35;
    const height = 35;
    const radius = 35;
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    addSolidGeometry(
      0,
      0,
      -30,
      new THREE.SphereBufferGeometry(width, height, radius),
      material,
      scene
    );
  }

  // box to display text

  {
    const width = 18;
    const height = 15;
    const depth = 1;

    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });
    addSolidGeometry(
      -10,
      -1,
      17,
      new THREE.BoxBufferGeometry(width, height, depth),
      material,
      scene
    );
  }

  // intro words model

  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader2();
    mtlLoader.load("../models/scale_test/test2.mtl", (mtlParseResult) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      objLoader.addMaterials(materials);
      objLoader.load("../models/scale_test/test2.obj", (root) => {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 0), -Math.PI / 2);
        root.applyQuaternion(quaternion);
        root.position.set(5, -5, 17);
        scene.add(root);
      });
    });
  }
  // title model

  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader2();
    mtlLoader.load("../models/amysworld.mtl", (mtlParseResult) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      objLoader.addMaterials(materials);
      objLoader.load("../models/amysworld.obj", (root) => {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 0), -Math.PI / 2);
        root.applyQuaternion(quaternion);
        root.scale.set(0.3, 0.3, 0.3);
        root.position.set(0, 30, 0);
        scene.add(root);
      });
    });
  }
  //teleport model
  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader2();
    mtlLoader.load("../models/teleport.mtl", (mtlParseResult) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      objLoader.addMaterials(materials);
      objLoader.load("../models/teleport.obj", (root) => {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 0), -Math.PI / 2);
        root.applyQuaternion(quaternion);
        root.scale.set(1.5, 1.5, 1.5);
        root.position.set(0, 0, -10);
        scene.add(root);
      });
    });
  }

  // animation body model
  {
    FBXloader.load(
      "../models/Running.fbx",
      function (object) {
        mixer = new THREE.AnimationMixer(object);
        var action = mixer.clipAction(object.animations[0]);
        action.play();
        object.scale.set(0.1, 0.1, 0.1);
        object.rotateY(THREE.Math.degToRad(180));
        object.position.set(45, 0, 40);
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(object);
      },
      undefined,
      function (e) {
        console.log(e);
      }
    );
  }
};

const scene2Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;

  {
    const width = 100;
    const height = 50;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff,
    });
    addSolidGeometry(x, y, z, geometry, material, scene);
  }

  {
    const material = new THREE.MeshPhongMaterial({
      color: 0x000000,
    });
    addText("HI AMY,", x, y + 20, z, material);
    addText("WW+.DCD.WORLD", x - 40, y + 10, z, material);
    addText("FOR:", x - 40, y + 5, z, material);
  }
};

const scene3Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;

  {
    const width = 100;
    const height = 50;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const texture = new THREE.VideoTexture(adVideo);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    addSolidGeometry(x, y, z, geometry, material, scene);
  }
};

const scene4Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;
  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader2();
    mtlLoader.load("../models/rotatingText.mtl", (mtlParseResult) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      objLoader.addMaterials(materials);
      objLoader.load("../models/rotatingText.obj", (root) => {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 0), -Math.PI / 2);
        root.applyQuaternion(quaternion);
        root.scale.set(5, 5, 5);
        root.position.set(x - 20, y, z + 50);
        scene.add(root);
      });
    });
  }

  {
    const width = 100;
    const height = 50;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    let ctx = preview.getContext("2d");
    ctx.font = "10px Arial";
    let introSentence = "Your Body Transformation ^Preview";
    ctx.fillText(introSentence, 10, 10);
    const texture = new THREE.CanvasTexture(ctx.canvas);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    addSolidGeometry(x, y, z, geometry, material, scene);
  }
};

const scene5Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;
  {
    const width = 100;
    const height = 50;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    let ctx = soundBackground.getContext("2d");

    ctx.rect(0, 0, 300, 150);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.font = "10px Arial";
    let introSentence = "The Body Transformation";
    ctx.fillStyle = "white";
    ctx.fillText(introSentence, 10, 10);
    const texture = new THREE.CanvasTexture(ctx.canvas);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    addSolidGeometry(x, y, z, geometry, material, scene);
  }
};

const scene6Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;

  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader2();
    mtlLoader.load("../models/nohead.mtl", (mtlParseResult) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      objLoader.addMaterials(materials);
      objLoader.load("../models/nohead.obj", (root) => {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 0), -Math.PI / 2);
        root.applyQuaternion(quaternion);
        root.scale.set(1, 1, 1);
        root.position.set(x, y, z);
        scene.add(root);
      });
    });
  }

  {
    const radiusTop = 4;
    const radiusBottom = 2;
    const height = 8;
    const radialSegments = 10;
    let face = addSolidGeometry(
      x,
      y + 20,
      z + 3,
      new THREE.CylinderBufferGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments
      ),
      facematerial,
      scene
    );
    face.rotation.y = 3.14;
  }

  {
    const width = 200;
    const height = 200;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vshader,
      fragmentShader: fshader,
    });
    waterBackground = addSolidGeometry(x, y, z - 20, geometry, material, scene);
  }
};

const scene7Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;

  {
    const width = 100;
    const height = 50;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const texture = new THREE.VideoTexture(fishJazz);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    addSolidGeometry(x, y, z, geometry, material, scene);
  }
  {
    const radius = 7.0;
    const geometry = new THREE.DodecahedronBufferGeometry(radius);
    face1 = addSolidGeometry(
      x - 30,
      y - 20,
      z - 30,
      geometry,
      facematerial,
      scene
    );
  }

  {
    const radius = 7.7;
    const geometry = new THREE.OctahedronBufferGeometry(radius);
    face2 = addSolidGeometry(x, y - 20, z - 30, geometry, facematerial, scene);
  }

  {
    const radius = 6;
    const height = 8;
    const radialSegments = 16;
    const geometry = new THREE.ConeBufferGeometry(
      radius,
      height,
      radialSegments
    );
    face3 = addSolidGeometry(
      x + 30,
      y - 20,
      z - 30,
      geometry,
      facematerial,
      scene
    );
  }

  {
    const material = new THREE.MeshBasicMaterial({
      map: loader.load("../assets/decay1.png"),
    });
    const radius = 7;
    const segments = 24;
    const geometry = new THREE.CircleBufferGeometry(radius, segments);
    decay1 = addSolidGeometry(
      x - 30,
      y + 10,
      z - 30,
      geometry,
      material,
      scene
    );
  }
  {
    const material = new THREE.MeshBasicMaterial({
      map: loader.load("../assets/decay2.png"),
    });
    const radius = 7;
    const segments = 24;
    const geometry = new THREE.CircleBufferGeometry(radius, segments);
    decay2 = addSolidGeometry(x, y + 10, z - 30, geometry, material, scene);
  }

  {
    const material = new THREE.MeshBasicMaterial({
      map: loader.load("../assets/decay3.png"),
    });
    const radius = 7;
    const segments = 24;
    const geometry = new THREE.CircleBufferGeometry(radius, segments);
    decay3 = addSolidGeometry(
      x + 30,
      y + 10,
      z - 30,
      geometry,
      material,
      scene
    );
  }
};

const scene9Construct = (origin) => {
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;
  fish1 = createFish(x, y, z, 1);
  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader2();
    mtlLoader.load("../models/scale_Amy.mtl", (mtlParseResult) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      objLoader.addMaterials(materials);
      objLoader.load("../models/scale_Amy.obj", (root) => {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 0), Math.PI / 2);
        root.applyQuaternion(quaternion);
        root.scale.set(2, 2, 2);
        root.position.set(x - 10, y, z);
        scene.add(root);
      });
    });
  }
};

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width != width || canvas.height != height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function addText(text, x, y, z, material) {
  const loader = new THREE.FontLoader();
  loader.load(
    "../resources/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      var geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 2,
        height: 5,
        bevelEnabled: false,
      });
      let title = addSolidGeometry(x, y, z, geometry, material, scene);
    }
  );
}

const vshader = `
void main() {	
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fshader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

uniform float u_time;
#define MAX_ITER 10
void main(void){

  vec2 position=(gl_FragCoord.xy/u_resolution);
  vec2 uv=vec2((position.x-.5)*2.,position.y-.5);
  vec2 p=uv*3.-vec2(15.);
  vec2 i=p;
  float c=1.;
  float inten=.05;
  
  for(int n=0;n<MAX_ITER;n++)
  {
      float t=u_time*(1.-(3./float(n+1)));
      i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+i.x));
      c+=1./length(vec2(p.x/(2.*sin(i.x+t)/inten),p.y/(cos(i.y+t)/inten)));
  }
  c/=float(MAX_ITER);
  c=1.5-sqrt(pow(c,2.));
  gl_FragColor=vec4(vec3(c*c*c*c*.3,c*c*c*c*.5,c*c*c*c*.825),1.);
}
`;

const createFish = (x, y, z, scale) => {
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });
  let fish = {};
  {
    const radiusTop = 1.1;
    const radiusBottom = 4;
    const height = 5;
    const radialSegments = 12;
    const geometry = new THREE.CylinderBufferGeometry(
      radiusTop * scale,
      radiusBottom * scale,
      height * scale,
      radialSegments
    );
    fish.body = addSolidGeometry(x + 5, y, z, geometry, material, scene);
    fish.body.rotation.z = 1.5;
  }
  {
    const radius = 3;
    const detail = 4;
    const geometry = new THREE.DodecahedronBufferGeometry(
      radius * scale,
      detail
    );
    fish.head = addSolidGeometry(x, y, z, geometry, material, scene);
  }

  {
    const material = new THREE.MeshBasicMaterial({
      map: loader.load(eyeUrl),
    });
    const radius = 1.5;
    const widthSegments = 23;
    const heightSegments = 6;
    const phiStart = Math.PI * 0.82;
    const phiLength = Math.PI * 1.0;
    const thetaStart = Math.PI * 0.22;
    const thetaLength = Math.PI * 0.58;
    fish.lefteye = addSolidGeometry(
      x - 2,
      y,
      z + 3,
      new THREE.SphereBufferGeometry(
        radius * scale,
        widthSegments,
        heightSegments,
        phiStart,
        phiLength,
        thetaStart,
        thetaLength
      ),
      material,
      scene
    );
    fish.lefteye.rotation.y = 3.0;
  }
  return fish;
};

const changeFishPos = (fish, x, y, z) => {
  fish.head.position.set(x, y, z);
  fish.body.position.set(x + 5, y, z);
  fish.lefteye.position.set(x - 2, y, z + 3);
};

(function () {
  document.addEventListener(
    "keydown",
    (event) => {
      const code = event.keyCode;
      if (code === 38) {
        move();
      }
    },
    false
  );
  main();
})();
