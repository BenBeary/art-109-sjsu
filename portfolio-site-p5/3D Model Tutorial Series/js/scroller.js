import * as THREE from "three";


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
})


renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 50;

renderer.render(scene,camera);


const geometry = new THREE.TorusGeometry(10,3,16,100);
const texture = new THREE.TextureLoader().load('textures/grass.jpg');
const material = new THREE.MeshBasicMaterial({map: texture});

const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
torus.position.z = -55;
torus.position.x = -10;

function moveCamera(){
    const t = document.body.getBoundingClientRect().top;

    camera.position.z = t * 0.1;
    camera.position.x = t * 0.01;
}

document.body.onscroll = moveCamera;

moveCamera();


function animate(){
    requestAnimationFrame(animate);
    torus.rotation.z += 0.01;
    renderer.render(scene,camera);
}

function onWindowResize() {
    camera.aspect =  window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

animate();
