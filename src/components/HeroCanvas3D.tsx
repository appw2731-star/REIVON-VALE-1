import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface HeroCanvas3DProps {
  className?: string;
}

// Reusable scratch vectors allocated outside the render loop (zero GC per frame)
const _pointerTarget = new THREE.Vector2(0, 0);
const _pointerSmooth = new THREE.Vector2(0, 0);
const _dummy = new THREE.Object3D();
const _tempColor = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const rendererStr = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return true;
  }
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const s = new THREE.Shape();
  const hw = width / 2;
  const hh = height / 2;
  const r = Math.min(radius, hw, hh);
  s.moveTo(-hw + r, -hh);
  s.lineTo(hw - r, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + r);
  s.lineTo(hw, hh - r);
  s.quadraticCurveTo(hw, hh, hw - r, hh);
  s.lineTo(-hw + r, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - r);
  s.lineTo(-hw, -hh + r);
  s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return s;
}

function createBrushedMetalBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 2) {
      const shade = 116 + Math.floor(Math.sin(y * 0.6) * 14 + (y % 5) * 3);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, 256, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

function createLaptopScreenTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep futuristic IDE + Web Studio canvas background
    const bg = ctx.createLinearGradient(0, 0, 1024, 640);
    bg.addColorStop(0, '#070917');
    bg.addColorStop(0.55, '#0d1028');
    bg.addColorStop(1, '#150c2e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 640);

    // Subtle radial electric aura inside screen
    const glow1 = ctx.createRadialGradient(780, 180, 10, 780, 180, 320);
    glow1.addColorStop(0, 'rgba(0, 217, 255, 0.28)');
    glow1.addColorStop(1, 'rgba(0, 217, 255, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1024, 640);

    const glow2 = ctx.createRadialGradient(260, 500, 10, 260, 500, 320);
    glow2.addColorStop(0, 'rgba(116, 27, 255, 0.32)');
    glow2.addColorStop(1, 'rgba(116, 27, 255, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1024, 640);

    // Top macOS / Studio Header Bar
    ctx.fillStyle = 'rgba(15, 18, 38, 0.92)';
    ctx.fillRect(0, 0, 1024, 48);
    ctx.fillStyle = 'rgba(0, 217, 255, 0.25)';
    ctx.fillRect(0, 47, 1024, 1);

    // Window Dots
    const dots = ['#ff5f57', '#febc2e', '#28c840'];
    dots.forEach((c, idx) => {
      ctx.beginPath();
      ctx.arc(28 + idx * 22, 24, 6, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });

    // Studio Address Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(140, 11, 340, 26);
    ctx.fillStyle = '#00D9FF';
    ctx.font = '600 14px monospace';
    ctx.fillText('reivon-vale.studio // App.tsx', 162, 29);

    ctx.fillStyle = '#C8C8D8';
    ctx.font = '700 14px sans-serif';
    ctx.fillText('REIVON VALE OS', 845, 29);

    // Left Sidebar (Explorer)
    ctx.fillStyle = 'rgba(9, 12, 26, 0.78)';
    ctx.fillRect(0, 48, 175, 592);
    ctx.fillStyle = 'rgba(200, 200, 216, 0.12)';
    ctx.fillRect(175, 48, 1, 592);

    const files = ['src/', '  Hero3D.tsx', '  WebApp.tsx', '  MobileUI.tsx', '  Polytechnic.ts', '  Shaders.glsl'];
    files.forEach((f, idx) => {
      if (idx === 1) {
        ctx.fillStyle = 'rgba(116, 27, 255, 0.32)';
        ctx.fillRect(8, 72 + idx * 34, 158, 28);
      }
      ctx.fillStyle = idx === 1 ? '#00D9FF' : '#9aa0be';
      ctx.font = '500 14px monospace';
      ctx.fillText(f, 20, 91 + idx * 34);
    });

    // Center Code Editor Panel
    const codeLines: Array<[string, string, string]> = [
      ['01', 'import', ' { Universe, Web, Mobile } from "@reivon/core";'],
      ['02', 'const', ' portfolio = createExperience({'],
      ['03', '  brand:', ' "REIVON VALE",'],
      ['04', '  engine:', ' "Three.js + React + TypeScript",'],
      ['05', '  devices:', ' ["Laptop", "Smartphone", "Tablet"],'],
      ['06', '  featured:', ' "Polytechnic Hub",'],
      ['07', '  mode:', ' "FUTURISTIC_DARK_3D"'],
      ['08', '});', ''],
      ['09', 'export default', ' launch(portfolio);'],
    ];

    codeLines.forEach(([num, kw, rest], i) => {
      const y = 102 + i * 34;
      ctx.fillStyle = '#4e5678';
      ctx.font = '500 15px monospace';
      ctx.fillText(num, 198, y);

      ctx.fillStyle = '#a86eff';
      ctx.font = '700 16px monospace';
      ctx.fillText(kw, 234, y);
      const kwWidth = ctx.measureText(kw).width;

      ctx.fillStyle = i === 2 || i === 5 ? '#00D9FF' : '#e6ecff';
      ctx.font = '500 16px monospace';
      ctx.fillText(rest, 234 + kwWidth, y);
    });

    // Bottom Live Preview & Performance Wave Card
    ctx.fillStyle = 'rgba(16, 21, 46, 0.88)';
    ctx.fillRect(198, 428, 796, 182);
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(198, 428, 796, 182);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 22px sans-serif';
    ctx.fillText('REIVON VALE  •  LIVE PREVIEW', 224, 468);

    ctx.fillStyle = '#00D9FF';
    ctx.font = '600 14px monospace';
    ctx.fillText('BUILD: PASSING   |   WEB & MOBILE SYNC: ACTIVE', 224, 496);

    // Illuminated Wave Bars inside Bottom Card
    const bars = [48, 76, 62, 92, 80, 108, 74, 96, 114, 86, 102, 70, 94, 118, 84, 68];
    bars.forEach((h, idx) => {
      const bx = 224 + idx * 46;
      const by = 592 - h * 0.72;
      const barGrad = ctx.createLinearGradient(bx, by, bx, 592);
      barGrad.addColorStop(0, '#00D9FF');
      barGrad.addColorStop(1, '#741BFF');
      ctx.fillStyle = barGrad;
      ctx.fillRect(bx, by, 26, h * 0.72);
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createKeyboardDeckTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#121322';
    ctx.fillRect(0, 0, 512, 320);

    // Recessed keyboard well
    ctx.fillStyle = '#0a0b15';
    ctx.fillRect(30, 24, 452, 168);

    // 5 rows of backlit keys with subtle electric cyan/purple rim glow
    const rows = 5;
    const cols = 13;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Spacebar on bottom row
        if (r === 4 && c >= 4 && c <= 8) {
          if (c === 4) {
            const x = 38 + c * 34;
            const y = 32 + r * 31;
            ctx.fillStyle = '#17192d';
            ctx.fillRect(x, y, 34 * 5 - 6, 24);
            ctx.strokeStyle = 'rgba(0, 217, 255, 0.55)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(x, y, 34 * 5 - 6, 24);
          }
          continue;
        }
        const x = 38 + c * 34;
        const y = 32 + r * 31;
        ctx.fillStyle = '#17192d';
        ctx.fillRect(x, y, 28, 24);
        ctx.strokeStyle = (r + c) % 3 === 0 ? 'rgba(0, 217, 255, 0.45)' : 'rgba(116, 27, 255, 0.42)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, 28, 24);
      }
    }

    // Glass Trackpad below keyboard
    ctx.fillStyle = '#141629';
    ctx.fillRect(166, 212, 180, 88);
    ctx.strokeStyle = 'rgba(200, 200, 216, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(166, 212, 180, 88);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createPhoneScreenTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const bg = ctx.createLinearGradient(0, 0, 512, 1024);
    bg.addColorStop(0, '#080a18');
    bg.addColorStop(0.5, '#120d2c');
    bg.addColorStop(1, '#071426');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 1024);

    // Top Dynamic Island
    ctx.fillStyle = '#030308';
    ctx.beginPath();
    ctx.roundRect(184, 24, 144, 34, 17);
    ctx.fill();

    // Status bar
    ctx.fillStyle = '#C8C8D8';
    ctx.font = '700 22px sans-serif';
    ctx.fillText('09:41', 36, 48);

    // Brand Header Card
    const heroGrad = ctx.createLinearGradient(32, 92, 480, 310);
    heroGrad.addColorStop(0, '#741BFF');
    heroGrad.addColorStop(1, '#00D9FF');
    ctx.fillStyle = heroGrad;
    ctx.beginPath();
    ctx.roundRect(32, 92, 448, 224, 34);
    ctx.fill();

    ctx.fillStyle = 'rgba(8, 8, 16, 0.72)';
    ctx.beginPath();
    ctx.roundRect(36, 96, 440, 216, 30);
    ctx.fill();

    ctx.fillStyle = '#00D9FF';
    ctx.font = '700 20px monospace';
    ctx.fillText('MOBILE EXPERIENCE', 64, 150);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 40px sans-serif';
    ctx.fillText('REIVON VALE', 64, 210);

    ctx.fillStyle = '#C8C8D8';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('Web • Mobile • 3D Craft', 64, 258);

    // App Tile Grid (2x2)
    const tiles = [
      { label: 'Web Apps', accent: '#00D9FF', x: 32, y: 350 },
      { label: 'Polytechnic', accent: '#741BFF', x: 268, y: 350 },
      { label: 'UI / UX', accent: '#3B82F6', x: 32, y: 546 },
      { label: 'AI Tools', accent: '#A855F7', x: 268, y: 546 },
    ];
    tiles.forEach((tile) => {
      ctx.fillStyle = 'rgba(20, 24, 48, 0.92)';
      ctx.beginPath();
      ctx.roundRect(tile.x, tile.y, 212, 168, 28);
      ctx.fill();
      ctx.strokeStyle = tile.accent;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = tile.accent;
      ctx.beginPath();
      ctx.arc(tile.x + 48, tile.y + 54, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 25px sans-serif';
      ctx.fillText(tile.label, tile.x + 26, tile.y + 128);
    });

    // Primary Electric Action Button
    const btnGrad = ctx.createLinearGradient(32, 760, 480, 840);
    btnGrad.addColorStop(0, '#741BFF');
    btnGrad.addColorStop(1, '#00D9FF');
    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.roundRect(32, 760, 448, 86, 24);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 28px sans-serif';
    ctx.fillText('EXPLORE PROJECTS →', 92, 813);

    // Bottom Dock Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.beginPath();
    ctx.roundRect(72, 906, 368, 66, 33);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(180, 994, 152, 8, 4);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createTabletScreenTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const bg = ctx.createLinearGradient(0, 0, 512, 384);
    bg.addColorStop(0, '#0a0e22');
    bg.addColorStop(1, '#1a1038');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 384);

    // Blueprint grid
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.14)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 384);
      ctx.stroke();
    }
    for (let y = 0; y <= 384; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#00D9FF';
    ctx.font = '700 18px monospace';
    ctx.fillText('DESIGN SYSTEM  //  3D UI', 28, 44);

    // Glowing geometric wireframe preview circle
    ctx.strokeStyle = '#00D9FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 210, 84, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#741BFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 210, 52, 0, Math.PI * 2);
    ctx.stroke();

    // Right metric lines
    [130, 178, 226, 274].forEach((y, idx) => {
      ctx.fillStyle = 'rgba(200, 200, 216, 0.16)';
      ctx.fillRect(272, y, 204, 18);
      ctx.fillStyle = idx % 2 === 0 ? '#00D9FF' : '#741BFF';
      ctx.fillRect(272, y, 120 + idx * 20, 18);
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function HeroCanvas3D({ className = '' }: HeroCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareWebGL();
    const isCompactMobile = window.innerWidth < 640;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: isCompactMobile ? 'low-power' : 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, isCompactMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth || 800, container.clientHeight || 600);
    renderer.setClearColor(0x080810, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080810, 0.036);

    const camera = new THREE.PerspectiveCamera(
      40,
      (container.clientWidth || 800) / Math.max(1, container.clientHeight || 600),
      0.1,
      90
    );
    camera.position.set(0, 0.45, 7.3);

    // Procedural Studio Environment Map for luxury brushed aluminum & glass device reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Cinematic 3-Point + Electric Purple / Neon Blue Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xa2eeff, 0x170c32, 1.25);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(4.5, 6.5, 7);
    scene.add(keyLight);

    const purpleRim = new THREE.DirectionalLight(0x741bff, 3.6);
    purpleRim.position.set(-6, 1.5, 3);
    scene.add(purpleRim);

    const cyanAccentLight = new THREE.PointLight(0x00d9ff, 4.8, 22);
    cyanAccentLight.position.set(3.2, 2.2, 4.4);
    scene.add(cyanAccentLight);

    const underGlowLight = new THREE.PointLight(0x741bff, 3.8, 18);
    underGlowLight.position.set(1.5, -2.4, 2.8);
    scene.add(underGlowLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const metalBump = createBrushedMetalBumpMap();
    metalBump.anisotropy = maxAniso;

    const laptopScreenTex = createLaptopScreenTexture(maxAniso);
    const keyboardTex = createKeyboardDeckTexture(maxAniso);
    const phoneScreenTex = createPhoneScreenTexture(maxAniso);
    const tabletScreenTex = createTabletScreenTexture(maxAniso);

    // Shared PBR Materials with deliberate roughness/metalness contrast
    const titaniumChromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4d7ea,
      metalness: 0.92,
      roughness: 0.18,
      bumpMap: metalBump,
      bumpScale: 0.008,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.65,
    });

    const spaceGrayBodyMat = new THREE.MeshStandardMaterial({
      color: 0x262942,
      metalness: 0.82,
      roughness: 0.28,
      bumpMap: metalBump,
      bumpScale: 0.006,
      envMapIntensity: 1.4,
    });

    const glossyBezelMat = new THREE.MeshPhysicalMaterial({
      color: 0x090a14,
      metalness: 0.12,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
    });

    const keyboardMat = new THREE.MeshStandardMaterial({
      map: keyboardTex,
      emissiveMap: keyboardTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.42,
      roughness: 0.62,
      metalness: 0.18,
    });

    const laptopScreenMat = new THREE.MeshStandardMaterial({
      map: laptopScreenTex,
      emissiveMap: laptopScreenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.92,
      roughness: 0.12,
      metalness: 0.05,
    });

    const phoneScreenMat = new THREE.MeshStandardMaterial({
      map: phoneScreenTex,
      emissiveMap: phoneScreenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.95,
      roughness: 0.1,
      metalness: 0.05,
    });

    const tabletScreenMat = new THREE.MeshStandardMaterial({
      map: tabletScreenTex,
      emissiveMap: tabletScreenTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.85,
      roughness: 0.12,
      metalness: 0.05,
      transparent: true,
      opacity: 0.94,
    });

    const neonCyanMat = new THREE.MeshStandardMaterial({
      color: 0x80f2ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 2.0,
      roughness: 0.16,
      metalness: 0.2,
    });

    const neonPurpleMat = new THREE.MeshStandardMaterial({
      color: 0xb784ff,
      emissive: 0x741bff,
      emissiveIntensity: 2.0,
      roughness: 0.18,
      metalness: 0.2,
    });

    const cameraLensMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d1528,
      metalness: 0.35,
      roughness: 0.06,
      clearcoat: 1.0,
      envMapIntensity: 2.0,
    });

    // Track geometries for strict unmount disposal
    const disposableGeos: THREE.BufferGeometry[] = [];
    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposableGeos.push(g);
      return g;
    };

    // Root Showcase Group (Desktop right half / Mobile centered subtle backdrop)
    const showcase = new THREE.Group();
    const applyResponsiveLayout = (width: number) => {
      if (width < 960) {
        showcase.position.set(0.1, 0.08, -1.5);
        showcase.scale.setScalar(0.64);
      } else {
        showcase.position.set(1.58, 0.14, 0);
        showcase.scale.setScalar(0.88);
      }
    };
    applyResponsiveLayout(container.clientWidth || 800);
    scene.add(showcase);

    // =========================================================================
    // DEVICE 1: PROCEDURAL 3D ULTRABOOK LAPTOP (Composite 8-Part THREE.Group)
    // =========================================================================
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.22, -0.35, 0.05);
    laptopGroup.rotation.set(0.24, -0.44, 0.04);
    showcase.add(laptopGroup);

    // 1.1 Base Aluminum Unibody Deck (Bevelled ExtrudeGeometry)
    const baseShape = createRoundedRectShape(2.76, 1.84, 0.13);
    const baseGeo = trackGeo(
      new THREE.ExtrudeGeometry(baseShape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.018,
        bevelSize: 0.018,
        bevelSegments: 3,
      })
    );
    baseGeo.rotateX(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, titaniumChromeMat);
    baseMesh.position.set(0, 0.04, 0);
    laptopGroup.add(baseMesh);

    // 1.2 Backlit Keyboard & Trackpad Surface Plane
    const keyboardGeo = trackGeo(new THREE.PlaneGeometry(2.54, 1.62));
    keyboardGeo.rotateX(-Math.PI / 2);
    const keyboardMesh = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboardMesh.position.set(0, 0.062, 0.02);
    laptopGroup.add(keyboardMesh);

    // 1.3 Front Neon Status Edge Strip
    const frontStripGeo = trackGeo(new THREE.BoxGeometry(0.75, 0.016, 0.02));
    const frontStripMesh = new THREE.Mesh(frontStripGeo, neonCyanMat);
    frontStripMesh.position.set(0, 0.005, 0.94);
    laptopGroup.add(frontStripMesh);

    // 1.4 Precision Metallic Hinge Cylinder
    const hingeGeo = trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 2.05, 20));
    hingeGeo.rotateZ(Math.PI / 2);
    const hingeMesh = new THREE.Mesh(hingeGeo, spaceGrayBodyMat);
    hingeMesh.position.set(0, 0.06, -0.9);
    laptopGroup.add(hingeMesh);

    // 1.5 Articulated Lid Assembly Pivot
    const lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0.06, -0.9);
    lidPivot.rotation.x = -0.26; // Natural ~105° open viewing angle
    laptopGroup.add(lidPivot);

    // Lid Metallic Outer Shell
    const lidShape = createRoundedRectShape(2.76, 1.78, 0.13);
    const lidGeo = trackGeo(
      new THREE.ExtrudeGeometry(lidShape, {
        depth: 0.045,
        bevelEnabled: true,
        bevelThickness: 0.014,
        bevelSize: 0.014,
        bevelSegments: 3,
      })
    );
    const lidShellMesh = new THREE.Mesh(lidGeo, titaniumChromeMat);
    lidShellMesh.position.set(0, 0.91, -0.055);
    lidPivot.add(lidShellMesh);

    // Lid Glossy Glass Bezel Front
    const bezelGeo = trackGeo(new THREE.PlaneGeometry(2.68, 1.7));
    const bezelMesh = new THREE.Mesh(bezelGeo, glossyBezelMat);
    bezelMesh.position.set(0, 0.91, 0.006);
    lidPivot.add(bezelMesh);

    // Glowing High-Res Display Screen
    const screenGeo = trackGeo(new THREE.PlaneGeometry(2.54, 1.56));
    const screenMesh = new THREE.Mesh(screenGeo, laptopScreenMat);
    screenMesh.position.set(0, 0.915, 0.012);
    lidPivot.add(screenMesh);

    // Glowing Rear Accent Crest on back of laptop lid
    const rearCrestGeo = trackGeo(new THREE.RingGeometry(0.14, 0.18, 6));
    const rearCrestMesh = new THREE.Mesh(rearCrestGeo, neonCyanMat);
    rearCrestMesh.rotation.y = Math.PI;
    rearCrestMesh.position.set(0, 0.92, -0.074);
    lidPivot.add(rearCrestMesh);

    // =========================================================================
    // DEVICE 2: PROCEDURAL 3D FLAGSHIP SMARTPHONE (Composite 7-Part Group)
    // =========================================================================
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(1.58, -0.04, 0.72);
    phoneGroup.rotation.set(-0.08, -0.46, -0.08);
    showcase.add(phoneGroup);

    // 2.1 Titanium Rounded Smartphone Chassis
    const phoneShape = createRoundedRectShape(0.92, 1.88, 0.14);
    const phoneBodyGeo = trackGeo(
      new THREE.ExtrudeGeometry(phoneShape, {
        depth: 0.082,
        bevelEnabled: true,
        bevelThickness: 0.018,
        bevelSize: 0.016,
        bevelSegments: 4,
      })
    );
    const phoneBodyMesh = new THREE.Mesh(phoneBodyGeo, titaniumChromeMat);
    phoneBodyMesh.position.set(0, 0, -0.041);
    phoneGroup.add(phoneBodyMesh);

    // 2.2 Front Glass Bezel
    const phoneBezelShape = createRoundedRectShape(0.88, 1.84, 0.12);
    const phoneBezelGeo = trackGeo(new THREE.ShapeGeometry(phoneBezelShape));
    const phoneBezelMesh = new THREE.Mesh(phoneBezelGeo, glossyBezelMat);
    phoneBezelMesh.position.set(0, 0, 0.061);
    phoneGroup.add(phoneBezelMesh);

    // 2.3 Glowing High-Res Mobile Screen
    const phoneScreenGeo = trackGeo(new THREE.PlaneGeometry(0.82, 1.76));
    const phoneScreenMesh = new THREE.Mesh(phoneScreenGeo, phoneScreenMat);
    phoneScreenMesh.position.set(0, 0, 0.065);
    phoneGroup.add(phoneScreenMesh);

    // 2.4 Metallic Side Power & Volume Buttons
    const sideBtnGeo = trackGeo(new THREE.BoxGeometry(0.025, 0.24, 0.032));
    const powerBtn = new THREE.Mesh(sideBtnGeo, spaceGrayBodyMat);
    powerBtn.position.set(0.48, 0.22, 0);
    phoneGroup.add(powerBtn);

    const volUpBtn = new THREE.Mesh(sideBtnGeo, spaceGrayBodyMat);
    volUpBtn.scale.y = 0.72;
    volUpBtn.position.set(-0.48, 0.34, 0);
    phoneGroup.add(volUpBtn);

    const volDownBtn = new THREE.Mesh(sideBtnGeo, spaceGrayBodyMat);
    volDownBtn.scale.y = 0.72;
    volDownBtn.position.set(-0.48, 0.06, 0);
    phoneGroup.add(volDownBtn);

    // 2.5 Rear Camera Island + Triple Lenses (visible during subtle rotation)
    const camBumpShape = createRoundedRectShape(0.38, 0.42, 0.07);
    const camBumpGeo = trackGeo(
      new THREE.ExtrudeGeometry(camBumpShape, {
        depth: 0.025,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 2,
      })
    );
    const camBumpMesh = new THREE.Mesh(camBumpGeo, spaceGrayBodyMat);
    camBumpMesh.position.set(-0.2, 0.62, -0.075);
    phoneGroup.add(camBumpMesh);

    const lensGeo = trackGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.028, 18));
    lensGeo.rotateX(Math.PI / 2);
    const lensOffsets: [number, number][] = [
      [-0.29, 0.72],
      [-0.29, 0.54],
      [-0.12, 0.63],
    ];
    lensOffsets.forEach(([lx, ly]) => {
      const lens = new THREE.Mesh(lensGeo, cameraLensMat);
      lens.position.set(lx, ly, -0.09);
      phoneGroup.add(lens);
    });

    // =========================================================================
    // DEVICE 3: FLOATING 3D TABLET / HOLOGRAPHIC UI PAD (Composite 4-Part Group)
    // =========================================================================
    const tabletGroup = new THREE.Group();
    tabletGroup.position.set(-1.55, 1.12, -0.75);
    tabletGroup.rotation.set(0.14, 0.32, 0.08);
    showcase.add(tabletGroup);

    const tabShape = createRoundedRectShape(1.48, 1.08, 0.1);
    const tabBodyGeo = trackGeo(
      new THREE.ExtrudeGeometry(tabShape, {
        depth: 0.045,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 3,
      })
    );
    const tabBodyMesh = new THREE.Mesh(tabBodyGeo, spaceGrayBodyMat);
    tabBodyMesh.position.set(0, 0, -0.022);
    tabletGroup.add(tabBodyMesh);

    const tabScreenGeo = trackGeo(new THREE.PlaneGeometry(1.36, 0.96));
    const tabScreenMesh = new THREE.Mesh(tabScreenGeo, tabletScreenMat);
    tabScreenMesh.position.set(0, 0, 0.038);
    tabletGroup.add(tabScreenMesh);

    const tabFrameEdges = trackGeo(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.54, 1.14, 0.07)));
    const tabFrameMat = new THREE.LineBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.42,
    });
    tabletGroup.add(new THREE.LineSegments(tabFrameEdges, tabFrameMat));

    // =========================================================================
    // ORBITAL TECH RINGS (UNDER-DEVICE LEVITATION HALO) & COSMIC PARTICLES
    // =========================================================================
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0.15, -1.16, -0.15);
    showcase.add(orbitGroup);

    const mainOrbitGeo = trackGeo(new THREE.TorusGeometry(2.22, 0.024, 14, 96));
    const mainOrbitMesh = new THREE.Mesh(mainOrbitGeo, titaniumChromeMat);
    mainOrbitMesh.rotation.set(Math.PI * 0.48, -0.08, 0.06);
    orbitGroup.add(mainOrbitMesh);

    const glowOrbitGeo = trackGeo(new THREE.TorusGeometry(1.98, 0.014, 10, 88));
    const glowOrbitMesh = new THREE.Mesh(glowOrbitGeo, neonCyanMat);
    glowOrbitMesh.rotation.set(Math.PI * 0.5, 0.1, -0.08);
    orbitGroup.add(glowOrbitMesh);

    // Two orbiting glowing tech satellites along the levitation ring
    const satGeo = trackGeo(new THREE.OctahedronGeometry(0.09, 0));
    const satHub = new THREE.Group();
    orbitGroup.add(satHub);

    const sat1 = new THREE.Mesh(satGeo, neonCyanMat);
    sat1.position.set(2.22, 0.06, 0);
    satHub.add(sat1);

    const sat2 = new THREE.Mesh(satGeo, neonPurpleMat);
    sat2.position.set(-2.22, -0.06, 0);
    satHub.add(sat2);

    // Floating Cosmic Tech Particle Field (InstancedMesh)
    const dustCount = isCompactMobile ? 56 : 112;
    const dustGeo = trackGeo(new THREE.OctahedronGeometry(0.036, 0));
    const dustMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x3b1f80,
      emissiveIntensity: 0.85,
      roughness: 0.24,
      metalness: 0.45,
    });
    const dustInstanced = new THREE.InstancedMesh(dustGeo, dustMat, dustCount);
    const particleColors = [0x00d9ff, 0x9b5cff, 0xc8c8d8, 0xffffff];
    for (let i = 0; i < dustCount; i++) {
      const radius = 3.0 + ((i * 73) % 100) / 14;
      const theta = i * 2.39996;
      const y = (((i * 37) % 100) / 50 - 1) * 3.5;
      const scale = 0.6 + ((i * 19) % 10) * 0.08;
      const x = Math.cos(theta) * radius + 0.5;
      const z = Math.sin(theta) * radius - 2.3;
      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      dustInstanced.setMatrixAt(i, _dummy.matrix);
      _tempColor.setHex(particleColors[i % particleColors.length]);
      dustInstanced.setColorAt(i, _tempColor);
    }
    dustInstanced.instanceMatrix.needsUpdate = true;
    if (dustInstanced.instanceColor) dustInstanced.instanceColor.needsUpdate = true;
    dustInstanced.computeBoundingSphere();
    scene.add(dustInstanced);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      _pointerTarget.set(
        (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
        -(event.clientY / Math.max(1, window.innerHeight)) * 2 + 1
      );
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = Math.max(1, container.clientHeight || 600);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      applyResponsiveLayout(w);
      if (reducedMotion) {
        renderer.render(scene, camera);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let frameId = 0;
    let disposed = false;
    const startMs = performance.now();
    let lastMs = startMs;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 85);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 90);
      }
    }

    const renderFrame = () => {
      if (disposed) return;
      const nowMs = performance.now();
      const dt = Math.min((nowMs - lastMs) / 1000, 0.1);
      lastMs = nowMs;
      const elapsed = (nowMs - startMs) / 1000;

      _pointerSmooth.x = THREE.MathUtils.damp(_pointerSmooth.x, _pointerTarget.x, 4.2, dt);
      _pointerSmooth.y = THREE.MathUtils.damp(_pointerSmooth.y, _pointerTarget.y, 4.2, dt);

      // Laptop: dignified floating hero sway + subtle lid breathing
      laptopGroup.position.y = -0.35 + Math.sin(elapsed * 0.95) * 0.12;
      laptopGroup.rotation.y = -0.44 + Math.sin(elapsed * 0.45) * 0.16 + _pointerSmooth.x * 0.24;
      laptopGroup.rotation.x = 0.24 + Math.cos(elapsed * 0.55) * 0.04 + _pointerSmooth.y * 0.12;
      lidPivot.rotation.x = -0.26 + Math.sin(elapsed * 0.7) * 0.035;

      // Smartphone: independent phase levitation & sleek showcase turn
      phoneGroup.position.y = -0.06 + Math.sin(elapsed * 1.15 + 1.4) * 0.15;
      phoneGroup.rotation.y = -0.52 + Math.sin(elapsed * 0.65 + 0.8) * 0.28 + _pointerSmooth.x * 0.3;
      phoneGroup.rotation.z = -0.1 + Math.sin(elapsed * 0.8) * 0.04;

      // Tablet / Holographic UI Pad: gentle upper-left counter-drift
      tabletGroup.position.y = 1.12 + Math.sin(elapsed * 0.85 + 2.6) * 0.11;
      tabletGroup.rotation.y = 0.32 + Math.cos(elapsed * 0.5) * 0.14 + _pointerSmooth.x * 0.18;
      tabletGroup.rotation.x = 0.14 + _pointerSmooth.y * 0.1;

      // Orbital tech rings & satellites
      mainOrbitMesh.rotation.z = elapsed * 0.16;
      glowOrbitMesh.rotation.z = -elapsed * 0.24;
      satHub.rotation.y = elapsed * 0.55;
      satHub.rotation.z = Math.sin(elapsed * 0.4) * 0.18;

      // Background cosmic particle field
      dustInstanced.rotation.y = elapsed * 0.03 + _pointerSmooth.x * 0.07;
      dustInstanced.rotation.x = _pointerSmooth.y * 0.04;

      renderer.render(scene, camera);

      if (reducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(renderFrame);
      } else {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      disposableGeos.forEach((g) => g.dispose());
      metalBump.dispose();
      laptopScreenTex.dispose();
      keyboardTex.dispose();
      phoneScreenTex.dispose();
      tabletScreenTex.dispose();

      titaniumChromeMat.dispose();
      spaceGrayBodyMat.dispose();
      glossyBezelMat.dispose();
      keyboardMat.dispose();
      laptopScreenMat.dispose();
      phoneScreenMat.dispose();
      tabletScreenMat.dispose();
      neonCyanMat.dispose();
      neonPurpleMat.dispose();
      cameraLensMat.dispose();
      tabFrameMat.dispose();
      dustMat.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="hero-3d-canvas"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
