// main.js

// // gui fields
// app.controls = {
//     // bouncingSpeed: 0.05,
//     rotationSpeed: 0.01,
//     // numParticles: 5000,
//     // particleDistribution: 200,
//     // velocityScale: 1.0,
// };


// // gui controls
// app.gui = new dat.GUI();
// // app.gui.add(app.controls, 'bouncingSpeed', 0, 1);
// app.gui.add(app.controls, 'rotationSpeed', 0, 0.1);
//     // app.gui.add(app.controls, 'velocityScale', -2, 2);


    // const numCubes = 10;
    // app.cubes = [];
    // for (let i = 0; i < numCubes; i++) {
    //     const cube = app.createCube({
    //         xSize: 10,
    //         ySize: 10,
    //         zSize: 10,
    //         x: THREE.Math.randInt(-100, 100),
    //         y: THREE.Math.randInt(-100, 100),
    //         z: THREE.Math.randInt(-100, 100),
    //         colour: new THREE.Color(
    //             Math.random(),
    //             Math.random(),
    //             Math.random(),
    //         )
    //     });
    //     app.cubes.push(cube);
    //     app.scene.add(cube);
    // }

    // app.particleSystem = app.createParticleSystem();
    // app.scene.add(app.particleSystem);

    // app.sphere2 = app.createSphere(6, 40, 40, 6, 20, 15, true, 0xff3333 );
    // app.scene.add( app.sphere2 );



// functions.js
// app.animate = () => {

//     app.stats.update();
//     // console.log(app.step);

//     // app.step += app.controls.bouncingSpeed;
//     // app.sphere.position.x = 6 + 5 * (Math.cos(app.step));
//     // app.sphere.position.y = 6 + 5 * (Math.abs(Math.sin(app.step)));
//     app.sphere1.rotation.y += app.controls.rotationSpeed;

//     // app.cubes.forEach(cube => {
//     //     cube.rotation.x += app.controls.rotationSpeed * cube.rotationScale;
//     //     cube.rotation.y += app.controls.rotationSpeed * cube.rotationScale;
//     // })

//     // app.animateParticles();
//     // app.cube.rotation.x += app.controls.rotationSpeed;
//     // app.cube.rotation.y += app.controls.rotationSpeed;
//     // app.cube.rotation.z += app.controls.rotationSpeed;


//     app.renderer.render(app.scene, app.camera1);
//     requestAnimationFrame(app.animate);
// }



// app.animateParticles = () => {
//     const particles = app.particleSystem.geometry.vertices;
//     for (let i = 0; i < particles.length; i++) {
//         const particle = particles[i];
//         // particle.y -= app.controls.bouncingSpeed;

//         // if( particle.y < -app.controls.particleDistribution ){
//         //     particle.y = app.controls.particleDistribution;
//         // }


//         const distSquared = (particle.x * particle.x) + (particle.y * particle.y) + (particle.z * particle.z);

//         if (distSquared > 2.0) {
//             const force = (1.0 / distSquared) * -0.2;
//             particle.vx += force * particle.x;
//             particle.vy += force * particle.y;
//             particle.vz += force * particle.z;
//         }
//         particle.x += particle.vx * app.controls.velocityScale;
//         particle.y += particle.vy * app.controls.velocityScale;
//         particle.z += particle.vz * app.controls.velocityScale;

//     }
//     // app.particleSystem.rotation.y -= app.controls.rotationSpeed;
//     app.particleSystem.geometry.verticesNeedUpdate = true;
// };