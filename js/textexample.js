// lod
var lod = new THREE.LOD();

//Create spheres with 3 levels of detail and create new LOD levels for them
for (var i = 0; i < 3; i++) {

    var geometry = new THREE.IcosahedronBufferGeometry(10, 3 - i)

    var mesh = new THREE.Mesh(geometry, material);

    lod.addLevel(mesh, i * 75);

}

scene.add(lod);
/////
/// MY OWN EXAMPLE TEST
var lod = new THREE.LOD();



// skybox
if (!Detector.webgl) Detector.addGetWebGLMessage();
var container;
var camera, controls, scene, renderer;
var sky, sunSphere;
init();
render();
function initSky() {
    // Add Sky
    sky = new THREE.Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    scene.add(sunSphere);
    /// GUI
    var effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: ! true
    };
    var distance = 400000;
    function guiChanged() {
        var uniforms = sky.material.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.rayleigh.value = effectController.rayleigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
        var theta = Math.PI * (effectController.inclination - 0.5);
        var phi = 2 * Math.PI * (effectController.azimuth - 0.5);
        sunSphere.position.x = distance * Math.cos(phi);
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
        sunSphere.visible = effectController.sun;
        uniforms.sunPosition.value.copy(sunSphere.position);
        renderer.render(scene, camera);
    }
    var gui = new dat.GUI();
    gui.add(effectController, "turbidity", 1.0, 20.0, 0.1).onChange(guiChanged);
    gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
    gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(guiChanged);
    gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(guiChanged);
    gui.add(effectController, "luminance", 0.0, 2).onChange(guiChanged);
    gui.add(effectController, "inclination", 0, 1, 0.0001).onChange(guiChanged);
    gui.add(effectController, "azimuth", 0, 1, 0.0001).onChange(guiChanged);
    gui.add(effectController, "sun").onChange(guiChanged);
    guiChanged();
}
function init() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 2000000);
    camera.position.set(0, 100, 2000);
    //camera.setLens(20);
    scene = new THREE.Scene();
    var helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
    scene.add(helper);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    //controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;
    controls.enablePan = false;
    initSky();
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
function render() {
    renderer.render(scene, camera);


// function init() {
//     container = document.getElementById('container');
//     var loader = new THREE.FontLoader();
//     loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
//         var scene = initScene(font);
//         animate();
//     });

// function initScene(font) {
//     var scene = new THREE.Scene();
//     scene.add(new THREE.AmbientLight(0x222222));
//     var light = new THREE.DirectionalLight(0xffffff, 1);
//     light.position.set(100, 100, 100);
//     scene.add(light);
//     var materialargs = {
//         color: 0xffffff,
//         specular: 0x050505,
//         shininess: 50,
//         emissive: 0x000000
//     };
//     var meshes = [];
//     var geometry = new THREE.SphereBufferGeometry(0.5, 24, 12);
//     for (var i = 0; i < labeldata.length; i++) {
//         var scale = labeldata[i].scale || 1;
//         var labelgeo = new THREE.TextBufferGeometry(labeldata[i].label, {
//             font: font,
//             size: labeldata[i].size,
//             height: labeldata[i].size / 2
//         });
//         labelgeo.computeBoundingSphere();
//         // center text
//         labelgeo.translate(- labelgeo.boundingSphere.radius, 0, 0);
//         materialargs.color = new THREE.Color().setHSL(Math.random(), 0.5, 0.5);
//         var material = new THREE.MeshPhongMaterial(materialargs);
//         var group = new THREE.Group();
//         group.position.z = -labeldata[i].size * scale;
//         scene.add(group);
//         var textmesh = new THREE.Mesh(labelgeo, material);
//         textmesh.scale.set(scale, scale, scale);
//         textmesh.position.z = -labeldata[i].size * scale;
//         textmesh.position.y = labeldata[i].size / 4 * scale;
//         group.add(textmesh);
//         var dotmesh = new THREE.Mesh(geometry, material);
//         dotmesh.position.y = -labeldata[i].size / 4 * scale;
//         dotmesh.scale.multiplyScalar(labeldata[i].size * scale);
//         group.add(dotmesh);
//     }
//     return scene;