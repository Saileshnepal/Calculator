// Calculator logic
let display = document.getElementById('display');

function appendToDisplay(value) {
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = display.value.replace(/×/g, '*');
        let result = eval(expression);
        display.value = result;
        animateCalculation();
    } catch {
        display.value = 'Error';
        setTimeout(() => clearDisplay(), 2000);
    }
}

function animateCalculation() {
    display.style.transform = 'scale(1.05)';
    display.style.background = 'rgba(76, 175, 80, 0.3)';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
        display.style.background = 'rgba(0, 0, 0, 0.3)';
    }, 200);
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if ((key >= '0' && key <= '9') || key === '.') {
        appendToDisplay(key);
    } else if (['+', '-', '/', '*'].includes(key)) {
        appendToDisplay(key === '*' ? '×' : key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// 3D Background
let scene, camera, renderer, cubes = [];

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < 50; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (Math.random() - 0.5) * 50;
        cube.position.y = (Math.random() - 0.5) * 50;
        cube.position.z = (Math.random() - 0.5) * 50;
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;

        cube.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.01
        };

        scene.add(cube);
        cubes.push(cube);
    }

    camera.position.z = 30;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    cubes.forEach((cube, index) => {
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;
        cube.position.y += Math.sin(Date.now() * cube.userData.floatSpeed + index) * 0.01;
    });

    camera.position.x = Math.sin(Date.now() * 0.0005) * 5;
    camera.position.y = Math.cos(Date.now() * 0.0003) * 3;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('load', initThreeJS);
