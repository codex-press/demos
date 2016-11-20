import article from 'article';
import Plugin from 'plugin';
import dom from 'dom';
import animate from 'animate';

import * as THREE from 'three';

let url = 'https://usercontent.codex.press/images/5e257fe7-6f08-42bc-bb91-37f61c3e8012/original.jpg';

let camera, scene, renderer;
let isUserInteracting = false;
let lon = -152
let lat = 4.4;
let onPointerDownPointerX;
let onPointerDownPointerY;
let onPointerDownLon;
let onPointerDownLat;

article.register('.rainbow', class Rainbow extends Plugin {

  constructor(args) {
    super(args);

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    this.prepend(renderer.domElement);
    this.select('img').css({display: 'none'});

    let aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.target = new THREE.Vector3( 0, 0, 0 );

    let texture = new THREE.TextureLoader().load(url, texture => {
      dom(renderer.domElement).addClass('loaded');
      this.update();
    });

    let material = new THREE.MeshBasicMaterial({map: texture});
    material.side = THREE.DoubleSide;

    let geometry = new THREE.SphereGeometry(3, 60, 40, 0, 2.5, 4, 1.2);
    geometry.scale(-1, -1, 1);

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    this.animate();

    this.bind({resize: 'resize'});
    // this.bind({wheel: 'wheel'}, this.el);
    this.bind({mousedown: 'mousedown'}, this.el);
  }

  animate() {
    let duration = 10000;

    let easeLat = animate.cubicOut(lat, -0.3);
    let easeFov = animate.cubicOut(camera.fov, 40);
    let easeLon = animate.cubicOut(lon, -64);

    let tick = time => {
      lat = easeLat(time);
      lon = easeLon(time);
      camera.fov = easeFov(time);
      camera.updateProjectionMatrix();
      this.update();
    };

    this.tween = animate({duration, tick});
  }


  resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.update();
  }


  mousedown(e) {
    this.tween.cancel();
    this.bind({
      mousemove: 'mousemove',
      mouseup: 'mouseup',
    }, window);

    isUserInteracting = true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
  }


  mousemove(e) {
    if ( isUserInteracting === true ) {
      lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
      lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
      this.update();
    }
  }


  mouseup(e) {
    this.unbind(['mousemove','mouseup'], window);
    this.animate();
    isUserInteracting = false;
  }


  // wheel(e) {
  //   camera.fov += event.deltaY * 0.05;
  //   console.log(camera.fov);
  //   camera.updateProjectionMatrix();
  //   this.update();
  //   e.preventDefault();
  // }


  update() {
    lat = Math.max(-85, Math.min(85, lat));

    // console.log(camera.fov, lat, lon);

    let phi = THREE.Math.degToRad(90 - lat);
    let theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt(camera.target);

    renderer.render(scene, camera);
  }

});



article.register('.scroll-block', class ScrollBlock extends Plugin {

  constructor(args) {
    super(args);
    console.log(this);
  }

});


