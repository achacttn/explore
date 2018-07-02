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

    app.axes = new THREE.AxesHelper(1e18);
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
        mesh: { material:"lambert", color:0xFF00AA, side:THREE.DoubleSide, wireframe: false},
        shadow: {cast:false},
    }
    app.plane1 = app.createPlane(plane1p);
    app.scene.add( app.plane1 );

    // earth
    var earthP = {
        dim: { radius: 1e5, triangles: 40, other: 40 },
        position: { x:0, y:0, z:0 },
        mesh: { material:"lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: THREE.ImageUtils.loadTexture('img/earth.jpg') },
        shadow: { cast: false },
    }
    app.earth = app.createSphere(earthP);
    app.scene.add(app.earth);

    // jupiter
    var jupiterP = {
        dim: { radius: 1e7, triangles: 40, other: 40 },
        position: { x: 0, y: 0, z: 0 },
        mesh: { material: "lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: new THREE.TextureLoader().load('img/jupiter.jpg')},
        shadow: { cast: false },
    }
    app.jupiter = app.createSphere(jupiterP);
    app.scene.add(app.jupiter);

    // sun (need to do something with shaders)
    var sunP = {
        dim: { radius: 1e9, triangles: 40, other: 40 },
        position: { x:0, y:0, z:0 },
        mesh: { material:"lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: THREE.ImageUtils.loadTexture('img/suntexture01.jpg')},
        shadow: { cast: false },
    }
    app.sun = app.createSphere(sunP);
    app.scene.add(app.sun);


    // android model test
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/android.js', ( geometry, materials ) => {
        var material = new THREE.MeshFaceMaterial(materials);
        app.android = new THREE.Mesh(geometry, material);
        app.android.scale.set(15500,15500,15500);
        app.android.position.y = 15000;
        app.android.position.x = 95000;
        app.android.position.z = 95000;
        app.scene.add(app.android);
    });

    // // how to add second model??
    // jsonLoader.load('models/android2.js', ( geometry2, materials2 ) => {
    //     var material2 = new THREE.MeshFaceMaterial(materials2);
    //     app.android2 = new THREE.Mesh(geometry2, material2);
    //     app.android2.scale.set(2000, 2000, 2000);
    //     app.scene.add(app.android2);
    // });

    // obj/mtl test (r2d2)
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('/scales/models/');
    mtlLoader.setPath('/scales/models/');
    mtlLoader.load('r2-d2.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('/scales/models/');
        objLoader.load('r2-d2.obj', object => {
            object.position.y -= 60;
            object.scale.set(0.75*1e10,0.75*1e10,0.75*1e10);
            app.scene.add(object);
        });
    });

    // human test texture
    app.manager = new THREE.LoadingManager();
    app.manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    app.humanTextureLoader = new THREE.TextureLoader(app.manager);
    app.humanTexture = app.humanTextureLoader.load('models/humantexture.jpg');
    // human test model
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
    };
    var loader = new THREE.OBJLoader(app.manager);
    loader.load('models/human3.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = app.humanTexture;
            }
        });
        object.scale.set(100,100,100);
        object.position.y = -12.5;
        app.scene.add(object);
    }, onProgress, onError);


    // cell collada model
    let cell;
    app.cellLoadingManager = new THREE.LoadingManager(function () {
        // cell.position.z = 1;
        app.scene.add(cell);
    });
    app.cellLoader = new THREE.ColladaLoader(app.cellLoadingManager);
    app.cellLoader.load('models/cell.dae', function (collada) {
        cell = collada.scene;
        cell.scale.set(0.01,0.01,0.01);

    });


    // // obj/mtl human
    // let humanMTLLoader = new THREE.MTLLoader();
    // humanMTLLoader.setTexturePath('/scales/models/');
    // humanMTLLoader.setPath('/scales/models/');
    // humanMTLLoader.load('humantexture.jpg', function (materials) {
    //     materials.preload();
    //     let humanOBJLoader = new THREE.OBJLoader();
    //     humanOBJLoader.setMaterials(materials);
    //     humanOBJLoader.setPath('/scales/models/');
    //     humanOBJLoader.load('human3.obj', object => {
    //         object.position.x = 1;
    //         object.scale.set(0.1,0.1,0.1);
    //         app.scene.add(object);
    //     })
    // });

    // vertex and fragment shader
    uniforms = {
        delta: { value:0 }
    };
    app.exampleMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });
    const exampleSphere = new THREE.SphereBufferGeometry(20, 40, 40);
    app.example = new THREE.Mesh( exampleSphere, app.exampleMaterial );
    app.example.position.set( 50, 50, 50 );
    app.scene.add(app.example);


    // wireframe spheres
    const sceneSpheres = [];
    const spheresArr = [];
    const sceneSphereMesh = {
        material:"lambert",
        color:0xFF0000,
        wireframe:true,
    };
    for( var i=-5; i<20; i+=2 ){
        spheresArr.push(10**i);
    }
    for( var i=0; i<spheresArr.length; i++ ){
        var sphereParamaters ={
            dim: { radius: spheresArr[i], triangles:40, other:40 },
            position: { x:0, y:0, z:0 },
            mesh: sceneSphereMesh,
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

    // vertexDisplacement;
    vertexDisplacement = new Float32Array(exampleSphere.attributes.position.count);
    for( var i=0; i<vertexDisplacement.length; i++ ){
        vertexDisplacement[i] = Math.sin(i);
    }
    // must use buffer geometry only
    exampleSphere.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));

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