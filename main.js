import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' // debug camera
import GUI from 'lil-gui'; 

// DEBUG CONTROLS
//you can do this by adding ?debug=true to the URL.
//https://lil-gui.georgealways.com/
const gui = new GUI()

const myObject = {
	myBoolean: true,
	// myFunction: function() { ... },
	myString: 'lil-gui',
	myNumber: 1
};

gui.add( myObject, 'myBoolean' );  // Checkbox
// gui.add( myObject, 'myFunction' ); // Button
gui.add( myObject, 'myString' );   // Text Field
gui.add( myObject, 'myNumber' );   // Number Field

// gui
//   .add(light, 'intensity')
//   .min(0)
//   .max(1)
//   .step(0.0001)
//   .name('ambient light intensity')

// gui.addColor(light, 'color').name('ambient light color')


// helper functions
function createCube(width, height, depth, color){
    const cubegeometry = new THREE.BoxGeometry( width, height, depth );
    const cubematerial = new THREE.MeshStandardMaterial( { color: color } );
    const cubeoutput = new THREE.Mesh( cubegeometry, cubematerial );
    // console.log(cube)
    return cubeoutput;
}







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
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement)


// creating cube
const cube = createCube(1,1,1,0x00ff00)
cube.castShadow = true
scene.add( cube );

// creating "plane"
const plane = createCube(5,0.5,5,0xff0000)
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

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    cube.rotation.x += 0.01
    cube.rotation.y += 0.05
}
animate();