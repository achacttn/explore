console.log(1);

var app = app || {};

app.controls = {
    example: 0.5,
}

app.init = ()=>{
    
    // gui, renderer
    app.gui = new dat.GUI();
    app.gui.add( app.controls, 'example', 0, 1 );

    app.scene = new THREE.Scene();
    app.width = window.innerWidth;
    app.height = window.innerHeight;

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setSize( app.width, app.height );
    app.renderer.setClearColor( 0x000000 );
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //

    // axes
    app.helperAxes = new THREE.AxesHelper(60);
    app.scene.add( app.helperAxes );
    //




    // ambient light and spotlight
    var ambientLight1color = app.createColor({ r: 200, g: 200, b: 200 });
    app.ambientLight1 = app.createAmbientLight(ambientLight1color);
    app.scene.add( app.ambientLight1 );

    var spotlight1color = app.createColor({ r: 250, g: 250, b: 250 });
    var spotlight1position = { sx: -30, sy: 50, sz: 30 };
    app.spotlight1 = app.createSpotlight( spotlight1color, spotlight1position );
    app.scene.add( app.spotlight1 );

    var camera1parameters = { pov: 60, aspectRatio: app.width/app.height, nearView: 0.1, farView: 1000, sx: -30, sy: 40, sz: 30 };
    app.camera1 = app.createCamera(camera1parameters);
    app.mouseControls = new THREE.OrbitControls( app.camera1, app.renderer.domElement );
    // app.camera1.lookAt(app.scene.position);
    app.scene.add( app.camera1 );
    //

    // plane
    var plane1color = app.createColor({ r: 25, g: 25, b: 25 });
    var plane1material = app.createMaterial( plane1color, "MeshLambertMaterial" );
    var plane1geometry = {
        name: "plane",
        dimension: { x: 120, y: 60 },
        position: { x: 15, y: 0, z: 0 }
    };
    app.plane1 = app.createObject( plane1geometry, plane1material )
    app.scene.add(app.plane1);


    // boilerplate
    document.getElementById('output').appendChild( app.renderer.domElement );

    app.stats = app.addStats();

    app.animate();
    //
};

window.onload = app.init;

app.onResize = ()=>{
    app.width = window.innerWidth;
    app.height = window.innerHeight;

    app.camera.aspect = app.width/app.height;
    app.camera.updateProjectionMatrix();

    app.renderer.setSize( app.width, app.height );
};

window.addEventListener( 'resize', app.onResize, false );

app.addStats = ()=>{
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById('output').appendChild( stats.domElement );
    return stats;
}