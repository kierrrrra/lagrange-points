'use strict';

var _ = require('lodash');
var three = require('three');

var planeFactory = function () {
    var geometry = new three.PlaneGeometry(2000, 2000, 50, 50);
    var material = new three.MeshDepthMaterial({wireframe: true});
    material.transparent = true;
    material.opacity = 0.2;

    var plane = new three.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;

    return plane;
}

module.exports = planeFactory;
