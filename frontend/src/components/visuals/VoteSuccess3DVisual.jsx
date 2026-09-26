import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const VoteSuccess3DVisual = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfffdf8, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf8, 1.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const burgundyLight = new THREE.DirectionalLight(0x5a2633, 2.0);
    burgundyLight.position.set(-4, -2, 3);
    scene.add(burgundyLight);

    const saffronLight = new THREE.DirectionalLight(0xe5a83b, 1.6);
    saffronLight.position.set(2, -4, -3);
    scene.add(saffronLight);

    // 1. Center Deep Burgundy Disc (#5A2633)
    const discGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 48);
    discGeo.rotateX(Math.PI / 2);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x5a2633,
      roughness: 0.25,
      metalness: 0.35
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    rootGroup.add(discMesh);

    // 2. Outer Saffron Ring (#E5A83B)
    const saffronRingGeo = new THREE.TorusGeometry(1.22, 0.055, 24, 64);
    const saffronRingMat = new THREE.MeshStandardMaterial({
      color: 0xe5a83b,
      emissive: 0xe5a83b,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.7
    });
    const saffronRingMesh = new THREE.Mesh(saffronRingGeo, saffronRingMat);
    rootGroup.add(saffronRingMesh);

    // 3. 3D Checkmark in Warm White + Jade Emissive
    const checkShape = new THREE.Shape();
    checkShape.moveTo(-0.45, -0.05);
    checkShape.lineTo(-0.15, -0.38);
    checkShape.lineTo(0.48, 0.32);
    checkShape.lineTo(0.38, 0.42);
    checkShape.lineTo(-0.15, -0.22);
    checkShape.lineTo(-0.35, 0.04);
    checkShape.closePath();

    const checkGeo = new THREE.ExtrudeGeometry(checkShape, { depth: 0.08, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.02, bevelThickness: 0.02 });
    const checkMat = new THREE.MeshStandardMaterial({
      color: 0xfffdf8,
      emissive: 0x2f8f83,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.3
    });
    const checkMesh = new THREE.Mesh(checkGeo, checkMat);
    checkMesh.position.set(0, 0, 0.06);
    rootGroup.add(checkMesh);

    // 4. Orbiting Ripple Rings in Jade (#2F8F83)
    const rippleGeo = new THREE.TorusGeometry(1.7, 0.02, 16, 80);
    const rippleMat = new THREE.MeshStandardMaterial({
      color: 0x2f8f83,
      emissive: 0x2f8f83,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.8
    });
    const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
    rippleMesh.rotation.set(Math.PI / 4, Math.PI / 6, 0);
    rootGroup.add(rippleMesh);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      rootGroup.rotation.y = Math.sin(t * 1.2) * 0.18;
      rootGroup.position.y = Math.sin(t * 1.8) * 0.06;
      rippleMesh.rotation.z += 0.008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      discGeo.dispose();
      saffronRingGeo.dispose();
      checkGeo.dispose();
      rippleGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-[200px] h-[200px] mx-auto flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default VoteSuccess3DVisual;
