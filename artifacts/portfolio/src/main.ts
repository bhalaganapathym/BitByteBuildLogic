// Type declarations for global variables loaded via CDN
declare const THREE: any;
declare const gsap: any;
declare const ScrollTrigger: any;
declare const ScrollToPlugin: any;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader & Hero Animation
    const companyName = "BitByteBuildLogic";
    const loaderText = document.querySelector('.loader-text');
    if (loaderText) {
        companyName.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'loader-char';
            loaderText.appendChild(span);
        });
    }

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = '';
        companyName.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'char';
            heroTitle.appendChild(span);
        });
    }

    window.addEventListener('load', () => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        const tl = gsap.timeline();
        
        tl.to('.loader-char', {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.out"
        })
        .to('#loader', {
            y: "-100%",
            duration: 0.8,
            ease: "power3.inOut",
            delay: 0.5,
            onComplete: () => {
                document.getElementById('loader')!.style.display = 'none';
                initScrollAnimations();
            }
        })
        .fromTo('#hero-title .char', 
            { opacity: 0, filter: 'blur(10px)', y: 30 },
            { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.04, duration: 0.8, ease: "power2.out" },
            "-=0.4"
        )
        .fromTo('.hero-subtitle, .hero-tagline, .hero-btns, .hero-stats',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" },
            "-=0.6"
        );
        
        initThreeJS();
    });

    // 2. Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
        
        // Hero gradient mouse tracking
        const hero = document.getElementById('hero');
        if (hero) {
            const rect = hero.getBoundingClientRect();
            const x = ((mouseX - rect.left) / rect.width) * 100;
            const y = ((mouseY - rect.top) / rect.height) * 100;
            hero.style.setProperty('--mouse-x', `${x}%`);
            hero.style.setProperty('--mouse-y', `${y}%`);
        }
    });
    
    const renderCursor = () => {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(renderCursor);
    };
    renderCursor();
    
    const interactiveElements = document.querySelectorAll('a, button, .btn-magnetic');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorRing) {
                cursorRing.style.width = '60px';
                cursorRing.style.height = '60px';
                cursorRing.style.backgroundColor = 'rgba(124, 92, 252, 0.1)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorRing) {
                cursorRing.style.width = '30px';
                cursorRing.style.height = '30px';
                cursorRing.style.backgroundColor = 'transparent';
            }
        });
    });

    // 3. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e: any) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    });

    // 4. Service Card Tilt
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e: any) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * 20;
            const tiltY = (x / rect.width) * -20;
            gsap.to(card, { rotateX: -tiltX, rotateY: tiltY, duration: 0.3, transformPerspective: 600 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.3 });
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(this: HTMLAnchorElement, e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                gsap.to(window, { duration: 1, scrollTo: targetId, ease: "power2.inOut" });
            }
            document.querySelector('.nav-links')?.classList.remove('active');
        });
    });

    document.querySelector('.hamburger')?.addEventListener('click', () => {
        document.querySelector('.nav-links')?.classList.toggle('active');
    });

    // Function definitions
    function initScrollAnimations() {
        ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self: any) => {
                if (self.progress > 0) {
                    document.getElementById('navbar')?.classList.add('scrolled');
                } else {
                    document.getElementById('navbar')?.classList.remove('scrolled');
                }
            }
        });
        
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || '0', 10);
            ScrollTrigger.create({
                trigger: counter,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => {
                            counter.textContent = Math.round(obj.val).toString();
                        }
                    });
                }
            });
        });
        
        const revealElements = document.querySelectorAll('.reveal-section');
        revealElements.forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
        
        gsap.to('#timeline-progress', {
            scrollTrigger: {
                trigger: '.process-container',
                start: "top center",
                end: "bottom center",
                scrub: 1
            },
            '--progress': 1,
            ease: "none"
        });
        
        if (window.innerWidth > 768) {
            const workContainer = document.getElementById('work-container');
            const workSection = document.getElementById('work');
            if (workContainer && workSection) {
                const getScrollAmount = () => workContainer.scrollWidth - window.innerWidth;
                gsap.to(workContainer, {
                    x: () => -getScrollAmount(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: workSection,
                        pin: true,
                        scrub: 1,
                        end: () => `+=${getScrollAmount()}`,
                        invalidateOnRefresh: true
                    }
                });
            }
        }
    }

    function initThreeJS() {
        const container = document.getElementById('threejs-bg');
        if (!container) return;
        
        // Guard: check WebGL support before initializing
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        if (!gl) return; // WebGL not available (e.g. server-side rendering or headless)
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        let renderer: any;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        } catch (e) {
            return; // WebGL renderer failed to initialize
        }
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Scene 1: Particles — fewer on mobile for smooth 60fps
        const particleCount = window.innerWidth <= 768 ? 150 : 300;
        const particlesGeo = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);
        
        const colorViolet = new THREE.Color('#7C5CFC');
        const colorCyan = new THREE.Color('#00FFFF');
        
        for(let i = 0; i < particleCount * 3; i+=3) {
            posArray[i] = (Math.random() - 0.5) * 80; 
            posArray[i+1] = (Math.random() - 0.5) * 80; 
            posArray[i+2] = (Math.random() - 0.5) * 30 - 15; 
            
            const mixColor = Math.random() > 0.5 ? colorViolet : colorCyan;
            colorArray[i] = mixColor.r;
            colorArray[i+1] = mixColor.g;
            colorArray[i+2] = mixColor.b;
        }
        
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMat = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        const particleSystem = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particleSystem);
        
        const maxLines = 1000;
        const linesGeo = new THREE.BufferGeometry();
        const linesPosArray = new Float32Array(maxLines * 6);
        const linesColorArray = new Float32Array(maxLines * 6);
        
        linesGeo.setAttribute('position', new THREE.BufferAttribute(linesPosArray, 3));
        linesGeo.setAttribute('color', new THREE.BufferAttribute(linesColorArray, 3));
        
        const linesMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });
        const lineSystem = new THREE.LineSegments(linesGeo, linesMat);
        scene.add(lineSystem);

        // Scene 2: Hero — 3D Network / Systems Architecture
        // Represents the interconnected digital systems BHALAGANAPATHY M builds
        const networkGroup = new THREE.Group();
        networkGroup.position.set(0, 0, -5);
        scene.add(networkGroup);

        // Build vertex set from a subdivided icosahedron
        const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
        const posAttr = icoGeo.attributes.position;
        const networkVertices: THREE.Vector3[] = [];
        const seenKeys = new Set<string>();
        for (let i = 0; i < posAttr.count; i++) {
            const v = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
            const key = `${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`;
            if (!seenKeys.has(key)) { seenKeys.add(key); networkVertices.push(v); }
        }

        // Glowing nodes at each vertex
        const nodeMeshes: any[] = [];
        networkVertices.forEach(v => {
            const nGeo = new THREE.SphereGeometry(0.07, 8, 8);
            const nMat = new THREE.MeshBasicMaterial({ color: 0x7C5CFC });
            const node = new THREE.Mesh(nGeo, nMat);
            node.position.copy(v);
            networkGroup.add(node);
            nodeMeshes.push(node);
        });

        // Edges between nearby vertices — represent service connections
        const networkEdges: { a: THREE.Vector3, b: THREE.Vector3 }[] = [];
        const EDGE_THRESHOLD = 1.85;
        for (let i = 0; i < networkVertices.length; i++) {
            for (let j = i + 1; j < networkVertices.length; j++) {
                if (networkVertices[i].distanceTo(networkVertices[j]) < EDGE_THRESHOLD) {
                    networkEdges.push({ a: networkVertices[i], b: networkVertices[j] });
                    const edgeGeo = new THREE.BufferGeometry().setFromPoints([
                        networkVertices[i].clone(), networkVertices[j].clone()
                    ]);
                    const edgeMat = new THREE.LineBasicMaterial({
                        color: 0x00FFFF, transparent: true, opacity: 0.25,
                        blending: THREE.AdditiveBlending
                    });
                    networkGroup.add(new THREE.Line(edgeGeo, edgeMat));
                }
            }
        }

        // Data packets (small glowing spheres) traveling along edges
        // Represent data, API calls, automation flows
        const networkPackets: { mesh: any, edgeIdx: number, t: number, speed: number }[] = [];
        const PACKET_COUNT = Math.min(networkEdges.length, 14);
        for (let i = 0; i < PACKET_COUNT; i++) {
            const pGeo = new THREE.SphereGeometry(0.045, 6, 6);
            const pMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xffffff : 0x25D366 });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            networkGroup.add(pMesh);
            networkPackets.push({
                mesh: pMesh,
                edgeIdx: Math.floor(Math.random() * networkEdges.length),
                t: Math.random(),
                speed: 0.006 + Math.random() * 0.008
            });
        }
        
        // Scene 3: Floating cubes
        const cubes: any[] = [];
        for(let i=0; i<8; i++) {
            const boxGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const boxWire = new THREE.WireframeGeometry(boxGeo);
            const boxMat = new THREE.LineBasicMaterial({ 
                color: i % 2 === 0 ? 0x7C5CFC : 0x00FFFF, 
                transparent: true, opacity: 0.5 
            });
            const boxMesh = new THREE.LineSegments(boxWire, boxMat);
            
            const data = {
                mesh: boxMesh,
                originX: (Math.random() - 0.5) * 12,
                originY: (Math.random() - 0.5) * 6,
                originZ: -4 - Math.random() * 3,
                radius: 0.5 + Math.random() * 2,
                speed: 0.01 + Math.random() * 0.02,
                phase: Math.random() * Math.PI * 2
            };
            
            scene.add(boxMesh);
            cubes.push(data);
        }

        // Scene 4: Services Sphere
        const sphereGroup = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(3, 16, 16);
        const sphereMat = new THREE.LineBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.2 });
        const sphereMesh = new THREE.LineSegments(new THREE.WireframeGeometry(sphereGeo), sphereMat);
        sphereGroup.add(sphereMesh);

        const dots: any[] = [];
        const serviceNames = ["Website Building", "WhatsApp Automation", "Custom Software", "Web Hosting", "Consulting"];
        for(let i=0; i<5; i++) {
            const dotGeo = new THREE.SphereGeometry(0.15, 16, 16);
            const dotMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
            const dotMesh = new THREE.Mesh(dotGeo, dotMat);
            
            const phi = Math.acos(-1 + (2 * i) / 4); 
            const theta = Math.sqrt(5 * Math.PI) * phi;
            
            dotMesh.position.x = 3 * Math.cos(theta) * Math.sin(phi);
            dotMesh.position.y = 3 * Math.sin(theta) * Math.sin(phi);
            dotMesh.position.z = 3 * Math.cos(phi);
            
            dotMesh.userData = { title: serviceNames[i] };
            
            sphereGroup.add(dotMesh);
            dots.push(dotMesh);
        }
        scene.add(sphereGroup);

        const raycaster = new THREE.Raycaster();
        const mouse3D = new THREE.Vector2();
        const tooltip = document.getElementById('sphere-tooltip');
        const servicesEl = document.getElementById('services');

        window.addEventListener('mousemove', (e) => {
            mouse3D.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse3D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        camera.position.z = 5;
        
        let time = 0;
        let scrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });
        
        function animate() {
            requestAnimationFrame(animate);
            time++;
            
            // Particles logic
            const positions = particleSystem.geometry.attributes.position.array as Float32Array;
            const colors = particleSystem.geometry.attributes.color.array as Float32Array;
            let lineCount = 0;
            
            for(let i = 0; i < particleCount; i++) {
                positions[i*3 + 2] += 0.02;
                if (positions[i*3 + 2] > 10) {
                    positions[i*3 + 2] = -20;
                }
                
                if (lineCount >= maxLines) continue;
                for(let j = i + 1; j < particleCount; j++) {
                    if (lineCount >= maxLines) break;
                    
                    const dx = positions[i*3] - positions[j*3];
                    const dy = positions[i*3 + 1] - positions[j*3 + 1];
                    const dz = positions[i*3 + 2] - positions[j*3 + 2];
                    const distSq = dx*dx + dy*dy + dz*dz;
                    
                    if (distSq < 64) { 
                        const dist = Math.sqrt(distSq);
                        const alpha = 1.0 - (dist / 8);
                        const lineIdx = lineCount * 6;
                        
                        linesPosArray[lineIdx] = positions[i*3];
                        linesPosArray[lineIdx+1] = positions[i*3+1];
                        linesPosArray[lineIdx+2] = positions[i*3+2];
                        linesPosArray[lineIdx+3] = positions[j*3];
                        linesPosArray[lineIdx+4] = positions[j*3+1];
                        linesPosArray[lineIdx+5] = positions[j*3+2];
                        
                        linesColorArray[lineIdx] = colors[i*3] * alpha;
                        linesColorArray[lineIdx+1] = colors[i*3+1] * alpha;
                        linesColorArray[lineIdx+2] = colors[i*3+2] * alpha;
                        linesColorArray[lineIdx+3] = colors[j*3] * alpha;
                        linesColorArray[lineIdx+4] = colors[j*3+1] * alpha;
                        linesColorArray[lineIdx+5] = colors[j*3+2] * alpha;
                        
                        lineCount++;
                    }
                }
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
            lineSystem.geometry.setDrawRange(0, lineCount * 2);
            lineSystem.geometry.attributes.position.needsUpdate = true;
            lineSystem.geometry.attributes.color.needsUpdate = true;

            // Network — slow majestic rotation + mouse parallax
            networkGroup.rotation.x += 0.002;
            networkGroup.rotation.y += 0.004;
            networkGroup.position.x += (mouse3D.x * 1.5 - networkGroup.position.x) * 0.05;
            networkGroup.position.y += (mouse3D.y * 1.5 - networkGroup.position.y) * 0.05;

            // Data packets travel along edges, wrap to a new random edge on completion
            networkPackets.forEach(p => {
                p.t += p.speed;
                if (p.t > 1) {
                    p.t = 0;
                    p.edgeIdx = Math.floor(Math.random() * networkEdges.length);
                }
                const edge = networkEdges[p.edgeIdx];
                p.mesh.position.lerpVectors(edge.a, edge.b, p.t);
            });

            // Pulse node brightness to simulate live activity
            const pulse = (Math.sin(time * 3) * 0.5 + 0.5);
            nodeMeshes.forEach((n, idx) => {
                const scale = 1 + pulse * 0.3 * ((idx % 3 === 0) ? 1 : 0);
                n.scale.setScalar(scale);
            });
            
            // Cubes
            cubes.forEach(c => {
                c.mesh.position.x = c.originX + Math.cos(time * c.speed + c.phase) * c.radius;
                c.mesh.position.y = c.originY + Math.sin(time * c.speed + c.phase) * c.radius * 0.5;
                c.mesh.position.z = c.originZ;
                c.mesh.rotation.x += 0.01;
                c.mesh.rotation.y += 0.01;
            });

            // Camera depth
            camera.position.y = -(scrollY * 0.005);

            // Services sphere logic
            if (servicesEl) {
                const rect = servicesEl.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    sphereGroup.visible = true;
                    sphereGroup.rotation.y += 0.005;
                    
                    const centerY = rect.top + rect.height / 2;
                    const normalizedY = -(centerY - window.innerHeight / 2) / window.innerHeight;
                    const visibleHeight = 2 * Math.tan( THREE.MathUtils.degToRad(75/2) ) * 5; 
                    
                    sphereGroup.position.y = camera.position.y + normalizedY * visibleHeight;
                    sphereGroup.position.z = 0; 
                    
                    raycaster.setFromCamera(mouse3D, camera);
                    const intersects = raycaster.intersectObjects(dots);
                    
                    let hovered = false;
                    dots.forEach(dot => dot.scale.set(1, 1, 1));
                    
                    if (intersects.length > 0) {
                        const hit = intersects[0].object;
                        hit.scale.set(2, 2, 2);
                        hovered = true;
                        
                        if (tooltip) {
                            tooltip.style.opacity = '1';
                            tooltip.textContent = hit.userData.title;
                            
                            const vector = hit.position.clone();
                            vector.applyMatrix4(sphereGroup.matrixWorld);
                            vector.project(camera);
                            
                            const x = (vector.x * .5 + .5) * window.innerWidth;
                            const y = (vector.y * -.5 + .5) * window.innerHeight;
                            
                            tooltip.style.left = `${x + 15}px`;
                            tooltip.style.top = `${y + 15}px`;
                        }
                    }
                    
                    if (!hovered && tooltip) {
                        tooltip.style.opacity = '0';
                    }
                } else {
                    sphereGroup.visible = false;
                    if (tooltip) tooltip.style.opacity = '0';
                }
            }

            renderer.render(scene, camera);
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});