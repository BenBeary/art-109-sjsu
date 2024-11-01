// Basic Three.JS scene from documentation, importing Three.JS through a CDN 
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene


//~~~~~~~Import Three.js (also linked to as import map in HTML)~~~~~~
import * as THREE from 'three';

// Import add-ons
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js'; // to load 3d models



// ~~~~~~~~~~~~~~~~Create scene here~~~~~~~~~~~~~~~~

let SpaceShip;

let mixer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#three-container").appendChild(renderer.domElement);


// const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader(); // to load 3d models



// Cube initialization
const geometry = new THREE.BoxGeometry(2,2,2);
const texture = new THREE.TextureLoader().load('images/tower-defence-game_1000px.png');
const material = new THREE.MeshBasicMaterial({map: texture});
const cube = new THREE.Mesh(geometry,material);
scene.add(cube);

const secondTexture = new THREE.TextureLoader().load('images/game-board_1000px.png');
const secondMaterial = new THREE.MeshBasicMaterial({map: secondTexture});
const cubeTwo = new THREE.Mesh(geometry,secondMaterial);
scene.add(cubeTwo);


camera.position.z = -5;


function init(){
    
    cube.position.set(0,0,-15)
    cubeTwo.position.set(0,0,-15)

    const light = new THREE.DirectionalLight(0xffffff, 3)
    light.position.set(1,1,5);
    scene.add(light);

    const second_light = new THREE.DirectionalLight(0xffffff, 2)
    second_light.position.set(1,1,-5);
    scene.add(second_light);
   

}


const clock = new THREE.Clock();

function animate(){
    requestAnimationFrame(animate);


    let scrollY = window.scrollY / document.body.scrollHeight *100;
    cube.position.x = scrollY * .25 - 10; 
    cube.position.y = -scrollY * .25 + 10;
    cubeTwo.position.x = scrollY * .25 - 23; 
    cubeTwo.position.y = -scrollY * .25 + 20;
    

    cube.rotation.x = Math.sin(Date.now() / 5000) * 4 - 2;
    cube.rotation.y = Math.sin(Date.now() / 3000) * 4 - 2;
    cube.rotation.z = Math.sin(Date.now() / 4000) * 4 - 2;
    cubeTwo.rotation.y = Math.sin(Date.now() / 3000) * 4 - 2;
    cubeTwo.rotation.x = Math.sin(Date.now() / 5000) * 4 - 2;
    cubeTwo.rotation.z = Math.sin(Date.now() / 4000) * 4 - 2;



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
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
// ~~~~~~~~~~~~~~~~ Initiate add-ons ~~~~~~~~~~~~~~~~




// loader.load('assets/SpaceShip.gltf', function (gltf){
//     SpaceShip = gltf.scene
//     scene.add(SpaceShip);
//     // SpaceShip.scale.set(2,2,2);
//     SpaceShip.position.y = -2;
//     mixer = new THREE.AnimationMixer(SpaceShip);
//     clips = gltf.animations;
// })

// // event Listener

// document.querySelector("body").addEventListener("mousedown", () => {
//     clips.forEach(function(clip) {
//         const action = mixer.clipAction(clip);
//         action.play();
//         action.paused = false;
//     })
// })
// document.querySelector("body").addEventListener("mouseup", () => {
//     clips.forEach(function(clip) {
//         const action = mixer.clipAction(clip);
//         action.paused = true;
//     })
// })
// document.querySelector("body").addEventListener("mousemove", () => {
//     cube.rotation.x += 0.01;
//     cube.rotation.z += 0.01;
//     cube.position.x = Math.sin(Date.now() / 5000) * 4 - 2;
//     cube.position.y = Math.sin(Date.now() / 3000) * 4 - 2;
//     cube.position.z = Math.sin(Date.now() / 4000) * 4 - 2;
// })



// →→→→→→ Follow next steps in tutorial: // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene


