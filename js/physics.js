'use strict';

var three = require('three');

var G = 1;

var Physics = function () {};

Physics.getAcceleration = function (body) {
    return new three.Vector3().copy(body.force).divideScalar(body.mass);
}

Physics.getVelocity = function (body) {
    return new three.Vector3().copy(body.velocity).add(body.acceleration);
}

Physics.getPositionDelta = function (body) {
    return new three.Vector3().addVectors(body.velocity, new three.Vector3().copy(body.acceleration).divideScalar(2));
}

Physics.calculateForce = function (subject, object) {
    var deltaVector = new three.Vector3().subVectors(subject.mesh.position, object.mesh.position);
    var distance = deltaVector.length();
    var directionVector = new three.Vector3().copy(deltaVector).divideScalar(deltaVector.length());

    return directionVector.multiplyScalar(G * subject.mass * object.mass / (distance * distance));
}

module.exports = Physics;
