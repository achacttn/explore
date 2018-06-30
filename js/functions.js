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

app.createMesh = ({ material, color, side, wireframe, map }) => {
    switch(material){
        case "lambert":
        return new THREE.MeshLambertMaterial({color, side, wireframe, map});
    }
};

// app.loadModel = ( modelPath ) => {
//     const jsonModel = new THREE.JSONLoader();
//     jsonModel.load( modelPath, ( geometry, materials )=>{
//         const modelMaterial = new THREE.MeshFaceMaterial(materials);
//         return new THREE.Mesh( geometry, modelMaterial );
//     });
// }

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

app.animate = () => {

    app.stats.update();
    app.earth.rotation.y += 0.01;
    
    app.sun.rotation.y += 0.01;

    app.renderer.render(app.scene, app.camera1);
    requestAnimationFrame(app.animate);
}