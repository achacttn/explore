var app = app || {};

app.createSpotlight = ({
    color,
    position: {x, y, z},
    shadow: { bool, width, height }}) => {
    const spotlight = new THREE.SpotLight(color);
    spotlight.position.set(x, y, z);
    spotlight.castShadow = bool;
    spotlight.shadow.mapSize.width = width;
    spotlight.shadow.mapSize.height = height;
    return spotlight;
};

app.createCamera = ({
    fov, aspect, near, far,
    position: { x, y, z }}) => {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(x, y, z);
    return camera;
}

app.createMesh = ({ material, color, side, wireframe, map, normalMap=undefined, alphaTest=1 }) => {
    switch(material){
        case "lambert":
        return new THREE.MeshLambertMaterial({color, side, wireframe, map, alphaTest});
        case "normal":
        return new THREE.MeshNormalMaterial({color, side, wireframe, map, alphaTest});
    }
};

app.createText = ({
    textString,
    font,
    size,
    height,
    mesh,
    translationFactor:{tx,ty,tz} }) => {
    // console.log(tx, ty, tz);
    
    const textGeometry = new THREE.TextBufferGeometry(textString,{font,size,height})
    textGeometry.computeBoundingSphere();
    const boundR = textGeometry.boundingSphere.radius;
    textGeometry.translate(tx*boundR,ty*boundR,tz*boundR);
    const textMesh = app.createMesh(mesh);
    const text = new THREE.Mesh(textGeometry, textMesh);
    return text;
};

app.createPlane = ({
    dim:{ width,height },
    position:{ x,y,z },
    mesh,
    shadow:{ bool }}) => {
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMesh = app.createMesh(mesh);
    const plane = new THREE.Mesh(planeGeometry, planeMesh);
    plane.rotation.y = -0.2 * Math.PI;
    plane.position.set(x,y,z);
    plane.receiveShadow = bool;
    return plane;
};


app.createCube = ({
    dim:{ length, width, height },
    position:{x,y,z},
    mesh,
    shadow:{ cast }}) => {
    const cubeGeometry = new THREE.BoxGeometry(length, width, height);
    const cubeMesh = app.createMesh(mesh);
    const cube = new THREE.Mesh(cubeGeometry, cubeMesh);
    cube.position.set(x, y, z);
    cube.castShadow = cast;

    cube.rotationScale = Math.random();

    return cube;
}

app.createSphere = ({
    dim:{ radius, triangles, other },
    position:{x,y,z},
    mesh,
    shadow:{ cast }}) => {
    // spheres take radius, then 2 arguments for triangles
    const sphereGeometry = new THREE.SphereGeometry(radius, triangles, other);
    const sphereMesh = app.createMesh(mesh);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMesh);
    sphere.position.set(x, y, z);
    sphere.castShadow = cast;

    return sphere;
};

app.createParticleSystem = () => {
    const particles = new THREE.Geometry();
    const dist = app.controls.particleDistribution
    for (let i = 0; i < app.controls.numParticles; i++) {
        const particle = new THREE.Vector3(
            THREE.Math.randInt(-dist, dist),
            100,
            THREE.Math.randInt(-dist, dist),
        );
        particle.vx = 0;
        particle.vy = 0;
        particle.vz = 0;

        particles.vertices.push(particle);
    }
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 8,
        map: THREE.ImageUtils.loadTexture('img/snowflake.png'),
        blending: THREE.NormalBlending,
        transparent: true,
        alphaTest: 0.5
    });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    return particleSystem;
};

// render loop
var delta = 0;
app.animate = () => {

    app.stats.update();
    app.earth.rotation.y += 0.01;
    app.jupiter.rotation.y += 0.01;
    app.sun.rotation.y += app.controls.sunRotationSpeed;
    app.humanlabel.rotation.y = app.controls.humanRotate;

    // // vertex fragments & vertex
    // delta +=0.1;
    // app.example.material.uniforms.delta.value = 0.5*Math.sin(delta)*0.5;
    // for( var i=0; i<vertexDisplacement.length; i++ ){
    //     vertexDisplacement[i] = 0.5+Math.sin(i*delta) * 0.25;
    // };
    // app.example.geometry.attributes.vertexDisplacement.needsUpdate = true;

    // camera events
    app.camera1.distance = Math.sqrt(app.camera1.position.x ** 2
        + app.camera1.position.y ** 2 + app.camera1.position.z ** 2)
    if( app.DNA ){
        app.camera1.distance < 0.0175 ? app.DNA.visible = false : app.DNA.visible = true;
    }
    if( app.cell ){
        app.camera1.distance < 8.6 ? app.cell.visible = false : app.cell.visible = true;
    }
    if( app.human ){
        app.camera1.distance < 1127 ? app.human.visible = false : app.human.visible = true;
    }
    // camera vs skybox
    if( app.humanSkyBox ){
        app.camera1.distance > 100000 ? app.humanSkyBox.visible = false : app.humanSkyBox.visible = true;
    }
    if (app.cellSkyBox) {
        app.camera1.distance < 8.5 ? app.cellSkyBox.visible = false : app.cellSkyBox.visible = true;
    }

    
    // rendering
    app.renderer.render(app.scene, app.camera1);
    requestAnimationFrame(app.animate);
}

// for human body 1302