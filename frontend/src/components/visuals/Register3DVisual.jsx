import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { UserCheck, Shield, Lock } from 'lucide-react';

export const Register3DVisual = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

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

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfffdf8, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf8, 1.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const burgundyLight = new THREE.DirectionalLight(0x5a2633, 1.8);
    burgundyLight.position.set(-5, -2, 4);
    scene.add(burgundyLight);

    const saffronLight = new THREE.DirectionalLight(0xe5a83b, 1.5);
    saffronLight.position.set(2, -4, -3);
    scene.add(saffronLight);

    // 1. Central 3D Civic Shield in Deep Burgundy (#5A2633)
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, -1.2);
    shieldShape.lineTo(0.9, -0.7);
    shieldShape.lineTo(0.9, 0.4);
    shieldShape.bezierCurveTo(0.9, 1.0, 0, 1.4, 0, 1.5);
    shieldShape.bezierCurveTo(0, 1.4, -0.9, 1.0, -0.9, 0.4);
    shieldShape.lineTo(-0.9, -0.7);
    shieldShape.closePath();

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.04,
      bevelThickness: 0.04
    });

    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x5a2633,
      roughness: 0.3,
      metalness: 0.35
    });

    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.rotation.z = Math.PI; // Point downwards
    rootGroup.add(shieldMesh);

    // Inner Saffron Seal (#E5A83B)
    const sealGeo = new THREE.TorusGeometry(0.55, 0.035, 16, 48);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xe5a83b,
      emissive: 0xe5a83b,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.7
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.position.set(0, 0, 0.18);
    rootGroup.add(sealMesh);

    // Orbit Ring in Jade (#2F8F83)
    const orbitGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 80);
    const orbitMat = new THREE.MeshStandardMaterial({
      color: 0x2f8f83,
      emissive: 0x2f8f83,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.set(Math.PI / 3, Math.PI / 6, 0);
    rootGroup.add(orbitMesh);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      shieldMesh.position.y = Math.sin(t * 1.4) * 0.08;
      sealMesh.position.y = shieldMesh.position.y;
      shieldMesh.rotation.y = Math.sin(t * 0.8) * 0.15;
      sealMesh.rotation.y = shieldMesh.rotation.y;

      orbitMesh.rotation.z += 0.006;
      orbitMesh.rotation.x += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      shieldGeo.dispose();
      sealGeo.dispose();
      orbitGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-burgundy text-warmwhite rounded-3xl border border-sandstone shadow-elevated h-full">
      <div className="w-[280px] h-[280px] flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />
      </div>
      <div className="text-center space-y-1 mt-2">
        <div className="font-mono text-xs text-saffron font-bold uppercase tracking-wider">
          VOTER ROLL VERIFICATION
        </div>
        <p className="text-xs text-sand-200 max-w-xs">
          Your credentials will be matched against official parliamentary records and cryptographically sealed.
        </p>
      </div>
    </div>
  );
};

export default Register3DVisual;
