// Particle System for Background Effects
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isInit = false;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.bindEvents();
        this.createParticles();
        this.animate();
        this.isInit = true;
    }
    
    createCanvas() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.appendChild(this.canvas);
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    createParticles() {
        const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.3;
                    
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.baseSpeed = Math.random() * 0.5 + 0.1;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.color = this.getRandomColor();
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulse = 0;
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }
    
    getRandomColor() {
        const colors = [
            'rgba(255, 215, 0', // Gold
            'rgba(0, 255, 255', // Cyan
            'rgba(255, 0, 128', // Pink
            'rgba(192, 192, 192' // Silver
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const force = (150 - distance) / 150;
            this.vx += (dx / distance) * force * 0.01;
            this.vy += (dy / distance) * force * 0.01;
        }
        
        // Apply velocity
        this.x += this.vx * this.baseSpeed;
        this.y += this.vy * this.baseSpeed;
        
        // Add some randomness
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += (Math.random() - 0.5) * 0.02;
        
        // Limit velocity
        const maxSpeed = 2;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
        
        // Boundary wrapping
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
        
        // Pulse effect
        this.pulse += this.pulseSpeed;
    }
    
    draw(ctx) {
        const pulseSize = this.size + Math.sin(this.pulse) * 0.5;
        const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.2;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize + 2, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}, ${pulseOpacity * 0.3})`;
        ctx.fill();
        
        // Inner particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}, ${pulseOpacity})`;
        ctx.fill();
        
        // Core highlight
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity * 0.8})`;
        ctx.fill();
    }
}

// Nebula Effect
class NebulaEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.time = 0;
        this.init();
    }
    
    init() {
        const heroElement = document.querySelector('.hero');
        if (!heroElement) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
            opacity: 0.6;
        `;
        
        heroElement.appendChild(this.canvas);
        this.resizeCanvas();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.005;
        
        // Draw nebula clouds
        this.drawNebula();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawNebula() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Create gradient
        const gradient = this.ctx.createRadialGradient(
            centerX + Math.sin(this.time) * 100,
            centerY + Math.cos(this.time * 0.8) * 80,
            0,
            centerX,
            centerY,
            Math.max(this.canvas.width, this.canvas.height) * 0.8
        );
        
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
        gradient.addColorStop(0.3, 'rgba(0, 255, 255, 0.1)');
        gradient.addColorStop(0.6, 'rgba(255, 0, 128, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add moving clouds
        for (let i = 0; i < 3; i++) {
            const x = centerX + Math.sin(this.time + i * 2) * (200 + i * 50);
            const y = centerY + Math.cos(this.time * 0.7 + i * 1.5) * (150 + i * 30);
            const radius = 150 + i * 50;
            
            const cloudGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            cloudGradient.addColorStop(0, `rgba(${i === 0 ? '255, 215, 0' : i === 1 ? '0, 255, 255' : '255, 0, 128'}, 0.1)`);
            cloudGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = cloudGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

// Initialize particles
function initializeParticles() {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        new ParticleSystem();
        new NebulaEffect();
    }, 100);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeParticles);
} else {
    initializeParticles();
}
