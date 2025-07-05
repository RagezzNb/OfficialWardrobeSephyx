// Custom Cursor with Particle Trail
class CyberpunkCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.cursorRing = document.getElementById('cursor-ring');
        this.cursorTrail = document.getElementById('cursor-trail');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMoving = false;
        
        this.init();
    }
    
    init() {
        if (!this.cursor) return;
        
        // Check if device supports hover (not touch device)
        if (window.matchMedia('(hover: none)').matches) {
            this.cursor.style.display = 'none';
            return;
        }
        
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isMoving = true;
            
            this.updateCursorPosition();
            this.createParticle();
        });
        
        document.addEventListener('mousedown', () => {
            this.cursorRing.classList.add('cursor-click');
            this.createBurst();
        });
        
        document.addEventListener('mouseup', () => {
            this.cursorRing.classList.remove('cursor-click');
        });
        
        // Hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .product-card, .nav-link, .filter-btn');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursorRing.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursorRing.classList.remove('cursor-hover');
            });
        });
        
        // Stop moving flag
        setTimeout(() => {
            this.isMoving = false;
        }, 100);
    }
    
    updateCursorPosition() {
        if (!this.cursor) return;
        
        gsap.to(this.cursor, {
            x: this.mouseX,
            y: this.mouseY,
            duration: 0.1,
            ease: 'power2.out'
        });
    }
    
    createParticle() {
        if (this.particles.length > 20) return; // Limit particles for performance
        
        const particle = {
            x: this.mouseX + (Math.random() - 0.5) * 10,
            y: this.mouseY + (Math.random() - 0.5) * 10,
            size: Math.random() * 3 + 1,
            life: 1,
            decay: Math.random() * 0.02 + 0.02,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        };
        
        this.particles.push(particle);
        
        // Create DOM element for particle
        const particleElement = document.createElement('div');
        particleElement.style.cssText = `
            position: fixed;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: var(--accent-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px var(--accent-gold);
            left: ${particle.x}px;
            top: ${particle.y}px;
        `;
        
        particle.element = particleElement;
        document.body.appendChild(particleElement);
    }
    
    createBurst() {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const particle = {
                x: this.mouseX,
                y: this.mouseY,
                size: Math.random() * 4 + 2,
                life: 1,
                decay: 0.03,
                vx: Math.cos(angle) * (Math.random() * 3 + 2),
                vy: Math.sin(angle) * (Math.random() * 3 + 2)
            };
            
            this.particles.push(particle);
            
            const particleElement = document.createElement('div');
            particleElement.style.cssText = `
                position: fixed;
                width: ${particle.size}px;
                height: ${particle.size}px;
                background: var(--neon-blue);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 0 15px var(--neon-blue);
                left: ${particle.x}px;
                top: ${particle.y}px;
            `;
            
            particle.element = particleElement;
            document.body.appendChild(particleElement);
        }
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.life -= particle.decay;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravity
            
            if (particle.element) {
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                particle.element.style.opacity = particle.life;
                particle.element.style.transform = `scale(${particle.life})`;
            }
            
            if (particle.life <= 0) {
                if (particle.element && particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
                this.particles.splice(index, 1);
            }
        });
    }
    
    animate() {
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor
function initializeCursor() {
    new CyberpunkCursor();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCursor);
} else {
    initializeCursor();
}
