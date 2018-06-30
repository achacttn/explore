var app = app || {};

app.step = 0;


app.init = () => {

    app.scene = new THREE.Scene();

    app.width = window.innerWidth;
    app.height = window.innerHeight;

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize(app.width, app.height);
    app.renderer.setClearColor(0x000000);
    // app.renderer.shadowMap.enabled = true;
    // app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    app.axes = new THREE.AxesHelper(40);
    app.scene.add(app.axes);

    // lighting
    // ambient
    app.ambientLight = new THREE.AmbientLight(0x666666);
    app.scene.add(app.ambientLight);

    // spotlight
    var spotlight1p = {
        color: 0xFFFFFF,
        position: { x:-50, y:50, z:30 },
        shadow: { bool:false, width:2048, height:2048 }
    }
    app.spotlight1 = app.createSpotlight(spotlight1p);
    app.scene.add(app.spotlight1);

    // camera1
    var camera1p = {
        fov: 60,
        aspect: app.width/app.height,
        near: 0.1,
        far: 1000,
        position: { x:-30, y:40, z:30 }
    }
    app.camera1 = app.createCamera(camera1p);
    app.camera1.lookAt(app.scene.position);
    app.mouseControls = new THREE.OrbitControls(
        app.camera1, app.renderer.domElement
    );


    // plane
    var plane1p = {
        dim: { width:120, height:60 },
        position: { x:0, y:0, z:-30 },
        mesh: { material:"lambert", color:0xFF0000, side:THREE.DoubleSide, wireframe: false},
        shadow: {cast:false},
    }
    app.plane1 = app.createPlane(plane1p);
    app.scene.add( app.plane1 );

    // sphere
    var sphere1p = {
        dim: { radius:20, triangles:40, other:40 },
        position: { x:0, y:0, z:0 },
        mesh: { material:"lambert", color:0xFFFFFF, side:undefined, wireframe:false, map: THREE.ImageUtils.loadTexture('img/earth.jpg') },
        shadow: { cast:false },
    }
    app.sphere1 = app.createSphere( sphere1p );
    app.sphere1bound = new THREE.BoundingBoxHelper(app.sphere1);
    app.scene.add(app.sphere1);
    app.scene.add(app.sphere1bound);

    // cubes
    var cube1p = {
        dim: { length:4, width:4, height:4 },
        position: { x:-4, y:40, z:0 },
        mesh: { material:"lambert", color:0x00FF00, side:undefined, wireframe:false },
        shadow: {cast:false}
    }
    app.cube1 = app.createCube(cube1p);
    app.scene.add(app.cube1);

    // OTHER
    // add <canvas> element created by renderer to DOM
    document.getElementById('output').appendChild(app.renderer.domElement);

    app.stats = app.addStats();

    app.animate();
};

window.onload = app.init;

app.onResize = () => {
    app.width = window.innerWidth;
    app.height = window.innerHeight;

    app.camera1.aspect = app.width / app.height;
    app.camera1.updateProjectionMatrix();

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