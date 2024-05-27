import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' // debug camera
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import GUI from 'lil-gui'; 
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

// DEBUG CONTROLS
//you can do this by adding ?debug=true to the URL.
//https://lil-gui.georgealways.com/
// const gui = new GUI()

// declarations
// let

// init();

animate(performance.now());

function animate(previousTime) {
    requestAnimationFrame((currentTime) => animate(currentTime));

    let deltaTime = currentTime - previousTime;

    update(deltaTime);

    renderer.render(scene, camera);
}

function update(deltaTime) {
    // Update animations or physics with deltaTime
    // For example, rotate a mesh:
    cube.rotation.x += 0.01 * deltaTime
    cube.rotation.y += 0.05 * deltaTime
}



// helper functions
function createCube(width, height, depth, color){
    const cubegeometry = new THREE.BoxGeometry( width, height, depth );
    const cubematerial = new THREE.MeshStandardMaterial( { color: color } );
    const cubeoutput = new THREE.Mesh( cubegeometry, cubematerial );
    // console.log(cube)
    return cubeoutput;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize );





// code below
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement)


// creating cube
const cube = createCube(1,1,1,0x00ff00)
cube.castShadow = true
// scene.add( cube );

// creating "plane"
const plane = createCube(5,0.1,5,0xff0000)
plane.position.y -= 3
plane.receiveShadow = true
scene.add( plane );


// creating light
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.y= 5
light.position.z =3
light.castShadow = true
scene.add( light )

const bulb = createCube(.5,.5,.5,0xffffff)
bulb.position.y = light.position.y
bulb.position.z = light.position.z
scene.add( bulb )

camera.position.z = 5;

const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)





const div = document.createElement( 'div' );
div.style.width = '480px';
div.style.height = '360px';
div.style.backgroundColor = '#000';

const iframe = document.createElement( 'iframe' );
iframe.style.width = '480px';
iframe.style.height = '360px';
iframe.style.border = '0px';
iframe.src = [ 'https://www.youtube.com/embed/', 'SJOz3qjfQXU', '?rel=0' ].join( '' );
div.appendChild( iframe );

const object = new CSS3DObject( div );
object.position.set( 1, 1, 1 );
object.rotation.y = 0;
scene.add(object)

const container = document.getElementById( 'container' );
const renderer2 = new CSS3DRenderer();
renderer2.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer2.domElement );





// skybox
const fbxLoader = new FBXLoader()
fbxLoader.load(
    'basic_skybox_3d_flip.fbx',
    (object) => {
        object.traverse(function (child) {
            if (child.isMesh) {
              console.log(child.geometry.attributes.uv)
    
              const texture = new THREE.TextureLoader().load(
                'clouds_anime_6k.jpg'
              )
              child.material.map = texture
              child.material.needsUpdate = true
              child.material.emissiveMap = new THREE.TextureLoader().load( "clouds_anime_6k.jpg" );
              child.material.emissive = new THREE.Color( 0xffffff );
              child.material.emissiveIntensity = .5

            }
          })
    
          object.scale.set(0.01, 0.01, 0.01)
          scene.add(object)
          console.log(object)
    }
)




