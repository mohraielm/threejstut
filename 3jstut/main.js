import './style.css'
import * as THREE from 'three';

// this is where we create the scene to hold all our objects and camera
const scene = new THREE.Scene();

//perspective camera is used to mimic what the human eye would see
//(field of view, aspect ratio of user's window, view frustum, view frustum)
const camera= new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);

//we need to render out the graphics to use
const renderer = new THREE.WebGL1Renderer({

//it needs to know what dom element to use which will be canvas with id of bg
  canvas: document.querySelector('#bg'),
});

//we can set the pixel ratio to the window device pixel ratio
renderer.setPixelRatio(window.devicePixelRatio);

//making it a full screen canvas by setting render size to window size
renderer.setSize (window.innerWidth,window.innerHeight);

//rn camera is set to middle  of screen so we will move it along the z axis
//to give us a better perspective when we add shapes
camera.position.setZ(30);

renderer.render(scene,camera);

//lets create out first object using 3js built in geometry
const geometry = new THREE.TorusGeometry(10,3,16,100)

//now we need to add material to give the ovject a color and texture
//3js offers built in material as well so we will use that
//use standard material to see it react to lighting
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});

//adding light to the scene
const pointLight = new THREE.PointLight(0xffffff);
//position it away from the center
pointLight.position.set(5, 5, 5);

//ambient light adds light to the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff);
//make sure to add it to the scene
scene.add(pointLight, ambientLight);


//now we create a mesh to combine the geometry and material
const torus= new THREE.Mesh(geometry,material);
//to add it to the scene just scene.add it
scene.add(torus)

//rerender the scene using the animation function, loop
function animate(){
  requestAnimationFrame(animate);
//to make the shape rotate when they are rendered
torus.rotation.x += 0.01;
torus.rotation.y += 0.005;
torus.rotation.z += 0.01;

  renderer.render(scene,camera);
}
//call the rendering function
animate()
