const programmingTerms = ["try-except", "yield", "get", "return", "Math.random()", "arr.length", 'let j'];
const symbols = ["+", "-", "*", "/", "%", "^", "&", "(", ")", "="];
const container = document.getElementById("intro-text");

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function getFourWordSequence() {
    let words = [];
    while (words.length < 4) {
        let word = getRandomItem(programmingTerms);
        if (!words.includes(word)) {
            words.push(word);
        }
    }

    let sym1 = getRandomItem(symbols);
    let sym2 = getRandomItem(symbols);
    let sym3 = getRandomItem(symbols);

    return `${words[0]} ${sym1} ${words[1]} ${sym2} ${words[2]} ${sym3} ${words[3]}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAnimation() {
    while (true) {
        const fullText = getFourWordSequence();
        container.innerHTML = "";
        const letterSpans = [];

        for (let i = 0; i < fullText.length; i++) {
            const span = document.createElement("span");
            span.textContent = fullText[i];
            
            if (fullText[i] === " ") {
                span.className = "inline-block mx-1";
            } else {
                span.className = "letter-block inline-block";
            }
            
            container.appendChild(span);
            letterSpans.push(span);
            await sleep(90);
        }

        await sleep(1500);

        letterSpans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add("dissipate");
            }, index * 35);
        });
        await sleep(800);
    }
}

runAnimation();

let currentState = 0;
const trackElement = document.getElementById("plane-track");
const planeElement = document.querySelector(".paper-plane-loop");

trackElement.addEventListener("click", () => {
    currentState = (currentState + 1) % 4;

    switch (currentState) {
        case 0:
            document.body.classList.remove("dyslexic-theme");
            planeElement.classList.remove("paused");
            break;
        case 1:
            document.body.classList.add("dyslexic-theme");
            planeElement.classList.remove("paused");
            break;
        case 2:
            document.body.classList.add("dyslexic-theme");
            planeElement.classList.add("paused");
            break;
        case 3:
            document.body.classList.remove("dyslexic-theme");
            planeElement.classList.add("paused");
            break;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const threeContainer = document.getElementById("three-container");
    const portfolioContent = document.getElementById("portfolio-content");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeContainer.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const W = 2.4;
    const H = 3.4;

    function createOrigamiPlane(texture) {
        const geometry = new THREE.BufferGeometry();

        const uvs = new Float32Array([
            0.5, 1.0,
            0.5, 0.0,
            0.35, 0.0,
            0.65, 0.0,
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ]);

        const flatPos = new Float32Array([
            0, 0, -H / 2,
            0, 0, H / 2,
            -W * 0.15, 0, H / 2,
            W * 0.15, 0, H / 2,
            -W / 2, 0, H / 2,
            W / 2, 0, H / 2,
            -W / 2, 0, -H / 2,
            W / 2, 0, -H / 2
        ]);

        const foldedPos = new Float32Array([
            0, 0.1, -H / 2 - 0.3,
            0, -0.45, H / 2,
            -0.12, 0.05, H / 2,
            0.12, 0.05, H / 2,
            -W * 0.65, 0.25, H / 2,
            W * 0.65, 0.25, H / 2,
            -0.06, -0.15, -0.2,
            0.06, -0.15, -0.2
        ]);

        const indices = [
            0, 1, 2,
            0, 3, 1,
            0, 2, 4,
            0, 5, 3,
            0, 4, 6,
            0, 7, 5
        ];

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(flatPos), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0.05
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { flatPos, foldedPos };
        return mesh;
    }

    let planeMesh = null;
    let isFolded = false;
    let isAnimating = false;
    let foldProgress = 0;

    function animate() {
        requestAnimationFrame(animate);

        if (planeMesh && isAnimating) {
            const target = isFolded ? 1 : 0;
            foldProgress += (target - foldProgress) * 0.08;

            const posAttr = planeMesh.geometry.attributes.position;
            const { flatPos, foldedPos } = planeMesh.userData;

            for (let i = 0; i < posAttr.array.length; i++) {
                posAttr.array[i] = flatPos[i] + (foldedPos[i] - flatPos[i]) * foldProgress;
            }
            posAttr.needsUpdate = true;
            planeMesh.geometry.computeVertexNormals();

            if (Math.abs(target - foldProgress) < 0.005) {
                foldProgress = target;
                isAnimating = false;

                if (!isFolded) {
                    threeContainer.classList.add("hidden");
                    portfolioContent.style.opacity = "1";
                    portfolioContent.style.pointerEvents = "auto";
                }
            }
        }

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    document.addEventListener("dblclick", async (e) => {
        if (e.target.tagName === "A" || e.target.closest("a") || isAnimating) return;

        if (!isFolded) {
            const canvas = await html2canvas(portfolioContent, {
                backgroundColor: null,
                scale: 1,
                useCORS: true
            });
            const texture = new THREE.CanvasTexture(canvas);
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            if (planeMesh) {
                scene.remove(planeMesh);
                planeMesh.geometry.dispose();
                planeMesh.material.dispose();
            }

            planeMesh = createOrigamiPlane(texture);
            scene.add(planeMesh);

            camera.position.set(0, 3.2, 6.5);
            controls.target.set(0, 0, 0);
            controls.update();

            portfolioContent.style.opacity = "0";
            portfolioContent.style.pointerEvents = "none";
            threeContainer.classList.remove("hidden");

            isFolded = true;
            foldProgress = 0;
            isAnimating = true;
        } else {
            isFolded = false;
            isAnimating = true;
        }
    });

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});

document.querySelectorAll(".todo-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.stopPropagation();
        item.classList.toggle("completed");
    });
});
