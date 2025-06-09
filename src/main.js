import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('viewer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 25, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xffffff, 0); // transparent white
container.appendChild(renderer.domElement);

scene.add(new THREE.DirectionalLight(0xffffff, 2));
scene.add(new THREE.AmbientLight(0x404040));

// 🔴 Always-visible debug cube
//const debugBox = new THREE.Mesh(
  // new THREE.BoxGeometry(10, 10, 10),
  // new THREE.MeshStandardMaterial({ color: 0xff0000 })
// );
//scene.add(debugBox);

// Animate always, with optional model rotation
let model = null;

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

const loader = new GLTFLoader();
loader.load(
  '/models/Building.glb',
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    console.log('✅ Model loaded:', model);

    // Only frame camera if model loads
    const boundingBox = new THREE.Box3().setFromObject(model);
    const size = boundingBox.getSize(new THREE.Vector3()).length();
    const center = boundingBox.getCenter(new THREE.Vector3());

    camera.position.set(center.x, center.y, size * 1.5);
    camera.lookAt(center);
  },
  undefined,
  (error) => {
    console.error('❌ Failed to load model:', error);
  }
);

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
