// Basic Three.JS scene from documentation, importing Three.JS through a CDN 
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene


//~~~~~~~Import Three.js (also linked to as import map in HTML)~~~~~~
import * as THREE from 'three';

// Import add-ons
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js'; // to load 3d models



// ~~~~~~~~~~~~~~~~Create scene here~~~~~~~~~~~~~~~~

let scene, camera, renderer, cube, cylinder;

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer( { antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    const light = new THREE.DirectionalLight(0xffffff, 3)
    light.position.set(1,1,5);
    scene.add(light);

    const second_light = new THREE.DirectionalLight(0xffffff, 2)
    second_light.position.set(1,1,-5);
    scene.add(second_light);

    const geometry = new THREE.BoxGeometry(2,2,2);
    const texture = new THREE.TextureLoader().load('textures/tower-defence-game_1000px.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    cube = new THREE.Mesh(geometry,material);
    scene.add(cube);
    
    const cyl_geometry = new THREE.CylinderGeometry( 1, 1, 3, 5 ); 
    const cyl_texture = new THREE.TextureLoader().load('textures/grass.jpg');
    const cyl_material = new THREE.MeshBasicMaterial( {map: cyl_texture} ); 
    cylinder = new THREE.Mesh( cyl_geometry, cyl_material ); 
    scene.add( cylinder );
    
    cylinder.position.z = 4;
    cube.position.z = -4;
    camera.position.z = -5;
}



function animate(){
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.z += 0.01;
    cylinder.rotation.y += 0.01;
    cylinder.rotation.z += 0.01;
    

    renderer.render(scene,camera);
}



function onWindowResize() {
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
// ~~~~~~~~~~~~~~~~ Initiate add-ons ~~~~~~~~~~~~~~~~
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader(); // to load 3d models



loader.load('3d_Model/SpaceShip.gltf', function (gltf){
    const SpaceShip = gltf.scene
    scene.add(SpaceShip);
})

// →→→→→→ Follow next steps in tutorial: // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene


