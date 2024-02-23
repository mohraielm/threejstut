import './style.css'
import * as THREE from 'three';
//import orbit controls to be able to interact with the objects
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

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
const geometry = new THREE.TorusGeometry(10,1,16,100)

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

//create a new orbit control, will listen to dom events on the mouse and
//move camera position accordingly
const controls= new OrbitControls(camera, renderer.domElement);

//randomly generating stars to create an outer space scene
function addStar() {
  //each sphere has a radius of .25
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  //standard material
  const material = new THREE.MeshStandardMaterial({ color: 0xFF1493 });
  //join them together
  const star = new THREE.Mesh(geometry, material);

  //randomly generate an x,y,z for each star
  const [x, y, z] = Array(3)
    .fill()
    //helper function to randomly generate a number from -100 to 100
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
//calling the function we created to make 200 stars
Array(200).fill().forEach(addStar);


//adding a space background
const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
scene.background = spaceTexture;

// My picture
//texture load your picture, for now we will use example pic pfp.jpg
const moTexture = new THREE.TextureLoader().load('pfp.jpg');
//create a mesh with box geometry and basic material
const momo = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: moTexture }));
//add the object to the scene
scene.add(momo);

//we can create different shapes with texture mapping such as a moon
const moonTexture = new THREE.TextureLoader().load('moon.jpeg');

const moon = new THREE.Mesh(
  //a sphere with a radius of 3 and mesh standard material
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture
  })
);
scene.add(moon);

//reposition the moon further down, where we will be scrolling to
moon.position.z=30;
moon.position.setX(-10);

//define a function to be an event handler everytime a user scrolls
function moveCamera(){
  //gives dimensions of viewport to see where user is scrolling from
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  momo.rotation.y += 0.01;
  momo.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll=moveCamera;
moveCamera();

//rerender the scene using the animation function, loop
function animate(){
  requestAnimationFrame(animate);
//to make the shape rotate when they are rendered
torus.rotation.x += 0.01;
torus.rotation.y += 0.005;
torus.rotation.z += 0.01;

//make sure orbitcontrols are updated in animate function
  controls.update();
  renderer.render(scene,camera);
}
//call the rendering function
animate()
