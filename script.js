document.addEventListener('DOMContentLoaded', () => {
    // 1. Bloqueio de Inspeção e Cópia (Segurança)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'u')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // 2. Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.setProperty('--x', `${e.clientX}px`);
                cursorGlow.style.setProperty('--y', `${e.clientY}px`);
            });
        });
    }

    // 3. 3D Tilt Effect for "Sobre Mim" Image (Click and Drag)
    const tiltElement = document.querySelector('.tilt-element');
    if (tiltElement) {
        let requestTick = null;
        let isDragging = false;

        const handleMove = (e) => {
            if (!isDragging) return;

            if (!requestTick) {
                requestTick = requestAnimationFrame(() => {
                    const { left, top, width, height } = tiltElement.getBoundingClientRect();
                    const centerX = left + width / 2;
                    const centerY = top + height / 2;
                    const mouseX = (e.clientX - centerX) / (width / 1.2);
                    const mouseY = (e.clientY - centerY) / (height / 1.2);
                    const rotateX = -mouseY * 15;
                    const rotateY = mouseX * 15;
                    tiltElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                    requestTick = null;
                });
            }
        };

        const stopDragging = () => {
            isDragging = false;
            if (requestTick) {
                cancelAnimationFrame(requestTick);
                requestTick = null;
            }
            tiltElement.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        };

        tiltElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
            handleMove(e);
        });

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', stopDragging);
        tiltElement.addEventListener('mouseleave', () => {
            if (!isDragging) {
                tiltElement.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            }
        });
    }

    // 4. Neural Network Background Animation
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseSpeed = 0;
        let lastMousePos = { x: 0, y: 0 };
        let mouseTimeout;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseSpeedX = (Math.random() - 0.5) * 0.5;
                this.baseSpeedY = (Math.random() - 0.5) * 0.5;
                this.speedX = this.baseSpeedX;
                this.speedY = this.baseSpeedY;
                this.size = Math.random() * 2 + 1;
                
                // Caracteres para o efeito de criptografia (Runas, Katakana, Letras Estranhas)
                this.chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEF@#$%&ΣΔΩΨΞΦ';
                this.char = this.getRandomChar();
                this.charTimer = 0;
                this.charInterval = Math.random() * 20 + 10; // Frequência de troca de cada partícula
            }

            getRandomChar() {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }

            update() {
                // Troca o caractere periodicamente para efeito de "criptografia"
                this.charTimer++;
                if (this.charTimer > this.charInterval) {
                    this.char = this.getRandomChar();
                    this.charTimer = 0;
                }

                // Aplica a velocidade base + boost do mouse
                const boost = 1 + mouseSpeed * 0.05;
                this.x += this.speedX * boost;
                this.y += this.speedY * boost;

                // Loop nas bordas
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;

                // Suaviza a volta à velocidade normal
                this.speedX = this.speedX * 0.95 + this.baseSpeedX * 0.05;
                this.speedY = this.speedY * 0.95 + this.baseSpeedY * 0.05;
            }

            draw() {
                // Desenha o "neurônio" (círculo)
                ctx.fillStyle = '#88ff00';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Desenha a letra/runa codificada acima da partícula
                ctx.fillStyle = 'rgba(136, 255, 0, 0.7)';
                ctx.font = `${this.size * 5}px JetBrains Mono`;
                ctx.fillText(this.char, this.x + 5, this.y - 5);
                
                // Brilho sutil na letra
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#88ff00';
            }
        }

        const initParticles = () => {
            particles = [];
            const count = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Conecta partículas próximas
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(136, 255, 0, ${0.2 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Desacelera gradualmente a velocidade extra do mouse
            if (mouseSpeed > 0) mouseSpeed *= 0.98;
            
            requestAnimationFrame(animate);
        };

        animate();

        // Monitora movimento do mouse para aumentar velocidade
        window.addEventListener('mousemove', (e) => {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            const speed = Math.sqrt(dx * dx + dy * dy);
            
            mouseSpeed = Math.min(speed, 50); // Cap na velocidade
            lastMousePos = { x: e.clientX, y: e.clientY };
        });

        // Monitora scroll para aumentar velocidade
        window.addEventListener('scroll', () => {
            mouseSpeed = Math.min(mouseSpeed + 5, 30);
        });
    }

    // 5. Crypto Text Animation for 'O' and 'A'
    const cryptoElements = document.querySelectorAll('.crypto-text');
    const chars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ1234567890@#$%&ΣΔΩΨ';
    
    cryptoElements.forEach(el => {
        const originalText = el.innerText;
        const textArray = originalText.split('');
        
        // Identifica os índices das letras 'O' e 'A'
        const targetIndices = [];
        textArray.forEach((char, index) => {
            if (char === 'O' || char === 'A') {
                targetIndices.push(index);
            }
        });

        setInterval(() => {
            const newArray = [...textArray];
            targetIndices.forEach(idx => {
                // Sorteia um caractere aleatório para simular descriptografia
                newArray[idx] = chars[Math.floor(Math.random() * chars.length)];
            });
            el.innerText = newArray.join('');
            el.setAttribute('data-text', newArray.join('')); // Atualiza o efeito glitch
        }, 80); // Velocidade da troca
    });

    // 6. Matrix Transition Logic
    const matrixOverlay = document.getElementById('matrix-overlay');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const mCtx = matrixCanvas.getContext('2d');

    const matrixChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ1234567890ABCDEF@#$%&ΣΔΩΨΞΦ';
    const fontSize = 16;
    let columns = 0;
    let drops = [];

    const initMatrix = () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        columns = Math.floor(matrixCanvas.width / fontSize);
        drops = new Array(columns).fill(1);
    };

    const drawMatrix = () => {
        // Limpa o canvas com transparência para manter as trilhas
        mCtx.fillStyle = 'rgba(5, 5, 5, 0.15)'; 
        mCtx.globalCompositeOperation = 'destination-out'; // Remove pixels para efeito de rastro transparente
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        mCtx.globalCompositeOperation = 'source-over';
        mCtx.fillStyle = '#88ff00'; // Verde Neon
        mCtx.font = fontSize + 'px JetBrains Mono';
        mCtx.shadowBlur = 8;
        mCtx.shadowColor = '#88ff00';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            mCtx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.95) {
                drops[i] = 0;
            }
            drops[i] += 1.5; // Velocidade equilibrada para ser suave
        }
        mCtx.shadowBlur = 0;
    };

    let matrixInterval = null;

    const startMatrixTransition = (targetId) => {
        initMatrix();
        matrixOverlay.classList.add('active');
        if (!matrixInterval) matrixInterval = setInterval(drawMatrix, 30);

        // Scroll suave visível por baixo das letras
        const targetElement = document.getElementById(targetId.substring(1));
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }

        // Remove o efeito após o tempo do scroll
        setTimeout(() => {
            matrixOverlay.classList.remove('active');
            setTimeout(() => {
                clearInterval(matrixInterval);
                matrixInterval = null;
                mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            }, 300);
        }, 800);
    };

    // Intercepta cliques nos links de navegação
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                startMatrixTransition(href);
            }
        });
    });

    // 7. Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
