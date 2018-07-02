function init() {
    container = document.getElementById('container');
    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        var scene = initScene(font);
        animate();
    });

function initScene(font) {
    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x222222));
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 100, 100);
    scene.add(light);
    var materialargs = {
        color: 0xffffff,
        specular: 0x050505,
        shininess: 50,
        emissive: 0x000000
    };
    var meshes = [];
    var geometry = new THREE.SphereBufferGeometry(0.5, 24, 12);
    for (var i = 0; i < labeldata.length; i++) {
        var scale = labeldata[i].scale || 1;
        var labelgeo = new THREE.TextBufferGeometry(labeldata[i].label, {
            font: font,
            size: labeldata[i].size,
            height: labeldata[i].size / 2
        });
        labelgeo.computeBoundingSphere();
        // center text
        labelgeo.translate(- labelgeo.boundingSphere.radius, 0, 0);
        materialargs.color = new THREE.Color().setHSL(Math.random(), 0.5, 0.5);
        var material = new THREE.MeshPhongMaterial(materialargs);
        var group = new THREE.Group();
        group.position.z = -labeldata[i].size * scale;
        scene.add(group);
        var textmesh = new THREE.Mesh(labelgeo, material);
        textmesh.scale.set(scale, scale, scale);
        textmesh.position.z = -labeldata[i].size * scale;
        textmesh.position.y = labeldata[i].size / 4 * scale;
        group.add(textmesh);
        var dotmesh = new THREE.Mesh(geometry, material);
        dotmesh.position.y = -labeldata[i].size / 4 * scale;
        dotmesh.scale.multiplyScalar(labeldata[i].size * scale);
        group.add(dotmesh);
    }
    return scene;