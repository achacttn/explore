var app = app || {};

app.step = 0;


app.init = () => {

    app.scene = new THREE.Scene();

    app.width = window.innerWidth;
    app.height = window.innerHeight;

    app.renderer = new THREE.WebGLRenderer({ antialias:true, logarithmicDepthBuffer:true });
    app.renderer.setSize(app.width, app.height);
    app.renderer.setClearColor(0x000000);
    // app.renderer.shadowMap.enabled = true;
    // app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    app.axes = new THREE.AxesHelper(40);
    app.scene.add(app.axes);

    // lighting
    // ambient
    app.ambientLight = new THREE.AmbientLight(0xDEDEDE);
    app.scene.add(app.ambientLight);

    // spotlight
    // var spotlight1p = {
    //     color: 0xFFFFFF,
    //     position: { x:-50, y:50, z:30 },
    //     shadow: { bool:false, width:2048, height:2048 }
    // }
    // app.spotlight1 = app.createSpotlight(spotlight1p);
    // app.scene.add(app.spotlight1);

    // camera1
    var camera1p = {
        fov: 60,
        aspect: app.width/app.height,
        near: 1e-6,
        far: 1e20,
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
        mesh: { material:"lambert", color:0x88CCFF, side:THREE.DoubleSide, wireframe: false},
        shadow: {cast:false},
    }
    app.plane1 = app.createPlane(plane1p);
    app.scene.add( app.plane1 );

    // earth
    var earthP = {
        dim: { radius: 10, triangles: 40, other: 40 },
        position: { x:0, y:0, z:0 },
        mesh: { material:"lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: THREE.ImageUtils.loadTexture('img/earth.jpg') },
        shadow: { cast: false },
    }
    app.earth = app.createSphere(earthP);
    app.scene.add(app.earth);

    // jupiter
    var jupiterP = {
        dim: { radius: 100, triangles: 40, other: 40 },
        position: { x: 0, y: 0, z: 0 },
        mesh: { material: "lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: THREE.ImageUtils.loadTexture('img/jupiter.jpg') },
        shadow: { cast: false },
    }
    app.jupiter = app.createSphere(jupiterP);
    app.scene.add(app.jupiter);

    // sun (need to do something with shaders)
    var sunP = {
        dim: { radius: 1000, triangles: 40, other: 40 },
        position: { x:0, y:0, z:0 },
        mesh: { material:"lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: THREE.ImageUtils.loadTexture('img/suntexture01.jpg') },
        shadow: { cast: false },
    }
    app.sun = app.createSphere(sunP);
    app.scene.add(app.sun);

    // sun (load model)
    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setTexturePath('/scales/img/');
    // mtlLoader.setPath('/scales/img/');
    // mtlLoader.load('suntexture01.jpg', (materials)=>{
    //     materials.preload();

    //     var objLoader = new THREE.OBJLoader();
    //     objLoader.setMaterials(materials);
    //     objLoader.setPath('/scales/models/');
    //     objLoader.load('sol.obj', (object)=>{
    //         object.position.x = 0,
    //         object.position.y = 0,
    //         object.position.z = 0,

    //         app.scene.add(object);
    //     })
    // })
     
    // general form
    // app.android1 = app.loadModel( 'models/android.js' );
    // app.android1.scale.set(1000,1000,1000)
    // app.scene.add(app.android1);

    // model testing
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/android.js', ( geometry, materials )=>{
        var material = new THREE.MeshFaceMaterial(materials);
        app.android = new THREE.Mesh(geometry, material);
        app.android.scale.set(1000,1000,1000);
        app.scene.add(app.android);
    })

    // how to add second model??
    var jsonLoader2 = new THREE.JSONLoader();
    jsonLoader2.load('models/android2.js', (geometry, materials) => {
        var material2 = new THREE.MeshFaceMaterial(materials);
        app.android2 = new THREE.Mesh(geometry, material2);
        app.android2.scale.set(2000, 2000, 2000);
        app.scene.add(app.android2);
    })
    // jsonLoader.load('models/android.js', addModel2ToScene);
    // function addModel2ToScene( geometry, materials ){
    //     var material = new THREE.MeshFaceMaterial(materials);
    //     app.android2 = new THREE.Mesh( geometry, material);
    //     app.android2.scale.set(2000,2000,2000);
    //     app.scene.add(app.android);
    // }



    const sceneSpheres = [];
    const spheresArr = [];
    for( var i=-5; i<19; i+=3 ){
        spheresArr.push(10**i);
    }
    for( var i=0; i<spheresArr.length; i++ ){
        var sphereParamaters ={
            dim: { radius: spheresArr[i], triangles:40, other:40 },
            position: { x:0, y:0, z:0 },
            mesh: { material:"lambert", color:0xFF0000, side:undefined, wireframe:true, map:undefined } ,
            shadow: { cast:false },
        }
        sceneSpheres[i] = app.createSphere(sphereParamaters);
        app.scene.add(sceneSpheres[i]);
    }

    // var sphere2p = {
    //     dim: { radius:0.01, triangles:40, other:40 },
    //     position: { x:0, y:0, z:0 },
    //     mesh: { material:"lambert", color:0xFF0000, side:undefined, wireframe:true, map:undefined },
    //     shadow: { cast:false },
    // }
    // app.sphere2 = app.createSphere( sphere2p );
    // app.sphere2bound = new THREE.BoundingBoxHelper(app.sphere2);
    // app.scene.add(app.sphere2);
    // app.scene.add(app.sphere2bound);

    // var sphere3p = {
    //     dim: { radius: 0.000001, triangles: 40, other: 40 },
    //     position: { x: 0, y: 0, z: 0 },
    //     mesh: { material: "lambert", color: 0x00FF00, side: undefined, wireframe: true, map: undefined },
    //     shadow: { cast: false },
    // }
    // app.sphere3 = app.createSphere(sphere3p);
    // app.sphere3bound = new THREE.BoundingBoxHelper(app.sphere3);
    // app.scene.add(app.sphere3);
    // app.scene.add(app.sphere3bound);

    // var sphere4p = {
    //     dim: { radius: 10000, triangles: 40, other: 40 },
    //     position: { x: 0, y: 0, z: 0 },
    //     mesh: { material: "lambert", color: 0x0000FF, side: undefined, wireframe: true, map: undefined },
    //     shadow: { cast: false },
    // }
    // app.sphere4 = app.createSphere(sphere4p);
    // app.sphere4bound = new THREE.BoundingBoxHelper(app.sphere4);
    // app.scene.add(app.sphere4);
    // app.scene.add(app.sphere4bound);

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