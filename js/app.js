var _ = require('lodash');
var three = require('three');
var OrbitControls = require('three-orbit-controls')(three)
var Stats = require('./vendor/stats.min.js');

var Planet = require('./planet.js');
var planeFactory = require('./plane.js');
var physics = require('./physics.js');

var scene = new three.Scene();

var camera = new three.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.y = 1000;
camera.lookAt(new three.Vector3(0,0,0));

var renderer = new three.WebGLRenderer();

var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
stats.domElement.style.left = '0px';
document.body.appendChild(stats.domElement);

//renderer.setClearColor(0xAAAAAA, 1);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var bodies = [];

// 2 spheres
// lines out of them
// bent mesh of gravitation
// gradient map of gravitation


var sun = new Planet({size: 50, mass: 3000, color: 0xffffff}, scene);
bodies.push(sun);

var earth = new Planet({size: 10, color: 0xffffff, velocity: new three.Vector3(0, 0, 2), position: new three.Vector3(300, 0, 0)}, scene);
bodies.push(earth);

var plane = planeFactory();
scene.add(plane);

var ambientLight = new three.AmbientLight(0x909090);
scene.add(ambientLight);

//var pointLight = new three.PointLight(0xFFFFFF);
//scene.add(pointLight);
//pointLight.position.set(0,0,500);

function update () {
    _.each(bodies, function (body) {
        body.force = calculateAllForces(body);;
        body.update();
    });
}

function calculateAllForces (subject) {
    var forceVector = new three.Vector3();

    _.each(bodies, function (object) {
        if (subject.id === object.id) return;

        forceVector.add(physics.calculateForce(subject, object));
    });

    return forceVector;
}

var controls = new OrbitControls(camera);

function render () {
    stats.begin();
    update();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
}
render();
