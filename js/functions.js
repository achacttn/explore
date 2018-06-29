console.log(2);

var app = app || {};

app.createColor = ({ r, g, b })=>{
    const color = new THREE.Color( r, g, b );
    return color;
};

app.createCamera = ({ pov, aspectRatio, nearView, farView, sx, sy, sz })=>{
    const camera = new THREE.PerspectiveCamera( pov, aspectRatio, nearView, farView );
    camera.position.set( sx, sy, sz );
    return camera;
};

app.createOrbitControls = ( input )=>{
    return new THREE.OrbitControls( input, app.renderer.domElement );
};

app.animate = ()=>{
    app.stats.update();
    app.renderer.render( app.scene, app.camera );
    requestAnimationFrame( app.animate );
};

app.createAmbientLight = ( color )=>{
    const ambientLight = new THREE.AmbientLight(color);
    return ambientLight;
};

app.createSpotlight = ( color, { sx, sy, sz })=>{
    const spotlight = new THREE.SpotLight( color );
    spotlight.position.set( sx, sy, sz );
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 2048;
    spotlight.shadow.mapSize.height = 2048;
    return spotlight;
};

app.createMaterial = ( color, type )=>{
    switch(type){
        case "MeshLambertMaterial":
        return new THREE.MeshLambertMaterial({color});
        break;
    }
}

app.createObject = ( geometry, material )=>{
    switch(geometry.name){
        case "plane":
        const planeGeometry = new THREE.PlaneGeometry( geometry.dimension.x, geometry.dimension.y );
        const plane = new THREE.Mesh( planeGeometry, material );
        plane.rotation.x = -0.5*Math.PI;
        return plane;
    }
}