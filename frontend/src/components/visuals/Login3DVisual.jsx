import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Lock, CheckCircle2, KeyRound } from 'lucide-react';

export const Login3DVisual = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

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

    const burgundyLight = new THREE.DirectionalLight(0x5a2633, 1.6);
    burgundyLight.position.set(-5, -2, 4);
    scene.add(burgundyLight);

    const jadeLight = new THREE.DirectionalLight(0x2f8f83, 1.5);
    jadeLight.position.set(2, -4, -3);
    scene.add(jadeLight);

    // 1. 3D Identity Card Texture (Warm Paper + Burgundy & Saffron)
    const createCardTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      // Card Base in Deep Burgundy
      ctx.fillStyle = '#5A2633';
      ctx.fillRect(0, 0, 640, 400);

      // Guilloche Border
      ctx.strokeStyle = '#E5A83B';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 608, 368);

      // Saffron Emblem Chip
      ctx.fillStyle = '#E5A83B';
      ctx.beginPath();
      ctx.roundRect(45, 45, 65, 50, 8);
      ctx.fill();

      // Header
      ctx.fillStyle = '#FFFDF8';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('DIGITAL VOTER IDENTITY', 130, 65);

      ctx.fillStyle = '#E5A83B';
      ctx.font = '14px monospace';
      ctx.fillText('DEMOCRATIC ROLL · ECDSA VERIFIED', 130, 90);

      // User info
      ctx.fillStyle = '#DED6CA';
      ctx.font = '15px monospace';
      ctx.fillText('VID : 2026-X89K-9901', 45, 175);
      ctx.fillText('AUTH: HARDWARE BIOMETRIC SEAL', 45, 210);
      ctx.fillText('ROLL: CONSTITUENCY AP-04', 45, 245);

      // Security Seal Watermark in Jade
      ctx.beginPath();
      ctx.arc(520, 260, 55, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(47, 143, 131, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#2F8F83';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✓ VERIFIED', 520, 255);
      ctx.fillText('VOTEREMOTE', 520, 275);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const cardTexture = createCardTexture();

    // 2. 3D Identity Card Mesh
    const cardGeo = new THREE.BoxGeometry(3.0, 1.85, 0.05);
    const cardEdgeMat = new THREE.MeshStandardMaterial({ color: 0x38161f, roughness: 0.4, metalness: 0.2 });
    const cardFrontMat = new THREE.MeshStandardMaterial({ map: cardTexture, roughness: 0.3, metalness: 0.1 });
    const cardMesh = new THREE.Mesh(cardGeo, [cardEdgeMat, cardEdgeMat, cardEdgeMat, cardEdgeMat, cardFrontMat, cardEdgeMat]);
    cardMesh.position.set(-0.2, 0.2, 0);
    cardMesh.rotation.set(0.1, -0.25, 0.05);
    rootGroup.add(cardMesh);

    // 3. Verification Seal (Jade + Saffron)
    const sealGroup = new THREE.Group();
    sealGroup.position.set(1.0, -0.4, 0.7);

    const sealRingGeo = new THREE.TorusGeometry(0.85, 0.045, 24, 48);
    const sealRingMat = new THREE.MeshStandardMaterial({ color: 0x2f8f83, emissive: 0x2f8f83, emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.5 });
    const sealRingMesh = new THREE.Mesh(sealRingGeo, sealRingMat);
    sealGroup.add(sealRingMesh);

    const checkShape = new THREE.Shape();
    checkShape.moveTo(-0.3, -0.05);
    checkShape.lineTo(-0.1, -0.28);
    checkShape.lineTo(0.35, 0.22);
    checkShape.lineTo(0.28, 0.29);
    checkShape.lineTo(-0.1, -0.16);
    checkShape.lineTo(-0.22, 0.02);
    checkShape.closePath();

    const checkGeo = new THREE.ExtrudeGeometry(checkShape, { depth: 0.05, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.015, bevelThickness: 0.015 });
    const checkMat = new THREE.MeshStandardMaterial({ color: 0xfffdf8, emissive: 0xe5a83b, emissiveIntensity: 0.3, roughness: 0.2, metalness: 0.4 });
    const checkMesh = new THREE.Mesh(checkGeo, checkMat);
    sealGroup.add(checkMesh);

    rootGroup.add(sealGroup);

    // 4. Orbiting Security Rings (Terracotta & Saffron)
    const orbitRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.02, 16, 80),
      new THREE.MeshStandardMaterial({ color: 0xc75c3c, emissive: 0xc75c3c, emissiveIntensity: 0.4, transparent: true, opacity: 0.75 })
    );
    orbitRing1.rotation.set(Math.PI / 3, Math.PI / 5, 0);
    rootGroup.add(orbitRing1);

    const orbitRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.015, 16, 90),
      new THREE.MeshStandardMaterial({ color: 0xe5a83b, emissive: 0xe5a83b, emissiveIntensity: 0.5, transparent: true, opacity: 0.65 })
    );
    orbitRing2.rotation.set(-Math.PI / 4, Math.PI / 4, 0);
    rootGroup.add(orbitRing2);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      cardMesh.position.y = 0.2 + Math.sin(t * 1.5) * 0.06;
      cardMesh.rotation.y = -0.25 + Math.sin(t * 0.8) * 0.05;

      sealGroup.position.y = -0.4 + Math.cos(t * 1.6) * 0.05;

      orbitRing1.rotation.z += 0.005;
      orbitRing2.rotation.z -= 0.004;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      cardGeo.dispose();
      cardTexture.dispose();
      sealRingGeo.dispose();
      checkGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-burgundy text-warmwhite border-r border-sandstone">
      {/* Top Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy-900 border border-saffron/40 text-xs text-saffron font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AUTHENTICATION GATEWAY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-warmwhite tracking-tight">
          Secure Remote Civic Access
        </h2>
        <p className="text-xs text-sand-200 max-w-sm leading-relaxed">
          Access your registered constituency ballot with zero identity linkage and hardware-grade cryptographic authentication.
        </p>
      </div>

      {/* 3D Visual Center */}
      <div className="py-4 flex items-center justify-center relative z-10">
        <div ref={mountRef} className="w-[320px] h-[320px] flex items-center justify-center" />
      </div>

      {/* Bottom Security Bullet Highlights */}
      <div className="space-y-2 pt-4 border-t border-burgundy-700 text-xs font-mono text-sand-200 relative z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-jade flex-shrink-0" />
          <span>AES-256-GCM Authenticated Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-saffron flex-shrink-0" />
          <span>Single-Use Anonymous Token Decoupling</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
          <span>SHA-256 Tamper-Evident Hash Chain</span>
        </div>
      </div>
    </div>
  );
};

export default Login3DVisual;
