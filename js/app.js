var _ = require('lodash');
var three = require('three');
var OrbitControls = require('three-orbit-controls')(three)

var Planet = require('./planet.js');
var planeFactory = require('./plane.js');


var scene = new three.Scene();

var camera = new three.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.y = 1000;
camera.lookAt(new three.Vector3(0,0,0));

var renderer = new three.WebGLRenderer();

//renderer.setClearColor(0xAAAAAA, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var bodies = [];

// 2 spheres
// lines out of them
// bent mesh of gravitation
// gradient map of gravitation


var sun = new Planet({size: 50, color: 0xffffff}, scene);
bodies.push(sun);

var earth = new Planet({size: 10, color: 0xffffff, velocity: new three.Vector3(0, 0, 2)}, scene);
bodies.push(earth);

earth.mesh.position.x = 300;

var plane = planeFactory();
scene.add(plane);

var ambientLight = new three.AmbientLight(0x909090);
scene.add(ambientLight);

//var pointLight = new three.PointLight(0xFFFFFF);
//scene.add(pointLight);
//pointLight.position.set(0,0,500);

function update () {
    _.each(bodies, function (body) {
        var forceVector = calculateAllForces(body);
        var acceleration = forceVector.divideScalar(body.mass);

        body.velocity = body.velocity.add(acceleration);
        body.forces = forceVector;

        body.update();
    });
}

function calculateAllForces (subject) {
    var forceVector = new three.Vector3();

    _.each(bodies, function (object) {
        if (subject.id === object.id) return;

        forceVector.add(calculateForce(subject, object));
    });

    console.log(subject.id + ': ' + forceVector.length());

    return forceVector;
}

function calculateForce (subject, object) {
    var forceVector = new three.Vector3().subVectors(subject.mesh.position, object.mesh.position);
    var length = forceVector.length();
    var directionVector = new three.Vector3().copy(forceVector).divideScalar(forceVector.length());

    return directionVector.multiplyScalar(0.005 * subject.mass * object.mass / length * length);
}

var controls = new OrbitControls(camera);

function render () {
    update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();
