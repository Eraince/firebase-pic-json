import * as THREE from "../resources/three.module.js";
import { OrbitControls } from "../resources/examples/jsm/controls/OrbitControls.js";
import { OBJLoader2 } from "../resources/examples/jsm/loaders/OBJLoader2.js";
import { FBXLoader } from "../resources/examples/jsm/loaders/FBXLoader.js";
import { MTLLoader } from "../resources/examples/jsm/loaders/MTLLoader.js";
import { MtlObjBridge } from "../resources/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";

import { EffectComposer } from "../resources/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../resources/examples/jsm/postprocessing/RenderPass.js";
import { BloomPass } from "../resources/examples/jsm/postprocessing/BloomPass.js";
import { FilmPass } from "../resources/examples/jsm/postprocessing/FilmPass.js";

const canvas = document.querySelector("#c");
const intro = document.querySelector("#introduction");
const preview = document.querySelector("#preview");
const surgery = document.getElementById("surgery");
const adVideo = document.getElementById("introVideo");
const soundBackground = document.getElementById("360sound");
let mixer, renderer, camera, scene, composer;
let obj1, obj2, obj3, obj4, obj5;

let clock = new THREE.Clock();

const FBXloader = new FBXLoader();
const loader = new THREE.TextureLoader();
loader.setCrossOrigin("");

let stage0 = new THREE.Vector3(0, -400, 450);
let stage1 = new THREE.Vector3(0, 0, 0);
let stage2 = new THREE.Vector3(0, 0, -400);
let stage3 = new THREE.Vector3(0, 0, -800);
let stage4 = new THREE.Vector3(0, 0, -1200);
let stage5 = new THREE.Vector3(0, 0, -1600);

function main(url, url2) {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

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
  scene1Construct(url);
  scene2Construct(stage2);
  scene3Construct(stage3);
  scene4Construct(stage4);
  scene5Construct(stage5);

  //texture of eyes

  // {
  //   const material = new THREE.MeshBasicMaterial({
  //     map: loader.load(url2),
  //   });
  //   const radius = 6.4;
  //   const widthSegments = 23;
  //   const heightSegments = 6;
  //   const phiStart = Math.PI * 0.82;
  //   const phiLength = Math.PI * 1.0;
  //   const thetaStart = Math.PI * 0.22;
  //   const thetaLength = Math.PI * 0.58;
  //   let eyes = addSolidGeometry(
  //     -57,
  //     10,
  //     5,
  //     new THREE.SphereBufferGeometry(
  //       radius,
  //       widthSegments,
  //       heightSegments,
  //       phiStart,
  //       phiLength,
  //       thetaStart,
  //       thetaLength
  //     ),
  //     material,
  //     scene
  //   );
  //   eyes.rotation.y = 3.8;
  // }

  // -----------------------------

  // ----------------------------------------------------------------
  let then = 0;
  function render(now) {
    var delta = clock.getDelta();
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

    if (mixer) mixer.update(delta);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      composer.setSize(canvas.width, canvas.height);
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
  var storageRef = firebase.storage().ref();

  storageRef
    .child("images/eyes")
    .getDownloadURL()
    .then(function (url) {
      var img = document.createElement("img");
      img.src = url;
      main(
        "https://firebasestorage.googleapis.com/v0/b/thisisatestfordrawing.appspot.com/o/images%2Famy?alt=media&token=ae5ad2cb-1f37-462d-b1f4-265c7a0f8e55",
        "https://firebasestorage.googleapis.com/v0/b/thisisatestfordrawing.appspot.com/o/images%2Feyes?alt=media&token=6fb11a69-4ac5-4f32-9fa9-8285250dbddd"
      );
    });
})();
let sceneTracking = 0;
function move() {
  if (sceneTracking <= 5) {
    var elem = document.getElementById("myBar");
    elem.style.width = sceneTracking * 20 + "%";
  }
  sceneTracking++;

  if (sceneTracking == 1) {
    gsap.to(camera.position, {
      duration: 10,
      z: 0,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });

    gsap.to(camera.rotation, {
      duration: 10,
      x: 0.5,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking == 2) {
    gsap.to(camera.position, {
      duration: 10,
      z: -200,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
    gsap.to(camera.rotation, {
      duration: 10,
      x: -0.05,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking == 3) {
    adVideo.play();
    gsap.to(camera.position, {
      duration: 10,
      z: -600,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking === 4) {
    adVideo.pause();
    gsap.to(camera.position, {
      duration: 10,
      z: -1000,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      },
    });
  }

  if (sceneTracking === 5) {
    surgery.play();
    gsap.to(camera.position, {
      duration: 10,
      z: -1450,
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

const scene1Construct = (url) => {
  {
    const material = new THREE.MeshBasicMaterial({
      map: loader.load(url),
    });
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
      material,
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
  // {
  //   const radiusTop = 40;
  //   const radiusBottom = 50;
  //   const height = 100.0;
  //   const radialSegments = 12;
  //   const heightSegments = 2;
  //   const openEnded = false;
  //   const thetaStart = Math.PI * 0.5;
  //   const thetaLength = Math.PI * 0.98;
  //   const geometry = new THREE.CylinderBufferGeometry(
  //     radiusTop,
  //     radiusBottom,
  //     height,
  //     radialSegments,
  //     heightSegments,
  //     openEnded,
  //     thetaStart,
  //     thetaLength
  //   );
  //   const material = new THREE.MeshPhongMaterial({
  //     color: 0xffff00,
  //     side: THREE.DoubleSide,
  //   });
  //   addSolidGeometry(0, 0, -400, geometry, material, scene);
  // }

  {
    const width = 100;
    const height = 50;
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    let ctx = intro.getContext("2d");
    ctx.font = "10px Arial";
    let introSentence = "HI AMY,";
    ctx.fillText(introSentence, 10, 10);
    const texture = new THREE.CanvasTexture(ctx.canvas);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
    });
    addSolidGeometry(x, y, z, geometry, material, scene);
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
