var app = app || {};

app.step = 0;

app.controls = {
    bouncingSpeed: 0.05,
    rotationSpeed: 0.01,
    numParticles: 50000,
    particleDistribution: 200,
    velocityScale: 1.0,
};

app.init = () => {
    console.log('AAAAA');

    app.gui = new dat.GUI();
    app.gui.add(app.controls, 'bouncingSpeed', 0, 1);
    app.gui.add(app.controls, 'rotationSpeed', 0, 1);
    app.gui.add(app.controls, 'velocityScale', -2, 2);

    app.scene = new THREE.Scene();

    app.width = window.innerWidth;
    app.height = window.innerHeight;

    // camera takes 4 arguments: POV, aspect ratio, near render, far render
    app.camera = new THREE.PerspectiveCamera(60, app.width / app.height, 0.1, 1000);
    app.camera.position.set(-30, 40, 30);
    app.camera.lookAt(app.scene.position);



    // calculates drawing of objects on lighting and camera
    // renders it to 2D image in canvas element
    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize(app.width, app.height);
    app.renderer.setClearColor(0x000000); // background
    // app.renderer.shadowMap.enabled = true; // computationally expensive shadows disabled by default
    // app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // app.axes = new THREE.AxesHelper(40);
    // app.scene.add( app.axes );

    // app.plane = app.createPlane();
    // app.scene.add( app.plane );

    app.cube = app.createCube({
        x: -4, y: 40, z: 0,
        xSize: 4, ySize: 4, zSize: 4, colour: 0xFF0000
    });
    app.scene.add(app.cube);

    const numCubes = 10;
    app.cubes = [];
    for (let i = 0; i < numCubes; i++) {
        const cube = app.createCube({
            xSize: 4,
            ySize: 4,
            zSize: 4,
            x: THREE.Math.randInt(-100, 100),
            y: THREE.Math.randInt(-100, 100),
            z: THREE.Math.randInt(-100, 100),
            colour: new THREE.Color(
                Math.random(),
                Math.random(),
                Math.random(),
            )
        });
        app.cubes.push(cube);
        app.scene.add(cube);

    }

    app.sphere = app.createSphere({ sx: 20, sy: 40, sz: 40, px: 0, py: 0, pz: 0, bool: false, colorSet: 0xFFFFFF });
    app.scene.add(app.sphere);

    app.particleSystem = app.createParticleSystem();
    app.scene.add(app.particleSystem);

    // app.sphere2 = app.createSphere(6, 40, 40, 6, 20, 15, true, 0xff3333 );
    // app.scene.add( app.sphere2 );

    app.spotlight = app.createSpotlight();
    app.scene.add(app.spotlight);

    app.ambientLight = new THREE.AmbientLight(0x666666);
    app.scene.add(app.ambientLight);

    app.mouseControls = new THREE.OrbitControls(
        app.camera, app.renderer.domElement
    );

    // add <canvas> element created by renderer to DOM
    document.getElementById('output').appendChild(app.renderer.domElement);

    app.stats = app.addStats();

    // perform render
    // app.renderer.render( app.scene, app.camera );
    app.animate();
};

window.onload = app.init;

app.onResize = () => {
    app.width = window.innerWidth;
    app.height = window.innerHeight;

    app.camera.aspect = app.width / app.height;
    app.camera.updateProjectionMatrix();

    app.renderer.setSize(app.width, app.height);
};

window.addEventListener('resize', app.onResize, false);

app.addStats = () => {
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById('stats').appendChild(stats.domElement);
    return stats;
}