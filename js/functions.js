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

app.createMesh = ({ material, color, side, wireframe, map, normalMap=undefined, opacity, alphaTest=1 }) => {
    switch(material){
        case "lambert":
        return new THREE.MeshLambertMaterial({color, side, wireframe, map, opacity, alphaTest});
        case "normal":
        return new THREE.MeshNormalMaterial({color, side, wireframe, map, opacity, alphaTest});
        case "basic":
        return new THREE.MeshBasicMaterial({color, side, wireframe, map, opacity, alphaTest});
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

app.createCSSObject = ( width, height, position, rotation, url )=>{
    var html = [
        `<div style="width:${width}px; height:${height}px;">`,
        `<iframe src="${url}" width="${width}" height="${height}">`,
        `</iframe>`,
        `</div>`
    ].join('\n');
    var div = document.createElement('div');
    $(div).html(html);
    var CSSObject = new THREE.CSS3DObject(div);
    CSSObject.position.x = position.x;
    CSSObject.position.y = position.y;
    CSSObject.position.z = position.z;
    CSSObject.rotation.x = rotation.x;
    CSSObject.rotation.y = rotation.y;
    CSSObject.rotation.z = rotation.z;

    return CSSObject;
}

// app.createParticleSystem = () => {
//     const particles = new THREE.Geometry();
//     const dist = app.controls.particleDistribution
//     for (let i = 0; i < app.controls.numParticles; i++) {
//         const particle = new THREE.Vector3(
//             THREE.Math.randInt(-dist, dist),
//             100,
//             THREE.Math.randInt(-dist, dist),
//         );
//         particle.vx = 0;
//         particle.vy = 0;
//         particle.vz = 0;

//         particles.vertices.push(particle);
//     }
//     const particleMaterial = new THREE.PointsMaterial({
//         color: 0xFFFFFF,
//         size: 8,
//         map: THREE.ImageUtils.loadTexture('img/snowflake.png'),
//         blending: THREE.NormalBlending,
//         transparent: true,
//         alphaTest: 0.5
//     });
//     const particleSystem = new THREE.Points(particles, particleMaterial);
//     return particleSystem;
// };



// render loop
var delta = 0;
app.animate = () => {

    app.stats.update();
    app.earth.rotation.y += app.controls.earthRotationSpeed;
    app.jupiter.rotation.y += app.controls.jupiterRotationSpeed;
    app.sun.rotation.y += app.controls.sunRotationSpeed;
    app.galaxyParticleSystem.rotation.y += app.controls.galaxyRotationSpeed;
    // app.galaxy




    // // vertex fragments & vertex
    // delta +=0.1;
    // app.example.material.uniforms.delta.value = 0.5*Math.sin(delta)*0.5;
    // for( var i=0; i<vertexDisplacement.length; i++ ){
    //     vertexDisplacement[i] = 0.5+Math.sin(i*delta) * 0.25;
    // };
    // app.example.geometry.attributes.vertexDisplacement.needsUpdate = true;

    // camera events
    app.camera1.distance = Math.sqrt(app.camera1.position.x**2+app.camera1.position.y**2+app.camera1.position.z**2)
    
    // object rendering
    if( app.galaxyParticleSystem && app.blackhole && app.sun && app.sunlabel ){
        app.camera1.distance < 1e9 ? app.scene.remove(app.galaxyParticleSystem) && app.scene.remove(app.blackhole) && app.scene.remove(app.sun) && app.scene.remove(app.sunlabel)
        :app.scene.add(app.galaxyParticleSystem) && app.scene.add(app.blackhole) && app.scene.add(app.sun) && app.scene.add(app.sunlabel);
    }
    if( app.jupiter && app.jupiterlabel ){
        app.camera1.distance < 1e7 ? app.scene.remove(app.jupiter) && app.scene.remove(app.jupiterlabel)
        :app.scene.add(app.jupiter) && app.scene.add(app.jupiterlabel);
    }
    if( app.earth && app.earthlabel ){
        app.camera1.distance < 90000 ? app.scene.remove(app.earth) && app.scene.remove(app.earthlabel)
        :app.scene.add(app.earth) && app.scene.add(app.earthlabel);
    }
    if( app.human && app.humanlabel ){
        app.camera1.distance < 1200 ? app.scene.remove(app.human) && app.scene.remove(app.humanlabel)
        :app.scene.add(app.human) && app.scene.add(app.humanlabel);
    }
    if( app.cell && app.celllabel ){
        app.camera1.distance < 9.11 ? app.scene.remove(app.cell) && app.scene.remove(app.celllabel)
        :app.scene.add(app.cell) && app.scene.add(app.celllabel);
    }
    if( app.DNA && app.DNAlabel ){
        app.camera1.distance < 0.0085 ? app.scene.remove(app.DNA) && app.scene.remove(app.DNAlabel)
        :app.scene.add(app.DNA) && app.scene.add(app.DNAlabel);
    }



    // skybox rendering
    if( app.blackholeSkyBox ){
        app.camera1.distance < 1.3e9 ? app.scene.remove(app.blackholeSkyBox)
        :app.scene.add(app.blackholeSkyBox);
    }
    if( app.jupiterSkyBox ){
        app.camera1.distance < 1.1e9 && app.camera1.distance > 1e5 ? app.scene.add(app.jupiterSkyBox)
        :app.scene.remove(app.jupiterSkyBox)
    }
    if( app.humanSkyBox ){
        app.camera1.distance < 133000 && app.camera1.distance > 1250 ? app.scene.add(app.humanSkyBox)
        :app.scene.remove(app.humanSkyBox);
    }
    if( app.cellSkyBox ){
        app.camera1.distance < 1249 && app.camera1.distance > 9.11 ? app.scene.add(app.cellSkyBox)
        :app.scene.remove(app.cellSkyBox);
    }
    if( app.DNASkyBox ){
        app.camera1.distance < 8.99 & app.camera1.distance > 0.0085 ? app.scene.add(app.DNASkyBox)
        :app.scene.remove(app.DNASkyBox);
    }



    // camera vs skybox
    if( app.DNASkyBox ){
        app.camera1.distance < 10.5 ? app.scene.add(app.DNASkyBox) : app.scene.remove(app.DNASkyBox);
    }
    if (app.cellSkyBox) {
        app.camera1.distance < 1200 ? app.scene.add(app.cellSkyBox) : app.scene.remove(app.cellSkyBox);
    }
    if( app.human && app.humanSkyBox ){
        app.camera1.distance < 100000 ? app.scene.add(app.humanSkyBox) && app.scene.add(app.human) : app.scene.remove(app.humanSkyBox) && app.scene.remove(app.human);
    }
    // if( app.jupiterSkyBox ){
    //     app.jupiterSkyBox.visible = app.camera1.distance < 2e10 ? true : false;
    // }
    
    // galaxy dynamic particles
    app.time = Date.now() * 0.005;
    app.galaxyParticleSystem.rotation.y += 0.01;
    app.sizes = app.galaxyGeometry.attributes.size.array;
    for (var i = 0; i < app.galaxyParticles; i++) {
        app.sizes[i] = 1e10 * (1 + Math.sin(0.1 * i + app.time));
    }
    app.galaxyGeometry.attributes.size.needsUpdate = true;

    // rendering
    app.renderer.render(app.scene, app.camera1);
    app.CSS3DRenderer.render(app.CSS3Dscene, app.camera1);
    requestAnimationFrame(app.animate);
}

// page toggle
var earthInfo = -1;
app.toggleEarth = () => {
    earthInfo *= -1;
    if (earthInfo > 0) {
        app.scene.add(app.earthPage);
    } else {
        app.scene.remove(app.earthPage);
    }
}
var jupiterInfo = -1;
app.toggleJupiter = () => {
    jupiterInfo *= -1;
    if (jupiterInfo > 0) {
        app.scene.add(app.jupiterPage);
    } else {
        app.scene.remove(app.jupiterPage);
    }
}
var sunInfo = -1;
app.toggleSun = ()=>{
    sunInfo*= -1;
    if(sunInfo > 0){
        app.scene.add(app.sunPage);
    } else {
        app.scene.remove(app.sunPage);
    }
}
var galaxyInfo = -1;
app.toggleGalaxy = ()=>{
    galaxyInfo*= -1;
    if(galaxyInfo > 0){
        app.scene.add(app.galaxyPage);
    } else {
        app.scene.remove(app.galaxyPage);
    }
}
var humanInfo = -1;
app.toggleHuman = ()=>{
    humanInfo*= -1;
    if(humanInfo > 0){
        app.scene.add(app.humanPage);
    } else {
        app.scene.remove(app.humanPage);
    }
}
var cellInfo = -1;
app.toggleCell = ()=>{
    cellInfo*= -1;
    if(cellInfo > 0){
        app.scene.add(app.cellPage);
    } else {
        app.scene.remove(app.cellPage);
    }
}
var DNAInfo = -1;
app.toggleDNA = ()=>{
    DNAInfo*= -1;
    if(DNAInfo > 0){
        app.scene.add(app.DNAPage);
    } else {
        app.scene.remove(app.DNAPage);
    }
}


window.addEventListener("keypress", (e)=>{
    if(e.key==="e"){
        app.toggleEarth();
    } else if(e.key==="j"){
        app.toggleJupiter();
    } else if(e.key==="s"){
        app.toggleSun();
    } else if(e.key==="g"){
        app.toggleGalaxy();
    } else if(e.key==="h"){
        app.toggleHuman();
    } else if(e.key==="c"){
        app.toggleCell();
    } else if(e.key==="d"){
        app.toggleDNA();
    }
})