# Explore ( with THREE.JS )

[Live demo]
(http://achacttn.github.io/explore)

### About

Explore is a rendering of a scene using THREE.js.
More specifically, attributes of three-dimensional objects (shape, mesh, etc) are defined and manipulated.
The results of these interactions between the objects, lighting, and the environment, are projected onto a canvas element.

![First test of a JSON model](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/json01.png)

Through WebGL (JavaScript API used by a browser to directly access the GPU), shader code written in GLSL can be combined with JavaScript control code to produce complex image-processing or physics.
THREE.js supports several image and 3d object formats.
Most simple geometries were created by specifying a geometry and a mesh.

![Earth](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/mesh01.png)

Complicated objects with many vertices and faces (such as a human) were imported with its respective loader.

![Typical result when googling "human model"](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/humanmodel01.png)

![Human](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/humanmodel02.png)

Galaxy was created by defining a vertex shader to describe particle dimensions, as well as afragment shader for texture and color.

![Inside galaxy](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/galaxy01.png)

Shader code was specified to be as the mesh of a single particle, and these particles were added to a more general Buffer Geometry.

![Side view](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/galaxy02.png)

The particles were uniformly distributed to produce a circular-shape in the x-z plane and a mirrored slope in the y-plane.
The particles by themselves have potential to be used in visualizing probability density functions.

![Example #1](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/particles01.png)

![Example #2](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/particles02.png)

![Example #3](https://raw.githubusercontent.com/achacttn/explore/master/readmesrc/particles03.png)

### Bugs

* On loading page, camera needs to move for proper alignment of objects.

* CSS3D plane object has opacity issue.

* CSS3D Object does not make a GET request.

### To be added

* Rendering WebGL within CSS3D objects.

* Passing browser events to the rendered WebGL inside the CSS3D in the normal GL renderer.

### Contact info

[Twitter](https://twitter.com/achacttn)

