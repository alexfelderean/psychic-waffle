import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' // debug camera
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import GUI from 'lil-gui'; 
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// DEBUG CONTROLS
//you can do this by adding ?debug=true to the URL.
//https://lil-gui.georgealways.com/
// const gui = new GUI()

// let camera, scene, renderer;

let sky, sun, sun2;

const myObject = {
	myBoolean: true,
	// myFunction: function() { ... },
	myString: 'lil-gui',
	myNumber: 1
};

// gui.add( myObject, 'myBoolean' );  // Checkbox
// // gui.add( myObject, 'myFunction' ); // Button
// gui.add( myObject, 'myString' );   // Text Field
// gui.add( myObject, 'myNumber' );   // Number Field

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

// const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)

// const fbxLoader = new FBXLoader()
// fbxLoader.load(
//     'basic_skybox_3d_flip.fbx',
//     (object) => {
//         object.traverse(function (child) {
//             if (child.isMesh) {
//               console.log(child.geometry.attributes.uv)
    
//               const texture = new THREE.TextureLoader().load(
//                 'clouds_anime_6k.jpg'
//               )
//               child.material.map = texture
//               child.material.needsUpdate = true
//               child.material.emissiveMap = new THREE.TextureLoader().load( "clouds_anime_6k.jpg" );
//               child.material.emissive = new THREE.Color( 0xffffff );
//               child.material.emissiveIntensity = 1

//             }
//           })
    
//           object.scale.set(0.01, 0.01, 0.01)
//           scene.add(object)
//           console.log(object)
//     }
// )



const loader = new GLTFLoader();
loader.load(
	// resource URL
	'hypernova.glb',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);


let height = 0

const defaultConfig = {
    turbidity: 2,
    rayleigh: .2,
    mieCoefficient: 0.01,
    mieDirectionalG: 0.98,
    elevation: -2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

function initSky() {
    // Add Sky
    sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    sun = new THREE.Vector3();
    sun2 = new THREE.Vector3();

    renderer.toneMappingExposure = defaultConfig.exposure;

    /// GUI
    const gui = new GUI();

    gui.add( defaultConfig, 'turbidity', 0.0, 20.0, 0.1 ).onChange( handleSkyChange );
    gui.add( defaultConfig, 'rayleigh', 0.0, 4, 0.001 ).onChange( handleSkyChange );
    gui.add( defaultConfig, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( handleSkyChange );
    gui.add( defaultConfig, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( handleSkyChange );
    gui.add( defaultConfig, 'elevation', -90, 90, 0.1 ).onChange( handleSkyChange );
    gui.add( defaultConfig, 'azimuth', - 180, 180, 0.1 ).onChange( handleSkyChange );
    gui.add( defaultConfig, 'exposure', 0, 1, 0.0001 ).onChange( handleSkyChange );
    
    handleSkyChange();
}

function handleSkyChange() {

    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = defaultConfig.turbidity;
    uniforms[ 'rayleigh' ].value = defaultConfig.rayleigh;
    uniforms[ 'mieCoefficient' ].value = defaultConfig.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = defaultConfig.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - defaultConfig.elevation );
    const theta = THREE.MathUtils.degToRad( defaultConfig.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );
    sun2.setFromSphericalCoords( 2, phi, theta );

    uniforms[ 'sunPosition' ].value.copy( sun );

    function animateSky() {
        defaultConfig.elevation += 0.01
    }

    animateSky()
}

initSky()


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    cube.rotation.x += 0.01
    cube.rotation.y += 0.05
    // animateSun()
    handleSkyChange()
}

// function render() {

//     renderer.render( scene, camera );

// }

animate();