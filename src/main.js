import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('viewer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // white background
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 25, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

scene.add(new THREE.DirectionalLight(0xffffff, 2));
scene.add(new THREE.AmbientLight(0x404040));

scene.add(new THREE.DirectionalLight(0xffffff, 2));
scene.add(new THREE.AmbientLight(0x404040));

// 🔴 Debug box to confirm rendering works
const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
scene.add(box);


const loader = new GLTFLoader();
loader.load('/models/Building.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  let scrollY = 0;
  let rotationTarget = 0;

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    rotationTarget = scrollY * 0.002;
  });

  function animate() {
    requestAnimationFrame(animate);
    model.rotation.y += (rotationTarget - model.rotation.y) * 0.1;
    renderer.render(scene, camera);
  }
  animate();
}, undefined, (error) => {
  console.error('Failed to load model:', error);
});

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
