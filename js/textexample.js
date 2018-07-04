


    <script>
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		var renderer, scene, camera, stats;
		var particleSystem, uniforms, geometry;
		var particles = 100000;
		init();
		animate();
		function init() {
            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 300;
        scene = new THREE.Scene();
			uniforms = {
            texture: {value: new THREE.TextureLoader().load( "textures/sprites/spark1.png" ) }
        };
			var shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: uniforms,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        blending:       THREE.AdditiveBlending,
        depthTest:      false,
        transparent:    true,
        vertexColors:   true
    });
    var radius = 200;
    geometry = new THREE.BufferGeometry();
    var positions = [];
    var colors = [];
    var sizes = [];
    var color = new THREE.Color();
			for ( var i = 0; i < particles; i ++ ) {
            positions.push((Math.random() * 2 - 1) * radius);
        positions.push( ( Math.random() * 2 - 1 ) * radius );
    positions.push( ( Math.random() * 2 - 1 ) * radius );
    color.setHSL( i / particles, 1.0, 0.5 );
    colors.push( color.r, color.g, color.b );
    sizes.push( 20 );;
}
geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setDynamic( true ) );


particleSystem = new THREE.Points( geometry, shaderMaterial );
scene.add( particleSystem );
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );
stats = new Stats();
container.appendChild( stats.dom );
//
function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
		function animate() {
        requestAnimationFrame(animate);
    render();
    stats.update();
}
		function render() {
			var time = Date.now() * 0.005;
    particleSystem.rotation.z = 0.01 * time;
    var sizes = geometry.attributes.size.array;
			for ( var i = 0; i < particles; i++ ) {
        sizes[i] = 10 * (1 + Math.sin(0.1 * i + time));
			}
    geometry.attributes.size.needsUpdate = true;
    renderer.render( scene, camera );
}

// var container, stats;
// var camera, scene, renderer, particle;
// var mouseX = 0, mouseY = 0;
// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;
// init();
// animate();
// function init() {
//     container = document.createElement('div');
//     document.body.appendChild(container);
//     camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
//     camera.position.z = 1000;
//     scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x000040);
//     var material = new THREE.SpriteMaterial({
//         map: new THREE.CanvasTexture(generateSprite()),
//         blending: THREE.AdditiveBlending
//     });
//     for (var i = 0; i < 1000; i++) {
//         particle = new THREE.Sprite(material);
//         initParticle(particle, i * 10);
//         scene.add(particle);
//     }
//     renderer = new THREE.CanvasRenderer();
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);
//     stats = new Stats();
//     container.appendChild(stats.dom);
//     document.addEventListener('mousemove', onDocumentMouseMove, false);
//     document.addEventListener('touchstart', onDocumentTouchStart, false);
//     document.addEventListener('touchmove', onDocumentTouchMove, false);
//     //
//     window.addEventListener('resize', onWindowResize, false);
// }
// function generateSprite() {
//     var canvas = document.createElement('canvas');
//     canvas.width = 16;
//     canvas.height = 16;
//     var context = canvas.getContext('2d');
//     var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
//     gradient.addColorStop(0, 'rgba(255,255,255,1)');
//     gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
//     gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
//     gradient.addColorStop(1, 'rgba(0,0,0,1)');
//     context.fillStyle = gradient;
//     context.fillRect(0, 0, canvas.width, canvas.height);
//     return canvas;
// }
// function initParticle(particle, delay) {
//     var particle = this instanceof THREE.Sprite ? this : particle;
//     var delay = delay !== undefined ? delay : 0;
//     particle.position.set(0, 0, 0);
//     particle.scale.x = particle.scale.y = Math.random() * 32 + 16;
//     new TWEEN.Tween(particle)
//         .delay(delay)
//         .to({}, 10000)
//         .onComplete(initParticle)
//         .start();
//     new TWEEN.Tween(particle.position)
//         .delay(delay)
//         .to({ x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000)
//         .start();
//     new TWEEN.Tween(particle.scale)
//         .delay(delay)
//         .to({ x: 0.01, y: 0.01 }, 10000)
//         .start();
// }
// //
// function onDocumentMouseMove(event) {
//     mouseX = event.clientX - windowHalfX;
//     mouseY = event.clientY - windowHalfY;
// }
// function onDocumentTouchStart(event) {
//     if (event.touches.length == 1) {
//         event.preventDefault();
//         mouseX = event.touches[0].pageX - windowHalfX;
//         mouseY = event.touches[0].pageY - windowHalfY;
//     }
// }
// function onDocumentTouchMove(event) {
//     if (event.touches.length == 1) {
//         event.preventDefault();
//         mouseX = event.touches[0].pageX - windowHalfX;
//         mouseY = event.touches[0].pageY - windowHalfY;
//     }
// }
// //
// function animate() {
//     requestAnimationFrame(animate);
//     render();
//     stats.update();
// }
// function render() {
//     TWEEN.update();
//     camera.position.x += (mouseX - camera.position.x) * 0.05;
//     camera.position.y += (- mouseY - camera.position.y) * 0.05;
//     camera.lookAt(scene.position);
//     renderer.render(scene, camera);
// }



// // // lod
// // var lod = new THREE.LOD();

// // //Create spheres with 3 levels of detail and create new LOD levels for them
// // for (var i = 0; i < 3; i++) {

// //     var geometry = new THREE.IcosahedronBufferGeometry(10, 3 - i)

// //     var mesh = new THREE.Mesh(geometry, material);

// //     lod.addLevel(mesh, i * 75);

// // }

// // scene.add(lod);
// // /////
// // /// MY OWN EXAMPLE TEST
// // var lod = new THREE.LOD();



// // // skybox
// // if (!Detector.webgl) Detector.addGetWebGLMessage();
// // var container;
// // var camera, controls, scene, renderer;
// // var sky, sunSphere;
// // init();
// // render();
// // function initSky() {
// //     // Add Sky
// //     sky = new THREE.Sky();
// //     sky.scale.setScalar(450000);
// //     scene.add(sky);
// //     // Add Sun Helper
// //     sunSphere = new THREE.Mesh(
// //         new THREE.SphereBufferGeometry(20000, 16, 8),
// //         new THREE.MeshBasicMaterial({ color: 0xffffff })
// //     );
// //     sunSphere.position.y = - 700000;
// //     sunSphere.visible = false;
// //     scene.add(sunSphere);
// //     /// GUI
// //     var effectController = {
// //         turbidity: 10,
// //         rayleigh: 2,
// //         mieCoefficient: 0.005,
// //         mieDirectionalG: 0.8,
// //         luminance: 1,
// //         inclination: 0.49, // elevation / inclination
// //         azimuth: 0.25, // Facing front,
// //         sun: ! true
// //     };
// //     var distance = 400000;
// //     function guiChanged() {
// //         var uniforms = sky.material.uniforms;
// //         uniforms.turbidity.value = effectController.turbidity;
// //         uniforms.rayleigh.value = effectController.rayleigh;
// //         uniforms.luminance.value = effectController.luminance;
// //         uniforms.mieCoefficient.value = effectController.mieCoefficient;
// //         uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
// //         var theta = Math.PI * (effectController.inclination - 0.5);
// //         var phi = 2 * Math.PI * (effectController.azimuth - 0.5);
// //         sunSphere.position.x = distance * Math.cos(phi);
// //         sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
// //         sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
// //         sunSphere.visible = effectController.sun;
// //         uniforms.sunPosition.value.copy(sunSphere.position);
// //         renderer.render(scene, camera);
// //     }
// //     var gui = new dat.GUI();
// //     gui.add(effectController, "turbidity", 1.0, 20.0, 0.1).onChange(guiChanged);
// //     gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
// //     gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(guiChanged);
// //     gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(guiChanged);
// //     gui.add(effectController, "luminance", 0.0, 2).onChange(guiChanged);
// //     gui.add(effectController, "inclination", 0, 1, 0.0001).onChange(guiChanged);
// //     gui.add(effectController, "azimuth", 0, 1, 0.0001).onChange(guiChanged);
// //     gui.add(effectController, "sun").onChange(guiChanged);
// //     guiChanged();
// // }
// // function init() {
// //     camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 2000000);
// //     camera.position.set(0, 100, 2000);
// //     //camera.setLens(20);
// //     scene = new THREE.Scene();
// //     var helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
// //     scene.add(helper);
// //     renderer = new THREE.WebGLRenderer();
// //     renderer.setPixelRatio(window.devicePixelRatio);
// //     renderer.setSize(window.innerWidth, window.innerHeight);
// //     document.body.appendChild(renderer.domElement);
// //     controls = new THREE.OrbitControls(camera, renderer.domElement);
// //     controls.addEventListener('change', render);
// //     //controls.maxPolarAngle = Math.PI / 2;
// //     controls.enableZoom = false;
// //     controls.enablePan = false;
// //     initSky();
// //     window.addEventListener('resize', onWindowResize, false);
// // }
// // function onWindowResize() {
// //     camera.aspect = window.innerWidth / window.innerHeight;
// //     camera.updateProjectionMatrix();
// //     renderer.setSize(window.innerWidth, window.innerHeight);
// //     render();
// // }
// // function render() {
// //     renderer.render(scene, camera);


// // function init() {
// //     container = document.getElementById('container');
// //     var loader = new THREE.FontLoader();
// //     loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
// //         var scene = initScene(font);
// //         animate();
// //     });

// // function initScene(font) {
// //     var scene = new THREE.Scene();
// //     scene.add(new THREE.AmbientLight(0x222222));
// //     var light = new THREE.DirectionalLight(0xffffff, 1);
// //     light.position.set(100, 100, 100);
// //     scene.add(light);
// //     var materialargs = {
// //         color: 0xffffff,
// //         specular: 0x050505,
// //         shininess: 50,
// //         emissive: 0x000000
// //     };
// //     var meshes = [];
// //     var geometry = new THREE.SphereBufferGeometry(0.5, 24, 12);
// //     for (var i = 0; i < labeldata.length; i++) {
// //         var scale = labeldata[i].scale || 1;
// //         var labelgeo = new THREE.TextBufferGeometry(labeldata[i].label, {
// //             font: font,
// //             size: labeldata[i].size,
// //             height: labeldata[i].size / 2
// //         });
// //         labelgeo.computeBoundingSphere();
// //         // center text
// //         labelgeo.translate(- labelgeo.boundingSphere.radius, 0, 0);
// //         materialargs.color = new THREE.Color().setHSL(Math.random(), 0.5, 0.5);
// //         var material = new THREE.MeshPhongMaterial(materialargs);
// //         var group = new THREE.Group();
// //         group.position.z = -labeldata[i].size * scale;
// //         scene.add(group);
// //         var textmesh = new THREE.Mesh(labelgeo, material);
// //         textmesh.scale.set(scale, scale, scale);
// //         textmesh.position.z = -labeldata[i].size * scale;
// //         textmesh.position.y = labeldata[i].size / 4 * scale;
// //         group.add(textmesh);
// //         var dotmesh = new THREE.Mesh(geometry, material);
// //         dotmesh.position.y = -labeldata[i].size / 4 * scale;
// //         dotmesh.scale.multiplyScalar(labeldata[i].size * scale);
// //         group.add(dotmesh);
// //     }
// //     return scene;