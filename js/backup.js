
<script>
requirejs.config({
	paths	: {

		"build"		: "vendor/tquery/build",
		"plugins"	: "vendor/tquery/plugins",
		'threex'	: 'vendor/tquery/vendor/threex',
		'three.js'	: 'vendor/tquery/vendor/three.js',
	},
});
</script><script>
require([ 'tquery.controls'
	, 'tquery.minecraft'
	, 'tquery.skymap'
	, 'tquery.grassground'
	, 'tquery.keyboard'
	, 'tquery.loaders'
	, 'tquery.domevent'
	, 'tquery.renderers'
	, 'tquery.htmlmixer'
], function(){
	var world	= tQuery.createWorld().boilerplate().start();
	
	document.querySelector('#infoButton').addEventListener('click', function(event){
		var element	= document.querySelector('#infoPopup');
		console.log('display', element.style.display)
		element.style.display	= element.style.display === 'none' ? 'block' : 'none';
	});
	
	// enable domEvent on this world
	world.enableDomEvent();	

	// setup camera position
	world.camera().positionY(1.5).positionZ(4).lookAt(0,1, 0)

	// handle camera controls
	var controls	= world.getCameraControls();
	controls.rangeX	*= 1/8;
	controls.rangeY	*= 1/8;
	controls.target.set(0, 0.8, 0)
	world.hook(function(){
		if( world.camera().positionY() < 0.3 ){
			world.camera().positionY(0.3)
		}
	})


	var videoIdx	= 0;
	var videos	= [];

	var loader	= new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	var modelUrl	= 'vendor/tquery/plugins/tvset/models/OldTelevisionSet01/models/Old Television Set 01.dae';
	loader.load(modelUrl, function(collada){
		var container	= tQuery.createObject3D().addTo(world)
			.positionZ(-0.5)
			.scaleBy(3)
		
		var tvSet	= tQuery(collada.scene).addTo(container)
			.positionY(-0.4)

		//var url		= 'http://www.youtube.com/embed/FY4UQpu1ijM';
		var url		= 'http://example.org';
		//var url	= 'http://pacmaze.com';
		var plane	= tQuery.createHTMLMixerPlane(url).addTo(container)
			.addClass('screen')
			.positionY(0.31).positionZ(0.16)
			.scaleX(1/2.2).scaleY(1/2.85)

		initChannel();	
	});

	function initChannel(){
		var request = new XMLHttpRequest()
		var url = 'http://gdata.youtube.com/feeds/api/playlists/UUDyknKncQDzw7NdqYj2_94A?alt=json&start-index=1';
		request.open("get", url, true);
		request.onload  = function(){
			// parse the feed
			var response  = JSON.parse(this.responseText)
			console.dir(response);
			// extract from the title+embedUrl from the feed
			response.feed.entry.forEach(function(entry){
				var video	= {};
				video.title	= entry.title['$t'];
				entry['media$group']['media$content'].forEach(function(content){
					if( content.type !== 'application/x-shockwave-flash') return;
					video.embedUrl	= content.url;
				})
				videos.push(video);
			})
			console.log(videos)


			// honor location.hash
			if( location.hash ){
				response.feed.entry.forEach(function(entry, idx){
					var title	= decodeURIComponent(location.hash.substr(1));
					if( entry.title['$t'] !== title )	return;
					videoIdx	= idx;
					setVideoUrl(videoIdx)
				});
			}


			// BUTTON NEXT
			var element		= document.createElement( 'div' );
			element.style.width	= '256px';
			element.style.height	= '256px';
			element.title 		= 'Next Video';
			element.classList.add("buttonPrevNext");
			var tObject3D	= new THREE.CSS3DObject( element );
			var htmlMixer	= world.htmlMixer();
			var tSceneCSS	= htmlMixer.sceneCSS();
			tQuery(tObject3D).addTo(tSceneCSS)
				.positionX(0.45).positionY(0.17).positionZ(0.05)
				.scaleX(0.5/256).scaleY(0.3/256)
			element.addEventListener('click', function(event){
				videoIdx	= (videoIdx+1 + videos.length) % videos.length;
				setVideoUrl( videoIdx )
			});

	
			// BUTTON PREV
			var element		= document.createElement( 'div' );
			element.style.width	= '256px';
			element.style.height	= '256px';
			element.title 		= 'Previous Video';
			element.classList.add("buttonPrevNext");
			var tObject3D	= new THREE.CSS3DObject( element );
			var htmlMixer	= world.htmlMixer();
			var tSceneCSS	= htmlMixer.sceneCSS();
			tQuery(tObject3D).addTo(tSceneCSS)
				.positionX(-0.45).positionY(0.17).positionZ(0.05)
				.scaleX(0.5/256).scaleY(0.3/256)
			element.addEventListener('click', function(event){
				videoIdx	= (videoIdx-1 + videos.length) % videos.length;
				setVideoUrl( videoIdx )
			});
			
			videoIdx	= 0;
			setVideoUrl( videoIdx )
		}
		request.send();
	}

	function setVideoUrl(videoIdx){
		var video	= videos[videoIdx];
		var plane	= tQuery('.screen')
		var objectCSS	= plane.data('htmlMixerObjectCss')
		var domElement	= objectCSS.element
		domElement.src	= video.embedUrl;
		location.hash	= encodeURIComponent(video.title);
	}
});
</script>


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