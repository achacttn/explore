var app = app || {};
app.step = 0;

// gui fields
app.controls = {
    sunRotationSpeed: 0.01,
    humanRotate: 0.5,
    // galaxyRadius: 500,
};

app.init = (font) => {
    // gui controls
    app.gui = new dat.GUI();
    app.gui.add(app.controls, 'sunRotationSpeed', 0, 0.1);
    app.gui.add(app.controls, 'humanRotate', 0, 10);
    // app.gui.add(app.controls, 'galaxyRadius', 500, 2000);

    app.scene = new THREE.Scene();
    var TGALoader = new THREE.TGALoader();

    app.width = window.innerWidth;
    app.height = window.innerHeight;

    app.renderer = new THREE.WebGLRenderer({ antialias:true, logarithmicDepthBuffer:true });
    app.renderer.setSize(app.width, app.height);
    app.renderer.setClearColor(0x000000);
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    app.axes = new THREE.AxesHelper(1e18);
    app.scene.add(app.axes);

    // lighting
    // ambient
    app.ambientLight = new THREE.AmbientLight(0xDEDEDE);
    app.scene.add(app.ambientLight);

    // spotlight
    var spotlight1p = {
        color: 0xFFFFFF,
        position: { x:-50, y:50, z:30 },
        shadow: { bool:true, width:2048, height:2048 }
    }
    app.spotlight1 = app.createSpotlight(spotlight1p);
    app.scene.add(app.spotlight1);

    // app.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // app.directionalLight.position.set(1, 1, 1);
    // app.scene.add(app.dreictionalLight);

    // using text function
    var text1p = {
        textString: "HELLO",
        font: font,
        size: 800,
        height: 500,
        mesh: {material:"lambert", color:0x00FF00},
        translationFactor:{tx:-1,ty:0,tz:0}
    }
    app.text1 = app.createText(text1p);
    app.text1.scale.set(0.000001,0.000001,0.000001);
    app.text1.receiveShadow = true;
    app.scene.add( app.text1 );


    // camera1
    var camera1p = {
        fov: 60,
        aspect: app.width/app.height,
        near: 1e-6,
        far: 2.5*1e18,
        position: { x:-30, y:40, z:30 }
    };
    app.camera1 = app.createCamera(camera1p);
    // rotate camera
    // app.camera1_pivot = new THREE.Object3D()
    // app.Y_AXIS = new THREE.Vector3(0, 1, 0);
    // app.scene.add(app.camera1_pivot);
    // app.camera1_pivot.add(app.camera1);

    app.camera1.lookAt(app.scene.position);
    app.mouseControls = new THREE.OrbitControls(
        app.camera1, app.renderer.domElement
    );
    app.camera1.position.set(10000,10000,10000) // cell
    // app.camera1.position.set(5*1e9, 5*1e9, 5*1e9); // sun
    app.camera1.distance = 0;
    // app.camera1.lookAt(app.camera1_pivot.position);
    // app.camera1_pivot.rotateOnAxis(app.Y_AXIS, 0.01);


    // var camera1Helper = new THREE.CameraHelper(app.camera1);
    // app.scene.add(camera1Helper);

    // plane
    // var plane1p = {
    //     dim: { width:120, height:60 },
    //     position: { x:0, y:0, z:-30 },
    //     mesh: { material:"lambert", color:0xFF00AA, side:THREE.DoubleSide, wireframe: false},
    //     shadow: {cast:false},
    // }
    // app.plane1 = app.createPlane(plane1p);
    // app.scene.add( app.plane1 );

    // earth
    var earthP = {
        dim: { radius: 1e5, triangles: 40, other: 40 },
        position: { x:0, y:0, z:0 },
        mesh: { material:"lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: THREE.ImageUtils.loadTexture('img/earth.jpg') },
        shadow: { cast: false },
    }
    app.earth = app.createSphere(earthP);
    app.scene.add(app.earth);
    // Earth label
    var earthlabelp = {
        textString: "EARTH",
        font: font,
        size: 50,
        height: 50,
        mesh: { material: "normal", color: 0x00FF00 },
        translationFactor: { tx: -0.5, ty: 1.25, tz: -0.3 }
    }
    app.earthlabel = app.createText(earthlabelp);
    app.earthlabel.scale.set(1000,1000,1000);
    app.earthlabel.rotation.y = 0.85;
    app.earthlabel.receiveShadow = true;
    // app.earthlabel.position.set = { x:6*10e5,y:5*10e5,z:3.8*10e5 }
    app.scene.add(app.earthlabel);
    // earth lights
    app.earthSpotlightp = {
        color: 0xFFFFFF,
        position: { x: 0, y: 5*10e5, z: -2.5*10e4 },
        shadow: { bool: true, width: 2048, height: 2048 }
    }
    app.earthSpotlight = app.createSpotlight(app.earthSpotlightp);
    app.scene.add(app.earthSpotlight);


    // jupiter
    var jupiterP = {
        dim: { radius: 1e7, triangles: 40, other: 40 },
        position: { x: 0, y: 0, z: 0 },
        mesh: { material: "lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: new THREE.TextureLoader().load('img/jupiter.jpg')},
        shadow: { cast: false },
    }
    app.jupiter = app.createSphere(jupiterP);
    app.scene.add(app.jupiter);
    // Jupiter label
    var jupiterlabelp = {
        textString: "JUPITER",
        font: font,
        size: 50,
        height: 50,
        mesh: { material: "normal", color: 0x00FF00 },
        translationFactor: { tx: 0.65, ty: 0.5, tz: -0.7 }
    }
    app.jupiterlabel = app.createText(jupiterlabelp);
    app.jupiterlabel.scale.set(100000, 100000, 100000);
    app.jupiterlabel.rotation.y = 0.85;
    app.jupiterlabel.receiveShadow = true;
    app.scene.add(app.jupiterlabel);
    // jupiter skybox
    app.jupiterImagePrefix = "img/solar_system/solar_system_";
    app.jupiterDirections = ["ft", "bk", "up", "dn", "rt", "lf"];
    app.jupiterImageSuffix = ".tga";
    app.jupiterSkyGeometry = new THREE.CubeGeometry(0.9*1e9, 0.9*1e9, 0.9*1e9);
    app.jupiterMaterialArray = [];
    for (var i = 0; i < 6; i++)
        app.jupiterMaterialArray.push(new THREE.MeshBasicMaterial({
            map: TGALoader.load(app.jupiterImagePrefix + app.jupiterDirections[i] + app.jupiterImageSuffix),
            side: THREE.BackSide
        }));
    app.jupiterSkyMaterial = new THREE.MeshFaceMaterial(app.jupiterMaterialArray);
    app.jupiterSkyBox = new THREE.Mesh(app.jupiterSkyGeometry, app.jupiterSkyMaterial);
    app.scene.add(app.jupiterSkyBox);

    // sun (need to do something with shaders)
    var sunP = {
        dim: { radius: 1e9, triangles: 40, other: 40 },
        position: { x:0, y:0, z:0 },
        mesh: { material:"lambert", color: 0xFFFFFF, side: undefined, wireframe: false, map: THREE.ImageUtils.loadTexture('img/suntexture01.jpg')},
        shadow: { cast: false },
    }
    app.sun = app.createSphere(sunP);
    app.scene.add(app.sun);
    // sun label
    var sunlabelp = {
        textString: "SUN",
        font: font,
        size: 50,
        height: 50,
        mesh: { material: "normal", color: 0x00FF00 },
        translationFactor: { tx: -0.25, ty: 1.85, tz: 0 }
    }
    app.sunlabel = app.createText(sunlabelp);
    app.sunlabel.scale.set(10000000, 10000000, 10000000);
    app.sunlabel.rotation.y = 0.85;
    app.sunlabel.receiveShadow = true;
    app.scene.add(app.sunlabel);

    // blackhole shell
    var blackholeP = {
        dim: { radius: 1e11, triangles: 40, other: 40 },
        position: { x: 0, y: 0, z: 0 },
        mesh: { material: "lambert", color: 0xFFFFFF, side: undefined, wireframe: true, map: undefined },
        shadow: { cast: false },
    }
    app.blackhole = app.createSphere(blackholeP);
    app.scene.add(app.blackhole);
    // blackhole+galaxy skybox
    app.blackholeImagePrefix = "img/nebula/nebula_";
    app.blackholeDirections = ["ft", "bk", "up", "dn", "rt", "lf"];
    app.blackholeImageSuffix = ".tga";
    app.blackholeSkyGeometry = new THREE.CubeGeometry(1e15, 1e15, 1e15);
    app.blackholeMaterialArray = [];
    for (var i = 0; i < 6; i++)
        app.blackholeMaterialArray.push(new THREE.MeshBasicMaterial({
            map: TGALoader.load(app.blackholeImagePrefix + app.blackholeDirections[i] + app.blackholeImageSuffix),
            side: THREE.BackSide
        }));
    app.blackholeSkyMaterial = new THREE.MeshFaceMaterial(app.blackholeMaterialArray);
    app.blackholeSkyBox = new THREE.Mesh(app.blackholeSkyGeometry, app.blackholeSkyMaterial);
    app.scene.add(app.blackholeSkyBox);

    // galactic centre
    var galaxyP = {
        dim: { radius: 0.5*1e13, triangles: 40, other: 40 },
        position: { x: 0, y: 0, z: 0 },
        mesh: { material: "normal", color: 0xFFFFFF, side: THREE.FrontSide, wireframe: true, map: undefined },
        shadow: { cast: false },
    }
    app.galaxy = app.createSphere(galaxyP);
    app.scene.add(app.galaxy);
    // galaxy shaders
    app.galaxyUniforms = {
        texture: { value: new THREE.TextureLoader().load('img/spark.png') }
    }
    app.galaxyShaderMaterial = new THREE.ShaderMaterial({
        uniforms: app.galaxyUniforms,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    app.galaxyRadius = 50000;
    app.galaxyGeometry = new THREE.BufferGeometry();
    app.galaxyParticles = 600000;
    app.galaxyPositions = [];
    app.galaxyColors = [];
    app.galaxySizes = [];
    
    app.galaxyColor = new THREE.Color();


    // // plane bulge
    // const planeDist = {};
    // // // y bulge
    // const yDist = {};
    // // bulge function (approximate Gaussian distribution)
    // for (var i = 0; i < 100; i++) {
    //     planeDist[i] = 0, yDist[i] = 0;
    // };
    // // console.log('planeDist: ', planeDist, 'yDist: ', yDist);

    // const sample = (samples, distObj, n = 10000) => {
    //     for (var i = 0; i < n; i++) {
    //         let a = 0;
    //         for (var j = 0; j < samples; j++) {
    //             a += parseInt(100 * Math.random());
    //         }
    //         a /= samples;
    //         a = parseInt(a);
    //         distObj[a]++;
    //     }
    // }
    // sample(6, planeDist);
    // sample(6, yDist);
    // console.log('planeDist: ', planeDist, 'yDist: ', yDist);

    // currentY = ( planeDist )=>{
    //     return (app.galaxyRadius*yDist[parseInt((planeDist/app.galaxyRadius)*100)])/4
    // };
    var yAxisDistributor = 1;
    for( var i=0; i<app.galaxyParticles; i++ ){
        yAxisDistributor*= -1;
        var randRad = app.galaxyRadius * Math.sqrt(Math.random());
        var randAng = 2 * Math.PI * Math.random();
        var currentX = randRad*Math.cos(randAng);
        var currentZ = randRad*Math.sin(randAng);

        // x position
        app.galaxyPositions.push( currentX );
        // y position attempt
        app.galaxyPositions.push( yAxisDistributor*Math.random()*((app.galaxyRadius-randRad)/4) );
        // app.galaxyPositions.push( currentY( randRad ) )
        // app.galaxyPositions.push( (((app.galaxyRadius**2)-((500-randRad)**2)) /app.galaxyRadius)*( Math.random() > 0.5 ? 1 : -1 ) );
        // z position
        app.galaxyPositions.push( currentZ );

        // // // galaxy particle colors
        app.galaxyColor.setHSL( i/app.galaxyParticles, 1.0, 0.5 );
        app.galaxyColors.push(app.galaxyColor.r, app.galaxyColor.g, app.galaxyColor.b);
        // app.galaxyColors.push( 1,1,1 );
        app.galaxySizes.push(20);
    }
    // console.log(currentYobj);
    app.galaxyGeometry.addAttribute('position', new THREE.Float32BufferAttribute(app.galaxyPositions, 3));
    app.galaxyGeometry.addAttribute('color', new THREE.Float32BufferAttribute(app.galaxyColors, 3));
    app.galaxyGeometry.addAttribute('size', new THREE.Float32BufferAttribute(app.galaxySizes, 1).setDynamic(true));
    app.galaxyParticleSystem = new THREE.Points(app.galaxyGeometry, app.galaxyShaderMaterial);

    // app.galaxyParticleSystem.scale.set(20,20,20);
    app.scene.add(app.galaxyParticleSystem);

    // // android model test
    // var jsonLoader = new THREE.JSONLoader();
    // jsonLoader.load('models/android.js', ( geometry, materials ) => {
    //     var material = new THREE.MeshFaceMaterial(materials);
    //     // var material = new THREE.MeshNormalMaterial(materials);
    //     app.android = new THREE.Mesh(geometry, material);
    //     app.android.scale.set(15500,15500,15500);
    //     app.android.position.y = 15000;
    //     app.android.position.x = 95000;
    //     app.android.position.z = 95000;
    //     app.scene.add(app.android);
    // });


    // obj/mtl test (r2d2)
    // var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setTexturePath('/scales/models/');
    // mtlLoader.setPath('/scales/models/');
    // mtlLoader.load('r2-d2.mtl', function (materials) {
    //     materials.preload();
    //     var objLoader = new THREE.OBJLoader();
    //     objLoader.setMaterials(materials);
    //     objLoader.setPath('/scales/models/');
    //     objLoader.load('r2-d2.obj', object => {
    //         app.r2d2 = object;
    //         object.position.y -= 60;
    //         object.scale.set(0.75*1e10,0.75*1e10,0.75*1e10);
    //         app.scene.add(object);
    //     });
    // });

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
        app.human = object;
        object.scale.set(1000,1000,1000);
        object.position.y = -15000;
        object.rotation.y = 0.74;
        app.scene.add(object);
    }, onProgress, onError);

    // human label
    var humanlabelp = {
        textString: "HUMAN",
        font: font,
        size: 1000,
        height: 500,
        mesh: { material: "normal", color: 0x00FF00 },
        translationFactor: { tx:-1,ty:1,tz:0 }
    }
    app.humanlabel = app.createText(humanlabelp);
    app.humanlabel.scale.set(2.5, 2.5, 2.5);
    app.humanlabel.rotation.y = 0.74;
    app.humanlabel.receiveShadow = true;
    app.scene.add(app.humanlabel);
    // human lights
    app.humanSpotlightp = {
        color: 0xFFFFFF,
        position: { x: -744, y: 38740, z: -1773 },
        shadow: { bool: true, width: 2048, height: 2048 }
    }
    app.humanSpotlight = app.createSpotlight(app.humanSpotlightp);
    app.scene.add(app.humanSpotlight);
    // human skybox
    app.humanImagePrefix = "img/mp_midnight/midnight-silence_";
    app.humanDirections = ["ft", "bk", "up", "dn", "rt", "lf"];
    app.humanImageSuffix = ".tga";
    app.humanSkyGeometry = new THREE.CubeGeometry(230000, 230000, 230000);
    app.humanMaterialArray = [];
    for (var i = 0; i < 6; i++)
        app.humanMaterialArray.push(new THREE.MeshBasicMaterial({
            map: TGALoader.load(app.humanImagePrefix + app.humanDirections[i] + app.humanImageSuffix),
            side: THREE.BackSide
        }));
    app.humanSkyMaterial = new THREE.MeshFaceMaterial(app.humanMaterialArray);
    app.humanSkyBox = new THREE.Mesh(app.humanSkyGeometry, app.humanSkyMaterial);
    app.scene.add(app.humanSkyBox);


    // DNA collada model
    app.DNALoader = new THREE.ColladaLoader(app.DNALoadingManager);
    app.DNALoader.load('models/DNA.dae', function(collada) {
        app.DNA = collada.scene;
        app.scene.add(app.DNA);
        app.DNA.scale.set(0.001,0.001,0.001);
        app.DNA.rotation.z = (11/8)*Math.PI/2;
        // DNA.rotation.x = (1/2)*Math.PI/2;
        app.DNA.position.y = -0.0005;
    });
    // DNA label
    var DNAlabelp = {
        textString: "DNA STRAND",
        font: font,
        size: 50,
        height:50,
        mesh: { material:"normal", color: 0x00FF00 },
        translationFactor: { tx:0.65,ty:0.5,tz:-0.7 }
    }
    app.DNAlabel = app.createText(DNAlabelp);
    app.DNAlabel.scale.set(0.001,0.001,0.001);
    app.DNAlabel.rotation.y = 0.85;
    app.DNAlabel.receiveShadow = true;
    app.DNAlabel.position = { x:-0.186, y:0.182, z:-0.365 };
    app.scene.add(app.DNAlabel);
    // DNA skybox
    app.DNAImagePrefix = "img/DNA/dna";
    app.DNADirections = ["1", "1", "1", "1", "1", "1"];
    app.DNAImageSuffix = ".jpg";
    app.DNASkyGeometry = new THREE.CubeGeometry(7, 7, 7);
    app.DNAMaterialArray = [];
    for (var i = 0; i < 6; i++)
        app.DNAMaterialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(app.DNAImagePrefix + app.DNADirections[i] + app.DNAImageSuffix),
            side: THREE.BackSide
        }));
    app.DNASkyMaterial = new THREE.MeshFaceMaterial(app.DNAMaterialArray);
    app.DNASkyBox = new THREE.Mesh(app.DNASkyGeometry, app.DNASkyMaterial);
    app.scene.add(app.DNASkyBox);

    // cell collada model
    app.cellLoader = new THREE.ColladaLoader(app.cellLoadingManager);
    app.cellLoader.load('models/cell.dae', function (collada) {
        app.cell = collada.scene;
        app.cell.position.x = 18.5;
        app.cell.position.y = -12.5;
        app.cell.position.z = -10.5;
        app.cell.rotation.y = 0.20;
        app.scene.add(app.cell);
        app.cell.scale.set(0.001,0.001,0.001);
    });
    // cell label
    var celllabelp = {
        textString: "CELL",
        font: font,
        size: 50,
        height: 50,
        mesh: { material: "normal", color: 0x00FF00 },
        translationFactor: { tx: -1, ty: 1, tz: 0 }
    }
    app.celllabel = app.createText(celllabelp);
    app.celllabel.scale.set(1, 1, 1);
    app.celllabel.rotation.y = 0.74;
    app.celllabel.receiveShadow = true;
    app.scene.add(app.celllabel);
    // cell lights
    app.cellSpotlightp = {
        color: 0xFFFFFF,
        position: { x: 11.3, y: 300, z: 20 },
        shadow: { bool: true, width: 2048, height: 2048 }
    }
    app.cellSpotlight = app.createSpotlight(app.cellSpotlightp);
    app.scene.add(app.cellSpotlight);
    // cell skybox
    app.cellImagePrefix = "img/bloodv/bloodv";
    app.cellDirections = ["1", "1", "1", "0", "0", "0"];
    app.cellImageSuffix = ".jpg";
    app.cellSkyGeometry = new THREE.CubeGeometry(1500, 1500, 1500);
    app.cellMaterialArray = [];
    for (var i = 0; i < 6; i++)
        app.cellMaterialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(app.cellImagePrefix + app.cellDirections[i] + app.cellImageSuffix),
            side: THREE.BackSide
        }));
    app.cellSkyMaterial = new THREE.MeshFaceMaterial(app.cellMaterialArray);
    app.cellSkyBox = new THREE.Mesh(app.cellSkyGeometry, app.cellSkyMaterial);
    app.scene.add(app.cellSkyBox);


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


    // // vertex and fragment shader
    // uniforms = {
    //     delta: { value:0 }
    // };
    // app.exampleMaterial = new THREE.ShaderMaterial({
    //     uniforms: uniforms,
    //     vertexShader: document.getElementById('vertexShader').textContent,
    //     fragmentShader: document.getElementById('fragmentShader').textContent
    // });
    // const exampleSphere = new THREE.SphereBufferGeometry(20, 40, 40);
    // app.example = new THREE.Mesh( exampleSphere, app.exampleMaterial );
    // app.example.position.set( 50, 50, 50 );
    // app.scene.add(app.example);
    // // vertexDisplacement;
    // vertexDisplacement = new Float32Array(exampleSphere.attributes.position.count);
    // for( var i=0; i<vertexDisplacement.length; i++ ){
    //     vertexDisplacement[i] = Math.sin(i);
    // }
    // // must use buffer geometry only
    // exampleSphere.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));


    // wireframe spheres
    const sceneSpheres = [];
    const spheresArr = [(10 ** -5), (10 ** 11), (10 ** 13), (10 * 15)];
    const sceneSphereMesh = {
        material: "lambert",
        color: 0xFF0000,
        wireframe: true,
    };
    for (var i = 0; i < spheresArr.length; i++) {
        var sphereParamaters = {
            dim: { radius: spheresArr[i], triangles: 40, other: 40 },
            position: { x: 0, y: 0, z: 0 },
            mesh: sceneSphereMesh,
            shadow: { cast: false },
        }
        sceneSpheres[i] = app.createSphere(sphereParamaters);
        app.scene.add(sceneSpheres[i]);
    };

    // // lod test
    //     var lod = new THREE.LOD();
    //     for( var j=3; j>0; j-- ){

    //         var sphereParamaters ={
    //             dim: { radius: spheresArr[i], triangles:Math.floor(40*j/3), other:Math.floor(40*j/3) },
    //             position: { x:0, y:0, z:0 },
    //             mesh: sceneSphereMesh,
    //             shadow: { cast:false },
    //         }
    //         sceneSpheres[i] = app.createSphere(sphereParamaters);
    //         lod.addLevel(sceneSpheres[i], (3-j)*10*spheresArr[i]);
    //         // app.scene.add(sceneSpheres[i]);
    //     }
    //     app.scene.add(lod);
    // };
    // var lod = new THREE.LOD();
    // for( var i=0; i<3; i++ ){
    //     var testSphere = new THREE.SphereBufferGeometry( 1e12, (3-i)*10, (3-i)*10 );
    //     var testSphereMesh = new THREE.Mesh( testSphere, new THREE.MeshNormalMaterial );
    //     lod.addLevel(testSphereMesh, 10**(10+i))
    // }
    // app.scene.add(lod);

    // OTHER
    // add <canvas> element created by renderer to DOM
    document.getElementById('output').appendChild(app.renderer.domElement);

    app.stats = app.addStats();

    app.animate();
};

// loading font
const fontWrapper= function(){
    var fontLoader = new THREE.FontLoader();
    fontLoader.load('fonts/droid_sans_regular.typeface.json', function (font) {
        app.init(font);
    });
}

window.onload = fontWrapper;

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