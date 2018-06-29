var app = app || {};

app.createSpotlight = () => {
    const spotlight = new THREE.SpotLight(0xFFFFFF);
    spotlight.position.set(-30, 50, 30);
    // spotlight.castShadow = true;
    // spotlight.shadow.mapSize.width = 2048;
    // spotlight.shadow.mapSize.height = 2048;

    return spotlight;
};


app.createPlane = () => {
    const planeGeometry = new THREE.PlaneGeometry(120, 60);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xCFD8DC });

    // combine geometry (shape) and material (surface)
    // into mesh, the actual 3d object
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;

    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // plane.receiveShadow = true;

    return plane;
};


app.createCube = ({ x, y, z, xSize, ySize, zSize, colour }) => {
    const cubeGeometry = new THREE.BoxGeometry(xSize, ySize, zSize);
    const cubeMaterial = new THREE.MeshLambertMaterial({
        color: colour,
        wireframe: false,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, z);
    // cube.castShadow = true;

    cube.rotationScale = Math.random();

    return cube;
}

app.createSphere = ({ sx, sy, sz, px, py, pz, bool, colorSet }) => {
    // spheres take radius, then 2 arguments for triangles
    var toSet = colorSet;
    const sphereGeometry = new THREE.SphereGeometry(sx, sy, sz);
    const sphereMaterial = new THREE.MeshLambertMaterial({
        color: toSet,
        wireframe: bool,
        map: THREE.ImageUtils.loadTexture('img/earth.jpg'),
        side: THREE.DoubleSide
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(px, py, pz);
    // sphere.castShadow = true;

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
    // console.log(app.step);

    // app.step += app.controls.bouncingSpeed;
    // app.sphere.position.x = 6 + 5 * (Math.cos(app.step));
    // app.sphere.position.y = 6 + 5 * (Math.abs(Math.sin(app.step)));
    app.sphere.rotation.y += app.controls.rotationSpeed;

    app.cubes.forEach(cube => {
        cube.rotation.x += app.controls.rotationSpeed * cube.rotationScale;
        cube.rotation.y += app.controls.rotationSpeed * cube.rotationScale;
    })

    app.animateParticles();
    // app.cube.rotation.x += app.controls.rotationSpeed;
    // app.cube.rotation.y += app.controls.rotationSpeed;
    // app.cube.rotation.z += app.controls.rotationSpeed;

    app.renderer.render(app.scene, app.camera);

    requestAnimationFrame(app.animate);
}

app.animateParticles = () => {
    const particles = app.particleSystem.geometry.vertices;
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        // particle.y -= app.controls.bouncingSpeed;

        // if( particle.y < -app.controls.particleDistribution ){
        //     particle.y = app.controls.particleDistribution;
        // }


        const distSquared = (particle.x * particle.x) + (particle.y * particle.y) + (particle.z * particle.z);

        if (distSquared > 2.0) {
            const force = (1.0 / distSquared) * -0.2;
            particle.vx += force * particle.x;
            particle.vy += force * particle.y;
            particle.vz += force * particle.z;
        }
        particle.x += particle.vx * app.controls.velocityScale;
        particle.y += particle.vy * app.controls.velocityScale;
        particle.z += particle.vz * app.controls.velocityScale;

    }
    // app.particleSystem.rotation.y -= app.controls.rotationSpeed;
    app.particleSystem.geometry.verticesNeedUpdate = true;
};