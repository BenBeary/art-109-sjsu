// Basic Three.JS scene from documentation, importing Three.JS through a CDN 
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene


//~~~~~~~Import Three.js (also linked to as import map in HTML)~~~~~~
import * as THREE from 'three';

// Import add-ons
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js'; // to load 3d models



// ~~~~~~~~~~~~~~~~Create scene here~~~~~~~~~~~~~~~~

let scene, camera, renderer, cube, cylinder, SpaceShip;
let sceneContainer = document.querySelector("#scene-container");
let mixer;

// animation variables
let clips;

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer( { antialias: true});
    renderer.setSize(sceneContainer.clientWidth,sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);
    
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
    const cyl_material = new THREE.MeshBasicMaterial( {map: cyl_texture, alpha: true} ); 
    cylinder = new THREE.Mesh( cyl_geometry, cyl_material ); 
    scene.add( cylinder );
    
    cylinder.position.z = 4;
    cube.position.z = -4;
    camera.position.z = -5;
}


const clock = new THREE.Clock();

function animate(){
    requestAnimationFrame(animate);


    if(SpaceShip){

        SpaceShip.position.x = Math.sin(Date.now() / 5000) * 4;
        SpaceShip.position.y = Math.sin(Date.now() / 3000) * 4;
        SpaceShip.position.z = Math.sin(Date.now() / 4000) * 4;
        // SpaceShip.rotation.x = Math.sin(Date.now() / 5000) * -2;
        // SpaceShip.rotation.y = Math.sin(Date.now() / 3000) * -2;
        // SpaceShip.rotation.z = Math.sin(Date.now() / 4000) * -2;
        mixer.update(clock.getDelta());
    }

    renderer.render(scene,camera);
}



function onWindowResize() {
    camera.aspect =  sceneContainer.clientWidth / sceneContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneContainer.clientWidth,sceneContainer.clientHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
// ~~~~~~~~~~~~~~~~ Initiate add-ons ~~~~~~~~~~~~~~~~
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader(); // to load 3d models



loader.load('3d_Model/SpaceShip.gltf', function (gltf){
    SpaceShip = gltf.scene
    scene.add(SpaceShip);
    // SpaceShip.scale.set(2,2,2);
    SpaceShip.position.y = -2;
    mixer = new THREE.AnimationMixer(SpaceShip);
    clips = gltf.animations;
})

// event Listener

document.querySelector("body").addEventListener("mousedown", () => {
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
        action.paused = false;
    })
})
document.querySelector("body").addEventListener("mouseup", () => {
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.paused = true;
    })
})
document.querySelector("body").addEventListener("mousemove", () => {
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.01;
    cylinder.rotation.y += 0.01;
    cylinder.rotation.z += 0.01;
    cube.position.x = Math.sin(Date.now() / 5000) * 4 - 2;
    cube.position.y = Math.sin(Date.now() / 3000) * 4 - 2;
    cube.position.z = Math.sin(Date.now() / 4000) * 4 - 2;
    cylinder.position.x = Math.sin(Date.now() / 5000) * 4 + 2;
    cylinder.position.y = Math.sin(Date.now() / 3000) * 4 + 2;
    cylinder.position.z = Math.sin(Date.now() / 4000) * 4 + 2;
})



// →→→→→→ Follow next steps in tutorial: // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene


