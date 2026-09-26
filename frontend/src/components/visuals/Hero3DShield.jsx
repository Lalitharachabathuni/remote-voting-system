import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ShieldCheck, CheckCircle2, Lock, Sparkles, Check } from 'lucide-react';

export const Hero3DShield = () => {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [sealPulse, setSealPulse] = useState(false);

  // Mouse & parallax tracking
  const targetRotation = useRef({ x: 0.08, y: -0.22 });
  const currentRotation = useRef({ x: 0.08, y: -0.22 });

  const triggerVerification = useCallback(() => {
    setSealPulse(true);
    setTimeout(() => setSealPulse(false), 2000);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera
    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ----------------------------------------------------
    // 1. ELEGANT CIVIC LIGHTING SETUP (Warm White, Burgundy, Jade, Saffron)
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xfffdf8, 1.2);
    scene.add(ambientLight);

    // Key Light (Warm Sunlight Studio Light)
    const keyLight = new THREE.DirectionalLight(0xfffdf8, 2.0);
    keyLight.position.set(5, 7, 7);
    scene.add(keyLight);

    // Fill Light (Deep Burgundy Tone #5A2633)
    const fillLight = new THREE.DirectionalLight(0x5a2633, 1.2);
    fillLight.position.set(-6, -3, 4);
    scene.add(fillLight);

    // Rim Light (Saffron Gold #E5A83B)
    const rimLight = new THREE.DirectionalLight(0xe5a83b, 1.8);
    rimLight.position.set(3, -5, -4);
    scene.add(rimLight);

    // Accent Point Light (Jade #2F8F83)
    const jadeAccent = new THREE.PointLight(0x2f8f83, 1.5, 8);
    jadeAccent.position.set(1.5, -0.4, 2.5);
    scene.add(jadeAccent);

    // ----------------------------------------------------
    // 2. PROCEDURAL HIGH-RES DIGITAL BALLOT TEXTURE (Warm Paper + Burgundy & Jade)
    // ----------------------------------------------------
    const createBallotTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      // Document Background (Premium Stationery Warm White #FFFDF8 with Sandstone Undertone)
      ctx.fillStyle = '#FFFDF8';
      ctx.fillRect(0, 0, 1024, 1440);

      // Paper Grain & Micro Security Guilloche Border
      ctx.strokeStyle = '#DED6CA';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 964, 1380);

      ctx.strokeStyle = '#5A2633';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(45, 45, 934, 1350);

      // Micro Security Grid Lines (Very Faint Saffron/Sandstone)
      ctx.strokeStyle = 'rgba(222, 214, 202, 0.45)';
      ctx.lineWidth = 1;
      for (let y = 70; y < 1400; y += 36) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(960, y);
        ctx.stroke();
      }

      // Top Civic Header Banner (Deep Burgundy #5A2633)
      ctx.fillStyle = '#5A2633';
      ctx.beginPath();
      ctx.roundRect(60, 60, 904, 96, 12);
      ctx.fill();

      ctx.fillStyle = '#FFFDF8';
      ctx.font = 'bold 30px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OFFICIAL DIGITAL BALLOT', 512, 114);

      ctx.font = '15px monospace';
      ctx.fillStyle = '#E5A83B';
      ctx.fillText('PARLIAMENTARY DEMOCRATIC ROLL · SECURE REMOTE SESSION', 512, 138);

      // Civic Watermark Emblem in Center
      ctx.save();
      ctx.translate(512, 730);
      ctx.beginPath();
      ctx.arc(0, 0, 210, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(90, 38, 51, 0.06)';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.font = 'bold 160px Inter, sans-serif';
      ctx.fillStyle = 'rgba(90, 38, 51, 0.035)';
      ctx.fillText('VR', 0, 58);
      ctx.restore();

      // Voter Metadata Section
      ctx.textAlign = 'left';
      ctx.fillStyle = '#756E67';
      ctx.font = '17px monospace';
      ctx.fillText('TOKEN ID : ECDSA-2026-X89K-9901', 80, 200);
      ctx.fillText('STATUS   : CRYPTOGRAPHICALLY SEALED', 80, 230);
      ctx.fillText('HASH     : SHA256:7f83b1657ff1...44a', 80, 260);

      // Candidate Voting Selection Rows
      const candidates = [
        { name: 'Dr. Aarav Sundaram', party: 'Democratic Progress Alliance', symbol: '⚖', checked: false },
        { name: 'Smt. Priya Venkatesh', party: 'Citizens Innovation Coalition', symbol: '🏛', checked: true },
        { name: 'Rajesh Nambiar', party: 'National Green Ecological Forum', symbol: '🌿', checked: false },
        { name: 'Anita Deshmukh', party: 'Independent Electoral Nominee', symbol: '🕊', checked: false }
      ];

      candidates.forEach((cand, index) => {
        const topY = 320 + index * 170;

        // Candidate Card Box
        ctx.fillStyle = cand.checked ? 'rgba(90, 38, 51, 0.06)' : '#FAF8F4';
        ctx.strokeStyle = cand.checked ? '#5A2633' : '#DED6CA';
        ctx.lineWidth = cand.checked ? 3 : 1.5;
        
        ctx.beginPath();
        ctx.roundRect(80, topY, 864, 140, 16);
        ctx.fill();
        ctx.stroke();

        // Symbol Emblem Circle
        ctx.beginPath();
        ctx.arc(145, topY + 70, 38, 0, Math.PI * 2);
        ctx.fillStyle = cand.checked ? '#5A2633' : '#F5F0E7';
        ctx.fill();
        ctx.strokeStyle = cand.checked ? '#E5A83B' : '#DED6CA';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = cand.checked ? '#FFFDF8' : '#252322';
        ctx.fillText(cand.symbol, 145, topY + 81);

        // Candidate Details
        ctx.textAlign = 'left';
        ctx.font = 'bold 27px Inter, sans-serif';
        ctx.fillStyle = cand.checked ? '#5A2633' : '#252322';
        ctx.fillText(cand.name, 210, topY + 60);

        ctx.font = '19px Inter, sans-serif';
        ctx.fillStyle = '#756E67';
        ctx.fillText(cand.party, 210, topY + 95);

        // Checkbox
        ctx.beginPath();
        ctx.roundRect(860, topY + 45, 50, 50, 10);
        ctx.fillStyle = cand.checked ? '#2F8F83' : '#FFFDF8';
        ctx.fill();
        ctx.strokeStyle = cand.checked ? '#2F8F83' : '#DED6CA';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (cand.checked) {
          ctx.beginPath();
          ctx.moveTo(872, topY + 70);
          ctx.lineTo(882, topY + 82);
          ctx.lineTo(898, topY + 58);
          ctx.strokeStyle = '#FFFDF8';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      });

      // Bottom Saffron Civic Seal & Verification Hash
      ctx.beginPath();
      ctx.arc(200, 1260, 65, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(229, 168, 59, 0.12)';
      ctx.fill();
      ctx.strokeStyle = '#E5A83B';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'center';
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#5A2633';
      ctx.fillText('✓ VERIFIED', 200, 1255);
      ctx.fillStyle = '#C75C3C';
      ctx.fillText('CIVIC SEAL', 200, 1275);

      // Verification Barcode / Hash Lines
      ctx.fillStyle = '#756E67';
      for (let x = 320; x < 900; x += 14) {
        const w = (x % 28 === 0) ? 6 : 3;
        ctx.fillRect(x, 1220, w, 60);
      }
      ctx.textAlign = 'left';
      ctx.font = '15px monospace';
      ctx.fillStyle = '#252322';
      ctx.fillText('VOTEREMOTE PROTOCOL // RECORD ID: VR-2026-XQ89', 320, 1310);

      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    const ballotTexture = createBallotTexture();

    // ----------------------------------------------------
    // 3. 3D DIGITAL BALLOT GEOMETRY & MATERIAL
    // ----------------------------------------------------
    const ballotWidth = 3.3;
    const ballotHeight = 4.6;
    const ballotDepth = 0.08;

    const ballotGeometry = new THREE.BoxGeometry(ballotWidth, ballotHeight, ballotDepth, 2, 2, 1);
    
    // Matte Paper / Warm Sand edge material
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f0e7,
      roughness: 0.6,
      metalness: 0.05
    });
    
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: ballotTexture,
      roughness: 0.5,
      metalness: 0.05,
      bumpScale: 0.015
    });

    const ballotMaterials = [
      edgeMaterial, // right
      edgeMaterial, // left
      edgeMaterial, // top
      edgeMaterial, // bottom
      frontMaterial, // front
      edgeMaterial  // back
    ];

    const ballotMesh = new THREE.Mesh(ballotGeometry, ballotMaterials);
    ballotMesh.position.set(-0.25, 0, 0);
    ballotMesh.rotation.set(0.08, -0.22, 0.04);
    rootGroup.add(ballotMesh);

    // ----------------------------------------------------
    // 4. CIRCULAR CIVIC SEAL WITH DEEP BURGUNDY & JADE CHECKMARK
    // ----------------------------------------------------
    const sealGroup = new THREE.Group();
    sealGroup.position.set(1.35, -0.4, 0.95);

    // Outer Beveled Deep Burgundy Ring (#5A2633)
    const sealRingGeo = new THREE.TorusGeometry(1.22, 0.07, 32, 64);
    const sealRingMat = new THREE.MeshStandardMaterial({
      color: 0x5a2633,
      emissive: 0x5a2633,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.4
    });
    const sealRingMesh = new THREE.Mesh(sealRingGeo, sealRingMat);
    sealGroup.add(sealRingMesh);

    // Inner Translucent Civic Disc (Jade #2F8F83)
    const sealDiscGeo = new THREE.CylinderGeometry(1.18, 1.18, 0.04, 48);
    sealDiscGeo.rotateX(Math.PI / 2);
    const sealDiscMat = new THREE.MeshPhysicalMaterial({
      color: 0x2f8f83,
      roughness: 0.2,
      metalness: 0.15,
      transmission: 0.6,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.6,
      clearcoat: 0.9
    });
    const sealDiscMesh = new THREE.Mesh(sealDiscGeo, sealDiscMat);
    sealGroup.add(sealDiscMesh);

    // Concentric Inner Saffron Ring Accent (#E5A83B)
    const innerSaffronRingGeo = new THREE.TorusGeometry(0.92, 0.028, 24, 48);
    const innerSaffronRingMat = new THREE.MeshStandardMaterial({
      color: 0xe5a83b,
      emissive: 0xe5a83b,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.7
    });
    const innerSaffronRingMesh = new THREE.Mesh(innerSaffronRingGeo, innerSaffronRingMat);
    sealGroup.add(innerSaffronRingMesh);

    // 3D Extruded Checkmark
    const checkShape = new THREE.Shape();
    checkShape.moveTo(-0.45, -0.05);
    checkShape.lineTo(-0.15, -0.38);
    checkShape.lineTo(0.48, 0.32);
    checkShape.lineTo(0.38, 0.42);
    checkShape.lineTo(-0.15, -0.22);
    checkShape.lineTo(-0.35, 0.04);
    checkShape.closePath();

    const checkExtrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02
    };
    const checkGeometry = new THREE.ExtrudeGeometry(checkShape, checkExtrudeSettings);
    const checkMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffdf8,
      emissive: 0x2f8f83,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.2
    });
    const checkMesh = new THREE.Mesh(checkGeometry, checkMaterial);
    checkMesh.position.set(0, 0, 0.06);
    sealGroup.add(checkMesh);

    rootGroup.add(sealGroup);

    // ----------------------------------------------------
    // 5. ORBITAL RINGS (Terracotta & Saffron)
    // ----------------------------------------------------
    const orbitGroup = new THREE.Group();

    // Orbit Ring 1 (Terracotta #C75C3C)
    const orbit1Geo = new THREE.TorusGeometry(2.7, 0.024, 16, 100);
    const orbit1Mat = new THREE.MeshStandardMaterial({
      color: 0xc75c3c,
      emissive: 0xc75c3c,
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75
    });
    const orbit1Mesh = new THREE.Mesh(orbit1Geo, orbit1Mat);
    orbit1Mesh.rotation.set(Math.PI / 3.2, Math.PI / 6, 0);
    orbitGroup.add(orbit1Mesh);

    // Orbit Ring 2 (Saffron #E5A83B)
    const orbit2Geo = new THREE.TorusGeometry(3.2, 0.02, 16, 120);
    const orbit2Mat = new THREE.MeshStandardMaterial({
      color: 0xe5a83b,
      emissive: 0xe5a83b,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.7,
      transparent: true,
      opacity: 0.7
    });
    const orbit2Mesh = new THREE.Mesh(orbit2Geo, orbit2Mat);
    orbit2Mesh.rotation.set(-Math.PI / 4, Math.PI / 4, 0);
    orbitGroup.add(orbit2Mesh);

    rootGroup.add(orbitGroup);

    // ----------------------------------------------------
    // 6. SATELLITE INTERACTION NODES (Jade, Saffron, Terracotta)
    // ----------------------------------------------------
    const nodeCount = isMobile ? 10 : 18;
    const nodeSpheres = [];
    
    const saffronNodeMat = new THREE.MeshStandardMaterial({
      color: 0xe5a83b,
      emissive: 0xe5a83b,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7
    });

    const jadeNodeMat = new THREE.MeshStandardMaterial({
      color: 0x2f8f83,
      emissive: 0x2f8f83,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.5
    });

    const terracottaNodeMat = new THREE.MeshStandardMaterial({
      color: 0xc75c3c,
      emissive: 0xc75c3c,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.5
    });

    for (let i = 0; i < nodeCount; i++) {
      const radius = 2.4 + (i % 3) * 0.5;
      const angle = (i / nodeCount) * Math.PI * 2;
      const heightOffset = ((i % 5) - 2) * 0.35;
      
      const nodeGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const mat = i % 3 === 0 ? saffronNodeMat : (i % 3 === 1 ? jadeNodeMat : terracottaNodeMat);
      const mesh = new THREE.Mesh(nodeGeo, mat);
      
      mesh.position.set(
        Math.cos(angle) * radius,
        heightOffset + Math.sin(angle * 2) * 0.3,
        Math.sin(angle) * radius * 0.7
      );
      
      nodeSpheres.push({
        mesh,
        baseAngle: angle,
        radius,
        speed: 0.0025 + (i % 3) * 0.0012,
        heightOffset
      });
      rootGroup.add(mesh);
    }

    // Dynamic Network Connecting Lines (Deep Burgundy & Jade)
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x5a2633,
      transparent: true,
      opacity: 0.22
    });
    const linePositions = new Float32Array(nodeCount * nodeCount * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    rootGroup.add(linesMesh);

    // ----------------------------------------------------
    // 7. AMBIENT PARTICLES (Subtle Saffron, Jade, Terracotta)
    // ----------------------------------------------------
    const particleCount = isMobile ? 30 : 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const jadeColor = new THREE.Color('#2F8F83');
    const terracottaColor = new THREE.Color('#C75C3C');
    const saffronColor = new THREE.Color('#E5A83B');

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8.5;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 5.5;

      const choice = Math.random();
      const col = choice < 0.4 ? jadeColor : (choice < 0.75 ? terracottaColor : saffronColor);
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.55
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ----------------------------------------------------
    // 8. ENTRANCE STAGGERED ASSEMBLY (1.0s - 1.4s)
    // ----------------------------------------------------
    const startTime = performance.now();
    rootGroup.scale.set(0.3, 0.3, 0.3);
    rootGroup.position.y = -0.9;

    // ----------------------------------------------------
    // 9. ANIMATION LOOP & PARALLAX ENGINE
    // ----------------------------------------------------
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;

      // Entrance ease-out quad (1.2s duration)
      if (elapsedTime < 1.3) {
        const progress = Math.min(elapsedTime / 1.1, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScale = 0.3 + 0.7 * easeOut;
        rootGroup.scale.set(currentScale, currentScale, currentScale);
        rootGroup.position.y = -0.9 + 0.9 * easeOut;
      }

      // Parallax smooth interpolation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05;

      rootGroup.rotation.x = currentRotation.current.x;
      rootGroup.rotation.y = currentRotation.current.y;

      // Subtle Idle Floating Movement
      if (!prefersReducedMotion) {
        const time = elapsedTime;
        ballotMesh.position.y = Math.sin(time * 1.3) * 0.07;
        ballotMesh.rotation.z = 0.04 + Math.sin(time * 0.8) * 0.012;

        sealGroup.position.y = -0.4 + Math.cos(time * 1.4) * 0.05;
        sealGroup.rotation.z = Math.sin(time * 0.7) * 0.025;

        // Gyroscopic rotation of orbit rings
        orbit1Mesh.rotation.z += 0.004;
        orbit2Mesh.rotation.z -= 0.003;
        orbitGroup.rotation.y += 0.0015;

        // Orbit satellite nodes
        let lineIdx = 0;
        const positions = lineGeo.attributes.position.array;

        nodeSpheres.forEach((node, idx) => {
          node.baseAngle += node.speed;
          const nx = Math.cos(node.baseAngle) * node.radius;
          const nz = Math.sin(node.baseAngle) * node.radius * 0.7;
          const ny = node.heightOffset + Math.sin(node.baseAngle * 2 + time) * 0.22;
          node.mesh.position.set(nx, ny, nz);

          // Connect adjacent nodes
          const nextNode = nodeSpheres[(idx + 1) % nodeCount];
          const distSq = (nx - nextNode.mesh.position.x) ** 2 + 
                         (ny - nextNode.mesh.position.y) ** 2 + 
                         (nz - nextNode.mesh.position.z) ** 2;

          if (distSq < 6.5 && lineIdx < linePositions.length - 6) {
            positions[lineIdx++] = nx;
            positions[lineIdx++] = ny;
            positions[lineIdx++] = nz;
            positions[lineIdx++] = nextNode.mesh.position.x;
            positions[lineIdx++] = nextNode.mesh.position.y;
            positions[lineIdx++] = nextNode.mesh.position.z;
          }
        });

        // Clear remaining lines
        while (lineIdx < linePositions.length) {
          positions[lineIdx++] = 0;
        }
        lineGeo.attributes.position.needsUpdate = true;

        // Particle gentle drifting
        particles.rotation.y += 0.0004;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------------------
    // 10. RESIZE HANDLER
    // ----------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ----------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      ballotGeometry.dispose();
      ballotTexture.dispose();
      sealRingGeo.dispose();
      sealDiscGeo.dispose();
      innerSaffronRingGeo.dispose();
      checkGeometry.dispose();
      orbit1Geo.dispose();
      orbit2Geo.dispose();
      lineGeo.dispose();
      particleGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Parallax Pointer Event Handlers
  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    targetRotation.current = {
      x: 0.08 - y * 0.3,
      y: -0.22 + x * 0.38
    };
  };

  const handlePointerLeave = () => {
    targetRotation.current = { x: 0.08, y: -0.22 };
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={triggerVerification}
      className="relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center cursor-pointer select-none group"
      aria-label="Interactive 3D Digital Ballot and Verification Shield visualization"
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]" 
      />

      {/* Fallback in case WebGL is disabled */}
      {!webGlSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-warmwhite rounded-2xl border border-sandstone shadow-card">
          <ShieldCheck className="w-16 h-16 text-jade mb-3" />
          <h3 className="text-base font-bold text-charcoal">Digital Voting & Identity Shield</h3>
          <p className="text-xs text-warmgray mt-1 max-w-xs font-mono">
            Cryptographically Verified Parliamentary Roll · ECDSA Sealed
          </p>
        </div>
      )}

      {/* Floating Civic Badge: Identity Verified Seal (Top Left) */}
      <div 
        className={`absolute top-6 left-4 sm:left-8 px-3.5 py-1.5 rounded-full bg-warmwhite/90 backdrop-blur-md border text-xs font-mono font-bold transition-all duration-300 flex items-center gap-2 shadow-card ${
          sealPulse 
            ? 'border-jade text-jade ring-2 ring-jade/30 scale-105' 
            : 'border-sandstone text-jade'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-jade animate-ping" />
        <span>SECURELY VERIFIED</span>
      </div>

      {/* Floating Civic Badge: Cryptographic Seal (Bottom Right) */}
      <div className="absolute bottom-8 right-4 sm:right-8 px-3.5 py-1.5 rounded-full bg-warmwhite/90 backdrop-blur-md border border-sandstone text-charcoal text-xs font-mono font-bold flex items-center gap-2 shadow-card">
        <Lock className="w-3.5 h-3.5 text-burgundy" />
        <span>ECDSA SHA-256 SEALED</span>
      </div>

      {/* Interactive Verification Toast on Click */}
      {sealPulse && (
        <div className="absolute inset-x-4 bottom-20 mx-auto max-w-xs p-3 rounded-xl bg-burgundy text-warmwhite text-xs font-mono text-center shadow-elevated border border-saffron/40 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-1.5 font-bold text-warmwhite mb-0.5">
            <Check className="w-4 h-4 text-saffron" />
            <span>✓ VERIFIED</span>
          </div>
          <span className="text-[11px] text-warmwhite/80">Ballot Integrity Sealed in Isolated Vault</span>
        </div>
      )}

      {/* Subtle Interaction Hint on Desktop Hover */}
      <div className="absolute bottom-2 inset-x-0 text-center opacity-0 group-hover:opacity-75 transition-opacity text-[11px] font-mono text-warmgray pointer-events-none">
        Click to trigger verification pulse · Move cursor to tilt
      </div>
    </div>
  );
};

export default Hero3DShield;
