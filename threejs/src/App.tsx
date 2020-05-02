import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Vector3, Mesh } from "three";

function App() {
  const root = process.env.PUBLIC_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [percentLoading, setPercentLoading] = useState(0);
  let container;

  let camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer;

  let degX = 0;
  let degY = 0;
  let camZ = 0.2;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  const canvas = useRef<HTMLDivElement>(null);
  let phone: THREE.Group;
  const vec = new Vector3();
  function init() {
    container = canvas.current!;

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.set(0, 0, camZ);

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.1);
    camera.add(pointLight);
    scene.add(camera);

    // model

    var onProgress = function (xhr: {
      lengthComputable: any;
      loaded: number;
      total: number;
    }) {
      if (xhr.lengthComputable) {
        var percentComplete = (xhr.loaded / xhr.total) * 100;
        setPercentLoading(Math.round(percentComplete));
      }
    };

    var onError = function (e: any) {
      console.log(e);
    };

    new MTLLoader()
      .setPath(root)
      .load("/assets/phone.mtl", function (materials) {
        materials.preload();

        new OBJLoader()
          .setPath(root)
          .setMaterials(materials)
          .load(
            "/assets/phone.obj",
            function (object) {
              setIsLoading(false);
              phone = object;

              const boundingBox = new THREE.Box3().setFromObject(phone);
              var bboxCenter = boundingBox.getCenter(vec).negate().clone();

              phone.traverse((obj) => {
                if (obj instanceof Mesh) {
                  obj.geometry.translate(
                    bboxCenter.x,
                    bboxCenter.y,
                    bboxCenter.z
                  );
                }
              });

              camera.lookAt(scene.position);
              scene.add(phone);
            },
            onProgress,
            onError
          );
      });

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener("mousemove", onDocumentMouseMove, false);
    document.addEventListener("wheel", onDocumentMouseWheel, false);
    document.addEventListener("touchmove", onDocumentTouchMove, false);

    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event: MouseEvent) {
    degY = ((event.clientX - windowHalfX) / windowHalfX) * Math.PI;
    degX = ((event.clientY - windowHalfY) / windowHalfY) * Math.PI;
  }

  function onDocumentTouchMove(event: TouchEvent) {
    degY =
      ((event.changedTouches[0].clientX - windowHalfX) / windowHalfX) * Math.PI;
    degX =
      ((event.changedTouches[0].clientY - windowHalfY) / windowHalfY) * Math.PI;
  }

  function onDocumentMouseWheel(event: WheelEvent) {
    var scale = 0.02;
    if (event.deltaY > 0) {
      camZ += scale;
      camZ = camZ > 1 ? 1 : camZ;
    } else {
      camZ -= scale;
      camZ = camZ < 0.1 ? 0.1 : camZ;
    }
  }

  function render() {
    camera.position.z = camZ;

    if (phone) {
      phone.rotation.set(degX, degY, 0);
    }
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  return (
    <div className="App">
      <div className="canvas" ref={canvas}></div>
      <div className={`loading ${isLoading ? "active" : ""}`}>
        Loading {percentLoading} %
      </div>
    </div>
  );
}

export default App;
