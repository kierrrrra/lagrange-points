'use strict';

var _ = require('lodash');
var three = require('three');
var Class = require('backbone-class');

var Planet = Class.extend({

    defaults: {
        size: 10,
        color: 0xffffff,
        velocity: new three.Vector3(0,0,0)
    },

    initialize: function (options, scene) {
        this.id = IdGenerator.getNew();

        this.options = _.defaults({}, options, this.defaults);

        this.mass = this.options.mass || this.options.size;
        this.velocity = this.options.velocity;

        var geometry = new three.SphereGeometry(this.options.size || 10, 32, 32);
        var material = new three.MeshPhongMaterial({color: this.options.color});

        if (this.options.planet) {
            material = this.setupPlanetMaterial(material);
        }

        this.mesh = new three.Mesh(geometry, material);

        this.setUpVectorLines();

        this.addToScene(scene);
    },

    setupPlanetMaterial: function (material) {
        switch (this.options.planet) {
            case 'earth':
                material.map = three.ImageUtils.loadTexture('images/earthmap1k.jpg');
                material.bumpMap = three.ImageUtils.loadTexture('images/earthbump1k.jpg');
                material.bumpScale = 5;
                material.specularMap = three.ImageUtils.loadTexture('images/earthspec1k.jpg');
                material.specular = new three.Color(0x333333);
                return material;
            case 'sun':
                material.map = three.ImageUtils.loadTexture('images/sunmap.jpg');
                return material;
            default:
                return material;
        }
    },

    addToScene: function (scene) {
        scene.add(this.mesh);
        scene.add(this.velocityLine);
        scene.add(this.forceLine);
    },

    setUpVectorLines: function () {
        this.setUpVelocityLine();
        this.setUpForceLine();
    },

    setUpVelocityLine: function () {
        var lineMaterial = new three.LineBasicMaterial({color: 0x00FF00});
        var lineGeometry = new three.Geometry();

        lineGeometry.vertices.push(
            new three.Vector3().copy(this.mesh.position),
            new three.Vector3().addVectors(this.mesh.position, this.velocity));

        this.velocityLine = new three.Line(lineGeometry, lineMaterial);
    },

    setUpForceLine: function () {
        var lineMaterial = new three.LineBasicMaterial({color: 0xFF0000});
        var lineGeometry = new three.Geometry();

        lineGeometry.vertices.push(
            new three.Vector3().copy(this.mesh.position),
            new three.Vector3().copy(this.mesh.position));

        this.forceLine = new three.Line(lineGeometry, lineMaterial);
    },

    update: function () {
        this.mesh.position.sub(this.velocity);

        this.velocityLine.geometry.vertices[0] = this.mesh.position;
        this.velocityLine.geometry.vertices[1] = this.mesh.position.clone().add(this.velocity.clone().multiplyScalar(-10));

        this.forceLine.geometry.vertices[0] = this.mesh.position;
        this.forceLine.geometry.vertices[1] = this.mesh.position.clone().add(this.forces.clone().multiplyScalar(-100));

        this.velocityLine.geometry.verticesNeedUpdate = true;
        this.forceLine.geometry.verticesNeedUpdate = true;
    }
});


var IdGenerator = (function () {
    var id = 0;

    return {
        getNew: function () {
            return id++;
        }
    }
}());

module.exports = Planet;
