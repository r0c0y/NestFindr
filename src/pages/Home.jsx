import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, textMesh;
    let animationId;

    // Use correct imports for three >=0.150.0
    import('three').then(THREE => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
      camera.position.z = 8;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(canvas.width, canvas.height);
      renderer.setClearColor(0x000000, 0);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      // Dynamically import FontLoader and TextGeometry for three >=0.150.0
      Promise.all([
        import('three/examples/jsm/loaders/FontLoader.js'),
        import('three/examples/jsm/geometries/TextGeometry.js')
      ]).then(([{ FontLoader }, { TextGeometry }]) => {
        const loader = new FontLoader();
        loader.load(
          'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/fonts/helvetiker_regular.typeface.json',
          font => {
            const textGeometry = new TextGeometry('NestFindr', {
              font,
              size: 2.5,
              height: 0.6,
              curveSegments: 16,
              bevelEnabled: true,
              bevelThickness: 0.18,
              bevelSize: 0.12,
              bevelOffset: 0,
              bevelSegments: 8
            });

            const material = new THREE.MeshPhysicalMaterial({
              color: 0xff7300,
              metalness: 0.7,
              roughness: 0.15,
              clearcoat: 1,
              clearcoatRoughness: 0.05,
              reflectivity: 1,
              transmission: 0.1,
              sheen: 1,
              sheenColor: new THREE.Color(0xffffff),
            });

            textMesh = new THREE.Mesh(textGeometry, material);
            textGeometry.center();
            scene.add(textMesh);

            // Animation
            function animate() {
              animationId = requestAnimationFrame(animate);
              textMesh.rotation.y += 0.008;
              textMesh.rotation.x = Math.sin(Date.now() * 0.0005) * 0.08;
              renderer.render(scene, camera);
            }
            animate();
          },
          undefined,
          () => {
            // Font loading error fallback
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "bold 64px Arial";
            ctx.fillStyle = "#ff7300";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("NestFindr", canvas.width / 2, canvas.height / 2);
          }
        );
      }).catch(() => {
        // Fallback: draw text on canvas if three/examples import fails
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 64px Arial";
        ctx.fillStyle = "#ff7300";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("NestFindr", canvas.width / 2, canvas.height / 2);
      });
    });

    // Clean up
    return () => {
      if (renderer) renderer.dispose();
      if (animationId) cancelAnimationFrame(animationId);
      if (scene && textMesh) scene.remove(textMesh);
    };
  }, []);

  return (
    <div className="home-container">
      <canvas
        id="title-3d"
        ref={canvasRef}
        width={1068}
        height={320}
        style={{ width: '100%', maxWidth: 1068, height: 320, display: 'block', margin: '0 auto' }}
        aria-hidden="true"
        data-engine="three.js r158"
      />
      <div className="hero-section">
        <h1 className="hero-title">Welcome to NestFindr</h1>
        <p className="hero-subtitle">
          Discover your dream home with ease—explore listings, calculate mortgages, and more!
        </p>
        <Link to="/listings">
          <button className="hero-button">Explore Listings</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;